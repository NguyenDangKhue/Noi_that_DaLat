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

// Load Portfolio Items
function loadPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!portfolioGrid) return;
    
    portfolioGrid.innerHTML = projects.map(project => `
        <div class="portfolio-item" onclick="openModal(${project.id})">
            <div class="portfolio-image-container">
                <img src="${project.afterImage}" alt="${project.title}" class="portfolio-image" loading="lazy">
                <span class="portfolio-badge">${project.style}</span>
            </div>
            <div class="portfolio-info">
                <h3 class="portfolio-title">${project.title}</h3>
                <p class="portfolio-style">Phong cách: ${project.style}</p>
                <p class="portfolio-price">Từ ${project.totalCost}</p>
            </div>
        </div>
    `).join('');
}

// Modal Functions
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

function openModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    modalBody.innerHTML = `
        <div class="modal-image-container">
            <div class="modal-image-wrapper">
                <img src="${project.beforeImage}" alt="Trước khi thiết kế" class="modal-image">
                <div class="modal-image-label">Trước khi thiết kế</div>
            </div>
            <div class="modal-image-wrapper">
                <img src="${project.afterImage}" alt="Sau khi thiết kế" class="modal-image">
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
});

