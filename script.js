// Flag để kiểm tra xem có đang load dữ liệu không (tránh auto-export khi load)
let isLoadingData = false;

// Debounce timer cho auto-export để tránh download quá nhiều lần
let autoExportTimer = null;

// Sample projects data
let projects = [
    {
        id: 1,
        title: "Phòng Khách Hiện Đại",
        description: "Thiết kế phòng khách sang trọng với phong cách hiện đại, tối giản",
        beforeImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        details: "Phòng khách được thiết kế với không gian mở, ánh sáng tự nhiên và nội thất hiện đại. Sử dụng màu sắc trung tính kết hợp với các điểm nhấn màu vàng đồng tạo nên không gian ấm cúng và sang trọng.",
        specs: {
            "Diện tích": "45m²",
            "Phong cách": "Hiện đại",
            "Thời gian": "2 tháng",
            "Vật liệu": "Gỗ tự nhiên, đá marble"
        },
        price: "150.000.000 VNĐ"
    },
    {
        id: 2,
        title: "Phòng Ngủ Master",
        description: "Không gian nghỉ ngơi thư giãn với thiết kế tinh tế",
        beforeImage: "https://images.unsplash.com/photo-1522771739844-6a9f47ddef91?w=800",
        afterImage: "https://images.unsplash.com/photo-1631889993951-fc3d2b5e1cc1?w=800",
        details: "Phòng ngủ master được thiết kế với không gian rộng rãi, giường ngủ lớn và tủ quần áo tích hợp. Màu sắc nhẹ nhàng tạo cảm giác thư giãn, kết hợp với ánh sáng tự nhiên và nhân tạo được tính toán kỹ lưỡng.",
        specs: {
            "Diện tích": "35m²",
            "Phong cách": "Tối giản",
            "Thời gian": "1.5 tháng",
            "Vật liệu": "Gỗ MDF, vải bọc"
        },
        price: "120.000.000 VNĐ"
    },
    {
        id: 3,
        title: "Nhà Bếp Mở",
        description: "Không gian bếp hiện đại với đảo bếp và khu vực ăn uống",
        beforeImage: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
        afterImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
        details: "Nhà bếp mở được thiết kế với đảo bếp trung tâm, tủ bếp cao cấp và thiết bị hiện đại. Không gian được tối ưu hóa cho việc nấu nướng và thưởng thức bữa ăn cùng gia đình.",
        specs: {
            "Diện tích": "25m²",
            "Phong cách": "Scandinavian",
            "Thời gian": "1 tháng",
            "Vật liệu": "Gỗ sồi, đá granite"
        },
        price: "100.000.000 VNĐ"
    }
];

// Load projects from localStorage, data.json, or use default
async function loadProjects() {
    isLoadingData = true; // Đánh dấu đang load dữ liệu
    
    // First try to load from data.json (for GitHub Pages)
    // Try multiple paths to handle different GitHub Pages configurations
    const possiblePaths = [
        'data.json',
        './data.json',
        '/data.json',
        window.location.pathname.replace(/\/[^/]*$/, '') + '/data.json'
    ];
    
    for (const path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const data = await response.json();
                if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
                    projects = data.projects;
                    console.log(`✅ Đã tải ${projects.length} dự án từ data.json (từ đường dẫn: ${path})`);
                    
                    // Import images if they exist in the data
                    if (data.images && typeof data.images === 'object') {
                        let imageCount = 0;
                        let failedCount = 0;
                        Object.keys(data.images).forEach(key => {
                            try {
                                const imageData = data.images[key];
                                if (imageData && typeof imageData === 'string') {
                                    localStorage.setItem(key, imageData);
                                    imageCount++;
                                } else {
                                    console.warn(`⚠️ Hình ảnh ${key} không hợp lệ`);
                                    failedCount++;
                                }
                            } catch (error) {
                                console.error(`❌ Lỗi khi import hình ảnh ${key}:`, error);
                                failedCount++;
                                // Nếu localStorage đầy, thử xóa một số item cũ
                                if (error.name === 'QuotaExceededError') {
                                    console.warn('⚠️ localStorage đầy, đang thử dọn dẹp...');
                                    try {
                                        // Xóa các image cũ không còn được sử dụng
                                        const usedImages = new Set();
                                        projects.forEach(p => {
                                            if (p.beforeImage) usedImages.add(p.beforeImage);
                                            if (p.afterImage) usedImages.add(p.afterImage);
                                        });
                                        Object.keys(localStorage).forEach(k => {
                                            if (k.startsWith('project_image_') && !usedImages.has(k)) {
                                                localStorage.removeItem(k);
                                            }
                                        });
                                        // Thử lại
                                        localStorage.setItem(key, data.images[key]);
                                        imageCount++;
                                        failedCount--;
                                    } catch (retryError) {
                                        console.error('❌ Vẫn không thể lưu hình ảnh sau khi dọn dẹp');
                                    }
                                }
                            }
                        });
                        console.log(`✅ Đã import ${imageCount} hình ảnh vào localStorage${failedCount > 0 ? `, ${failedCount} hình ảnh thất bại` : ''}`);
                    } else {
                        console.warn('⚠️ data.json không có phần images hoặc không hợp lệ');
                    }
                    
                    // Import hashtags if they exist
                    if (data.hashtags && typeof data.hashtags === 'object') {
                        saveHashtags(data.hashtags);
                        console.log(`✅ Đã import hashtags từ data.json vào localStorage`);
                    }
                    
                    // Also save to localStorage as backup (không trigger auto-export vì isLoadingData = true)
                    localStorage.setItem('projects', JSON.stringify(projects));
                    isLoadingData = false;
                    return;
                } else {
                    console.warn(`⚠️ data.json tìm thấy nhưng không có dự án hợp lệ (từ đường dẫn: ${path})`);
                }
            } else {
                console.log(`⚠️ Không thể tải data.json từ ${path} (status: ${response.status})`);
            }
        } catch (error) {
            console.log(`⚠️ Lỗi khi tải data.json từ ${path}:`, error.message);
        }
    }
    
    console.log('📦 Không tìm thấy data.json, sử dụng localStorage hoặc dữ liệu mặc định');
    
    // Fallback to localStorage
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        try {
            projects = JSON.parse(savedProjects);
            console.log(`✅ Đã tải ${projects.length} dự án từ localStorage`);
        } catch (error) {
            console.error('❌ Lỗi khi parse dữ liệu từ localStorage:', error);
        }
    } else {
        console.log('📋 Sử dụng dữ liệu mặc định từ script.js');
    }
    
    // Ensure hashtags are loaded from localStorage (they should already be there from previous sessions)
    const existingHashtags = localStorage.getItem('adminHashtags');
    if (existingHashtags) {
        try {
            const hashtags = JSON.parse(existingHashtags);
            console.log(`✅ Đã tải hashtags từ localStorage: ${hashtags.roomTypes.length} loại phòng, ${hashtags.styles.length} phong cách`);
        } catch (error) {
            console.error('❌ Lỗi khi parse hashtags từ localStorage:', error);
        }
    } else {
        console.log('⚠️ Chưa có hashtags trong localStorage. Vui lòng tạo hashtags trong admin panel.');
    }
    
    isLoadingData = false; // Hoàn tất load dữ liệu
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Initialize reveal effect for project cards
function initRevealEffect() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const container = card.querySelector('.project-image-container');
        const slider = card.querySelector('.reveal-slider');
        const afterImage = card.querySelector('.project-image-after');
        let isDragging = false;
        let currentCard = null;
        
        // Prevent clicks on image container from triggering navigation
        container.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Mouse events
        container.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault();
            isDragging = true;
            currentCard = { container, slider, afterImage };
            container.style.userSelect = 'none';
            updateSliderPosition(e, container, slider, afterImage);
        });
        
        // Use requestAnimationFrame for smooth animation
        let animationFrame = null;
        const handleMouseMove = (e) => {
            if (isDragging && currentCard) {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
                animationFrame = requestAnimationFrame(() => {
                    updateSliderPosition(e, currentCard.container, currentCard.slider, currentCard.afterImage);
                });
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        
        const handleMouseUp = () => {
            if (isDragging && currentCard) {
                isDragging = false;
                currentCard.container.style.userSelect = '';
                currentCard = null;
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            }
        };
        
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
        
        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            isDragging = true;
            currentCard = { container, slider, afterImage };
            updateSliderPosition(e.touches[0], container, slider, afterImage);
        });
        
        container.addEventListener('touchmove', (e) => {
            if (isDragging && currentCard) {
                e.preventDefault();
                e.stopPropagation();
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
                animationFrame = requestAnimationFrame(() => {
                    updateSliderPosition(e.touches[0], currentCard.container, currentCard.slider, currentCard.afterImage);
                });
            }
        });
        
        container.addEventListener('touchend', (e) => {
            e.stopPropagation();
            if (isDragging && currentCard) {
                isDragging = false;
                currentCard = null;
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            }
        });
        
        container.addEventListener('touchcancel', (e) => {
            e.stopPropagation();
            if (isDragging && currentCard) {
                isDragging = false;
                currentCard = null;
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            }
        });
    });
}

function updateSliderPosition(e, container, slider, afterImage) {
    const rect = container.getBoundingClientRect();
    let x;
    
    // Handle both mouse and touch events
    if (e.clientX !== undefined) {
        x = e.clientX - rect.left;
    } else if (e.pageX !== undefined) {
        x = e.pageX - rect.left - window.scrollX;
    } else {
        return;
    }
    
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    // Use transform for better performance
    slider.style.left = percentage + '%';
    // Clip-path: inset(top right bottom left)
    // After image should be on the right side, so clip from left
    // When percentage = 0%, show all (inset(0 0 0 0))
    // When percentage = 50%, show right half (inset(0 0 0 50%))
    // When percentage = 100%, show nothing (inset(0 0 0 100%))
    afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
}

// Extract styles from project specs or hashtags
function extractStyles(project) {
    // Priority 1: Use hashtags if available
    if (project.hashtags && project.hashtags.styles && Array.isArray(project.hashtags.styles) && project.hashtags.styles.length > 0) {
        return project.hashtags.styles;
    }
    
    const styles = [];
    if (project.specs && project.specs["Phong cách"]) {
        const styleText = project.specs["Phong cách"];
        
        // Common style keywords to look for
        const styleKeywords = {
            'Hiện đại': 'Hiện đại',
            'Modern': 'Hiện đại',
            'Contemporary': 'Đương đại',
            'Đương đại': 'Đương đại',
            'Minimalist': 'Tối giản',
            'Tối giản': 'Tối giản',
            'Scandinavian': 'Scandinavian',
            'Rustic': 'Rustic',
            'Industrial': 'Công nghiệp',
            'Công nghiệp': 'Công nghiệp',
            'Classic': 'Cổ điển',
            'Cổ điển': 'Cổ điển',
            'Luxury': 'Sang trọng',
            'Sang trọng': 'Sang trọng',
            'Traditional': 'Truyền thống',
            'Truyền thống': 'Truyền thống',
            'Bohemian': 'Bohemian',
            'Vintage': 'Vintage',
            'Eclectic': 'Eclectic',
            'Farmhouse': 'Farmhouse',
            'Mediterranean': 'Mediterranean',
            'Art Deco': 'Art Deco',
            'Mid-century': 'Mid-century'
        };
        
        // Check for style keywords
        Object.entries(styleKeywords).forEach(([keyword, styleName]) => {
            const regex = new RegExp(keyword, 'i');
            if (regex.test(styleText) && !styles.includes(styleName)) {
                styles.push(styleName);
            }
        });
        
        // Try to extract styles from patterns like "- Style Name:" or "Style Name:"
        const patternMatches = styleText.match(/(?:^|\n|[-•])\s*([A-Za-zÀ-ỹ\s]+?)(?:\s*[:\-]|\(|\)|,|\.|$)/g);
        if (patternMatches) {
            patternMatches.forEach(match => {
                let style = match.replace(/^[-•\n]\s*/, '').replace(/[:\-\(\)].*$/, '').trim();
                // Remove common words
                style = style.replace(/^(phong cách|style|thiết kế)\s*/i, '').trim();
                if (style && style.length > 2 && style.length < 30) {
                    // Check if it's a valid style name (not a description)
                    const isDescription = /(đặc trưng|bởi|với|sử dụng|tạo|cho|và|hoặc|kết hợp)/i.test(style);
                    if (!isDescription && !styles.includes(style)) {
                        styles.push(style);
                    }
                }
            });
        }
    }
    
    // If no styles found, try to infer from description
    if (styles.length === 0 && project.description) {
        const desc = project.description.toLowerCase();
        if (desc.includes('hiện đại') || desc.includes('modern')) styles.push('Hiện đại');
        if (desc.includes('tối giản') || desc.includes('minimalist')) styles.push('Tối giản');
        if (desc.includes('sang trọng') || desc.includes('luxury')) styles.push('Sang trọng');
    }
    
    return styles.length > 0 ? styles : ['Khác'];
}

// Extract room type from project title or hashtags
function extractRoomType(project) {
    // Priority 1: Use hashtags if available, but validate against title
    if (project.hashtags && project.hashtags.roomType) {
        const savedRoomType = project.hashtags.roomType;
        const title = project.title.toLowerCase().trim();
        
        // Validate: if title clearly indicates a different room type, use title instead
        // This prevents cases where wrong hashtag was saved
        const titleRoomTypes = [
            { key: 'phòng trọ', value: 'Phòng Trọ' },
            { key: 'phòng khách', value: 'Phòng Khách' },
            { key: 'phòng ngủ', value: 'Phòng Ngủ' },
            { key: 'phòng tắm', value: 'Phòng Tắm' },
            { key: 'phòng làm việc', value: 'Phòng Làm Việc' },
            { key: 'phòng thờ', value: 'Phòng Thờ' },
            { key: 'nhà bếp', value: 'Nhà Bếp' },
            { key: 'ban công', value: 'Ban Công' },
            { key: 'căn hộ', value: 'Căn Hộ' },
            { key: 'biệt thự', value: 'Biệt Thự' }
        ];
        
        // Check if title has a specific room type that doesn't match saved hashtag
        for (const { key, value } of titleRoomTypes) {
            const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(title) && value !== savedRoomType) {
                // Title indicates different room type, use title instead
                console.warn(`Hashtag mismatch: Saved "${savedRoomType}" but title suggests "${value}". Using title.`);
                return value;
            }
        }
        
        return savedRoomType;
    }
    
    // Priority 2: Extract from title
    // Use word boundaries to match exact phrases, prioritizing longer/more specific matches first
    const title = project.title.toLowerCase().trim();
    const roomTypes = [
        // More specific matches first (longer phrases)
        { key: 'phòng trọ', value: 'Phòng Trọ' },
        { key: 'phòng khách', value: 'Phòng Khách' },
        { key: 'phòng ngủ', value: 'Phòng Ngủ' },
        { key: 'phòng tắm', value: 'Phòng Tắm' },
        { key: 'phòng làm việc', value: 'Phòng Làm Việc' },
        { key: 'phòng thờ', value: 'Phòng Thờ' },
        { key: 'nhà bếp', value: 'Nhà Bếp' },
        { key: 'ban công', value: 'Ban Công' },
        { key: 'căn hộ', value: 'Căn Hộ' },
        { key: 'biệt thự', value: 'Biệt Thự' },
        // Less specific matches last
        { key: 'bếp', value: 'Nhà Bếp' },
        { key: 'nhà', value: 'Nhà' },
        { key: 'villa', value: 'Villa' }
    ];
    
    // Check for exact word matches first (more specific)
    for (const { key, value } of roomTypes) {
        // Use word boundary regex to match whole words/phrases
        const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(title)) {
            return value;
        }
    }
    
    // Fallback: check for substring matches (less strict)
    for (const { key, value } of roomTypes) {
        if (title.includes(key)) {
            return value;
        }
    }
    
    return 'Khác';
}

// Get hashtags from localStorage (created by admin)
function getAdminHashtags() {
    const saved = localStorage.getItem('adminHashtags');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing adminHashtags:', e);
            return {
                roomTypes: [],
                styles: []
            };
        }
    }
    // Return empty arrays if no hashtags created yet
    return {
        roomTypes: [],
        styles: []
    };
}

// Get all unique styles and room types from projects
function getAllStylesAndRoomTypes() {
    // Use admin-created hashtags instead of extracting from projects
    const adminHashtags = getAdminHashtags();
    
    return {
        styles: adminHashtags.styles || [],
        roomTypes: adminHashtags.roomTypes || []
    };
}

// Current filter state
let currentFilters = {
    styles: [],
    roomTypes: []
};

// Render projects on homepage
async function renderProjects(filteredProjects = null) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    const projectsToRender = filteredProjects || projects;
    
    // Load all images first
    for (const project of projectsToRender) {
        if (project.beforeImage && project.beforeImage.startsWith('project_image_')) {
            await getImageSrc(project.beforeImage);
        }
        if (project.afterImage && project.afterImage.startsWith('project_image_')) {
            await getImageSrc(project.afterImage);
        }
    }
    
    projectsGrid.innerHTML = projectsToRender.map(project => {
        const styles = extractStyles(project);
        const roomType = extractRoomType(project);
        
        // Filter out "Khác" and "N/A" from styles if there are other styles
        const displayStyles = styles.filter(s => s !== 'Khác' && s !== 'N/A');
        if (displayStyles.length === 0 && styles.length > 0) {
            displayStyles.push(...styles);
        }
        
        const styleTags = displayStyles.map(style => 
            `<span class="hashtag hashtag-style">#${style}</span>`
        ).join('');
        
        const roomTypeTag = `<span class="hashtag hashtag-room">#${roomType}</span>`;
        
        return `
        <div class="project-card" data-project-id="${project.id}" data-styles="${displayStyles.join(',')}" data-room-type="${roomType}">
            <div class="project-image-container">
                <img src="${getImageSrcSync(project.beforeImage)}" alt="Before" class="project-image-before" data-project-id="${project.id}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'18\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3EĐang tải...%3C/text%3E%3C/svg%3E'; this.onerror=null;">
                <img src="${getImageSrcSync(project.afterImage)}" alt="After" class="project-image-after" data-project-id="${project.id}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'18\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3EĐang tải...%3C/text%3E%3C/svg%3E'; this.onerror=null;">
                <div class="reveal-slider"></div>
            </div>
                <div class="project-info" onclick="viewProjectDetail(${project.id})" style="cursor: pointer;">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-hashtags ${(currentFilters.styles.length > 0 || currentFilters.roomTypes.length > 0) ? 'visible' : 'hidden'}">
                    ${roomTypeTag}
                    ${styleTags}
                </div>
                <div class="project-meta">
                    <span>Xem chi tiết</span>
                    <a href="detail.html?id=${project.id}" class="view-details" onclick="event.stopPropagation();">Chi tiết →</a>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    // Update images after initial render (for async loading)
    // Use project ID to match instead of index to avoid image jumping
    for (const project of projectsToRender) {
        const card = projectsGrid.querySelector(`[data-project-id="${project.id}"]`);
        if (card) {
            // Find images within this specific card to avoid matching wrong images
            const beforeImg = card.querySelector('.project-image-before');
            const afterImg = card.querySelector('.project-image-after');
            
            if (beforeImg && project.beforeImage) {
                const src = await getImageSrc(project.beforeImage);
                if (src && beforeImg.getAttribute('data-project-id') === String(project.id)) {
                    beforeImg.src = src;
                }
            }
            if (afterImg && project.afterImage) {
                const src = await getImageSrc(project.afterImage);
                if (src && afterImg.getAttribute('data-project-id') === String(project.id)) {
                    afterImg.src = src;
                }
            }
        }
    }
    
    // Initialize reveal effect after rendering
    setTimeout(initRevealEffect, 100);
}

// Filter projects based on selected filters
function filterProjects() {
    const hasActiveFilters = currentFilters.styles.length > 0 || currentFilters.roomTypes.length > 0;
    
    if (!hasActiveFilters) {
        // No filters - render all projects with hidden hashtags
        renderProjects();
        return;
    }
    
    // Apply filters
    const filtered = projects.filter(project => {
        const projectStyles = extractStyles(project);
        const roomType = extractRoomType(project);
        
        // Filter out "Khác" and "N/A" for comparison
        const cleanProjectStyles = projectStyles.filter(s => s !== 'Khác' && s !== 'N/A');
        
        // Check style filter
        const matchesStyle = currentFilters.styles.length === 0 || 
            currentFilters.styles.some(filterStyle => {
                // Exact match
                if (cleanProjectStyles.includes(filterStyle)) return true;
                // Partial match (case insensitive)
                return cleanProjectStyles.some(style => 
                    style.toLowerCase().includes(filterStyle.toLowerCase()) ||
                    filterStyle.toLowerCase().includes(style.toLowerCase())
                );
            });
        
        // Check room type filter
        const matchesRoomType = currentFilters.roomTypes.length === 0 ||
            currentFilters.roomTypes.includes(roomType);
        
        return matchesStyle && matchesRoomType;
    });
    
    renderProjects(filtered);
}

// Toggle filter
function toggleFilter(type, value) {
    const filterArray = currentFilters[type];
    const index = filterArray.indexOf(value);
    
    if (index > -1) {
        filterArray.splice(index, 1);
    } else {
        filterArray.push(value);
    }
    
    // Update filter buttons
    updateFilterButtons();
    
    // Apply filter
    filterProjects();
}

// Update filter button states
function updateFilterButtons() {
    // Update style buttons
    document.querySelectorAll('.filter-btn-style').forEach(btn => {
        const value = btn.dataset.value;
        if (currentFilters.styles.includes(value)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update room type buttons
    document.querySelectorAll('.filter-btn-room').forEach(btn => {
        const value = btn.dataset.value;
        if (currentFilters.roomTypes.includes(value)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter sections expanded state
let filterSectionsExpanded = {
    roomTypes: false,
    styles: false
};

// Render filter buttons
function renderFilters() {
    const filterContainer = document.getElementById('filterContainer');
    if (!filterContainer) return;
    
    const { styles, roomTypes } = getAllStylesAndRoomTypes();
    
    // Build filter HTML safely
    const roomTypeButtons = roomTypes.map(roomType => {
        const escapedRoomType = escapeHtml(roomType);
        const escapedValue = roomType.replace(/'/g, "\\'");
        return `<button class="filter-btn filter-btn-room" data-type="roomTypes" data-value="${escapedRoomType}" onclick="toggleFilter('roomTypes', '${escapedValue}')">
                        ${escapedRoomType}
                    </button>`;
    }).join('');
    
    const styleButtons = styles.map(style => {
        const escapedStyle = escapeHtml(style);
        const escapedValue = style.replace(/'/g, "\\'");
        return `<button class="filter-btn filter-btn-style" data-type="styles" data-value="${escapedStyle}" onclick="toggleFilter('styles', '${escapedValue}')">
                        #${escapedStyle}
                    </button>`;
    }).join('');
    
    const clearButtonHtml = (currentFilters.styles.length > 0 || currentFilters.roomTypes.length > 0) ? `
        <div class="filter-actions">
            <button class="filter-clear-btn" onclick="clearFilters()">Xóa bộ lọc</button>
        </div>
    ` : '';
    
    filterContainer.innerHTML = `
        <div class="filter-section">
            <div class="filter-title-toggle" onclick="toggleFilterSection('roomTypes')">
                <div class="filter-title-content">
                    <span class="filter-title-icon">🏠</span>
                    <span class="filter-title-text">Lọc theo loại phòng</span>
                </div>
                <span class="filter-toggle-icon ${filterSectionsExpanded.roomTypes ? 'expanded' : ''}">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
            <div class="filter-buttons-container ${filterSectionsExpanded.roomTypes ? 'expanded' : 'collapsed'}">
                <div class="filter-buttons">
                    ${roomTypeButtons}
                </div>
            </div>
        </div>
        <div class="filter-section">
            <div class="filter-title-toggle" onclick="toggleFilterSection('styles')">
                <div class="filter-title-content">
                    <span class="filter-title-icon">🎨</span>
                    <span class="filter-title-text">Lọc theo phong cách</span>
                </div>
                <span class="filter-toggle-icon ${filterSectionsExpanded.styles ? 'expanded' : ''}">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
            <div class="filter-buttons-container ${filterSectionsExpanded.styles ? 'expanded' : 'collapsed'}">
                <div class="filter-buttons">
                    ${styleButtons}
                </div>
            </div>
        </div>
        ${clearButtonHtml}
    `;
    
    // Update button states after rendering
    updateFilterButtons();
}

// Toggle filter section expand/collapse
function toggleFilterSection(section) {
    filterSectionsExpanded[section] = !filterSectionsExpanded[section];
    renderFilters();
}

// Clear all filters
function clearFilters() {
    currentFilters = {
        styles: [],
        roomTypes: []
    };
    renderFilters();
    renderProjects();
}

// View project detail
function viewProjectDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// Format text với xuống dòng và gạch đầu dòng
function formatTextWithBullets(text) {
    if (!text) return '';
    
    // Tách theo xuống dòng, giữ lại cả dòng trống để xử lý đoạn văn
    const lines = text.split('\n');
    
    // Nhóm các dòng liên tiếp có gạch đầu dòng thành một danh sách
    let result = '';
    let listItems = [];
    
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Kiểm tra nếu dòng bắt đầu bằng '-' hoặc '*' thì tạo gạch đầu dòng
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const content = trimmedLine.substring(1).trim();
            if (content) {
                listItems.push(`<li>${content}</li>`);
            }
        } else if (trimmedLine) {
            // Nếu có danh sách đang tích lũy, đóng danh sách trước
            if (listItems.length > 0) {
                result += `<ul class="spec-bullet-list">${listItems.join('')}</ul>`;
                listItems = [];
            }
            // Thêm đoạn văn
            result += `<p>${trimmedLine}</p>`;
        } else {
            // Dòng trống - đóng danh sách nếu có
            if (listItems.length > 0) {
                result += `<ul class="spec-bullet-list">${listItems.join('')}</ul>`;
                listItems = [];
            }
        }
    });
    
    // Đóng danh sách nếu còn
    if (listItems.length > 0) {
        result += `<ul class="spec-bullet-list">${listItems.join('')}</ul>`;
    }
    
    return result || text;
}

// Load project detail
async function loadProjectDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'));
    
    if (!projectId) {
        window.location.href = 'index.html';
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        window.location.href = 'index.html';
        return;
    }
    
    document.querySelector('.detail-title').textContent = project.title;
    
    // Load images asynchronously
    const beforeImg = document.querySelector('.detail-image-before');
    const afterImg = document.querySelector('.detail-image-after');
    
    if (beforeImg && project.beforeImage) {
        const src = await getImageSrc(project.beforeImage);
        beforeImg.src = src || '';
        beforeImg.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect fill=\'%23ddd\' width=\'400\' height=\'300\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'18\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EKhông tìm thấy hình ảnh%3C/text%3E%3C/svg%3E';
        };
    }
    
    if (afterImg && project.afterImage) {
        const src = await getImageSrc(project.afterImage);
        afterImg.src = src || '';
        afterImg.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect fill=\'%23ddd\' width=\'400\' height=\'300\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'18\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EKhông tìm thấy hình ảnh%3C/text%3E%3C/svg%3E';
        };
    }
    
    document.querySelector('.detail-description').textContent = project.details;
    document.querySelector('.pricing-amount').textContent = project.price;
    
    const specsContainer = document.querySelector('.detail-specs');
    specsContainer.innerHTML = Object.entries(project.specs)
        .filter(([key]) => key !== 'Thời gian') // Bỏ mục Thời gian
        .map(([key, value]) => {
            // Xử lý Phong cách và Vật liệu với format xuống dòng và gạch đầu dòng
            if (key === 'Phong cách' || key === 'Vật liệu') {
                return `
                    <div class="spec-item spec-item-formatted">
                        <strong>${key}</strong>
                        <div class="spec-formatted-content">
                            ${formatTextWithBullets(value)}
                        </div>
                    </div>
                `;
            }
            // Hiển thị bình thường cho các mục khác
            return `
                <div class="spec-item">
                    <strong>${key}</strong>
                    <span>${value}</span>
                </div>
            `;
        }).join('');
}

// Image compression and upload functions
function compressImage(file, maxWidth = 1200, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with compression
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            
            img.onerror = reject;
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle image upload
async function handleImageUpload(fileInputId, hiddenInputId, previewId) {
    const fileInput = document.getElementById(fileInputId);
    const hiddenInput = document.getElementById(hiddenInputId);
    const preview = document.getElementById(previewId);
    const placeholder = document.getElementById(fileInputId.replace('File', 'Placeholder'));
    
    if (!fileInput.files || fileInput.files.length === 0) {
        return;
    }
    
    const file = fileInput.files[0];
    
    // Check file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
        alert('Kích thước file quá lớn! Vui lòng chọn file nhỏ hơn 10MB.');
        fileInput.value = '';
        return;
    }
    
    // Show loading
    if (placeholder) {
        placeholder.textContent = 'Đang xử lý...';
        placeholder.style.display = 'block';
    }
    preview.style.display = 'none';
    
    try {
        // Compress image
        const compressedImage = await compressImage(file);
        
        // Generate unique ID for image
        const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Save to localStorage
        const storageKey = `project_image_${imageId}`;
        localStorage.setItem(storageKey, compressedImage);
        
        // Set hidden input value to storage key
        hiddenInput.value = storageKey;
        
        // Show preview
        preview.src = compressedImage;
        preview.style.display = 'block';
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // Show file size info
        const sizeKB = Math.round(compressedImage.length * 0.75 / 1024);
        console.log(`Hình ảnh đã được nén: ${sizeKB}KB`);
        
    } catch (error) {
        console.error('Lỗi khi xử lý hình ảnh:', error);
        alert('Có lỗi xảy ra khi xử lý hình ảnh. Vui lòng thử lại.');
        if (placeholder) {
            placeholder.textContent = 'Chưa có hình ảnh';
        }
    }
}

// Cache để lưu images đã load từ data.json (tránh load lại nhiều lần)
const imageCache = {};

// Load image từ data.json nếu không có trong localStorage
async function loadImageFromDataJson(imageKey) {
    if (imageCache[imageKey]) {
        return imageCache[imageKey];
    }
    
    try {
        const possiblePaths = [
            'data.json',
            './data.json',
            '/data.json',
            window.location.pathname.replace(/\/[^/]*$/, '') + '/data.json'
        ];
        
        for (const path of possiblePaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const data = await response.json();
                    if (data.images && data.images[imageKey]) {
                        // Lưu vào localStorage và cache
                        try {
                            localStorage.setItem(imageKey, data.images[imageKey]);
                            imageCache[imageKey] = data.images[imageKey];
                            console.log(`✅ Đã load lại hình ảnh ${imageKey} từ data.json`);
                            return data.images[imageKey];
                        } catch (error) {
                            // Nếu không thể lưu vào localStorage, chỉ dùng cache
                            imageCache[imageKey] = data.images[imageKey];
                            return data.images[imageKey];
                        }
                    }
                }
            } catch (error) {
                // Tiếp tục thử path tiếp theo
            }
        }
    } catch (error) {
        console.error(`❌ Lỗi khi load hình ảnh ${imageKey} từ data.json:`, error);
    }
    
    return null;
}

// Get image from storage or URL
async function getImageSrc(imageValue) {
    if (!imageValue) return '';
    
    // Check if it's a storage key (starts with 'project_image_')
    if (imageValue.startsWith('project_image_')) {
        // Thử lấy từ localStorage trước
        let storedImage = localStorage.getItem(imageValue);
        
        if (storedImage) {
            return storedImage;
        }
        
        // Nếu không có trong localStorage, thử load từ cache
        if (imageCache[imageValue]) {
            return imageCache[imageValue];
        }
        
        // Nếu không có trong cache, thử load từ data.json
        storedImage = await loadImageFromDataJson(imageValue);
        if (storedImage) {
            return storedImage;
        }
        
        // Nếu vẫn không tìm thấy, log warning và trả về rỗng
        console.warn(`⚠️ Không tìm thấy hình ảnh với key: ${imageValue}`);
        return '';
    }
    
    // Otherwise, it's a URL
    return imageValue;
}

// Synchronous version for use in template strings (fallback)
function getImageSrcSync(imageValue) {
    if (!imageValue) return '';
    
    if (imageValue.startsWith('project_image_')) {
        const storedImage = localStorage.getItem(imageValue) || imageCache[imageValue];
        return storedImage || '';
    }
    
    return imageValue;
}

// Initialize admin accounts system
function initAdminAccounts() {
    if (!localStorage.getItem('adminAccounts')) {
        // Create default admin account
        const defaultAccounts = {
            'admin': {
                password: 'admin',
                createdAt: new Date().toISOString(),
                isAdmin: true
            }
        };
        localStorage.setItem('adminAccounts', JSON.stringify(defaultAccounts));
    } else {
        // Ensure admin account has isAdmin flag
        const accounts = JSON.parse(localStorage.getItem('adminAccounts'));
        if (accounts['admin'] && !accounts['admin'].isAdmin) {
            accounts['admin'].isAdmin = true;
            localStorage.setItem('adminAccounts', JSON.stringify(accounts));
        }
    }
}

// Check if user is admin
function isAdmin() {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const accounts = getAdminAccounts();
    return accounts[currentUser] && accounts[currentUser].isAdmin === true;
}

// Get admin accounts
function getAdminAccounts() {
    const accounts = localStorage.getItem('adminAccounts');
    return accounts ? JSON.parse(accounts) : {};
}

// Save admin accounts
function saveAdminAccounts(accounts) {
    localStorage.setItem('adminAccounts', JSON.stringify(accounts));
}

// Check if user is logged in
function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('currentUser');
}

// Get current user
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Login function
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showMessage('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    const accounts = getAdminAccounts();
    
    if (accounts[username] && accounts[username].password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        window.location.href = 'admin.html';
    } else {
        showMessage('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
}


// Show message
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMsg = document.querySelector('.login-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `login-message ${type}`;
    msgDiv.textContent = message;
    
    const loginBox = document.querySelector('.login-box');
    loginBox.insertBefore(msgDiv, loginBox.firstChild.nextSibling);
    
    setTimeout(() => {
        msgDiv.style.opacity = '0';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Load admin page
function loadAdminPage() {
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize hashtag dropdowns
    const hashtags = getHashtags();
    updateHashtagDropdowns(hashtags);
    
    // Show current user name
    const currentUser = getCurrentUser();
    const userNameElement = document.getElementById('currentUserName');
    if (userNameElement) {
        userNameElement.textContent = currentUser || 'Admin';
    }
    
    const adminProjects = document.getElementById('adminProjects');
    if (!adminProjects) return;
    
    // Cập nhật trạng thái nút chọn file
    const fileSelected = dataJsonFileHandle !== null || sessionStorage.getItem('dataJsonFileSelected') === 'true';
    updateSelectFileButton(fileSelected);
    
    // Hiển thị thông báo nếu đã chọn file trước đó
    if (fileSelected && !dataJsonFileHandle) {
        const fileName = sessionStorage.getItem('dataJsonFileName') || 'data.json';
        console.log(`ℹ️ Đã chọn file ${fileName} trong phiên trước. Vui lòng chọn lại file để tiếp tục tự động lưu.`);
    }
    
    adminProjects.innerHTML = projects.map(project => `
        <div class="admin-project-card">
            <img src="${getImageSrc(project.afterImage)}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="admin-actions">
                <button class="btn-edit" onclick="editProject(${project.id})">Sửa</button>
                <button class="btn-delete" onclick="deleteProject(${project.id})">Xóa</button>
            </div>
        </div>
    `).join('');
}

// Open account management modal
function openAccountModal() {
    document.getElementById('accountModal').classList.add('active');
    switchAccountTab('changePassword');
    loadAccountsList();
}

// Close account modal
function closeAccountModal() {
    document.getElementById('accountModal').classList.remove('active');
    // Reset forms
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPasswordChange').value = '';
    document.getElementById('confirmPasswordChange').value = '';
    document.getElementById('newAccountUsername').value = '';
    document.getElementById('newAccountPassword').value = '';
}

// Switch account tab
function switchAccountTab(tab) {
    const changePasswordTab = document.getElementById('changePasswordTab');
    const manageAccountsTab = document.getElementById('manageAccountsTab');
    const tabs = document.querySelectorAll('.account-tab-btn');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'changePassword') {
        changePasswordTab.style.display = 'block';
        manageAccountsTab.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        // Only admin can access manage accounts tab
        if (!isAdmin()) {
            alert('Chỉ tài khoản admin mới có quyền quản lý tài khoản!');
            return;
        }
        changePasswordTab.style.display = 'none';
        manageAccountsTab.style.display = 'block';
        tabs[1].classList.add('active');
        loadAccountsList();
    }
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPasswordChange').value;
    const confirmPassword = document.getElementById('confirmPasswordChange').value;
    const targetUsername = document.getElementById('changePasswordUsername')?.value || getCurrentUser();
    const currentUser = getCurrentUser();
    const userIsAdmin = isAdmin();
    
    // If changing other user's password, must be admin
    if (targetUsername !== currentUser && !userIsAdmin) {
        alert('Bạn không có quyền đổi mật khẩu của tài khoản khác!');
        return;
    }
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    const accounts = getAdminAccounts();
    
    // If admin changing other user's password, skip current password check
    if (targetUsername === currentUser) {
        if (!accounts[currentUser] || accounts[currentUser].password !== currentPassword) {
            alert('Mật khẩu hiện tại không đúng!');
            return;
        }
    }
    
    accounts[targetUsername].password = newPassword;
    saveAdminAccounts(accounts);
    
    alert('Đổi mật khẩu thành công!');
    closeAccountModal();
}

// Load accounts list
function loadAccountsList() {
    const accountsList = document.getElementById('accountsList');
    if (!accountsList) return;
    
    const accounts = getAdminAccounts();
    const currentUser = getCurrentUser();
    const userIsAdmin = isAdmin();
    const accountsArray = Object.keys(accounts);
    
    if (accountsArray.length === 0) {
        accountsList.innerHTML = '<p style="text-align: center; color: #666;">Chưa có tài khoản nào</p>';
        return;
    }
    
    accountsList.innerHTML = accountsArray.map(username => {
        const account = accounts[username];
        const createdAt = new Date(account.createdAt).toLocaleDateString('vi-VN');
        const isCurrentUser = username === currentUser;
        const isAccountAdmin = account.isAdmin === true;
        
        return `
            <div class="account-item ${isCurrentUser ? 'current-user' : ''} ${isAccountAdmin ? 'admin-account' : ''}">
                <div class="account-info">
                    <strong>${username} ${isCurrentUser ? '(Bạn)' : ''} ${isAccountAdmin ? '👑' : ''}</strong>
                    <small>Tạo ngày: ${createdAt} ${isAccountAdmin ? '| Admin' : ''}</small>
                </div>
                <div class="account-actions">
                    ${userIsAdmin && !isCurrentUser ? `<button class="btn-change-password-other" onclick="changeOtherPassword('${username}')">Đổi MK</button>` : ''}
                    ${userIsAdmin && !isCurrentUser && !isAccountAdmin ? `<button class="btn-delete-account" onclick="deleteAccount('${username}')">Xóa</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Change password for other user (admin only)
function changeOtherPassword(username) {
    if (!isAdmin()) {
        alert('Chỉ tài khoản admin mới có quyền đổi mật khẩu của tài khoản khác!');
        return;
    }
    
    const newPassword = prompt(`Nhập mật khẩu mới cho tài khoản "${username}":`);
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    const confirmPassword = prompt('Xác nhận mật khẩu mới:');
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    const accounts = getAdminAccounts();
    accounts[username].password = newPassword;
    saveAdminAccounts(accounts);
    
    alert('Đổi mật khẩu thành công!');
    loadAccountsList();
}

// Create new account (only admin)
function createNewAccount() {
    if (!isAdmin()) {
        alert('Chỉ tài khoản admin mới có quyền tạo tài khoản mới!');
        return;
    }
    
    const username = document.getElementById('newAccountUsername').value.trim();
    const password = document.getElementById('newAccountPassword').value;
    
    if (!username || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    const accounts = getAdminAccounts();
    
    if (accounts[username]) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
    }
    
    accounts[username] = {
        password: password,
        createdAt: new Date().toISOString(),
        isAdmin: false
    };
    
    saveAdminAccounts(accounts);
    alert('Tạo tài khoản thành công!');
    
    document.getElementById('newAccountUsername').value = '';
    document.getElementById('newAccountPassword').value = '';
    loadAccountsList();
}

// Delete account (admin only)
function deleteAccount(username) {
    if (!isAdmin()) {
        alert('Chỉ tài khoản admin mới có quyền xóa tài khoản!');
        return;
    }
    
    const currentUser = getCurrentUser();
    const accounts = getAdminAccounts();
    
    if (username === currentUser) {
        alert('Bạn không thể xóa tài khoản của chính mình!');
        return;
    }
    
    if (accounts[username] && accounts[username].isAdmin) {
        alert('Không thể xóa tài khoản admin!');
        return;
    }
    
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) {
        return;
    }
    
    delete accounts[username];
    saveAdminAccounts(accounts);
    
    alert('Xóa tài khoản thành công!');
    loadAccountsList();
}

// Hashtag Management Functions
function getHashtags() {
    const saved = localStorage.getItem('adminHashtags');
    if (saved) {
        return JSON.parse(saved);
    }
    // Default hashtags
    return {
        roomTypes: ['Phòng Khách', 'Phòng Ngủ', 'Nhà Bếp', 'Phòng Tắm', 'Phòng Làm Việc'],
        styles: ['Hiện đại', 'Tối giản', 'Scandinavian', 'Cổ điển', 'Sang trọng']
    };
}

function saveHashtags(hashtags) {
    localStorage.setItem('adminHashtags', JSON.stringify(hashtags));
}

function updateHashtagDropdowns(hashtags) {
    const roomTypeSelect = document.getElementById('projectRoomType');
    const stylesSelect = document.getElementById('projectHashtagStyles');
    
    if (roomTypeSelect) {
        roomTypeSelect.innerHTML = '<option value="">-- Chọn loại phòng --</option>' +
            hashtags.roomTypes.map(tag => `<option value="${tag}">${tag}</option>`).join('');
    }
    
    if (stylesSelect) {
        stylesSelect.innerHTML = hashtags.styles.map(tag => 
            `<option value="${tag}">${tag}</option>`
        ).join('');
    }
}

function displayHashtags(hashtags) {
    const roomTypesList = document.getElementById('roomTypesList');
    const stylesList = document.getElementById('stylesList');
    
    if (roomTypesList) {
        if (hashtags.roomTypes.length === 0) {
            roomTypesList.innerHTML = '<p style="text-align: center; color: #999; padding: 1rem;">Chưa có hashtag nào. Hãy thêm hashtag mới!</p>';
        } else {
            roomTypesList.innerHTML = hashtags.roomTypes.map((tag, index) => `
                <div class="hashtag-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f5f5f5; border-radius: 6px; margin-bottom: 0.5rem; transition: all 0.2s;">
                    <span style="font-weight: 500; color: #333;">${tag}</span>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="editHashtag('roomType', ${index})" style="padding: 0.375rem 0.75rem; background: #f39c12; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.background='#e67e22'" onmouseout="this.style.background='#f39c12'">✏️ Sửa</button>
                        <button onclick="deleteHashtag('roomType', ${index})" style="padding: 0.375rem 0.75rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">🗑️ Xóa</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (stylesList) {
        if (hashtags.styles.length === 0) {
            stylesList.innerHTML = '<p style="text-align: center; color: #999; padding: 1rem;">Chưa có hashtag nào. Hãy thêm hashtag mới!</p>';
        } else {
            stylesList.innerHTML = hashtags.styles.map((tag, index) => `
                <div class="hashtag-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f5f5f5; border-radius: 6px; margin-bottom: 0.5rem; transition: all 0.2s;">
                    <span style="font-weight: 500; color: #333;">${tag}</span>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="editHashtag('style', ${index})" style="padding: 0.375rem 0.75rem; background: #f39c12; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.background='#e67e22'" onmouseout="this.style.background='#f39c12'">✏️ Sửa</button>
                        <button onclick="deleteHashtag('style', ${index})" style="padding: 0.375rem 0.75rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">🗑️ Xóa</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function toggleHashtagSection() {
    const hashtagSection = document.getElementById('hashtagSection');
    const toggleBtn = document.getElementById('toggleHashtagBtn');
    
    if (hashtagSection.style.display === 'none') {
        hashtagSection.style.display = 'block';
        const hashtags = getHashtags();
        displayHashtags(hashtags);
        toggleBtn.textContent = '🏷️ Ẩn Quản Lý Hashtag';
        toggleBtn.style.background = '#e74c3c';
        // Scroll to hashtag section
        hashtagSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        hashtagSection.style.display = 'none';
        toggleBtn.textContent = '🏷️ Quản Lý Hashtag';
        toggleBtn.style.background = '#27ae60';
    }
}

function openHashtagManagement() {
    // For backward compatibility, toggle the section
    const hashtagSection = document.getElementById('hashtagSection');
    if (hashtagSection && hashtagSection.style.display === 'none') {
        toggleHashtagSection();
    }
}

function openAddHashtagModal() {
    document.getElementById('hashtagModalTitle').textContent = 'Thêm Hashtag Mới';
    document.getElementById('hashtagForm').reset();
    document.getElementById('hashtagType').value = '';
    document.getElementById('hashtagName').value = '';
    document.getElementById('hashtagForm').dataset.editIndex = '';
    document.getElementById('hashtagForm').dataset.editType = '';
    document.getElementById('hashtagType').disabled = false;
    document.getElementById('hashtagModal').classList.add('active');
}

function editHashtag(type, index) {
    const hashtags = getHashtags();
    const tagArray = type === 'roomType' ? hashtags.roomTypes : hashtags.styles;
    
    document.getElementById('hashtagModalTitle').textContent = 'Sửa Hashtag';
    document.getElementById('hashtagType').value = type === 'roomType' ? 'roomType' : 'style';
    document.getElementById('hashtagName').value = tagArray[index];
    document.getElementById('hashtagForm').dataset.editIndex = index;
    document.getElementById('hashtagForm').dataset.editType = type;
    document.getElementById('hashtagType').disabled = true;
    document.getElementById('hashtagModal').classList.add('active');
}

function deleteHashtag(type, index) {
    if (!confirm('Bạn có chắc chắn muốn xóa hashtag này?')) return;
    
    const hashtags = getHashtags();
    if (type === 'roomType') {
        hashtags.roomTypes.splice(index, 1);
    } else {
        hashtags.styles.splice(index, 1);
    }
    
    saveHashtags(hashtags);
    displayHashtags(hashtags);
    updateHashtagDropdowns(hashtags);
    
    // Auto-export to data.json to persist hashtags
    if (typeof autoExportData === 'function') {
        autoExportData();
    }
    
    // Refresh hashtag section if it's visible
    const hashtagSection = document.getElementById('hashtagSection');
    if (hashtagSection && hashtagSection.style.display !== 'none') {
        displayHashtags(hashtags);
    }
    
    // Refresh filters on homepage if available
    if (document.getElementById('filterContainer')) {
        renderFilters();
    }
}

function saveHashtag() {
    const type = document.getElementById('hashtagType').value;
    const name = document.getElementById('hashtagName').value.trim();
    const editIndex = document.getElementById('hashtagForm').dataset.editIndex;
    const editType = document.getElementById('hashtagForm').dataset.editType;
    
    if (!type || !name) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    const hashtags = getHashtags();
    const tagArray = type === 'roomType' ? hashtags.roomTypes : hashtags.styles;
    
    // Check for duplicates
    if (editIndex === '' && tagArray.includes(name)) {
        alert('Hashtag này đã tồn tại!');
        return;
    }
    
    if (editIndex !== '') {
        // Edit existing
        const editTagArray = editType === 'roomType' ? hashtags.roomTypes : hashtags.styles;
        if (editIndex !== '' && editTagArray[editIndex] !== name && tagArray.includes(name)) {
            alert('Hashtag này đã tồn tại!');
            return;
        }
        editTagArray[editIndex] = name;
    } else {
        // Add new
        tagArray.push(name);
    }
    
    saveHashtags(hashtags);
    displayHashtags(hashtags);
    updateHashtagDropdowns(hashtags);
    
    // Auto-export to data.json to persist hashtags
    // Always try to export, even if not on admin page
    try {
        if (typeof autoExportData === 'function') {
            autoExportData();
        } else {
            // If autoExportData not available, manually export hashtags
            // This ensures hashtags are saved even when not on admin page
            console.log('⚠️ autoExportData not available, hashtags saved to localStorage only');
        }
    } catch (error) {
        console.error('Error exporting hashtags:', error);
    }
    
    closeHashtagModal();
    alert('Đã lưu hashtag thành công!');
    
    // Refresh hashtag section if it's visible
    const hashtagSection = document.getElementById('hashtagSection');
    if (hashtagSection && hashtagSection.style.display !== 'none') {
        displayHashtags(hashtags);
    }
    
    // Refresh filters on homepage if available
    if (document.getElementById('filterContainer')) {
        renderFilters();
    }
}

function closeHashtagModal() {
    document.getElementById('hashtagModal').classList.remove('active');
    document.getElementById('hashtagForm').reset();
    document.getElementById('hashtagForm').dataset.editIndex = '';
    document.getElementById('hashtagForm').dataset.editType = '';
    document.getElementById('hashtagType').disabled = false;
}

// Make functions available globally
window.toggleHashtagSection = toggleHashtagSection;
window.openHashtagManagement = openHashtagManagement;
window.openAddHashtagModal = openAddHashtagModal;
window.editHashtag = editHashtag;
window.deleteHashtag = deleteHashtag;
window.saveHashtag = saveHashtag;
window.closeHashtagModal = closeHashtagModal;

// Add new project
function addProject() {
    // Update hashtag dropdowns before adding
    const hashtags = getHashtags();
    updateHashtagDropdowns(hashtags);
    
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const beforeImage = document.getElementById('beforeImage').value;
    const afterImage = document.getElementById('afterImage').value;
    const details = document.getElementById('projectDetails').value;
    const price = document.getElementById('projectPrice').value;
    
    // Validate images
    if (!beforeImage || !afterImage) {
        alert('Vui lòng upload hoặc nhập URL cho cả hai hình ảnh (trước và sau thiết kế)!');
        return;
    }
    
    // Get hashtag values from dropdowns
    const roomTypeSelect = document.getElementById('projectRoomType');
    const stylesSelect = document.getElementById('projectHashtagStyles');
    const roomType = roomTypeSelect ? roomTypeSelect.value : '';
    const selectedStyles = stylesSelect ? Array.from(stylesSelect.selectedOptions).map(opt => opt.value) : [];
    
    const newProject = {
        id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
        title,
        description,
        beforeImage,
        afterImage,
        details,
        specs: {
            "Diện tích": document.getElementById('projectArea').value || "N/A",
            "Phong cách": document.getElementById('projectStyle').value || "N/A",
            "Thời gian": document.getElementById('projectTime').value || "N/A",
            "Vật liệu": document.getElementById('projectMaterials').value || "N/A"
        },
        price,
        hashtags: {
            roomType: roomTypeInput || null,
            styles: hashtagStyles.length > 0 ? hashtagStyles : null
        }
    };
    
    projects.push(newProject);
    saveProjects();
    closeModal();
    loadAdminPage();
    // Tự động cập nhật data.json
    autoExportData();
    alert('Thêm dự án thành công!');
}

// Edit project
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    // Update hashtag dropdowns before editing
    const hashtags = getHashtags();
    updateHashtagDropdowns(hashtags);
    
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('beforeImage').value = project.beforeImage;
    document.getElementById('afterImage').value = project.afterImage;
    document.getElementById('projectDetails').value = project.details;
    document.getElementById('projectPrice').value = project.price;
    document.getElementById('projectArea').value = project.specs["Diện tích"] || "";
    document.getElementById('projectStyle').value = project.specs["Phong cách"] || "";
    document.getElementById('projectTime').value = project.specs["Thời gian"] || "";
    document.getElementById('projectMaterials').value = project.specs["Vật liệu"] || "";
    
    // Load hashtags if they exist
    if (project.hashtags) {
        const roomTypeSelect = document.getElementById('projectRoomType');
        const stylesSelect = document.getElementById('projectHashtagStyles');
        
        if (roomTypeSelect && project.hashtags.roomType) {
            roomTypeSelect.value = project.hashtags.roomType;
        }
        
        if (stylesSelect && project.hashtags.styles && Array.isArray(project.hashtags.styles)) {
            Array.from(stylesSelect.options).forEach(option => {
                option.selected = project.hashtags.styles.includes(option.value);
            });
        }
    } else {
        // Clear hashtag selections if not exist
        const roomTypeSelect = document.getElementById('projectRoomType');
        const stylesSelect = document.getElementById('projectHashtagStyles');
        if (roomTypeSelect) roomTypeSelect.value = '';
        if (stylesSelect) {
            Array.from(stylesSelect.options).forEach(option => {
                option.selected = false;
            });
        }
    }
    
    // Show preview images
    const beforePreview = document.getElementById('beforeImagePreview');
    const afterPreview = document.getElementById('afterImagePreview');
    const beforePlaceholder = document.getElementById('beforeImagePlaceholder');
    const afterPlaceholder = document.getElementById('afterImagePlaceholder');
    
    if (project.beforeImage) {
        beforePreview.src = getImageSrc(project.beforeImage);
        beforePreview.style.display = 'block';
        if (beforePlaceholder) beforePlaceholder.style.display = 'none';
    }
    
    if (project.afterImage) {
        afterPreview.src = getImageSrc(project.afterImage);
        afterPreview.style.display = 'block';
        if (afterPlaceholder) afterPlaceholder.style.display = 'none';
    }
    
    // Set URL inputs if it's a URL
    if (project.beforeImage && !project.beforeImage.startsWith('project_image_')) {
        document.getElementById('beforeImageUrl').value = project.beforeImage;
    }
    if (project.afterImage && !project.afterImage.startsWith('project_image_')) {
        document.getElementById('afterImageUrl').value = project.afterImage;
    }
    
    document.getElementById('modalTitle').textContent = 'Sửa Dự Án';
    document.getElementById('saveProjectBtn').onclick = () => saveProject(id);
    document.getElementById('projectModal').classList.add('active');
}

// Save edited project
function saveProject(id) {
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) return;
    
    const beforeImage = document.getElementById('beforeImage').value;
    const afterImage = document.getElementById('afterImage').value;
    
    // Validate images
    if (!beforeImage || !afterImage) {
        alert('Vui lòng upload hoặc nhập URL cho cả hai hình ảnh (trước và sau thiết kế)!');
        return;
    }
    
    // Get hashtag values from dropdowns
    const roomTypeSelect = document.getElementById('projectRoomType');
    const stylesSelect = document.getElementById('projectHashtagStyles');
    const roomType = roomTypeSelect ? roomTypeSelect.value : '';
    const selectedStyles = stylesSelect ? Array.from(stylesSelect.selectedOptions).map(opt => opt.value) : [];
    
    projects[projectIndex] = {
        id,
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        beforeImage,
        afterImage,
        details: document.getElementById('projectDetails').value,
        specs: {
            "Diện tích": document.getElementById('projectArea').value || "N/A",
            "Phong cách": document.getElementById('projectStyle').value || "N/A",
            "Thời gian": document.getElementById('projectTime').value || "N/A",
            "Vật liệu": document.getElementById('projectMaterials').value || "N/A"
        },
        price: document.getElementById('projectPrice').value,
        hashtags: {
            roomType: roomType || null,
            styles: selectedStyles.length > 0 ? selectedStyles : null
        }
    };
    
    saveProjects();
    closeModal();
    loadAdminPage();
    // Tự động cập nhật data.json
    autoExportData();
    alert('Cập nhật dự án thành công!');
}

// Delete project
function deleteProject(id) {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
        projects = projects.filter(p => p.id !== id);
        saveProjects();
        loadAdminPage();
        // Tự động cập nhật data.json
        autoExportData();
        alert('Xóa dự án thành công!');
    }
}

// File handle để lưu trực tiếp vào data.json (File System Access API)
let dataJsonFileHandle = null;

// Lưu thông tin file đã chọn vào sessionStorage để nhớ trong phiên làm việc
function saveFileHandleInfo(fileName) {
    try {
        sessionStorage.setItem('dataJsonFileName', fileName);
        sessionStorage.setItem('dataJsonFileSelected', 'true');
    } catch (error) {
        console.error('Lỗi khi lưu thông tin file:', error);
    }
}

// Xóa thông tin file handle
function clearFileHandleInfo() {
    try {
        sessionStorage.removeItem('dataJsonFileName');
        sessionStorage.removeItem('dataJsonFileSelected');
    } catch (error) {
        console.error('Lỗi khi xóa thông tin file:', error);
    }
}

// Khởi tạo file handle từ localStorage (nếu có)
async function initDataJsonFileHandle() {
    // Kiểm tra xem trình duyệt có hỗ trợ File System Access API không
    if (!('showSaveFilePicker' in window)) {
        console.log('⚠️ Trình duyệt không hỗ trợ File System Access API, sẽ sử dụng download thông thường');
        return false;
    }
    
    // Thử khôi phục file handle từ localStorage (chỉ lưu tên file, không lưu handle vì không thể serialize)
    // Sẽ yêu cầu người dùng chọn file lại mỗi lần, nhưng có thể cải thiện bằng cách lưu trong sessionStorage
    
    return true;
}

// Yêu cầu người dùng chọn file data.json để lưu
async function selectDataJsonFile() {
    if (!('showOpenFilePicker' in window) && !('showSaveFilePicker' in window)) {
        alert('Trình duyệt của bạn không hỗ trợ tính năng này. Vui lòng sử dụng Chrome hoặc Edge phiên bản mới nhất.');
        return null;
    }
    
    try {
        // Ưu tiên: Thử mở file data.json hiện có trong thư mục dự án
        if ('showOpenFilePicker' in window) {
            try {
                const fileHandles = await window.showOpenFilePicker({
                    types: [{
                        description: 'JSON files',
                        accept: {
                            'application/json': ['.json']
                        }
                    }],
                    multiple: false,
                    excludeAcceptAllOption: false
                });
                
                if (fileHandles && fileHandles.length > 0) {
                    const fileHandle = fileHandles[0];
                    const file = await fileHandle.getFile();
                    
                    // Kiểm tra xem có phải file data.json không (hoặc chấp nhận bất kỳ file .json nào)
                    if (file.name.toLowerCase().endsWith('.json')) {
                        dataJsonFileHandle = fileHandle;
                        updateSelectFileButton(true);
                        saveFileHandleInfo(file.name);
                        console.log(`✅ Đã chọn file: ${file.name}`);
                        return fileHandle;
                    }
                }
            } catch (openError) {
                if (openError.name !== 'AbortError') {
                    console.log('Không thể mở file hiện có, sẽ tạo file mới:', openError.message);
                } else {
                    // Người dùng hủy, không làm gì
                    return null;
                }
            }
        }
        
        // Fallback: Tạo file mới hoặc lưu file mới
        if ('showSaveFilePicker' in window) {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'data.json',
                types: [{
                    description: 'JSON files',
                    accept: {
                        'application/json': ['.json']
                    }
                }]
                // Không chỉ định startIn để trình duyệt nhớ vị trí cuối cùng
            });
            
            // Lưu file handle vào biến global
            dataJsonFileHandle = fileHandle;
            
            // Lưu thông tin file
            try {
                const file = await fileHandle.getFile();
                saveFileHandleInfo(file.name);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin file:', error);
            }
            
            // Cập nhật nút để hiển thị trạng thái đã chọn
            updateSelectFileButton(true);
            
            return fileHandle;
        }
        
        return null;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Người dùng đã hủy chọn file');
        } else {
            console.error('Lỗi khi chọn file:', error);
            alert('Lỗi khi chọn file: ' + error.message);
        }
        return null;
    }
}

// Hàm để người dùng chọn file data.json cho tự động lưu
async function selectDataJsonFileForAutoSave() {
    // Hiển thị hướng dẫn trước khi chọn file
    const shouldContinue = confirm(
        'Hướng dẫn:\n\n' +
        '1. Chọn file data.json trong thư mục dự án (cùng thư mục với start-server.bat)\n' +
        '2. Sau khi chọn, mọi thay đổi sẽ tự động lưu đè lên file này\n\n' +
        'Bạn có muốn tiếp tục?'
    );
    
    if (!shouldContinue) {
        return;
    }
    
    const fileHandle = await selectDataJsonFile();
    if (fileHandle) {
        try {
            const file = await fileHandle.getFile();
            const filePath = file.webkitRelativePath || file.name;
            alert(
                `✅ Đã chọn file thành công!\n\n` +
                `File: ${file.name}\n` +
                `Vị trí: Thư mục dự án\n\n` +
                `Từ giờ, mọi thay đổi sẽ tự động lưu đè lên file này.\n` +
                `File sẽ được lưu vào cùng thư mục với start-server.bat.`
            );
        } catch (error) {
            alert('Đã chọn file thành công! Từ giờ, mọi thay đổi sẽ tự động lưu đè lên file này.');
        }
    }
}

// Cập nhật trạng thái nút chọn file
function updateSelectFileButton(isSelected) {
    const btn = document.getElementById('selectFileBtn');
    if (btn) {
        if (isSelected) {
            btn.innerHTML = '<span>✓</span> Đã chọn File';
            btn.style.background = '#4CAF50';
            btn.title = 'File data.json đã được chọn, sẽ tự động lưu đè khi có thay đổi';
        } else {
            btn.innerHTML = '<span>📁</span> Chọn File data.json';
            btn.style.background = '';
            btn.title = 'Chọn file data.json để tự động lưu đè khi có thay đổi';
        }
    }
}

// Tự động export data.json và lưu đè lên file trong thư mục dự án
async function autoExportData() {
    // Chỉ tự động export khi đang ở trang admin
    if (!document.getElementById('adminProjects')) {
        return;
    }
    
    // Debounce: Hủy timer cũ nếu có
    if (autoExportTimer) {
        clearTimeout(autoExportTimer);
    }
    
    // Đợi 500ms trước khi export để tránh download quá nhiều lần khi có nhiều thay đổi liên tiếp
    autoExportTimer = setTimeout(async () => {
        // Collect all images from localStorage
        const imageData = {};
        
        projects.forEach(project => {
            if (project.beforeImage && project.beforeImage.startsWith('project_image_')) {
                const imageBase64 = localStorage.getItem(project.beforeImage);
                if (imageBase64) {
                    imageData[project.beforeImage] = imageBase64;
                }
            }
            if (project.afterImage && project.afterImage.startsWith('project_image_')) {
                const imageBase64 = localStorage.getItem(project.afterImage);
                if (imageBase64) {
                    imageData[project.afterImage] = imageBase64;
                }
            }
        });
        
        // Get hashtags from localStorage
        const hashtags = getHashtags();
        
        // Create export object
        const exportData = {
            projects: projects,
            images: imageData,
            hashtags: hashtags,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        // Convert to JSON string
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Thử sử dụng File System Access API để lưu trực tiếp vào file
        if ('showSaveFilePicker' in window) {
            try {
                // Nếu chưa có file handle, yêu cầu người dùng chọn file lần đầu
                if (!dataJsonFileHandle) {
                    dataJsonFileHandle = await selectDataJsonFile();
                }
                
                // Nếu có file handle, ghi đè lên file đó
                if (dataJsonFileHandle) {
                    try {
                        const writable = await dataJsonFileHandle.createWritable();
                        await writable.write(dataBlob);
                        await writable.close();
                        
                        console.log('✅ Đã lưu đè lên file data.json thành công');
                        showAutoExportNotification(true);
                        autoExportTimer = null;
                        return;
                    } catch (error) {
                        console.error('Lỗi khi ghi file:', error);
                        // Nếu file handle không còn hợp lệ, reset và fallback về download
                        if (error.name === 'NotFoundError' || error.name === 'InvalidStateError') {
                            dataJsonFileHandle = null;
                            updateSelectFileButton(false);
                            clearFileHandleInfo();
                            console.log('File handle không còn hợp lệ, chuyển sang download');
                        } else {
                            throw error;
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lưu file bằng File System Access API:', error);
                // Fallback về phương thức download thông thường
            }
        }
        
        // Fallback: Download file như cũ (nếu không hỗ trợ File System Access API hoặc người dùng hủy)
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json'; // Tên file cố định
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Hiển thị thông báo nhỏ ở góc màn hình
        showAutoExportNotification(false);
        
        autoExportTimer = null;
    }, 500);
}

// Hiển thị thông báo tự động export
function showAutoExportNotification(savedDirectly = false) {
    // Xóa thông báo cũ nếu có
    const existingNotification = document.getElementById('autoExportNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'autoExportNotification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (savedDirectly) {
        notification.innerHTML = `
            <strong>✓ Đã tự động lưu đè lên file data.json</strong><br>
            <small>File đã được cập nhật trực tiếp trong thư mục dự án</small>
        `;
    } else {
        notification.innerHTML = `
            <strong>✓ Đã tự động cập nhật data.json</strong><br>
            <small>File đã được tải về thư mục Downloads, vui lòng copy vào thư mục dự án</small>
        `;
    }
    
    // Thêm animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    if (!document.getElementById('autoExportNotificationStyle')) {
        style.id = 'autoExportNotificationStyle';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Tự động ẩn sau 4 giây
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Export data to JSON file (includes images as base64) - Manual export
function exportData() {
    // Collect all images from localStorage
    const imageData = {};
    const imageKeys = [];
    
    projects.forEach(project => {
        if (project.beforeImage && project.beforeImage.startsWith('project_image_')) {
            const imageBase64 = localStorage.getItem(project.beforeImage);
            if (imageBase64) {
                imageData[project.beforeImage] = imageBase64;
                imageKeys.push(project.beforeImage);
            }
        }
        if (project.afterImage && project.afterImage.startsWith('project_image_')) {
            const imageBase64 = localStorage.getItem(project.afterImage);
            if (imageBase64) {
                imageData[project.afterImage] = imageBase64;
                imageKeys.push(project.afterImage);
            }
        }
    });
    
    // Create export object
    const exportData = {
        projects: projects,
        images: imageData,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    // Create download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interior-design-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Đã export thành công!\n- ${projects.length} dự án\n- ${Object.keys(imageData).length} hình ảnh`);
}

// Import data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!confirm('Import sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc chắn?')) {
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importedData.projects || !Array.isArray(importedData.projects)) {
                throw new Error('File không đúng định dạng!');
            }
            
            // Import images to localStorage
            if (importedData.images) {
                let imageCount = 0;
                Object.keys(importedData.images).forEach(key => {
                    localStorage.setItem(key, importedData.images[key]);
                    imageCount++;
                });
                console.log(`Đã import ${imageCount} hình ảnh vào localStorage`);
            }
            
            // Import projects
            projects = importedData.projects;
            saveProjects();
            
            // Import hashtags if they exist
            if (importedData.hashtags && typeof importedData.hashtags === 'object') {
                saveHashtags(importedData.hashtags);
                console.log(`✅ Đã import hashtags vào localStorage`);
            }
            
            // Reload admin page
            loadAdminPage();
            
            alert(`Import thành công!\n- ${projects.length} dự án\n- ${importedData.images ? Object.keys(importedData.images).length : 0} hình ảnh\n- ${importedData.hashtags ? 'Hashtag đã được import' : 'Không có hashtag'}`);
            
        } catch (error) {
            console.error('Lỗi khi import:', error);
            alert('Lỗi khi import dữ liệu: ' + error.message);
        }
    };
    
    reader.onerror = () => {
        alert('Lỗi khi đọc file!');
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

// Open modal for adding project
function openAddModal() {
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('beforeImage').value = '';
    document.getElementById('afterImage').value = '';
    document.getElementById('projectDetails').value = '';
    document.getElementById('projectPrice').value = '';
    document.getElementById('projectArea').value = '';
    document.getElementById('projectStyle').value = '';
    document.getElementById('projectTime').value = '';
    document.getElementById('projectMaterials').value = '';
    
    // Update hashtag dropdowns and clear selections
    const hashtags = getHashtags();
    updateHashtagDropdowns(hashtags);
    const roomTypeSelect = document.getElementById('projectRoomType');
    const stylesSelect = document.getElementById('projectHashtagStyles');
    if (roomTypeSelect) roomTypeSelect.value = '';
    if (stylesSelect) {
        Array.from(stylesSelect.options).forEach(option => {
            option.selected = false;
        });
    }
    
    // Reset file inputs
    document.getElementById('beforeImageFile').value = '';
    document.getElementById('afterImageFile').value = '';
    document.getElementById('beforeImageUrl').value = '';
    document.getElementById('afterImageUrl').value = '';
    
    // Reset previews
    const beforePreview = document.getElementById('beforeImagePreview');
    const afterPreview = document.getElementById('afterImagePreview');
    const beforePlaceholder = document.getElementById('beforeImagePlaceholder');
    const afterPlaceholder = document.getElementById('afterImagePlaceholder');
    
    if (beforePreview) {
        beforePreview.src = '';
        beforePreview.style.display = 'none';
    }
    if (afterPreview) {
        afterPreview.src = '';
        afterPreview.style.display = 'none';
    }
    if (beforePlaceholder) {
        beforePlaceholder.textContent = 'Chưa có hình ảnh';
        beforePlaceholder.style.display = 'block';
    }
    if (afterPlaceholder) {
        afterPlaceholder.textContent = 'Chưa có hình ảnh';
        afterPlaceholder.style.display = 'block';
    }
    
    document.getElementById('modalTitle').textContent = 'Thêm Dự Án Mới';
    document.getElementById('saveProjectBtn').onclick = addProject;
    document.getElementById('projectModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
}

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu on scroll (mobile)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (Math.abs(scrollTop - lastScrollTop) > 10) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
}

// Collapsible Sections for Mobile
function initCollapsibleSections() {
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const header = toggle.closest('.section-header-toggle');
            const section = header.closest('section');
            const content = section.querySelector('.collapsible-content');
            
            if (content) {
                const isActive = content.classList.contains('active');
                
                if (isActive) {
                    content.classList.remove('active');
                    toggle.classList.remove('active');
                } else {
                    content.classList.add('active');
                    toggle.classList.add('active');
                }
            }
        });

        // Also allow clicking on the header to toggle
        const header = toggle.closest('.section-header-toggle');
        if (header) {
            header.addEventListener('click', (e) => {
                // Only trigger if clicking on header, not on toggle button (to avoid double trigger)
                if (e.target === header || e.target.closest('.section-title')) {
                    toggle.click();
                }
            });
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize collapsible sections
    initCollapsibleSections();
    
    // Initialize admin accounts system
    initAdminAccounts();
    
    await loadProjects();
    
    // Check which page we're on
    if (document.getElementById('projectsGrid')) {
        // Ensure hashtags are loaded before rendering filters
        const hashtags = getHashtags();
        if (hashtags && (hashtags.roomTypes.length > 0 || hashtags.styles.length > 0)) {
            console.log('✅ Hashtags loaded for filters:', hashtags);
        } else {
            console.warn('⚠️ No hashtags found. Filters will be empty. Please create hashtags in admin panel.');
        }
        renderFilters();
        renderProjects();
    } else if (document.querySelector('.detail-container')) {
        loadProjectDetail();
    } else if (document.getElementById('adminProjects')) {
        loadAdminPage();
    }
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

