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
        let currentHighlightedIndex = 2; // Default to center item (index 2 of 5 visible items)
        let isAnimating = false; // Prevent multiple animations at once
        const SPREAD_FACTOR = 0.9;
        const NUM_DISPLAY_SLOTS = domDisplaySlots.length;
        const CENTER_SLOT_INDEX = Math.floor(NUM_DISPLAY_SLOTS / 2);

        const updateCarouselStylesAndContent = (animationStep = 0, totalSteps = 1) => {
            if (researchData.length === 0 || NUM_DISPLAY_SLOTS === 0) return;
            const itemWidth = domDisplaySlots[0].offsetWidth;

            // Calculate the interpolated data index for smooth animation
            const interpolatedDataIndex = animationStep === 0 ? currentDataIndex : 
                Math.floor(currentDataIndex + (animationStep / totalSteps) * 0); // Will be updated in animation function

            domDisplaySlots.forEach((slot, slotIndex) => {
                const offsetFromCenterSlot = slotIndex - CENTER_SLOT_INDEX;
                let dataIdxToShow = (interpolatedDataIndex + offsetFromCenterSlot % researchData.length + researchData.length) % researchData.length;
                const project = researchData[dataIdxToShow];

                const bgDiv = slot.querySelector('.research-item-bg');
                const titleH3 = slot.querySelector('.research-item-content h3');
                const subtitleP = slot.querySelector('.research-item-content p');

                // Update content only if data changed and not during animation
                if (animationStep === 0 && slot.dataset.currentDataId !== project.id) {
                    if (bgDiv) bgDiv.style.backgroundImage = `url('${project.imgSrc}')`;
                    if (titleH3) titleH3.textContent = project.title;
                    if (subtitleP) subtitleP.textContent = project.subtitle;
                    slot.dataset.currentDataId = project.id;
                }
                
                if (animationStep === 0) {
                    slot.dataset.title = project.title;
                    slot.dataset.imgSrc = project.modalImgSrc || project.imgSrc;
                    slot.dataset.details = project.details;
                    if (project.link) slot.dataset.link = project.link; else delete slot.dataset.link;
                }
                
                // Apply visual styles
                let translateX = offsetFromCenterSlot * (itemWidth * SPREAD_FACTOR);
                let scale = 1, opacity = 1, blur = 0;
                let zIndex = NUM_DISPLAY_SLOTS - Math.abs(offsetFromCenterSlot);

                if (researchScroller.classList.contains('is-visible')) {
                    // Check if this item should be highlighted
                    const isHighlighted = slotIndex === currentHighlightedIndex;
                    
                    if (!isHighlighted) {
                        scale = 0.82; 
                        opacity = 0.55; 
                        blur = 2.5;
                        const perspectivePush = itemWidth * 0.08 * Math.abs(offsetFromCenterSlot);
                        translateX += offsetFromCenterSlot > 0 ? perspectivePush : -perspectivePush;
                    } else {
                        scale = 1.0; 
                        opacity = 1; 
                        blur = 0; 
                        zIndex = NUM_DISPLAY_SLOTS + 1;
                    }
                } else {
                    opacity = 0;
                    scale = 0.7;
                }
                
                slot.style.transform = `translateX(calc(-50% + ${translateX}px)) translateY(-50%) scale(${scale})`;
                slot.style.opacity = opacity;
                slot.style.filter = `blur(${blur}px)`;
                slot.style.zIndex = zIndex;
                slot.classList.toggle('is-active-center', slotIndex === currentHighlightedIndex);
            });
        };

        const animateSlide = (direction, callback) => {
            if (isAnimating) return;
            isAnimating = true;
            
            // Get the currently highlighted project ID before animation
            const currentHighlightedSlot = domDisplaySlots[currentHighlightedIndex];
            const highlightedProjectId = currentHighlightedSlot.dataset.currentDataId;
            
            // Always slide by 1 position
            const slideDistance = 1;
            
            const startDataIndex = currentDataIndex;
            const endDataIndex = direction === 'next' ? 
                (currentDataIndex + slideDistance) % researchData.length : 
                (currentDataIndex - slideDistance + researchData.length) % researchData.length;
            
            const animationDuration = 800; // milliseconds
            const startTime = performance.now();
            const itemWidth = domDisplaySlots[0].offsetWidth;
            
            // Calculate the total slide distance in pixels
            const totalSlideDistance = slideDistance * (itemWidth * SPREAD_FACTOR);
            const slideDirection = direction === 'next' ? -1 : 1; // next = slide left (negative), prev = slide right (positive)
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                // Smooth easing function (ease-in-out)
                const easedProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                // Calculate current slide offset
                const currentSlideOffset = totalSlideDistance * easedProgress * slideDirection;
                
                // Calculate the interpolated data index for smooth content transitions
                const interpolatedDataIndex = startDataIndex + (slideDistance * easedProgress * (direction === 'next' ? 1 : -1));
                
                // Update currentHighlightedIndex immediately based on where the highlighted project currently is
                domDisplaySlots.forEach((slot, slotIndex) => {
                    const offsetFromCenterSlot = slotIndex - CENTER_SLOT_INDEX;
                    let dataIdxToShow = Math.round(interpolatedDataIndex + offsetFromCenterSlot);
                    dataIdxToShow = ((dataIdxToShow % researchData.length) + researchData.length) % researchData.length;
                    const project = researchData[dataIdxToShow];
                    
                    if (project.id === highlightedProjectId) {
                        currentHighlightedIndex = slotIndex;
                    }
                });
                
                domDisplaySlots.forEach((slot, slotIndex) => {
                    const offsetFromCenterSlot = slotIndex - CENTER_SLOT_INDEX;
                    
                    // Calculate which project should be shown based on interpolated position
                    let dataIdxToShow = Math.round(interpolatedDataIndex + offsetFromCenterSlot);
                    dataIdxToShow = ((dataIdxToShow % researchData.length) + researchData.length) % researchData.length;
                    const project = researchData[dataIdxToShow];
                    
                    // Update content if it has changed
                    const bgDiv = slot.querySelector('.research-item-bg');
                    const titleH3 = slot.querySelector('.research-item-content h3');
                    const subtitleP = slot.querySelector('.research-item-content p');
                    
                    if (slot.dataset.currentDataId !== project.id) {
                        if (bgDiv) bgDiv.style.backgroundImage = `url('${project.imgSrc}')`;
                        if (titleH3) titleH3.textContent = project.title;
                        if (subtitleP) subtitleP.textContent = project.subtitle;
                        slot.dataset.currentDataId = project.id;
                        slot.dataset.title = project.title;
                        slot.dataset.imgSrc = project.modalImgSrc || project.imgSrc;
                        slot.dataset.details = project.details;
                        if (project.link) slot.dataset.link = project.link; else delete slot.dataset.link;
                    }
                    
                    // Calculate smooth position with fractional offset for continuous movement
                    const fractionalOffset = interpolatedDataIndex - Math.floor(interpolatedDataIndex);
                    let translateX = (offsetFromCenterSlot - fractionalOffset) * (itemWidth * SPREAD_FACTOR);
                    
                    // Apply visual styles
                    let scale = 1, opacity = 1, blur = 0;
                    let zIndex = NUM_DISPLAY_SLOTS - Math.abs(offsetFromCenterSlot);
                    
                    // Use the updated currentHighlightedIndex for immediate highlighting
                    const isHighlighted = slotIndex === currentHighlightedIndex;
                    
                    if (researchScroller.classList.contains('is-visible')) {
                        if (!isHighlighted) {
                            scale = 0.82; 
                            opacity = 0.55; 
                            blur = 2.5;
                            const perspectivePush = itemWidth * 0.08 * Math.abs(offsetFromCenterSlot);
                            translateX += offsetFromCenterSlot > 0 ? perspectivePush : -perspectivePush;
                        } else {
                            scale = 1.0; 
                            opacity = 1; 
                            blur = 0;
                            zIndex = NUM_DISPLAY_SLOTS + 1;
                        }
                    }
                    
                    slot.style.transform = `translateX(calc(-50% + ${translateX}px)) translateY(-50%) scale(${scale})`;
                    slot.style.opacity = opacity;
                    slot.style.filter = `blur(${blur}px)`;
                    slot.style.zIndex = zIndex;
                    slot.classList.toggle('is-active-center', isHighlighted);
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Animation complete - update final state
                    currentDataIndex = endDataIndex;
                    
                    // Find where the highlighted project ended up
                    domDisplaySlots.forEach((slot, slotIndex) => {
                        if (slot.dataset.currentDataId === highlightedProjectId) {
                            currentHighlightedIndex = slotIndex;
                        }
                    });
                    
                    isAnimating = false;
                    updateCarouselStylesAndContent(); // Final update to ensure correct state
                    if (callback) callback();
                }
            };
            
            requestAnimationFrame(animate);
        };

        if (researchData.length > 0 && NUM_DISPLAY_SLOTS > 0) {
            domDisplaySlots.forEach(slot => {
                slot.style.position = 'absolute';
                slot.style.left = '50%';
            });

            // Arrow click handlers - instant transition without animation
            if (prevArrow) prevArrow.addEventListener('click', () => {
                if (!researchScroller.classList.contains('has-initialized')) researchScroller.classList.add('has-initialized');
                if (isAnimating) return; // Prevent clicks during any ongoing animations
                
                // Get the currently highlighted project ID
                const currentHighlightedSlot = domDisplaySlots[currentHighlightedIndex];
                const highlightedProjectId = currentHighlightedSlot.dataset.currentDataId;
                
                // Update data index immediately
                currentDataIndex = (currentDataIndex - 1 + researchData.length) % researchData.length;
                
                // Update content and find new highlighted position
                updateCarouselStylesAndContent();
                
                // Find where the highlighted project ended up
                domDisplaySlots.forEach((slot, slotIndex) => {
                    if (slot.dataset.currentDataId === highlightedProjectId) {
                        currentHighlightedIndex = slotIndex;
                    }
                });
                
                // Final update with correct highlighting
                updateCarouselStylesAndContent();
            });
            if (nextArrow) nextArrow.addEventListener('click', () => {
                if (!researchScroller.classList.contains('has-initialized')) researchScroller.classList.add('has-initialized');
                if (isAnimating) return; // Prevent clicks during any ongoing animations
                
                // Get the currently highlighted project ID
                const currentHighlightedSlot = domDisplaySlots[currentHighlightedIndex];
                const highlightedProjectId = currentHighlightedSlot.dataset.currentDataId;
                
                // Update data index immediately
                currentDataIndex = (currentDataIndex + 1) % researchData.length;
                
                // Update content and find new highlighted position
                updateCarouselStylesAndContent();
                
                // Find where the highlighted project ended up
                domDisplaySlots.forEach((slot, slotIndex) => {
                    if (slot.dataset.currentDataId === highlightedProjectId) {
                        currentHighlightedIndex = slotIndex;
                    }
                });
                
                // Final update with correct highlighting
                updateCarouselStylesAndContent();
            });

            // Hover-based highlighting
            domDisplaySlots.forEach((slot, index) => {
                slot.addEventListener('mouseenter', () => {
                    currentHighlightedIndex = index;
                    updateCarouselStylesAndContent();
                });
            });

            // Click handler for highlighted items
            itemsContainer.addEventListener('click', (event) => {
                const clickedItem = event.target.closest('.research-item');
                if (!clickedItem) return;

                const clickedIndex = domDisplaySlots.indexOf(clickedItem);
                if (clickedIndex === currentHighlightedIndex && openModal) {
                    // Highlighted item was clicked, open modal
                    const data = { ...clickedItem.dataset };
                    openModal(data);
                }
            });
            
            window.addEventListener('resize', updateCarouselStylesAndContent);
        } else {
            if(prevArrow) prevArrow.style.display = 'none';
            if(nextArrow) nextArrow.style.display = 'none';
        }
        
        // Initialize with center item highlighted
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
        
        // Modal trigger for publications ONLY. Research items are handled in their own section.
        document.addEventListener('click', function(event) {
            const trigger = event.target.closest('.publication-entry[data-title]');
            if (trigger) {
                const data = { ...trigger.dataset }; 
                if (openModal) openModal(data);
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

    // --- Tools Section ---
    // Custom Select Dropdown Functionality
    function initializeCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');
        
        customSelects.forEach(select => {
            const selected = select.querySelector('.select-selected');
            const items = select.querySelector('.select-items');
            const options = items.querySelectorAll('div[data-value]');
            
            // Click on selected to toggle dropdown
            selected.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other dropdowns
                customSelects.forEach(other => {
                    if (other !== select) {
                        other.classList.remove('active');
                    }
                });
                // Toggle current dropdown
                select.classList.toggle('active');
            });
            
            // Click on option to select
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Update selected display
                    selected.textContent = option.textContent;
                    
                    // Update selected class
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    // Close dropdown
                    select.classList.remove('active');
                    
                    // Get the unit value and trigger conversion
                    const unitValue = option.getAttribute('data-value');
                    const target = select.getAttribute('data-target');
                    
                    // Store the current value for the converter functions
                    select.currentValue = unitValue;
                    
                    // Trigger appropriate conversion
                    triggerConversion(target);
                });
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            customSelects.forEach(select => {
                select.classList.remove('active');
            });
        });
    }
    
    // Helper function to get current unit value
    function getCurrentUnit(target) {
        const select = document.querySelector(`[data-target="${target}"]`);
        return select ? select.currentValue : null;
    }
    
    // Helper function to trigger conversions
    function triggerConversion(target) {
        switch(target) {
            case 'energy-unit':
            case 'temperature-unit':
            case 'wavelength-unit':
            case 'frequency-unit':
            case 'wavenumber-unit':
                if (energyInput && energyInput.value) updateFromEnergy();
                else if (temperatureInput && temperatureInput.value) updateFromTemperature();
                else if (wavelengthInput && wavelengthInput.value) updateFromWavelength();
                else if (frequencyInput && frequencyInput.value) updateFromFrequency();
                else if (wavenumberInput && wavenumberInput.value) updateFromWavenumber();
                break;
            case 'beam-wavelength-unit':
            case 'beam-waist-unit':
            case 'rayleigh-unit':
            case 'divergence-unit':
            case 'distance-unit':
            case 'beam-radius-unit':
                if (typeof calculateGaussianBeam === 'function') calculateGaussianBeam();
                break;
        }
    }

    // Tools Navigation
    const toolsNavBtns = document.querySelectorAll('.tools-nav-btn');
    const toolPanels = document.querySelectorAll('.tool-panel');

    if (toolsNavBtns.length > 0 && toolPanels.length > 0) {
        toolsNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTool = btn.getAttribute('data-tool');
                
                // Remove active class from all nav buttons
                toolsNavBtns.forEach(navBtn => navBtn.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Hide all tool panels
                toolPanels.forEach(panel => panel.classList.remove('active'));
                
                // Show target tool panel
                const targetPanel = document.getElementById(`tool-${targetTool}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // Initialize custom selects
    initializeCustomSelects();

    // Ultimate Converter: Energy ⇄ Temperature ⇄ Wavelength ⇄ Frequency ⇄ Wavenumber
    const energyInput = document.getElementById('energy-input');
    const temperatureInput = document.getElementById('temperature-input');
    const wavelengthInput = document.getElementById('wavelength-input');
    const frequencyInput = document.getElementById('frequency-input');
    const wavenumberInput = document.getElementById('wavenumber-input');

    if (energyInput && temperatureInput && wavelengthInput && frequencyInput && wavenumberInput) {
        // Physical constants
        const kB = 8.617333262145e-5; // Boltzmann constant in eV/K
        const h = 4.135667696e-15; // Planck constant in eV·s
        const c = 2.998e8; // Speed of light in m/s

        // Unit conversion factors to eV
        const energyFactors = {
            'meV': 1e-3,
            'eV': 1,
            'keV': 1e3,
            'MeV': 1e6,
            'J': 6.242e18  // Joule to eV
        };

        // Unit conversion factors to K
        const temperatureFactors = {
            'K': 1,
            '°C': 1  // Will handle Celsius conversion separately
        };

        // Unit conversion factors for wavelength (to m)
        const wavelengthFactors = {
            'pm': 1e-12,
            'nm': 1e-9,
            'μm': 1e-6,
            'mm': 1e-3,
            'cm': 1e-2,
            'm': 1,
            'km': 1e3
        };

        // Unit conversion factors for frequency (to Hz)
        const frequencyFactors = {
            'mHz': 1e-3,
            'Hz': 1,
            'kHz': 1e3,
            'MHz': 1e6,
            'GHz': 1e9,
            'THz': 1e12,
            'PHz': 1e15
        };

        // Unit conversion factors for wavenumber (to m^-1)
        const wavenumberFactors = {
            'mm-1': 1e3,
            'cm-1': 1e2,
            'm-1': 1
        };

        let lastUltimateChanged = null;

        function updateFromEnergy() {
            if (lastUltimateChanged === 'energy') return;
            lastUltimateChanged = 'energy';

            const energyValue = parseFloat(energyInput.value);
            if (isNaN(energyValue) || energyValue === '') return;

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';

            const energyInEv = energyValue * energyFactors[energyUnit];
            
            // Convert to temperature: T = E / kB
            let tempInK = energyInEv / kB;
            let tempInTargetUnit = tempInK;
            if (tempUnit === '°C') {
                tempInTargetUnit = tempInK - 273.15;
            }
            
            // Convert to wavelength: λ = hc / E
            const wavelengthInM = (h * c) / energyInEv;
            const wavelengthInTargetUnit = wavelengthInM / wavelengthFactors[wavelengthUnit];
            
            // Convert to frequency: f = E / h
            const frequencyInHz = energyInEv / h;
            const frequencyInTargetUnit = frequencyInHz / frequencyFactors[frequencyUnit];
            
            // Convert to wavenumber: k = E / (hc)
            const wavenumberInM = energyInEv / (h * c);
            const wavenumberInTargetUnit = wavenumberInM / wavenumberFactors[wavenumberUnit];

            temperatureInput.value = tempInTargetUnit.toExponential(4);
            wavelengthInput.value = wavelengthInTargetUnit.toExponential(4);
            frequencyInput.value = frequencyInTargetUnit.toExponential(4);
            wavenumberInput.value = wavenumberInTargetUnit.toExponential(4);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromTemperature() {
            if (lastUltimateChanged === 'temperature') return;
            lastUltimateChanged = 'temperature';

            const tempValue = parseFloat(temperatureInput.value);
            if (isNaN(tempValue) || tempValue === '') return;

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';

            let tempInK = tempValue;
            if (tempUnit === '°C') {
                tempInK = tempValue + 273.15;
            }
            
            const energyInEv = tempInK * kB;
            const energyInTargetUnit = energyInEv / energyFactors[energyUnit];
            
            // Convert to wavelength: λ = hc / E
            const wavelengthInM = (h * c) / energyInEv;
            const wavelengthInTargetUnit = wavelengthInM / wavelengthFactors[wavelengthUnit];
            
            // Convert to frequency: f = E / h
            const frequencyInHz = energyInEv / h;
            const frequencyInTargetUnit = frequencyInHz / frequencyFactors[frequencyUnit];
            
            // Convert to wavenumber: k = E / (hc)
            const wavenumberInM = energyInEv / (h * c);
            const wavenumberInTargetUnit = wavenumberInM / wavenumberFactors[wavenumberUnit];

            energyInput.value = energyInTargetUnit.toExponential(4);
            wavelengthInput.value = wavelengthInTargetUnit.toExponential(4);
            frequencyInput.value = frequencyInTargetUnit.toExponential(4);
            wavenumberInput.value = wavenumberInTargetUnit.toExponential(4);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromWavelength() {
            if (lastUltimateChanged === 'wavelength') return;
            lastUltimateChanged = 'wavelength';

            const wavelengthValue = parseFloat(wavelengthInput.value);
            if (isNaN(wavelengthValue) || wavelengthValue === '') return;

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';

            const wavelengthInM = wavelengthValue * wavelengthFactors[wavelengthUnit];
            
            // Convert to energy: E = hc / λ
            const energyInEv = (h * c) / wavelengthInM;
            const energyInTargetUnit = energyInEv / energyFactors[energyUnit];
            
            // Convert to temperature: T = E / kB
            let tempInK = energyInEv / kB;
            let tempInTargetUnit = tempInK;
            if (tempUnit === '°C') {
                tempInTargetUnit = tempInK - 273.15;
            }
            
            // Convert to frequency: f = c / λ
            const frequencyInHz = c / wavelengthInM;
            const frequencyInTargetUnit = frequencyInHz / frequencyFactors[frequencyUnit];
            
            // Convert to wavenumber: k = 1 / λ
            const wavenumberInM = 1 / wavelengthInM;
            const wavenumberInTargetUnit = wavenumberInM / wavenumberFactors[wavenumberUnit];

            energyInput.value = energyInTargetUnit.toExponential(4);
            temperatureInput.value = tempInTargetUnit.toExponential(4);
            frequencyInput.value = frequencyInTargetUnit.toExponential(4);
            wavenumberInput.value = wavenumberInTargetUnit.toExponential(4);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromFrequency() {
            if (lastUltimateChanged === 'frequency') return;
            lastUltimateChanged = 'frequency';

            const frequencyValue = parseFloat(frequencyInput.value);
            if (isNaN(frequencyValue) || frequencyValue === '') return;

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';

            const frequencyInHz = frequencyValue * frequencyFactors[frequencyUnit];
            
            // Convert to energy: E = hf
            const energyInEv = h * frequencyInHz;
            const energyInTargetUnit = energyInEv / energyFactors[energyUnit];
            
            // Convert to temperature: T = E / kB
            let tempInK = energyInEv / kB;
            let tempInTargetUnit = tempInK;
            if (tempUnit === '°C') {
                tempInTargetUnit = tempInK - 273.15;
            }
            
            // Convert to wavelength: λ = c / f
            const wavelengthInM = c / frequencyInHz;
            const wavelengthInTargetUnit = wavelengthInM / wavelengthFactors[wavelengthUnit];
            
            // Convert to wavenumber: k = f / c
            const wavenumberInM = frequencyInHz / c;
            const wavenumberInTargetUnit = wavenumberInM / wavenumberFactors[wavenumberUnit];

            energyInput.value = energyInTargetUnit.toExponential(4);
            temperatureInput.value = tempInTargetUnit.toExponential(4);
            wavelengthInput.value = wavelengthInTargetUnit.toExponential(4);
            wavenumberInput.value = wavenumberInTargetUnit.toExponential(4);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromWavenumber() {
            if (lastUltimateChanged === 'wavenumber') return;
            lastUltimateChanged = 'wavenumber';

            const wavenumberValue = parseFloat(wavenumberInput.value);
            if (isNaN(wavenumberValue) || wavenumberValue === '') return;

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';

            const wavenumberInM = wavenumberValue * wavenumberFactors[wavenumberUnit];
            
            // Convert to wavelength: λ = 1 / k
            const wavelengthInM = 1 / wavenumberInM;
            const wavelengthInTargetUnit = wavelengthInM / wavelengthFactors[wavelengthUnit];
            
            // Convert to energy: E = hck
            const energyInEv = h * c * wavenumberInM;
            const energyInTargetUnit = energyInEv / energyFactors[energyUnit];
            
            // Convert to temperature: T = E / kB
            let tempInK = energyInEv / kB;
            let tempInTargetUnit = tempInK;
            if (tempUnit === '°C') {
                tempInTargetUnit = tempInK - 273.15;
            }
            
            // Convert to frequency: f = c * k
            const frequencyInHz = c * wavenumberInM;
            const frequencyInTargetUnit = frequencyInHz / frequencyFactors[frequencyUnit];

            energyInput.value = energyInTargetUnit.toExponential(4);
            temperatureInput.value = tempInTargetUnit.toExponential(4);
            wavelengthInput.value = wavelengthInTargetUnit.toExponential(4);
            frequencyInput.value = frequencyInTargetUnit.toExponential(4);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        // Initialize default values for custom selects
        const energySelect = document.querySelector('[data-target="energy-unit"]');
        const temperatureSelect = document.querySelector('[data-target="temperature-unit"]');
        const wavelengthSelect = document.querySelector('[data-target="wavelength-unit"]');
        const frequencySelect = document.querySelector('[data-target="frequency-unit"]');
        const wavenumberSelect = document.querySelector('[data-target="wavenumber-unit"]');
        if (energySelect) energySelect.currentValue = 'eV';
        if (temperatureSelect) temperatureSelect.currentValue = 'K';
        if (wavelengthSelect) wavelengthSelect.currentValue = 'nm';
        if (frequencySelect) frequencySelect.currentValue = 'THz';
        if (wavenumberSelect) wavenumberSelect.currentValue = 'cm-1';

        energyInput.addEventListener('input', updateFromEnergy);
        temperatureInput.addEventListener('input', updateFromTemperature);
        wavelengthInput.addEventListener('input', updateFromWavelength);
        frequencyInput.addEventListener('input', updateFromFrequency);
        wavenumberInput.addEventListener('input', updateFromWavenumber);
    }

    // Gaussian Beam Calculator
    const beamWavelengthInput = document.getElementById('beam-wavelength-input');
    const beamWaistInput = document.getElementById('beam-waist-input');
    const rayleighRangeOutput = document.getElementById('rayleigh-range-output');
    const divergenceOutput = document.getElementById('divergence-output');
    const distanceInput = document.getElementById('distance-input');
    const beamRadiusOutput = document.getElementById('beam-radius-output');

    if (beamWavelengthInput && beamWaistInput && rayleighRangeOutput && divergenceOutput && distanceInput && beamRadiusOutput) {
        
        // Unit conversion factors for beam calculations
        const beamWavelengthFactors = {
            'nm': 1e-9,
            'μm': 1e-6,
            'mm': 1e-3
        };

        const beamSizeFactors = {
            'nm': 1e-9,
            'μm': 1e-6,
            'mm': 1e-3,
            'cm': 1e-2,
            'm': 1
        };

        const angleFactors = {
            'mrad': 1e-3,
            'rad': 1,
            'deg': Math.PI / 180
        };

        function calculateGaussianBeam() {
            const wavelengthValue = parseFloat(beamWavelengthInput.value);
            const beamWaistValue = parseFloat(beamWaistInput.value);
            
            if (isNaN(wavelengthValue) || isNaN(beamWaistValue) || wavelengthValue <= 0 || beamWaistValue <= 0) {
                rayleighRangeOutput.value = '';
                divergenceOutput.value = '';
                beamRadiusOutput.value = '';
                return;
            }

            const wavelengthUnit = getCurrentUnit('beam-wavelength-unit') || 'nm';
            const beamWaistUnit = getCurrentUnit('beam-waist-unit') || 'μm';
            const rayleighUnit = getCurrentUnit('rayleigh-unit') || 'mm';
            const divergenceUnit = getCurrentUnit('divergence-unit') || 'mrad';
            const distanceUnit = getCurrentUnit('distance-unit') || 'mm';
            const beamRadiusUnit = getCurrentUnit('beam-radius-unit') || 'μm';

            // Convert to base units (meters)
            const wavelengthInM = wavelengthValue * beamWavelengthFactors[wavelengthUnit];
            const beamWaistInM = beamWaistValue * beamSizeFactors[beamWaistUnit];

            // Calculate Rayleigh range: zR = π * w0^2 / λ
            const rayleighRangeInM = Math.PI * beamWaistInM * beamWaistInM / wavelengthInM;
            const rayleighRangeInTargetUnit = rayleighRangeInM / beamSizeFactors[rayleighUnit];

            // Calculate divergence: θ = λ / (π * w0)
            const divergenceInRad = wavelengthInM / (Math.PI * beamWaistInM);
            const divergenceInTargetUnit = divergenceInRad / angleFactors[divergenceUnit];

            rayleighRangeOutput.value = rayleighRangeInTargetUnit.toExponential(4);
            divergenceOutput.value = divergenceInTargetUnit.toExponential(4);

            // Calculate beam radius at distance if distance is provided
            const distanceValue = parseFloat(distanceInput.value);
            if (!isNaN(distanceValue) && distanceValue >= 0) {
                const distanceInM = distanceValue * beamSizeFactors[distanceUnit];
                
                // Calculate beam radius: w(z) = w0 * sqrt(1 + (z/zR)^2)
                const beamRadiusInM = beamWaistInM * Math.sqrt(1 + Math.pow(distanceInM / rayleighRangeInM, 2));
                const beamRadiusInTargetUnit = beamRadiusInM / beamSizeFactors[beamRadiusUnit];
                
                beamRadiusOutput.value = beamRadiusInTargetUnit.toExponential(4);
            } else {
                beamRadiusOutput.value = '';
            }
        }

        // Initialize default values for Gaussian beam calculator
        const beamWavelengthSelect = document.querySelector('[data-target="beam-wavelength-unit"]');
        const beamWaistSelect = document.querySelector('[data-target="beam-waist-unit"]');
        const rayleighSelect = document.querySelector('[data-target="rayleigh-unit"]');
        const divergenceSelect = document.querySelector('[data-target="divergence-unit"]');
        const distanceSelect = document.querySelector('[data-target="distance-unit"]');
        const beamRadiusSelect = document.querySelector('[data-target="beam-radius-unit"]');
        
        if (beamWavelengthSelect) beamWavelengthSelect.currentValue = 'nm';
        if (beamWaistSelect) beamWaistSelect.currentValue = 'μm';
        if (rayleighSelect) rayleighSelect.currentValue = 'mm';
        if (divergenceSelect) divergenceSelect.currentValue = 'mrad';
        if (distanceSelect) distanceSelect.currentValue = 'mm';
        if (beamRadiusSelect) beamRadiusSelect.currentValue = 'μm';

        beamWavelengthInput.addEventListener('input', calculateGaussianBeam);
        beamWaistInput.addEventListener('input', calculateGaussianBeam);
        distanceInput.addEventListener('input', calculateGaussianBeam);
    }


});