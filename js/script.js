document.addEventListener('DOMContentLoaded', () => {
    let openModal;
    const siteHeader = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const body = document.body;

    // --- Header Behavior ---
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) siteHeader.classList.add('scrolled');
            else siteHeader.classList.remove('scrolled');
            highlightNavLinkOnScroll();
        }, { passive: true });
    }

    // --- Mobile Menu ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isActive));
            body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // --- Nav Link Smooth Scroll & Active State (Viewport Center Criterion) ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement && siteHeader) {
                const isHero = targetId === '#hero';
                const headerOffset = isHero ? 0 : siteHeader.offsetHeight + 20;
                let elementPosition = targetElement.getBoundingClientRect().top;
                const scrollToPosition = isHero ? window.pageYOffset + elementPosition : window.pageYOffset + elementPosition - headerOffset;
                window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                }
            }
        });
    });

    function highlightNavLinkOnScroll() {
        if (!siteHeader || navLinks.length === 0) return;
        const viewportCenterY = window.innerHeight / 2;
        let activeSectionId = null;
        let minDistanceToCenter = Infinity;

        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href');
            const section = document.querySelector(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionIsMinimallyInView = rect.top < window.innerHeight && rect.bottom > 0;
                if (sectionIsMinimallyInView) {
                    const sectionCenterY = rect.top + rect.height / 2;
                    const distance = Math.abs(sectionCenterY - viewportCenterY);
                    if (distance < minDistanceToCenter) {
                        minDistanceToCenter = distance;
                        activeSectionId = sectionId;
                    }
                }
                link.classList.remove('active');
            }
        });

        if (activeSectionId) {
            const activeLink = document.querySelector(`.nav-link[href="${activeSectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        } else if (window.pageYOffset < window.innerHeight / 3) {
            const firstNavLink = document.querySelector('.nav-link[href="#hero"]') || document.querySelector('.nav-link');
            if(firstNavLink) firstNavLink.classList.add('active');
        }
    }
    if (navLinks.length > 0) highlightNavLinkOnScroll();

    // --- Hero Carousel ---
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        const slides = heroCarousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-nav-btn.side-prev');
        const nextBtn = document.querySelector('.carousel-nav-btn.side-next');
        let currentSlide = 0;
        let slideInterval;
        const showSlide = (index) => { slides.forEach((s, i) => s.classList.toggle('active', i === index)); currentSlide = index; };
        const next = () => showSlide((currentSlide + 1) % slides.length);
        const prev = () => showSlide((currentSlide - 1 + slides.length) % slides.length);
        if (slides.length > 1) {
            if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetInterval(); });
            if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetInterval(); });
            const startInterval = () => slideInterval = setInterval(next, 7000);
            const resetInterval = () => { clearInterval(slideInterval); startInterval(); };
            startInterval(); showSlide(0);
        } else if (slides.length === 1) { showSlide(0); if(prevBtn) prevBtn.style.display = 'none'; if(nextBtn) nextBtn.style.display = 'none';}
    }

    // --- Research Section - INFINITE Advanced Carousel ---
    const researchScroller = document.querySelector('.horizontal-scroll-wrapper');
    if (researchScroller) {
        const itemsContainer = researchScroller.querySelector('.research-items-container');
        const domDisplaySlots = Array.from(itemsContainer.querySelectorAll('.research-item'));
        const prevArrow = researchScroller.querySelector('.hs-arrow.prev');
        const nextArrow = researchScroller.querySelector('.hs-arrow.next');

        const researchData = [
            { id: "proj1", title: "Project Alpha", subtitle: "Quantum Entanglement", imgSrc: "https://images.unsplash.com/photo-1617957689187-9929f580a63e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60", modalImgSrc: "https://images.unsplash.com/photo-1617957689187-9929f580a63e?auto=format&fit=crop&w=800&q=60", details: "Detailed exploration of quantum entanglement phenomena using advanced simulation techniques. This project involved developing new algorithms for many-body systems and resulted in significant insights into non-local correlations. Built with Python, NumPy, and custom C++ extensions for performance critical parts. Visualizations were created using Matplotlib and Mayavi." },
            { id: "proj2", title: "Project Beta", subtitle: "Dark Matter Simulation", imgSrc: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60", modalImgSrc: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=60", details: "Large-scale N-body simulations to investigate the distribution and properties of dark matter halos. This project utilized high-performance computing clusters (MPI, OpenMP) and advanced statistical analysis tools like pandas and scikit-learn in Python. Results were published in ApJ." },
            { id: "proj3", title: "Project Gamma", subtitle: "Gravitational Waves", imgSrc: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60", modalImgSrc: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800&q=60", details: "Analysis of gravitational wave data from LIGO/Virgo collaborations to detect and characterize black hole mergers. Developed signal processing pipelines and applied machine learning techniques for noise reduction and event classification." },
            { id: "proj4", title: "Project Delta", subtitle: "Condensed Matter", imgSrc: "https://images.unsplash.com/photo-1633094234903-377eea001933?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60", modalImgSrc: "https://images.unsplash.com/photo-1633094234903-377eea001933?auto=format&fit=crop&w=800&q=60", details: "Theoretical modeling of exotic phases in condensed matter systems, focusing on topological insulators and their potential applications in quantum computing. Employed analytical methods and numerical simulations using Mathematica and custom Fortran codes." },
            { id: "proj5", title: "Project Epsilon", subtitle: "Musical Harmonics", imgSrc: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60", modalImgSrc: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60", details: "An interdisciplinary project exploring the mathematical and physical underpinnings of musical harmony and dissonance. Developed interactive visualizations using JavaScript (p5.js) to demonstrate wave interference and Fourier analysis in sound." },
            { id: "proj6", title: "Project Zeta", subtitle: "Astroinformatics", imgSrc: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60", modalImgSrc: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=60", details: "Developing new machine learning algorithms for classifying astronomical objects from large survey data. Focus on scalability and interpretability of models." }
        ];

        let currentDataIndex = 0;
        const SPREAD_FACTOR = 0.9; // ADJUST THIS FOR SPACING
        const NUM_DISPLAY_SLOTS = domDisplaySlots.length;
        const CENTER_SLOT_INDEX = Math.floor(NUM_DISPLAY_SLOTS / 2);

        const updateCarouselStylesAndContent = () => {
            if (researchData.length === 0 || NUM_DISPLAY_SLOTS === 0) return;
            const itemWidth = domDisplaySlots[0].offsetWidth;

            domDisplaySlots.forEach((slot, slotIndex) => {
                const offsetFromCenterSlot = slotIndex - CENTER_SLOT_INDEX;
                let dataIdxToShow = (currentDataIndex + offsetFromCenterSlot % researchData.length + researchData.length) % researchData.length;
                const project = researchData[dataIdxToShow];

                const bgDiv = slot.querySelector('.research-item-bg');
                const titleH3 = slot.querySelector('.research-item-content h3');
                const subtitleP = slot.querySelector('.research-item-content p');

                // Update content
                if (slot.dataset.currentDataId !== project.id) { // Update content only if data changed
                    if (bgDiv) bgDiv.style.backgroundImage = `url('${project.imgSrc}')`;
                    if (titleH3) titleH3.textContent = project.title;
                    if (subtitleP) subtitleP.textContent = project.subtitle;
                    slot.dataset.currentDataId = project.id; // Track current data
                }
                
                slot.dataset.title = project.title;
                slot.dataset.imgSrc = project.modalImgSrc || project.imgSrc;
                slot.dataset.details = project.details;
                if (project.link) slot.dataset.link = project.link; else delete slot.dataset.link;
                
                // Apply visual styles
                let translateX = offsetFromCenterSlot * (itemWidth * SPREAD_FACTOR);
                let scale = 1, opacity = 1, blur = 0;
                let zIndex = NUM_DISPLAY_SLOTS - Math.abs(offsetFromCenterSlot);

                if (researchScroller.classList.contains('is-visible') && researchScroller.classList.contains('has-initialized')) {
                    // Normal coverflow active styling
                    if (offsetFromCenterSlot !== 0) {
                        scale = 0.82; opacity = 0.55; blur = 2.5;
                        const perspectivePush = itemWidth * 0.08 * Math.abs(offsetFromCenterSlot);
                        translateX += offsetFromCenterSlot > 0 ? perspectivePush : -perspectivePush;
                    } else {
                        scale = 1.0; opacity = 1; blur = 0; zIndex = NUM_DISPLAY_SLOTS + 1;
                    }
                } else if (researchScroller.classList.contains('is-visible')) {
                    // Gathering animation: items animate TO these calculated "normal" coverflow styles
                    // The initial "scattered" styles are in CSS for :not(.is-visible)
                    // So, here we calculate target styles for the gather.
                     if (offsetFromCenterSlot !== 0) {
                        scale = 0.82; opacity = 0.55; blur = 2.5; // Target for side items after gather
                        const perspectivePush = itemWidth * 0.08 * Math.abs(offsetFromCenterSlot);
                        translateX += offsetFromCenterSlot > 0 ? perspectivePush : -perspectivePush;
                    } else { // Center item
                        scale = 1.0; opacity = 1; blur = 0; zIndex = NUM_DISPLAY_SLOTS + 1; // Target for center after gather
                    }
                } else {
                    // Fallback if somehow called when not visible (shouldn't happen with observer logic)
                    // This will be overridden by CSS :not(.is-visible) if parent isn't visible
                    opacity = 0;
                    scale = 0.7;
                }
                
                slot.style.transform = `translateX(calc(-50% + ${translateX}px)) translateY(-50%) scale(${scale})`;
                slot.style.opacity = opacity;
                slot.style.filter = `blur(${blur}px)`;
                slot.style.zIndex = zIndex;
                slot.classList.toggle('is-active-center', offsetFromCenterSlot === 0);
            });
        };

        if (researchData.length > 0 && NUM_DISPLAY_SLOTS > 0) {
            domDisplaySlots.forEach(slot => {
                slot.style.position = 'absolute';
                slot.style.left = '50%';
            });

            if (prevArrow) prevArrow.addEventListener('click', () => {
                if (!researchScroller.classList.contains('has-initialized')) researchScroller.classList.add('has-initialized');
                currentDataIndex = (currentDataIndex - 1 + researchData.length) % researchData.length;
                updateCarouselStylesAndContent();
            });
            if (nextArrow) nextArrow.addEventListener('click', () => {
                if (!researchScroller.classList.contains('has-initialized')) researchScroller.classList.add('has-initialized');
                currentDataIndex = (currentDataIndex + 1) % researchData.length;
                updateCarouselStylesAndContent();
            });
            
            currentDataIndex = 0;
            // Initial call to set content and target styles is now handled by the Intersection Observer
            // to allow the "gathering" animation to occur from CSS initial states.
            window.addEventListener('resize', updateCarouselStylesAndContent);
        } else {
            if(prevArrow) prevArrow.style.display = 'none';
            if(nextArrow) nextArrow.style.display = 'none';
        }
         // 页面加载时立即触发聚拢动画，不必等待滚动或点击
        researchScroller.classList.add('is-visible', 'has-initialized');
        updateCarouselStylesAndContent();
    }

    // --- Generic Modal Functionality ---
    const modalContainer = document.getElementById('generic-modal');
    if (modalContainer) {
        const modalCloseBtn = modalContainer.querySelector('.modal-close-btn');
        const modalTitleEl = document.getElementById('modal-title-content');
        const modalImageEl = document.getElementById('modal-image-content');
        const modalDetailsEl = document.getElementById('modal-details-content');
        const modalAuthorsEl = document.getElementById('modal-authors-content');
        const modalJournalEl = document.getElementById('modal-journal-content');
        const modalLinkEl = document.getElementById('modal-link-content');
        const modalDialog    = modalContainer.querySelector('.modal-dialog');
        openModal = (data) => {
            modalDialog.scrollTop = 0;
            modalTitleEl.innerHTML   = data.title || '';
            modalImageEl.style.display = data.imgSrc ? 'block' : 'none';
            if(data.imgSrc) modalImageEl.src = data.imgSrc;
            modalImageEl.alt = data.title || 'Modal Image';
            modalDetailsEl.innerHTML = data.details || data.abstract || '';
            modalAuthorsEl.style.display = data.authors ? 'block' : 'none';
            if(data.authors) modalAuthorsEl.innerHTML = `<strong>Authors:</strong> ${data.authors}`;
            modalJournalEl.style.display = data.journal ? 'block' : 'none';
            if(data.journal) modalJournalEl.innerHTML = `<em>${data.journal}</em>`;
            modalLinkEl.style.display = (data.link || data.doiLink) ? 'inline-block' : 'none';
            if(data.link || data.doiLink) modalLinkEl.href = data.link || data.doiLink;
            modalContainer.classList.add('active'); body.style.overflow = 'hidden';
        };
        const closeModal = () => { modalContainer.classList.remove('active'); body.style.overflow = ''; };
        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalContainer.classList.contains('active')) closeModal(); });
        document.addEventListener('click', function(event) {
            const trigger = event.target.closest('[data-title]');
            if (trigger && trigger.closest('.research-item, .publication-entry')) {
                const data = { ...trigger.dataset }; openModal(data);
            }
        });
    }

    // --- Animate on Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-from-left, .animate-slide-from-right, .horizontal-scroll-wrapper');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Specific logic for research wrapper gather animation
                if (entry.target.classList.contains('horizontal-scroll-wrapper') && !entry.target.classList.contains('has-initialized')) {
                    // Call updateCarouselStylesAndContent WITHOUT a delay here.
                    // This sets the TARGET styles for the items.
                    // CSS will animate from the :not(.is-visible) state to these target styles.
                    updateCarouselStylesAndContent(); 
                    entry.target.classList.add('has-initialized');
                }
            } else {
                entry.target.classList.remove('is-visible');
                if (entry.target.classList.contains('horizontal-scroll-wrapper')) {
                    entry.target.classList.remove('has-initialized');
                }
            }
        });
    }, { threshold: 0.1 }); 
    
    animatedElements.forEach(el => observer.observe(el));

    // --- Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear().toString();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
     contactForm.addEventListener('submit', function(e) {
         e.preventDefault();
         const formData = new FormData(contactForm);
         fetch(contactForm.action, {
             method: 'POST',
             body: formData,
             headers: { 'Accept': 'application/json' }
         })
         .then(response => {
             if (response.ok) {
                 openModal({
                     title: 'Thank you!',
                     details: 'Your message has been sent. I will get back to you soon.'
                 });
                 contactForm.reset();
             } else {
                 response.json().then(data => {
                     openModal({
                         title: 'Oops!',
                         details: data.error || 'There was a problem submitting the form.'
                     });
                 });
             }
         })
         .catch(() => {
             openModal({
                 title: 'Oops!',
                 details: 'There was a problem submitting the form.'
             });
         });
    });
    }
});