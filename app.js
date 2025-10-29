// ===== THEME TOGGLE FUNCTIONALITY =====
class ThemeManager {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.body = document.body;
        this.currentTheme = this.getStoredTheme() || 'dark';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.body.setAttribute('data-theme', this.currentTheme);
        
        // Add event listener
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.body.setAttribute('data-theme', this.currentTheme);
        
        // Save to localStorage (Note: This won't work in sandbox, but included for completeness)
        try {
            localStorage.setItem('theme', this.currentTheme);
        } catch (e) {
            console.log('LocalStorage not available');
        }
        
        // Add smooth transition effect
        this.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            this.body.style.transition = '';
        }, 300);
        
        // Update header background immediately
        this.updateHeaderBackground();
    }
    
    updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (header) {
            if (this.currentTheme === 'light') {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
            }
        }
    }
}

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav__link');
        this.sections = document.querySelectorAll('section');
        this.header = document.querySelector('.header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        
        this.init();
    }
    
    init() {
        // Add smooth scrolling to navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Add scroll listener for header styling and active nav
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveNav();
        });
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    handleScroll() {
        if (!this.header) return;
        
        const scrollY = window.scrollY;
        const currentTheme = document.body.getAttribute('data-theme');
        
        if (scrollY > 100) {
            this.header.style.background = currentTheme === 'light' 
                ? 'rgba(255, 255, 255, 0.98)' 
                : 'rgba(0, 0, 0, 0.98)';
            this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.header.style.background = currentTheme === 'light' 
                ? 'rgba(255, 255, 255, 0.95)' 
                : 'rgba(0, 0, 0, 0.95)';
            this.header.style.boxShadow = 'none';
        }
    }
    
    updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.navMenu && this.navToggle) {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (this.navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
    
    closeMobileMenu() {
        if (this.navMenu && this.navToggle) {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ===== VIDEO MODAL FUNCTIONALITY =====
class VideoModal {
    constructor() {
        this.modal = document.getElementById('video-modal');
        this.modalPlayer = document.getElementById('video-player');
        this.closeBtn = document.querySelector('.video-modal__close');
        this.overlay = document.querySelector('.video-modal__overlay');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Add event listeners
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Prevent modal content click from closing modal
        const modalContent = document.querySelector('.video-modal__content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => e.stopPropagation());
        }
    }
    
    open(videoId) {
        if (!this.modal || !this.modalPlayer || !videoId) return;
        
        // Create YouTube embed with proper parameters
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.allow = 'autoplay; encrypted-media';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        this.modalPlayer.innerHTML = '';
        this.modalPlayer.appendChild(iframe);
        
        this.modal.classList.remove('hidden');
        this.modal.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Focus the close button for accessibility
        setTimeout(() => {
            if (this.closeBtn) {
                this.closeBtn.focus();
            }
        }, 100);
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        this.modal.classList.add('hidden');
        this.isOpen = false;
        
        // Clear the video player
        if (this.modalPlayer) {
            this.modalPlayer.innerHTML = '';
        }
        
        document.body.style.overflow = '';
        
        // Return focus to the trigger element if possible
        const activePortfolioItem = document.querySelector('.portfolio__item:hover .portfolio__play');
        if (activePortfolioItem) {
            activePortfolioItem.focus();
        }
    }
}

// ===== CONTACT FORM FUNCTIONALITY =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageTextarea = document.getElementById('message');
        this.charCounter = document.getElementById('char-count');
        this.submitBtn = null;
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        
        // Character counter for textarea
        if (this.messageTextarea && this.charCounter) {
            this.messageTextarea.addEventListener('input', () => this.updateCharCount());
            // Initialize character count
            this.updateCharCount();
        }
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.setupValidation();
        
        // Auto-resize textarea
        if (this.messageTextarea) {
            this.messageTextarea.addEventListener('input', this.autoResizeTextarea.bind(this));
        }
    }
    
    updateCharCount() {
        if (!this.messageTextarea || !this.charCounter) return;
        
        const currentLength = this.messageTextarea.value.length;
        this.charCounter.textContent = currentLength;
        
        // Change color based on character count
        if (currentLength > 250) {
            this.charCounter.style.color = '#ff6b6b';
        } else if (currentLength > 200) {
            this.charCounter.style.color = '#ffa500';
        } else {
            this.charCounter.style.color = '';
        }
    }
    
    autoResizeTextarea() {
        if (!this.messageTextarea) return;
        
        this.messageTextarea.style.height = 'auto';
        this.messageTextarea.style.height = this.messageTextarea.scrollHeight + 'px';
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        this.clearErrors(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Name validation
        if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        }
        
        // Show error if invalid
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.style.borderColor = '#ff6b6b';
        field.style.boxShadow = '0 0 0 4px rgba(255, 107, 107, 0.1)';
        
        // Create or update error message
        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            field.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ff6b6b;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        
        // Add error icon
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }
    
    clearErrors(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            this.submitForm();
        } else {
            this.showFormError('Please correct the errors above');
            // Scroll to first error
            const firstError = this.form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    
    submitForm() {
        if (!this.submitBtn) return;
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const originalText = this.submitBtn.innerHTML;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        this.submitBtn.disabled = true;
        this.submitBtn.style.opacity = '0.7';
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            this.updateCharCount();
            
            // Reset button
            this.submitBtn.innerHTML = originalText;
            this.submitBtn.disabled = false;
            this.submitBtn.style.opacity = '';
            
            // Reset textarea height
            if (this.messageTextarea) {
                this.messageTextarea.style.height = 'auto';
            }
        }, 2000);
        
        // Log form data for development (replace with actual API call)
        console.log('Form submitted with data:', data);
        
        // Here you would typically send the data to your backend:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
    }
    
    showSuccessMessage() {
        // Remove any existing messages
        this.removeMessages();
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Message sent successfully!</h4>
                <p>Thank you for your interest. I'll get back to you within 24 hours.</p>
            </div>
        `;
        
        // Style the success message
        successDiv.style.cssText = `
            background: linear-gradient(135deg, rgba(110, 231, 183, 0.1), rgba(147, 51, 234, 0.05));
            border: 1px solid #6EE7B7;
            color: #6EE7B7;
            padding: 1.5rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInDown 0.5s ease-out;
        `;
        
        // Insert at top of form
        this.form.insertBefore(successDiv, this.form.firstChild);
        
        // Remove after 8 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => successDiv.remove(), 300);
            }
        }, 8000);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showFormError(message) {
        // Remove any existing messages
        this.removeMessages();
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <h4>Validation Error</h4>
                <p>${message}</p>
            </div>
        `;
        
        // Style the error message
        errorDiv.style.cssText = `
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid #ff6b6b;
            color: #ff6b6b;
            padding: 1.5rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInDown 0.5s ease-out;
        `;
        
        // Insert at top of form
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        // Remove after 6 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 6000);
    }
    
    removeMessages() {
        const existingMessages = this.form.querySelectorAll('.form-error, .success-message');
        existingMessages.forEach(msg => msg.remove());
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);
        
        // Observe elements
        const elementsToAnimate = document.querySelectorAll(`
            .service-card, 
            .portfolio__item, 
            .stat, 
            .about__title,
            .section-title,
            .hero__title
        `);
        
        elementsToAnimate.forEach(el => this.observer.observe(el));
    }
    
    animateElement(element) {
        if (element.classList.contains('service-card') || element.classList.contains('portfolio__item')) {
            element.classList.add('fade-in-up');
        } else if (element.classList.contains('stat')) {
            element.classList.add('slide-in-right');
        } else if (element.classList.contains('about__title') || element.classList.contains('section-title')) {
            element.classList.add('slide-in-left');
        } else {
            element.classList.add('fade-in-up');
        }
        
        // Stop observing this element
        this.observer.unobserve(element);
    }
}

// ===== PORTFOLIO INTERACTIONS =====
class PortfolioManager {
    constructor() {
        this.portfolioItems = document.querySelectorAll('.portfolio__item');
        this.init();
    }
    
    init() {
        this.portfolioItems.forEach(item => {
            this.setupItemInteractions(item);
        });
    }
    
    setupItemInteractions(item) {
        const overlay = item.querySelector('.portfolio__overlay');
        const info = item.querySelector('.portfolio__info');
        const playBtn = item.querySelector('.portfolio__play');
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', () => {
            this.animateItemEnter(info);
        });
        
        item.addEventListener('mouseleave', () => {
            this.animateItemLeave(info);
        });
        
        // Keyboard accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (playBtn) {
                    playBtn.click();
                }
            }
        });
        
        // Make portfolio items focusable
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Play video: ${item.querySelector('.portfolio__title')?.textContent || 'Portfolio video'}`);
    }
    
    animateItemEnter(info) {
        if (!info) return;
        
        const elements = info.querySelectorAll('.portfolio__type, .portfolio__title, .portfolio__description, .portfolio__duration');
        
        elements.forEach((el, index) => {
            if (el) {
                el.style.transform = 'translateY(20px)';
                el.style.opacity = '0';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.transform = 'translateY(0)';
                    el.style.opacity = '1';
                }, index * 80);
            }
        });
    }
    
    animateItemLeave(info) {
        if (!info) return;
        
        const elements = info.querySelectorAll('*');
        elements.forEach(el => {
            el.style.transition = '';
            el.style.transform = '';
            el.style.opacity = '';
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Open video modal (called from HTML)
function openVideoModal(videoId) {
    if (window.videoModal) {
        window.videoModal.open(videoId);
    }
}

// Close video modal (called from HTML)
function closeVideoModal() {
    if (window.videoModal) {
        window.videoModal.close();
    }
}

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }
    
    optimizeScrollEvents() {
        let ticking = false;
        
        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-based updates happen here
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }
    
    preloadResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        // Add skip links
        this.addSkipLinks();
        
        // Enhance focus management
        this.enhanceFocusManagement();
        
        // Add ARIA labels and roles
        this.enhanceARIA();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }
    
    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent);
            color: var(--bg-primary);
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.2s;
            font-weight: 500;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    enhanceFocusManagement() {
        // Focus trap for modal
        const modal = document.getElementById('video-modal');
        if (modal) {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll('button, iframe, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }
    
    enhanceARIA() {
        // Add ARIA labels to interactive elements
        const portfolioItems = document.querySelectorAll('.portfolio__item');
        portfolioItems.forEach((item, index) => {
            const title = item.querySelector('.portfolio__title')?.textContent || `Portfolio item ${index + 1}`;
            item.setAttribute('aria-label', `View ${title} video`);
        });
        
        // Add ARIA labels to form elements
        const form = document.getElementById('contact-form');
        if (form) {
            form.setAttribute('aria-label', 'Contact form');
        }
        
        // Add role to navigation
        const nav = document.querySelector('.nav__menu');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for custom elements
        document.addEventListener('keydown', (e) => {
            // Close modal on Escape
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.video-modal.active');
                if (activeModal && window.videoModal) {
                    window.videoModal.close();
                }
                
                // Close mobile menu on Escape
                const mobileMenu = document.querySelector('.nav__menu.active');
                if (mobileMenu && window.navigation) {
                    window.navigation.closeMobileMenu();
                }
            }
        });
    }
}

// ===== INITIALIZATION =====
let themeManager, navigation, videoModal, contactForm, scrollAnimations, portfolioManager, performanceOptimizer, accessibilityEnhancer;

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize core components
        themeManager = new ThemeManager();
        navigation = new Navigation();
        videoModal = new VideoModal();
        contactForm = new ContactForm();
        scrollAnimations = new ScrollAnimations();
        portfolioManager = new PortfolioManager();
        performanceOptimizer = new PerformanceOptimizer();
        accessibilityEnhancer = new AccessibilityEnhancer();
        
        // Make videoModal globally available for onclick handlers
        window.videoModal = videoModal;
        window.navigation = navigation;
        
        // Add loading complete class
        document.body.classList.add('loaded');
        
        // Initialize any dynamic animations
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero__title');
            if (heroTitle) {
                heroTitle.style.animation = 'fadeInUp 1s ease-out';
            }
        }, 100);
        
        console.log('VideoCraft Portfolio - All systems initialized successfully ✨');
        
    } catch (error) {
        console.error('Error initializing components:', error);
        // Graceful degradation - basic functionality should still work
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    
    // Basic error recovery
    if (event.error && event.error.message) {
        // Don't break the user experience for non-critical errors
        if (!event.error.message.includes('critical')) {
            event.preventDefault();
        }
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Prevent the default behavior (which would log the error to console)
    event.preventDefault();
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        // Monitor page load performance
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('Page Load Performance:', {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
        }
    });
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        Navigation,
        VideoModal,
        ContactForm,
        ScrollAnimations,
        PortfolioManager,
        PerformanceOptimizer,
        AccessibilityEnhancer,
        scrollToSection,
        openVideoModal,
        closeVideoModal,
        debounce
    };
}