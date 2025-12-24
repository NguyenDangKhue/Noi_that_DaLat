// Admin Authentication and Management System

// Initialize admin accounts system (same as script.js)
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

// Get admin accounts
function getAdminAccounts() {
    const accounts = localStorage.getItem('adminAccounts');
    return accounts ? JSON.parse(accounts) : {};
}

// Initialize admin system
function initAdmin() {
    // Initialize admin accounts system
    initAdminAccounts();
    
    // Check if we're on login page
    if (document.getElementById('loginForm')) {
        initLogin();
    }
    
    // Check if we're on admin panel
    if (document.getElementById('projectsList')) {
        checkAuth();
        initAdminPanel();
    }
}

// Login functionality
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            loginError.textContent = 'Vui lòng điền đầy đủ thông tin!';
            loginError.style.display = 'block';
            return;
        }
        
        const accounts = getAdminAccounts();
        
        if (accounts[username] && accounts[username].password === password) {
            // Create session (compatible with both systems)
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminLoginTime', Date.now().toString());
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            
            // Redirect to admin panel
            window.location.href = 'admin-panel.html';
        } else {
            loginError.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
            loginError.style.display = 'block';
        }
    });
}

// Check authentication (compatible with both systems)
function checkAuth() {
    // Check both sessionStorage (admin.js) and localStorage (script.js)
    const sessionLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const localStorageLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    // Accept either authentication method
    if ((sessionLoggedIn || localStorageLoggedIn) && currentUser) {
        // Check session time if using sessionStorage
        if (sessionLoggedIn) {
            const loginTime = sessionStorage.getItem('adminLoginTime');
            if (loginTime) {
                const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
                if (Date.now() - parseInt(loginTime) > sessionDuration) {
                    sessionStorage.removeItem('adminLoggedIn');
                    sessionStorage.removeItem('adminLoginTime');
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('currentUser');
                    redirectToLogin();
                    return;
                }
            }
        }
        // Authentication valid
        return;
    }
    
    // No valid authentication found
    redirectToLogin();
}

// Redirect to login
function redirectToLogin() {
    window.location.href = 'admin-login.html';
}

// Logout functionality (clear both systems)
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'admin-login.html';
}

// Initialize admin panel
function initAdminPanel() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Navigation
    initNavigation();
    
    // Load and display projects
    loadProjects();
    
    // Load contact info
    loadContactInfo();
    
    // Project form
    initProjectForm();
    
    // Contact form
    initContactForm();
    
    // Settings form
    initSettingsForm();
    
    // Hashtag management
    initHashtagManagement();
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const sectionId = item.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Load projects from localStorage or data.js
function loadProjects() {
    let projects = [];
    
    // Try to load from localStorage first
    const savedProjects = localStorage.getItem('adminProjects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else if (typeof projects !== 'undefined' && window.projects) {
        // Use projects from data.js if available
        projects = window.projects;
    }
    
    displayProjects(projects);
}

// Display projects in admin panel
function displayProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    
    if (!projects || projects.length === 0) {
        projectsList.innerHTML = '<p class="empty-state">Chưa có dự án nào. Hãy thêm dự án mới!</p>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => `
        <div class="project-card-admin">
            <div class="project-card-image">
                <img src="${project.afterImage}" alt="${project.title}">
            </div>
            <div class="project-card-content">
                <h3>${project.title}</h3>
                <p class="project-style">Phong cách: ${project.style}</p>
                <p class="project-cost">${project.totalCost}</p>
            </div>
            <div class="project-card-actions">
                <button class="btn-edit" onclick="editProject(${project.id})">✏️ Sửa</button>
                <button class="btn-delete" onclick="deleteProject(${project.id})">🗑️ Xóa</button>
            </div>
        </div>
    `).join('');
}

// Add new project
function addProject() {
    // Update hashtag dropdowns before adding
    const hashtags = getHashtags();
    updateHashtagDropdowns(hashtags);
    
    document.getElementById('modalTitle').textContent = 'Thêm Dự Án Mới';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    
    // Clear hashtag selections
    const roomTypeSelect = document.getElementById('projectRoomType');
    const stylesSelect = document.getElementById('projectHashtagStyles');
    if (roomTypeSelect) roomTypeSelect.value = '';
    if (stylesSelect) {
        Array.from(stylesSelect.options).forEach(option => {
            option.selected = false;
        });
    }
    
    // Clear previews
    document.getElementById('beforeImagePreview').innerHTML = '';
    document.getElementById('afterImagePreview').innerHTML = '';
    document.getElementById('beforeImageSize').textContent = '';
    document.getElementById('afterImageSize').textContent = '';
    document.getElementById('beforeImageStatus').textContent = '';
    document.getElementById('afterImageStatus').textContent = '';
    
    document.getElementById('projectModal').style.display = 'block';
}

// Edit project
function editProject(projectId) {
    const projects = JSON.parse(localStorage.getItem('adminProjects')) || window.projects || [];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    // Update hashtag dropdowns before editing
    const hashtags = getHashtags();
    updateHashtagDropdowns(hashtags);
    
    document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Dự Án';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectStyle').value = project.style;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectBeforeImage').value = project.beforeImage;
    document.getElementById('projectAfterImage').value = project.afterImage;
    document.getElementById('projectTotalCost').value = project.totalCost;
    document.getElementById('projectCostItems').value = project.costItems.join('\n');
    
    // Set hashtag values
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
    }
    
    // Show previews if images are base64
    if (project.beforeImage && project.beforeImage.startsWith('data:')) {
        document.getElementById('beforeImagePreview').innerHTML = 
            `<img src="${project.beforeImage}" alt="Preview" class="preview-image">`;
    }
    if (project.afterImage && project.afterImage.startsWith('data:')) {
        document.getElementById('afterImagePreview').innerHTML = 
            `<img src="${project.afterImage}" alt="Preview" class="preview-image">`;
    }
    
    document.getElementById('projectModal').style.display = 'block';
}

// Delete project
function deleteProject(projectId) {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    
    let projects = JSON.parse(localStorage.getItem('adminProjects')) || window.projects || [];
    projects = projects.filter(p => p.id !== projectId);
    
    // Reassign IDs
    projects = projects.map((p, index) => ({ ...p, id: index + 1 }));
    
    saveProjects(projects);
    loadProjects();
}

// Initialize project form
function initProjectForm() {
    const projectForm = document.getElementById('projectForm');
    const addProjectBtn = document.getElementById('addProjectBtn');
    
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', addProject);
    }
    
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProject();
        });
    }
    
    // Image upload handlers
    initImageUpload();
    
    // Auto-compress when URL is entered
    initImageUrlCompress();
    
    // Close modal
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProjectModal);
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
}

// Initialize image upload
function initImageUpload() {
    const beforeImageFile = document.getElementById('beforeImageFile');
    const afterImageFile = document.getElementById('afterImageFile');
    
    if (beforeImageFile) {
        beforeImageFile.addEventListener('change', (e) => {
            handleImageUpload(e.target.files[0], 'before');
        });
    }
    
    if (afterImageFile) {
        afterImageFile.addEventListener('change', (e) => {
            handleImageUpload(e.target.files[0], 'after');
        });
    }
}

// Handle image upload and compression
async function handleImageUpload(file, type) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ!');
        return;
    }
    
    const previewId = type === 'before' ? 'beforeImagePreview' : 'afterImagePreview';
    const sizeId = type === 'before' ? 'beforeImageSize' : 'afterImageSize';
    const statusId = type === 'before' ? 'beforeImageStatus' : 'afterImageStatus';
    const inputId = type === 'before' ? 'projectBeforeImage' : 'projectAfterImage';
    
    const preview = document.getElementById(previewId);
    const sizeDisplay = document.getElementById(sizeId);
    const statusDisplay = document.getElementById(statusId);
    const input = document.getElementById(inputId);
    
    // Load compression settings
    const maxWidth = parseInt(localStorage.getItem('imageMaxWidth') || '1200');
    const maxHeight = parseInt(localStorage.getItem('imageMaxHeight') || '1200');
    const quality = parseFloat(localStorage.getItem('imageQuality') || '0.8');
    const maxSizeKB = parseInt(localStorage.getItem('imageMaxSizeKB') || '500');
    
    // Update compressor settings
    if (typeof imageCompressor !== 'undefined') {
        imageCompressor.maxWidth = maxWidth;
        imageCompressor.maxHeight = maxHeight;
        imageCompressor.quality = quality;
        imageCompressor.maxSizeKB = maxSizeKB;
    }
    
    // Show loading
    statusDisplay.textContent = 'Đang nén ảnh...';
    statusDisplay.className = 'image-status loading';
    preview.innerHTML = '<div class="loading-spinner">⏳ Đang xử lý...</div>';
    
    try {
        // Get original size
        const originalSizeKB = (file.size / 1024).toFixed(2);
        sizeDisplay.textContent = `Kích thước gốc: ${originalSizeKB} KB`;
        
        // Compress image
        const compressed = await imageCompressor.compressFromFile(file);
        const compressedSizeKB = imageCompressor.getBase64SizeKB(compressed);
        
        // Update input with compressed base64
        input.value = compressed;
        
        // Show preview
        preview.innerHTML = `<img src="${compressed}" alt="Preview" class="preview-image">`;
        
        // Update size info
        const savedKB = (originalSizeKB - compressedSizeKB).toFixed(2);
        const savedPercent = ((1 - compressedSizeKB / originalSizeKB) * 100).toFixed(1);
        sizeDisplay.innerHTML = `
            <span>Gốc: ${originalSizeKB} KB</span> → 
            <span style="color: #27ae60; font-weight: 600;">${compressedSizeKB.toFixed(2)} KB</span>
            <span style="color: #27ae60;">(Tiết kiệm ${savedPercent}%)</span>
        `;
        
        // Update status
        statusDisplay.textContent = '✓ Đã nén thành công';
        statusDisplay.className = 'image-status success';
        
    } catch (error) {
        console.error('Error compressing image:', error);
        statusDisplay.textContent = '✗ Lỗi khi nén ảnh';
        statusDisplay.className = 'image-status error';
        preview.innerHTML = '';
    }
}

// Initialize auto-compress for URL images
function initImageUrlCompress() {
    const beforeImageInput = document.getElementById('projectBeforeImage');
    const afterImageInput = document.getElementById('projectAfterImage');
    
    let beforeTimeout, afterTimeout;
    
    if (beforeImageInput) {
        beforeImageInput.addEventListener('input', (e) => {
            clearTimeout(beforeTimeout);
            const url = e.target.value.trim();
            
            if (url && url.startsWith('http')) {
                beforeTimeout = setTimeout(() => {
                    compressImageFromUrl(url, 'before');
                }, 1000); // Wait 1 second after user stops typing
            }
        });
    }
    
    if (afterImageInput) {
        afterImageInput.addEventListener('input', (e) => {
            clearTimeout(afterTimeout);
            const url = e.target.value.trim();
            
            if (url && url.startsWith('http')) {
                afterTimeout = setTimeout(() => {
                    compressImageFromUrl(url, 'after');
                }, 1000);
            }
        });
    }
}

// Compress image from URL
async function compressImageFromUrl(url, type) {
    const previewId = type === 'before' ? 'beforeImagePreview' : 'afterImagePreview';
    const sizeId = type === 'before' ? 'beforeImageSize' : 'afterImageSize';
    const statusId = type === 'before' ? 'beforeImageStatus' : 'afterImageStatus';
    const inputId = type === 'before' ? 'projectBeforeImage' : 'projectAfterImage';
    
    const preview = document.getElementById(previewId);
    const sizeDisplay = document.getElementById(sizeId);
    const statusDisplay = document.getElementById(statusId);
    const input = document.getElementById(inputId);
    
    // Show loading
    statusDisplay.textContent = 'Đang tải và nén ảnh...';
    statusDisplay.className = 'image-status loading';
    preview.innerHTML = '<div class="loading-spinner">⏳ Đang tải ảnh...</div>';
    
    try {
        // Compress image
        const compressed = await imageCompressor.compressFromUrl(url);
        const compressedSizeKB = imageCompressor.getBase64SizeKB(compressed);
        
        // Update input with compressed base64
        input.value = compressed;
        
        // Show preview
        preview.innerHTML = `<img src="${compressed}" alt="Preview" class="preview-image">`;
        
        // Update size info
        sizeDisplay.innerHTML = `
            <span style="color: #27ae60; font-weight: 600;">Đã nén: ${compressedSizeKB.toFixed(2)} KB</span>
        `;
        
        // Update status
        statusDisplay.textContent = '✓ Đã nén thành công';
        statusDisplay.className = 'image-status success';
        
    } catch (error) {
        console.error('Error compressing image from URL:', error);
        // If compression fails, keep original URL
        preview.innerHTML = `<img src="${url}" alt="Preview" class="preview-image" onerror="this.parentElement.innerHTML=''">`;
        statusDisplay.textContent = '⚠ Sử dụng ảnh gốc (không thể nén)';
        statusDisplay.className = 'image-status warning';
    }
}

// Close project modal
function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
}

// Save project
function saveProject() {
    const projectId = document.getElementById('projectId').value;
    const title = document.getElementById('projectTitle').value;
    const style = document.getElementById('projectStyle').value;
    const description = document.getElementById('projectDescription').value;
    const beforeImage = document.getElementById('projectBeforeImage').value;
    const afterImage = document.getElementById('projectAfterImage').value;
    const totalCost = document.getElementById('projectTotalCost').value;
    const costItemsText = document.getElementById('projectCostItems').value;
    
    const costItems = costItemsText.split('\n').filter(item => item.trim() !== '');
    
    // Get hashtag values
    const roomTypeSelect = document.getElementById('projectRoomType');
    const stylesSelect = document.getElementById('projectHashtagStyles');
    const roomType = roomTypeSelect ? roomTypeSelect.value : '';
    const selectedStyles = stylesSelect ? Array.from(stylesSelect.selectedOptions).map(opt => opt.value) : [];
    
    let projects = JSON.parse(localStorage.getItem('adminProjects')) || window.projects || [];
    
    if (projectId) {
        // Edit existing project
        const index = projects.findIndex(p => p.id === parseInt(projectId));
        if (index !== -1) {
            projects[index] = {
                id: parseInt(projectId),
                title,
                style,
                description,
                beforeImage,
                afterImage,
                totalCost,
                costItems,
                hashtags: {
                    roomType: roomType || null,
                    styles: selectedStyles.length > 0 ? selectedStyles : null
                }
            };
        }
    } else {
        // Add new project
        const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        projects.push({
            id: newId,
            title,
            style,
            description,
            beforeImage,
            afterImage,
            totalCost,
            costItems,
            hashtags: {
                roomType: roomType || null,
                styles: selectedStyles.length > 0 ? selectedStyles : null
            }
        });
    }
    
    saveProjects(projects);
    loadProjects();
    closeProjectModal();
    
    alert('Đã lưu dự án thành công!');
}

// Save projects to localStorage
function saveProjects(projects) {
    localStorage.setItem('adminProjects', JSON.stringify(projects));
}

// Load contact info
function loadContactInfo() {
    const contactEmail = localStorage.getItem('contactEmail') || 'info@interiordesign.com';
    const contactPhone = localStorage.getItem('contactPhone') || '+84 123 456 789';
    const contactAddress = localStorage.getItem('contactAddress') || '123 Đường ABC, Quận XYZ, TP.HCM';
    
    document.getElementById('contactEmail').value = contactEmail;
    document.getElementById('contactPhone').value = contactPhone;
    document.getElementById('contactAddress').value = contactAddress;
}

// Initialize contact form
function initContactForm() {
    const saveContactBtn = document.getElementById('saveContactBtn');
    
    if (saveContactBtn) {
        saveContactBtn.addEventListener('click', () => {
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const address = document.getElementById('contactAddress').value;
            
            localStorage.setItem('contactEmail', email);
            localStorage.setItem('contactPhone', phone);
            localStorage.setItem('contactAddress', address);
            
            alert('Đã lưu thông tin liên hệ thành công!');
        });
    }
}

// Hashtag Management Functions
function initHashtagManagement() {
    // Load and display hashtags
    loadHashtags();
    
    // Add hashtag button
    const addHashtagBtn = document.getElementById('addHashtagBtn');
    if (addHashtagBtn) {
        addHashtagBtn.addEventListener('click', addHashtag);
    }
    
    // Hashtag form
    const hashtagForm = document.getElementById('hashtagForm');
    if (hashtagForm) {
        hashtagForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveHashtag();
        });
    }
    
    // Close hashtag modal
    const hashtagModal = document.getElementById('hashtagModal');
    const closeBtn = hashtagModal?.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeHashtagModal);
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === hashtagModal) {
            closeHashtagModal();
        }
    });
}

// Load hashtags from localStorage
function loadHashtags() {
    const hashtags = getHashtags();
    displayHashtags(hashtags);
    updateHashtagDropdowns(hashtags);
}

// Get hashtags from localStorage
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

// Save hashtags to localStorage
function saveHashtags(hashtags) {
    localStorage.setItem('adminHashtags', JSON.stringify(hashtags));
}

// Display hashtags
function displayHashtags(hashtags) {
    const roomTypesList = document.getElementById('roomTypesList');
    const stylesList = document.getElementById('stylesList');
    
    if (roomTypesList) {
        roomTypesList.innerHTML = hashtags.roomTypes.map((tag, index) => `
            <div class="hashtag-item">
                <span>${tag}</span>
                <div class="hashtag-actions">
                    <button class="btn-edit-small" onclick="editHashtag('roomType', ${index})">✏️</button>
                    <button class="btn-delete-small" onclick="deleteHashtag('roomType', ${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    if (stylesList) {
        stylesList.innerHTML = hashtags.styles.map((tag, index) => `
            <div class="hashtag-item">
                <span>${tag}</span>
                <div class="hashtag-actions">
                    <button class="btn-edit-small" onclick="editHashtag('style', ${index})">✏️</button>
                    <button class="btn-delete-small" onclick="deleteHashtag('style', ${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
}

// Update hashtag dropdowns in project form
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

// Add new hashtag
function addHashtag() {
    document.getElementById('hashtagModalTitle').textContent = 'Thêm Hashtag Mới';
    document.getElementById('hashtagForm').reset();
    document.getElementById('hashtagType').value = '';
    document.getElementById('hashtagName').value = '';
    document.getElementById('hashtagForm').dataset.editIndex = '';
    document.getElementById('hashtagForm').dataset.editType = '';
    document.getElementById('hashtagModal').classList.add('active');
}

// Edit hashtag
function editHashtag(type, index) {
    const hashtags = getHashtags();
    const tagArray = type === 'roomType' ? hashtags.roomTypes : hashtags.styles;
    
    document.getElementById('hashtagModalTitle').textContent = 'Sửa Hashtag';
    document.getElementById('hashtagType').value = type === 'roomType' ? 'roomType' : 'style';
    document.getElementById('hashtagName').value = tagArray[index];
    document.getElementById('hashtagForm').dataset.editIndex = index;
    document.getElementById('hashtagForm').dataset.editType = type;
    document.getElementById('hashtagType').disabled = true; // Can't change type when editing
    document.getElementById('hashtagModal').classList.add('active');
}

// Delete hashtag
function deleteHashtag(type, index) {
    if (!confirm('Bạn có chắc chắn muốn xóa hashtag này?')) return;
    
    const hashtags = getHashtags();
    if (type === 'roomType') {
        hashtags.roomTypes.splice(index, 1);
    } else {
        hashtags.styles.splice(index, 1);
    }
    
    saveHashtags(hashtags);
    loadHashtags();
}

// Save hashtag
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
    loadHashtags();
    closeHashtagModal();
    alert('Đã lưu hashtag thành công!');
}

// Close hashtag modal
function closeHashtagModal() {
    document.getElementById('hashtagModal').classList.remove('active');
    document.getElementById('hashtagForm').reset();
    document.getElementById('hashtagForm').dataset.editIndex = '';
    document.getElementById('hashtagForm').dataset.editType = '';
    document.getElementById('hashtagType').disabled = false;
}

// Make functions available globally
window.editHashtag = editHashtag;
window.deleteHashtag = deleteHashtag;
window.closeHashtagModal = closeHashtagModal;

// Initialize settings form
function initSettingsForm() {
    // Get current logged in user
    const currentUser = localStorage.getItem('currentUser') || 'admin';
    document.getElementById('adminUsername').value = currentUser;
    
    // Load image compression settings
    const maxWidth = localStorage.getItem('imageMaxWidth') || '1200';
    const maxHeight = localStorage.getItem('imageMaxHeight') || '1200';
    const quality = localStorage.getItem('imageQuality') || '0.8';
    const maxSizeKB = localStorage.getItem('imageMaxSizeKB') || '500';
    
    document.getElementById('maxImageWidth').value = maxWidth;
    document.getElementById('maxImageHeight').value = maxHeight;
    document.getElementById('imageQuality').value = quality;
    document.getElementById('maxImageSizeKB').value = maxSizeKB;
    
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!username) {
                alert('Tên đăng nhập không được để trống!');
                return;
            }
            
            // Update admin accounts system
            const accounts = getAdminAccounts();
            const currentUser = localStorage.getItem('currentUser') || 'admin';
            
            // If changing username, create new account and delete old one
            if (username !== currentUser) {
                if (accounts[username]) {
                    alert('Tên đăng nhập này đã tồn tại!');
                    return;
                }
                // Create new account with same password if not changing password
                accounts[username] = {
                    password: password || accounts[currentUser].password,
                    createdAt: accounts[currentUser].createdAt || new Date().toISOString(),
                    isAdmin: accounts[currentUser].isAdmin || false
                };
                // Update current user
                localStorage.setItem('currentUser', username);
                // Don't delete old account, keep it for safety
            }
            
            // Update password if provided
            if (password) {
                if (password !== confirmPassword) {
                    alert('Mật khẩu xác nhận không khớp!');
                    return;
                }
                if (password.length < 6) {
                    alert('Mật khẩu phải có ít nhất 6 ký tự!');
                    return;
                }
                accounts[username].password = password;
            }
            
            // Save accounts
            localStorage.setItem('adminAccounts', JSON.stringify(accounts));
            
            // Save image compression settings
            const maxWidth = document.getElementById('maxImageWidth').value;
            const maxHeight = document.getElementById('maxImageHeight').value;
            const quality = document.getElementById('imageQuality').value;
            const maxSizeKB = document.getElementById('maxImageSizeKB').value;
            
            localStorage.setItem('imageMaxWidth', maxWidth);
            localStorage.setItem('imageMaxHeight', maxHeight);
            localStorage.setItem('imageQuality', quality);
            localStorage.setItem('imageMaxSizeKB', maxSizeKB);
            
            // Update image compressor settings
            if (typeof imageCompressor !== 'undefined') {
                imageCompressor.maxWidth = parseInt(maxWidth);
                imageCompressor.maxHeight = parseInt(maxHeight);
                imageCompressor.quality = parseFloat(quality);
                imageCompressor.maxSizeKB = parseInt(maxSizeKB);
            }
            
            alert('Đã lưu cài đặt thành công!');
            
            // Clear password fields
            document.getElementById('adminPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAdmin);

// Make functions available globally
window.editProject = editProject;
window.deleteProject = deleteProject;
window.closeProjectModal = closeProjectModal;

