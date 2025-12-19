// Navigation Toggle for Mobile
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Load projects from localStorage or data.js
let currentProjects = [];

function loadProjectsData() {
    // Try to load from localStorage first (admin edited data)
    const savedProjects = localStorage.getItem('adminProjects');
    if (savedProjects) {
        currentProjects = JSON.parse(savedProjects);
    } else if (typeof projects !== 'undefined' && window.projects) {
        // Use projects from data.js if available
        currentProjects = window.projects;
    } else {
        currentProjects = [];
    }
    return currentProjects;
}

// Load Portfolio Items
function loadPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!portfolioGrid) return;
    
    const projects = loadProjectsData();
    
    if (projects.length === 0) {
        portfolioGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">Chưa có dự án nào được hiển thị.</p>';
        return;
    }
    
    portfolioGrid.innerHTML = projects.map(project => {
        // Use optimized images (compressed if available)
        const beforeImage = getOptimizedImageUrl(project.beforeImage, project.id, 'before');
        const afterImage = getOptimizedImageUrl(project.afterImage, project.id, 'after');
        
        return `
        <div class="portfolio-item" data-project-id="${project.id}">
            <div class="portfolio-image-container">
                <div class="before-after-container">
                    <div class="before-image-wrapper">
                        <img src="${beforeImage}" alt="Trước khi thiết kế" class="portfolio-image-before" loading="lazy">
                        <div class="image-label image-label-before">Trước</div>
                    </div>
                    <div class="after-image-wrapper">
                        <img src="${afterImage}" alt="Sau khi thiết kế" class="portfolio-image-after" loading="lazy">
                        <div class="image-label image-label-after">Sau</div>
                    </div>
                    <div class="comparison-slider">
                        <div class="slider-handle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 3L4 7l4 4M16 21l4-4-4-4M4 7h16"/>
                            </svg>
                        </div>
                    </div>
                    <div class="comparison-line"></div>
                </div>
                <span class="portfolio-badge">${project.style}</span>
            </div>
            <div class="portfolio-info">
                <h3 class="portfolio-title">${project.title}</h3>
                <p class="portfolio-style">Phong cách: ${project.style}</p>
                <p class="portfolio-price">Từ ${project.totalCost}</p>
                <button class="btn-view-details" onclick="openModal(${project.id}); event.stopPropagation();">Xem Chi Tiết</button>
            </div>
        </div>
    `;
    }).join('');
    
    // Initialize before/after comparison sliders
    initBeforeAfterSliders();
}

// Helper function to create storage key from URL (if not defined in image-compress.js)
function getImageStorageKey(imageUrl) {
    if (typeof getImageStorageKey === 'function' && getImageStorageKey !== arguments.callee) {
        return getImageStorageKey(imageUrl);
    }
    // Fallback: create a hash-like key from URL
    try {
        return 'img_' + btoa(imageUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
    } catch (e) {
        // If btoa fails, use a simple hash
        let hash = 0;
        for (let i = 0; i < imageUrl.length; i++) {
            const char = imageUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'img_' + Math.abs(hash).toString(36);
    }
}

// Get optimized image URL (use compressed version if available)
function getOptimizedImageUrl(imageUrl, projectId, type) {
    // If already base64 (compressed), use it directly
    if (imageUrl && imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    
    // Try to get compressed version from localStorage
    if (typeof imageCompressor !== 'undefined' && imageUrl) {
        const key = `img_${projectId}_${type}`;
        const compressed = localStorage.getItem(key);
        if (compressed) {
            return compressed;
        }
        
        // Try to get from general image storage
        const generalKey = getImageStorageKey(imageUrl);
        const generalCompressed = localStorage.getItem(generalKey);
        if (generalCompressed) {
            return generalCompressed;
        }
    }
    
    // Return original URL
    return imageUrl;
}

// Modal Functions
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

function openModal(projectId) {
    const projects = loadProjectsData();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    // Get optimized images
    const beforeImage = getOptimizedImageUrl(project.beforeImage, project.id, 'before');
    const afterImage = getOptimizedImageUrl(project.afterImage, project.id, 'after');
    
    modalBody.innerHTML = `
        <div class="modal-image-container">
            <div class="modal-image-wrapper">
                <img src="${beforeImage}" alt="Trước khi thiết kế" class="modal-image" loading="lazy">
                <div class="modal-image-label">Trước khi thiết kế</div>
            </div>
            <div class="modal-image-wrapper">
                <img src="${afterImage}" alt="Sau khi thiết kế" class="modal-image" loading="lazy">
                <div class="modal-image-label">Sau khi thiết kế</div>
            </div>
        </div>
        
        <h2 class="modal-title">${project.title}</h2>
        
        <div class="modal-details">
            <div class="modal-detail-section">
                <h3>Phong Cách Thiết Kế</h3>
                <p><strong>${project.style}</strong></p>
                <p>${project.description}</p>
            </div>
            
            <div class="modal-detail-section">
                <h3>Các Hạng Mục Chi Phí Thi Công</h3>
                <ul>
                    ${project.costItems.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-detail-section">
                <h3>Chi Phí Thực Hiện Trọn Gói</h3>
                <p class="modal-price-highlight">${project.totalCost}</p>
                <p style="margin-top: 0.5rem; color: var(--text-light); font-size: 0.9rem;">
                    * Giá có thể thay đổi tùy theo diện tích và yêu cầu cụ thể
                </p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with close button
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize before/after comparison sliders
function initBeforeAfterSliders() {
    const containers = document.querySelectorAll('.before-after-container');
    
    containers.forEach(container => {
        let isDragging = false;
        const slider = container.querySelector('.comparison-slider');
        const line = container.querySelector('.comparison-line');
        const afterWrapper = container.querySelector('.after-image-wrapper');
        const beforeWrapper = container.querySelector('.before-image-wrapper');
        
        if (!slider || !line || !afterWrapper || !beforeWrapper) return;
        
        // Set initial position (50% - both images equally visible)
        let position = 50;
        updateSlider(position, slider, line, afterWrapper, beforeWrapper);
        
        // Disable transition when dragging starts
        const disableTransition = () => {
            beforeWrapper.style.transition = 'none';
        };
        
        // Enable smooth transition when dragging ends
        const enableTransition = () => {
            beforeWrapper.style.transition = 'clip-path 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        };
        
        // Mouse events
        const handleMove = (e) => {
            if (!isDragging) return;
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            position = percent;
            updateSlider(position, slider, line, afterWrapper, beforeWrapper);
        };
        
        const handleStart = (e) => {
            isDragging = true;
            container.style.cursor = 'grabbing';
            disableTransition();
            handleMove(e);
        };
        
        const handleEnd = () => {
            isDragging = false;
            container.style.cursor = 'grab';
            enableTransition();
        };
        
        slider.addEventListener('mousedown', handleStart);
        container.addEventListener('mousedown', (e) => {
            if (e.target !== slider && !slider.contains(e.target)) {
                handleStart(e);
            }
        });
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Touch events for mobile
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const rect = container.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            position = percent;
            updateSlider(position, slider, line, afterWrapper, beforeWrapper);
        };
        
        const handleTouchStart = (e) => {
            isDragging = true;
            disableTransition();
            const rect = container.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            position = percent;
            updateSlider(position, slider, line, afterWrapper, beforeWrapper);
        };
        
        const handleTouchEnd = () => {
            isDragging = false;
            enableTransition();
        };
        
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        
        // Hover effect to show slider
        container.addEventListener('mouseenter', () => {
            slider.style.opacity = '1';
            line.style.opacity = '1';
        });
        
        container.addEventListener('mouseleave', () => {
            if (!isDragging) {
                slider.style.opacity = '0.7';
                line.style.opacity = '0.5';
            }
        });
    });
}

// Update slider position
function updateSlider(position, slider, line, afterWrapper, beforeWrapper) {
    const smoothPosition = Math.max(0, Math.min(100, position));
    slider.style.left = `${smoothPosition}%`;
    line.style.left = `${smoothPosition}%`;
    
    // Update clip-path to reveal/hide before image
    // When slider is at 0%: before image fully visible (clip-path: 0% 0, 0% 0, 0% 100%, 0% 100%)
    // When slider is at 50%: before image half visible (clip-path: 0% 0, 50% 0, 50% 100%, 0% 100%)
    // When slider is at 100%: before image fully hidden (clip-path: 0% 0, 100% 0, 100% 100%, 0% 100%)
    // This reveals the after image underneath from left to right
    
    if (beforeWrapper) {
        beforeWrapper.style.clipPath = `polygon(0% 0%, ${smoothPosition}% 0%, ${smoothPosition}% 100%, 0% 100%)`;
    }
}

// Load contact information from localStorage
function loadContactInfo() {
    const contactEmail = localStorage.getItem('contactEmail');
    const contactPhone = localStorage.getItem('contactPhone');
    const contactAddress = localStorage.getItem('contactAddress');
    
    if (contactEmail) {
        const emailElement = document.querySelector('.contact-item:nth-child(1) p');
        if (emailElement) emailElement.textContent = contactEmail;
    }
    
    if (contactPhone) {
        const phoneElement = document.querySelector('.contact-item:nth-child(2) p');
        if (phoneElement) phoneElement.textContent = contactPhone;
    }
    
    if (contactAddress) {
        const addressElement = document.querySelector('.contact-item:nth-child(3) p');
        if (addressElement) addressElement.textContent = contactAddress;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
    loadContactInfo();
});

