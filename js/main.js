document.addEventListener('DOMContentLoaded', function() {

    // Cache frequently used elements
    const body = document.body;
    const loadingScreen = document.querySelector('.loading-screen');
    const langBtns = document.querySelectorAll('.lang-btn');
    const allLangElements = document.querySelectorAll('.en, .zh');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const backToTopBtnLink = document.querySelector('.back-to-top a');
    const emailForm = document.getElementById('emailForm');

    // Utility: Throttle function
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }

    // --- Loading screen ---
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                 loadingScreen.addEventListener('transitionend', () => {
                     if (loadingScreen.parentNode) {
                         loadingScreen.parentNode.removeChild(loadingScreen);
                     }
                 }, { once: true });
            }, 500);
        });
    }

    // --- Language switching ---
    function switchLanguage(lang) {
        allLangElements.forEach(el => {
            el.classList.toggle('hidden', !el.classList.contains(lang));
        });
        document.documentElement.lang = lang;
        body.dataset.lang = lang; // Use cached body
    }

    if (langBtns.length > 0) {
        langBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);
                langBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // --- Mobile menu toggle ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            const isActive = navLinks.classList.toggle('active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', isActive);
            body.style.overflow = isActive ? 'hidden' : ''; // Use cached body
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    body.style.overflow = ''; // Use cached body
                }
            });
        });
         document.addEventListener('click', (event) => {
             const isClickInsideNav = navLinks.contains(event.target);
             const isClickOnHamburger = hamburger.contains(event.target);
             if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                 hamburger.classList.remove('active');
                 navLinks.classList.remove('active');
                 hamburger.setAttribute('aria-expanded', 'false');
                 body.style.overflow = ''; // Use cached body
             }
         });
    }

    // --- Smooth scrolling for anchor links ---
    const navbarHeight = navbar?.offsetHeight || 70; // Use cached navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                 e.preventDefault();
                 window.scrollTo({ top: 0, behavior: 'smooth' });
                 if (navLinks && navLinks.classList.contains('active')) { // Close mobile nav
                     hamburger.classList.remove('active');
                     navLinks.classList.remove('active');
                     hamburger.setAttribute('aria-expanded', 'false');
                     body.style.overflow = '';
                 }
            } else if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navbarHeight - 10;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    if (navLinks && navLinks.classList.contains('active')) { // Close mobile nav
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                        body.style.overflow = '';
                    }
                }
            }
        });
    });

    // --- Navbar scroll effect (Throttled) ---
    if (navbar) {
         const handleNavbarScroll = () => {
             navbar.classList.toggle('scrolled', window.scrollY > 300);
        };
        window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
    }

    // --- Slideshow functionality ---
    const slideshowModule = (function() {
        const slides = document.querySelectorAll('.slide');
        const container = document.querySelector('.slideshow-container');
        const prevBtn = document.querySelector('.slide-control.prev');
        const nextBtn = document.querySelector('.slide-control.next');
        let currentSlide = 0;
        let intervalId = null;
        const intervalTime = 5000;

        if (slides.length <= 1 || !container) {
            // Hide controls if not needed or container missing
             if(prevBtn) prevBtn.style.display = 'none';
             if(nextBtn) nextBtn.style.display = 'none';
            return; // Exit if slideshow isn't necessary
        }

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function next() { showSlide(currentSlide + 1); }
        function prev() { showSlide(currentSlide - 1); }

        function stop() { clearInterval(intervalId); intervalId = null; }
        function start() {
             stop(); // Clear previous interval
             intervalId = setInterval(next, intervalTime);
        }

        // Event listeners
        if (prevBtn) {
             prevBtn.addEventListener('click', () => { prev(); start(); });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => { next(); start(); });
        }
        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);

        // Touch events
        let touchStartX = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stop();
        }, { passive: true });
        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) { next(); }
            else if (touchEndX > touchStartX + swipeThreshold) { prev(); }
            start();
        }, { passive: true });

        // Initial setup
        showSlide(currentSlide); // Show first slide
        start();

    })(); // Immediately invoke the function to set up the slideshow

    // --- Research tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                const targetContent = document.getElementById(tabId);
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                if (targetContent) { targetContent.classList.add('active'); }
            });
        });
    }

    // --- Back to top button visibility (Throttled) ---
    if (backToTopBtnLink) {
         const handleBackToTopScroll = () => {
             backToTopBtnLink.classList.toggle('visible', window.pageYOffset > 300);
         };
         window.addEventListener('scroll', throttle(handleBackToTopScroll, 150));
    }

    // --- Contact form submission feedback ---
    // Inside the 'submit' event listener for emailForm
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            const formStatus = document.getElementById('form-status');
            const submitButtons = this.querySelectorAll('button[type="submit"]');
            const userEmailInput = this.querySelector('input[name="email"]'); // Get email input
            const replyToInput = this.querySelector('input[name="_replyto"]'); // Get hidden _replyto input

            // Set the _replyto field value
            if (userEmailInput && replyToInput) {
                replyToInput.value = userEmailInput.value;
            }

            if(formStatus) formStatus.textContent = 'Sending...';
            submitButtons.forEach(button => button.disabled = true);
            // FormSubmit handles the rest
        });
    }

    // --- Initialize default language ---
    const initialLang = body.dataset.lang || 'en'; // Use cached body
    switchLanguage(initialLang);
    if (langBtns.length > 0) {
        langBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-lang') === initialLang);
        });
    }

});