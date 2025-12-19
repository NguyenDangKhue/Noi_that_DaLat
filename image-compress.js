// Image Compression Utility
// Tự động giảm độ phân giải và nén hình ảnh để tối ưu bộ nhớ

class ImageCompressor {
    constructor(options = {}) {
        this.maxWidth = options.maxWidth || 1200;
        this.maxHeight = options.maxHeight || 1200;
        this.quality = options.quality || 0.8; // 0.0 - 1.0
        this.maxSizeKB = options.maxSizeKB || 500; // Maximum file size in KB
    }

    /**
     * Compress image from URL
     * @param {string} imageUrl - URL of the image
     * @returns {Promise<string>} - Compressed image as base64 data URL
     */
    async compressFromUrl(imageUrl) {
        try {
            const img = await this.loadImage(imageUrl);
            return await this.compressImage(img);
        } catch (error) {
            console.error('Error compressing image from URL:', error);
            return imageUrl; // Return original URL if compression fails
        }
    }

    /**
     * Compress image from File object
     * @param {File} file - File object
     * @returns {Promise<string>} - Compressed image as base64 data URL
     */
    async compressFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const img = new Image();
                    img.onload = async () => {
                        try {
                            const compressed = await this.compressImage(img);
                            resolve(compressed);
                        } catch (error) {
                            reject(error);
                        }
                    };
                    img.onerror = () => reject(new Error('Failed to load image'));
                    img.src = e.target.result;
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Load image from URL
     * @param {string} url - Image URL
     * @returns {Promise<Image>} - Image element
     */
    loadImage(url) {
        return new Promise((resolve, reject) => {
            // Check if image is from same origin or supports CORS
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => resolve(img);
            img.onerror = () => {
                // If CORS fails, try without crossOrigin
                const img2 = new Image();
                img2.onload = () => resolve(img2);
                img2.onerror = () => reject(new Error('Failed to load image'));
                img2.src = url;
            };
            
            img.src = url;
        });
    }

    /**
     * Compress image using Canvas
     * @param {Image} img - Image element
     * @returns {Promise<string>} - Compressed image as base64 data URL
     */
    async compressImage(img) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions
            let width = img.width;
            let height = img.height;
            
            if (width > this.maxWidth || height > this.maxHeight) {
                const ratio = Math.min(
                    this.maxWidth / width,
                    this.maxHeight / height
                );
                width = width * ratio;
                height = height * ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            // Try different quality levels to meet size requirement
            let quality = this.quality;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            let sizeKB = this.getBase64SizeKB(dataUrl);
            
            // If still too large, reduce quality further
            if (sizeKB > this.maxSizeKB) {
                quality = Math.max(0.1, (this.maxSizeKB / sizeKB) * quality * 0.9);
                dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
            
            resolve(dataUrl);
        });
    }

    /**
     * Get size of base64 string in KB
     * @param {string} base64 - Base64 string
     * @returns {number} - Size in KB
     */
    getBase64SizeKB(base64) {
        // Remove data URL prefix
        const base64Data = base64.split(',')[1] || base64;
        // Calculate size: base64 is ~33% larger than binary
        const sizeInBytes = (base64Data.length * 3) / 4;
        return sizeInBytes / 1024;
    }

    /**
     * Convert base64 to blob URL for better memory management
     * @param {string} base64 - Base64 data URL
     * @returns {string} - Blob URL
     */
    base64ToBlobUrl(base64) {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        return URL.createObjectURL(blob);
    }

    /**
     * Compress and save image to localStorage
     * @param {string} imageUrl - Original image URL
     * @param {string} key - Storage key
     * @returns {Promise<string>} - Compressed image URL (base64 or original)
     */
    async compressAndSave(imageUrl, key) {
        try {
            // Check if already compressed and saved
            const saved = localStorage.getItem(key);
            if (saved) {
                return saved;
            }
            
            // Compress image
            const compressed = await this.compressFromUrl(imageUrl);
            
            // Save to localStorage if not too large (localStorage limit ~5-10MB)
            const sizeKB = this.getBase64SizeKB(compressed);
            if (sizeKB < 1000) { // Only save if less than 1MB
                localStorage.setItem(key, compressed);
                return compressed;
            }
            
            // If too large, return original URL
            return imageUrl;
        } catch (error) {
            console.error('Error compressing and saving image:', error);
            return imageUrl;
        }
    }

    /**
     * Get optimized image URL (compressed if available, otherwise original)
     * @param {string} imageUrl - Original image URL
     * @param {string} key - Storage key for cached version
     * @returns {string} - Optimized image URL
     */
    getOptimizedUrl(imageUrl, key) {
        const saved = localStorage.getItem(key);
        return saved || imageUrl;
    }
}

// Global instance with default settings
const imageCompressor = new ImageCompressor({
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    maxSizeKB: 500
});

// Utility function to create storage key from URL
function getImageStorageKey(imageUrl) {
    // Create a hash-like key from URL
    return 'img_' + btoa(imageUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
}

// Function to preload and compress images in background
async function preloadAndCompressImages(imageUrls) {
    const compressedImages = {};
    
    for (const url of imageUrls) {
        if (!url) continue;
        
        const key = getImageStorageKey(url);
        
        // Skip if already compressed
        if (localStorage.getItem(key)) {
            compressedImages[url] = localStorage.getItem(key);
            continue;
        }
        
        try {
            const compressed = await imageCompressor.compressFromUrl(url);
            const sizeKB = imageCompressor.getBase64SizeKB(compressed);
            
            // Only save if reasonable size
            if (sizeKB < 1000) {
                localStorage.setItem(key, compressed);
                compressedImages[url] = compressed;
            } else {
                compressedImages[url] = url; // Use original if too large
            }
        } catch (error) {
            console.warn('Failed to compress image:', url, error);
            compressedImages[url] = url; // Use original on error
        }
    }
    
    return compressedImages;
}

