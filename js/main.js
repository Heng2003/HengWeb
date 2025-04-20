document.addEventListener('DOMContentLoaded', function() {
    // Loading screen - Ensure .loading-screen exists in HTML
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        // Add a small delay after everything is loaded, then fade out
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                // Optional: Remove loading screen from DOM after transition
                 loadingScreen.addEventListener('transitionend', () => {
                     if (loadingScreen.parentNode) {
                         loadingScreen.parentNode.removeChild(loadingScreen);
                     }
                 });
            }, 500); // Shorter delay after load event
        });
    }


    // Language switching
    const langBtns = document.querySelectorAll('.lang-btn');
    const allLangElements = document.querySelectorAll('.en, .zh'); // Cache elements

    function switchLanguage(lang) {
        // Hide all elements not in the selected language
        allLangElements.forEach(el => {
            if (el.classList.contains(lang)) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);

            // Update active button
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
             // Optional: Prevent body scroll when mobile menu is open
             document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scroll
                }
            });
        });
         // Close mobile menu when clicking outside of it
         document.addEventListener('click', (event) => {
             const isClickInsideNav = navLinks.contains(event.target);
             const isClickOnHamburger = hamburger.contains(event.target);

             if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                 hamburger.classList.remove('active');
                 navLinks.classList.remove('active');
                 document.body.style.overflow = ''; // Restore scroll
             }
         });
    }

    // Smooth scrolling for anchor links (handled by CSS `scroll-behavior: smooth;`)
    // JS implementation kept for browsers that might not support CSS smooth scroll fully
    // And to handle the offset for the fixed navbar.
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70; // Get navbar height dynamically or fallback
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Only override default behavior for actual internal links
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Prevent default jump
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navbarHeight - 10; // Add a little extra padding

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile nav if open after clicking a link
                    if (navLinks && navLinks.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            } else if (targetId === '#') {
                 // Special case for links like href="#" (often used for top link)
                 e.preventDefault();
                 window.scrollTo({ top: 0, behavior: 'smooth' });
                 // Close mobile nav if open
                 if (navLinks && navLinks.classList.contains('active')) {
                     hamburger.classList.remove('active');
                     navLinks.classList.remove('active');
                     document.body.style.overflow = '';
                 }
            }
        });
    });


    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    const slideshowContainer = document.querySelector('.slideshow-container');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 1 && slideshowContainer) { // Only run if there's more than one slide
        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function startSlideshow() {
             // Clear existing interval before starting a new one
             clearInterval(slideInterval);
             slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        // Initial start
        startSlideshow();

        // Pause slideshow on hover
        slideshowContainer.addEventListener('mouseenter', stopSlideshow);
        slideshowContainer.addEventListener('mouseleave', startSlideshow);

        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;

        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopSlideshow(); // Pause on touch start
        }, { passive: true }); // Use passive listener for better scroll performance

        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlideshow(); // Resume on touch end
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide(); // Left swipe
            } else if (touchEndX > touchStartX + swipeThreshold) {
                showSlide(currentSlide - 1); // Right swipe
            }
            // If the swipe distance is less than threshold, do nothing
        }
    }


    // Research tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content'); // Cache contents

    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                const targetContent = document.getElementById(tabId);

                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // --- Publication filtering section removed as it was unused ---

    // Back to top button visibility (CSS handles this now, JS only needed for click)
    const backToTopBtn = document.querySelector('.back-to-top a');
    if (backToTopBtn) {
        // Click event is handled by the smooth scroll logic above for href="#"
        // CSS handles visibility based on scroll position using the .visible class (if needed)
        // Or can be handled purely by CSS :hover/:focus states if always visible but styled

        // Logic to add/remove 'visible' class based on scroll (if CSS doesn't handle it)
         window.addEventListener('scroll', function() {
             if (window.pageYOffset > 300) {
                 backToTopBtn.classList.add('visible');
             } else {
                 backToTopBtn.classList.remove('visible');
             }
         });
    }


    // Contact form submission using mailto:
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            // DO NOT preventDefault() - let the form submit normally

            const formStatus = document.getElementById('form-status');
            const submitButtonEn = this.querySelector('button.en');
            const submitButtonZh = this.querySelector('button.zh');

            // Disable buttons and show status immediately on submit attempt
            if(formStatus) formStatus.textContent = 'Sending...';
            if(submitButtonEn) submitButtonEn.disabled = true;
            if(submitButtonZh) submitButtonZh.disabled = true;

            // FormSubmit will handle the rest, including redirection or showing a success message/CAPTCHA.
            // The 'Sending...' message might only show briefly before redirection.
        });
    }

    // Initialize with default language (e.g., English)
    switchLanguage('en'); // Ensure default language is shown on load
});