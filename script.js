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
    // First try to load from data.json (for GitHub Pages)
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            const data = await response.json();
            if (data.projects && data.projects.length > 0) {
                projects = data.projects;
                // Also save to localStorage as backup
                saveProjects();
                return;
            }
        }
    } catch (error) {
        console.log('Không tìm thấy data.json, sử dụng localStorage hoặc dữ liệu mặc định');
    }
    
    // Fallback to localStorage
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    }
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

// Render projects on homepage
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-image-container">
                <img src="${getImageSrc(project.beforeImage)}" alt="Before" class="project-image-before">
                <img src="${getImageSrc(project.afterImage)}" alt="After" class="project-image-after">
                <div class="reveal-slider"></div>
            </div>
            <div class="project-info" onclick="viewProjectDetail(${project.id})" style="cursor: pointer;">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span>Xem chi tiết</span>
                    <a href="detail.html?id=${project.id}" class="view-details" onclick="event.stopPropagation();">Chi tiết →</a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize reveal effect after rendering
    setTimeout(initRevealEffect, 100);
}

// View project detail
function viewProjectDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// Load project detail
function loadProjectDetail() {
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
    document.querySelector('.detail-image-before').src = getImageSrc(project.beforeImage);
    document.querySelector('.detail-image-after').src = getImageSrc(project.afterImage);
    document.querySelector('.detail-description').textContent = project.details;
    document.querySelector('.pricing-amount').textContent = project.price;
    
    const specsContainer = document.querySelector('.detail-specs');
    specsContainer.innerHTML = Object.entries(project.specs).map(([key, value]) => `
        <div class="spec-item">
            <strong>${key}</strong>
            <span>${value}</span>
        </div>
    `).join('');
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

// Get image from storage or URL
function getImageSrc(imageValue) {
    if (!imageValue) return '';
    
    // Check if it's a storage key (starts with 'project_image_')
    if (imageValue.startsWith('project_image_')) {
        return localStorage.getItem(imageValue) || imageValue;
    }
    
    // Otherwise, it's a URL
    return imageValue;
}

// Check if user is logged in
function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Load admin page
function loadAdminPage() {
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }
    
    const adminProjects = document.getElementById('adminProjects');
    if (!adminProjects) return;
    
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

// Add new project
function addProject() {
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
        price
    };
    
    projects.push(newProject);
    saveProjects();
    closeModal();
    loadAdminPage();
    alert('Thêm dự án thành công!');
}

// Edit project
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
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
        price: document.getElementById('projectPrice').value
    };
    
    saveProjects();
    closeModal();
    loadAdminPage();
    alert('Cập nhật dự án thành công!');
}

// Delete project
function deleteProject(id) {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
        projects = projects.filter(p => p.id !== id);
        saveProjects();
        loadAdminPage();
        alert('Xóa dự án thành công!');
    }
}

// Export data to JSON file (includes images as base64)
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
            
            // Reload admin page
            loadAdminPage();
            
            alert(`Import thành công!\n- ${projects.length} dự án\n- ${importedData.images ? Object.keys(importedData.images).length : 0} hình ảnh`);
            
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    
    // Check which page we're on
    if (document.getElementById('projectsGrid')) {
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

