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
                
                // Remove focus from the clicked link to prevent persistent highlighting
                link.blur();
                
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
                
                // Update content and decide new highlighted position (move highlight to the left neighbor)
                updateCarouselStylesAndContent();
                
                let highlightedEndedAtIndex = null;
                domDisplaySlots.forEach((slot, slotIndex) => {
                    if (slot.dataset.currentDataId === highlightedProjectId) {
                        highlightedEndedAtIndex = slotIndex;
                    }
                });
                
                if (highlightedEndedAtIndex !== null) {
                    currentHighlightedIndex = Math.max(highlightedEndedAtIndex - 1, 0);
                } else {
                    currentHighlightedIndex = CENTER_SLOT_INDEX;
                }
                
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
                
                // Update content and decide new highlighted position (move highlight to the right neighbor)
                updateCarouselStylesAndContent();
                
                let highlightedEndedAtIndex = null;
                domDisplaySlots.forEach((slot, slotIndex) => {
                    if (slot.dataset.currentDataId === highlightedProjectId) {
                        highlightedEndedAtIndex = slotIndex;
                    }
                });
                
                if (highlightedEndedAtIndex !== null) {
                    currentHighlightedIndex = Math.min(highlightedEndedAtIndex + 1, NUM_DISPLAY_SLOTS - 1);
                } else {
                    currentHighlightedIndex = CENTER_SLOT_INDEX;
                }
                
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
    
    // Smart number formatting function
    function formatNumber(value) {
        if (isNaN(value) || value === null || value === undefined) return '';
        
        const absValue = Math.abs(value);
        
        // For very small numbers (< 0.00001) or very large numbers (>= 100000), use scientific notation
        if (absValue < 1e-5 || absValue >= 1e5) {
            return value.toExponential(4);
        }
        
        // For numbers that can be displayed normally
        if (absValue >= 1) {
            // For integers or numbers with few decimal places
            if (value === Math.floor(value)) {
                return value.toString(); // Integer
            } else {
                // Limit to 5 significant digits after decimal point
                const decimalPlaces = Math.max(0, 5 - Math.floor(Math.log10(absValue)) - 1);
                return value.toFixed(Math.min(decimalPlaces, 5));
            }
        } else {
            // For numbers between 0 and 1
            const decimalPlaces = Math.max(0, 5 - Math.floor(Math.log10(absValue)) - 1);
            return value.toFixed(Math.min(decimalPlaces, 5));
        }
    }
    
    // Helper function to trigger conversions
    function triggerConversion(target) {
        switch(target) {
            case 'energy-unit':
                if (energyInput && energyInput.value) updateFromEnergy();
                break;
            case 'temperature-unit':
                if (temperatureInput && temperatureInput.value) updateFromTemperature();
                break;
            case 'wavelength-unit':
                if (wavelengthInput && wavelengthInput.value) updateFromWavelength();
                break;
            case 'frequency-unit':
                if (frequencyInput && frequencyInput.value) updateFromFrequency();
                break;
            case 'wavenumber-unit':
                if (wavenumberInput && wavenumberInput.value) updateFromWavenumber();
                break;
            case 'time-unit':
                if (timeInput && timeInput.value) updateFromTime();
                break;
            case 'beam-wavelength-unit':
            case 'beam-waist-unit':
            case 'rayleigh-unit':
            case 'divergence-unit':
            case 'distance-unit':
            case 'beam-radius-unit':
                if (typeof calculateGaussianBeam === 'function') calculateGaussianBeam();
                break;
            case 'carrier-density-unit':
                if (carrierDensityInput && carrierDensityInput.value) updateFromCarrierDensity();
                break;
            case 'fermi-energy-unit':
                if (fermiEnergyInput && fermiEnergyInput.value) updateFromFermiEnergy();
                break;
            case 'fermi-wavenumber-unit':
                if (fermiWavenumberInput && fermiWavenumberInput.value) updateFromFermiWavenumber();
                break;
            case 'gate-voltage-sio2-unit':
                if (gateVoltageSiO2Input && gateVoltageSiO2Input.value) updateFromGateVoltageSiO2();
                break;
            case 'gate-voltage-hbn-unit':
                if (gateVoltageHBNInput && gateVoltageHBNInput.value) updateFromGateVoltageHBN();
                break;
            case 'sio2-thickness-unit':
                if (gateVoltageSiO2Input && gateVoltageSiO2Input.value) updateFromGateVoltageSiO2();
                break;
            case 'hbn-thickness-unit':
                if (gateVoltageHBNInput && gateVoltageHBNInput.value) updateFromGateVoltageHBN();
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

    // Ultimate Converter: Energy ⇄ Temperature ⇄ Wavelength ⇄ Frequency ⇄ Wavenumber ⇄ Time
    const energyInput = document.getElementById('energy-input');
    const temperatureInput = document.getElementById('temperature-input');
    const wavelengthInput = document.getElementById('wavelength-input');
    const frequencyInput = document.getElementById('frequency-input');
    const wavenumberInput = document.getElementById('wavenumber-input');
    const timeInput = document.getElementById('time-input');
    const spectralBandDisplay = document.getElementById('spectral-band-display');
    const bandNameElement = document.getElementById('band-name');
    const bandDescriptionElement = document.getElementById('band-description');

    if (energyInput && temperatureInput && wavelengthInput && frequencyInput && wavenumberInput && timeInput) {
        // Physical constants
        const kB = 8.617333262145e-5; // Boltzmann constant in eV/K
        const h = 4.135667696e-15; // Planck constant in eV·s
        const c = 2.998e8; // Speed of light in m/s

        // Spectral band definitions (wavelength in meters)
        // Based on the detailed electromagnetic spectrum table provided
        const spectralBands = [
            // Ultraviolet (UV)
            { name: "Extreme UV", min: 1e-9, max: 100e-9, description: "EUV: 1240–12.4 eV, 1–100 nm" },
            { name: "Vacuum UV", min: 100e-9, max: 190e-9, description: "VUV, UV-C: 12.4–6.53 eV, 100–190 nm" },
            { name: "Deep UV", min: 190e-9, max: 280e-9, description: "DUV, UV-C: 6.53–4.43 eV, 190–280 nm" },
            { name: "Mid UV", min: 280e-9, max: 315e-9, description: "UV-B: 4.43–3.94 eV, 280–315 nm" },
            { name: "Near UV", min: 315e-9, max: 380e-9, description: "UV-A: 3.94–3.26 eV, 315–380 nm" },
            
            // Visible (Vis)
            { name: "Violet", min: 380e-9, max: 435e-9, description: "3.26–2.85 eV, 380–435 nm" },
            { name: "Blue", min: 435e-9, max: 500e-9, description: "2.85–2.48 eV, 435–500 nm" },
            { name: "Cyan", min: 500e-9, max: 520e-9, description: "2.48–2.38 eV, 500–520 nm" },
            { name: "Green", min: 520e-9, max: 565e-9, description: "2.38–2.19 eV, 520–565 nm" },
            { name: "Yellow", min: 565e-9, max: 590e-9, description: "2.19–2.10 eV, 565–590 nm" },
            { name: "Orange", min: 590e-9, max: 625e-9, description: "2.10–1.98 eV, 590–625 nm" },
            { name: "Red", min: 625e-9, max: 780e-9, description: "1.98–1.59 eV, 625–780 nm" },
            
            // Infrared (IR)
            { name: "Near IR", min: 780e-9, max: 1400e-9, description: "NIR, IR-A: 1.58–0.886 eV, 780–1400 nm" },
            { name: "Near IR-B", min: 1.4e-6, max: 3e-6, description: "NIR, IR-B: 0.886–0.413 eV, 1.4–3 μm" },
            { name: "Mid IR", min: 3e-6, max: 50e-6, description: "MIR, IR-C: 413–24.8 meV, 3–50 μm" },
            { name: "Far IR", min: 50e-6, max: 1e-3, description: "FIR, IR-C: 24.8–1.24 meV, 50 μm–1 mm" },
            
            // Terahertz (THz) - overlaps with Far IR, but prioritized for 10μm-1mm range
            { name: "Terahertz", min: 10e-6, max: 1e-3, description: "THz: 124–1.24 meV, 10 μm–1 mm, 30–0.3 THz" },
            
            // Microwave (MW)
            { name: "Microwave", min: 1e-3, max: 1, description: "MW: 1.24 meV–1.24 μeV, 1 mm–1 m, 0.3–0.0003 THz" }
        ];

        // Function to identify spectral band
        function identifySpectralBand(wavelengthInMeters) {
            // Find all matching bands
            const matchingBands = spectralBands.filter(band => 
                wavelengthInMeters >= band.min && wavelengthInMeters < band.max
            );
            
            if (matchingBands.length === 0) {
                return { name: "Unknown", description: "Wavelength outside defined ranges" };
            }
            
            // If multiple matches, prioritize more specific classifications
            // Terahertz takes priority over Far IR in overlapping range
            const priorityOrder = ["Terahertz", "Far IR", "Mid IR", "Near IR-B", "Near IR"];
            for (const priority of priorityOrder) {
                const priorityBand = matchingBands.find(band => band.name === priority);
                if (priorityBand) return priorityBand;
            }
            
            // Return first match if no priority found
            return matchingBands[0];
        }

        // Function to update spectral band display
        function updateSpectralBandDisplay(wavelengthInMeters) {
            if (!spectralBandDisplay || !bandNameElement || !bandDescriptionElement) return;
            
            const band = identifySpectralBand(wavelengthInMeters);
            bandNameElement.textContent = band.name;
            bandDescriptionElement.textContent = band.description;
            
            if (!spectralBandDisplay.classList.contains('visible')) {
                spectralBandDisplay.classList.add('visible');
            }
        }

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

        // Unit conversion factors for time (to s)
        const timeFactors = {
            'fs': 1e-15,
            'ps': 1e-12,
            'ns': 1e-9,
            'µs': 1e-6,
            'ms': 1e-3,
            's': 1
        };

        let lastUltimateChanged = null;

        function updateFromEnergy() {
            const energyValue = parseFloat(energyInput.value);
            if (isNaN(energyValue) || energyValue === '' || energyValue <= 0) return;
            
            if (lastUltimateChanged === 'energy') return;
            lastUltimateChanged = 'energy';

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';
            const timeUnit = getCurrentUnit('time-unit') || 'ps';

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

            // Convert to time (period): T = h / E
            const timeInS = h / energyInEv;
            const timeInTargetUnit = timeInS / timeFactors[timeUnit];

            temperatureInput.value = formatNumber(tempInTargetUnit);
            wavelengthInput.value = formatNumber(wavelengthInTargetUnit);
            frequencyInput.value = formatNumber(frequencyInTargetUnit);
            wavenumberInput.value = formatNumber(wavenumberInTargetUnit);
            timeInput.value = formatNumber(timeInTargetUnit);
            
            // Update spectral band display
            updateSpectralBandDisplay(wavelengthInM);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromTemperature() {
            const tempValue = parseFloat(temperatureInput.value);
            if (isNaN(tempValue) || tempValue === '') return;
            
            if (lastUltimateChanged === 'temperature') return;
            lastUltimateChanged = 'temperature';

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';
            const timeUnit = getCurrentUnit('time-unit') || 'ps';

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

            // Convert to time (period): T = h / E
            const timeInS = h / energyInEv;
            const timeInTargetUnit = timeInS / timeFactors[timeUnit];

            energyInput.value = formatNumber(energyInTargetUnit);
            wavelengthInput.value = formatNumber(wavelengthInTargetUnit);
            frequencyInput.value = formatNumber(frequencyInTargetUnit);
            wavenumberInput.value = formatNumber(wavenumberInTargetUnit);
            timeInput.value = formatNumber(timeInTargetUnit);
            
            // Update spectral band display
            updateSpectralBandDisplay(wavelengthInM);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromWavelength() {
            const wavelengthValue = parseFloat(wavelengthInput.value);
            if (isNaN(wavelengthValue) || wavelengthValue === '' || wavelengthValue <= 0) return;
            
            if (lastUltimateChanged === 'wavelength') return;
            lastUltimateChanged = 'wavelength';

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';
            const timeUnit = getCurrentUnit('time-unit') || 'ps';

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

            // Convert to time (period): T = λ / c
            const timeInS = wavelengthInM / c;
            const timeInTargetUnit = timeInS / timeFactors[timeUnit];

            energyInput.value = formatNumber(energyInTargetUnit);
            temperatureInput.value = formatNumber(tempInTargetUnit);
            frequencyInput.value = formatNumber(frequencyInTargetUnit);
            wavenumberInput.value = formatNumber(wavenumberInTargetUnit);
            timeInput.value = formatNumber(timeInTargetUnit);
            
            // Update spectral band display
            updateSpectralBandDisplay(wavelengthInM);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromFrequency() {
            const frequencyValue = parseFloat(frequencyInput.value);
            if (isNaN(frequencyValue) || frequencyValue === '' || frequencyValue <= 0) return;
            
            if (lastUltimateChanged === 'frequency') return;
            lastUltimateChanged = 'frequency';

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';
            const timeUnit = getCurrentUnit('time-unit') || 'ps';

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

            // Convert to time (period): T = 1 / f
            const timeInS = 1 / frequencyInHz;
            const timeInTargetUnit = timeInS / timeFactors[timeUnit];

            energyInput.value = formatNumber(energyInTargetUnit);
            temperatureInput.value = formatNumber(tempInTargetUnit);
            wavelengthInput.value = formatNumber(wavelengthInTargetUnit);
            wavenumberInput.value = formatNumber(wavenumberInTargetUnit);
            timeInput.value = formatNumber(timeInTargetUnit);
            
            // Update spectral band display
            updateSpectralBandDisplay(wavelengthInM);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromWavenumber() {
            const wavenumberValue = parseFloat(wavenumberInput.value);
            if (isNaN(wavenumberValue) || wavenumberValue === '' || wavenumberValue <= 0) return;
            
            if (lastUltimateChanged === 'wavenumber') return;
            lastUltimateChanged = 'wavenumber';

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';
            const timeUnit = getCurrentUnit('time-unit') || 'ps';

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

            // Convert to time (period): T = 1 / (c * k)
            const timeInS = 1 / (c * wavenumberInM);
            const timeInTargetUnit = timeInS / timeFactors[timeUnit];

            energyInput.value = formatNumber(energyInTargetUnit);
            temperatureInput.value = formatNumber(tempInTargetUnit);
            wavelengthInput.value = formatNumber(wavelengthInTargetUnit);
            frequencyInput.value = formatNumber(frequencyInTargetUnit);
            timeInput.value = formatNumber(timeInTargetUnit);
            
            // Update spectral band display
            updateSpectralBandDisplay(wavelengthInM);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        function updateFromTime() {
            const timeValue = parseFloat(timeInput.value);
            if (isNaN(timeValue) || timeValue === '' || timeValue <= 0) return;
            
            if (lastUltimateChanged === 'time') return;
            lastUltimateChanged = 'time';

            const energyUnit = getCurrentUnit('energy-unit') || 'eV';
            const tempUnit = getCurrentUnit('temperature-unit') || 'K';
            const wavelengthUnit = getCurrentUnit('wavelength-unit') || 'nm';
            const frequencyUnit = getCurrentUnit('frequency-unit') || 'THz';
            const wavenumberUnit = getCurrentUnit('wavenumber-unit') || 'cm-1';
            const timeUnit = getCurrentUnit('time-unit') || 'ps';

            const timeInS = timeValue * timeFactors[timeUnit];
            
            // Convert to frequency: f = 1 / T
            const frequencyInHz = 1 / timeInS;
            const frequencyInTargetUnit = frequencyInHz / frequencyFactors[frequencyUnit];
            
            // Convert to energy: E = h / T
            const energyInEv = h / timeInS;
            const energyInTargetUnit = energyInEv / energyFactors[energyUnit];
            
            // Convert to temperature: T = E / kB
            let tempInK = energyInEv / kB;
            let tempInTargetUnit = tempInK;
            if (tempUnit === '°C') {
                tempInTargetUnit = tempInK - 273.15;
            }
            
            // Convert to wavelength: λ = c * T
            const wavelengthInM = c * timeInS;
            const wavelengthInTargetUnit = wavelengthInM / wavelengthFactors[wavelengthUnit];
            
            // Convert to wavenumber: k = 1 / (c * T)
            const wavenumberInM = 1 / (c * timeInS);
            const wavenumberInTargetUnit = wavenumberInM / wavenumberFactors[wavenumberUnit];

            energyInput.value = formatNumber(energyInTargetUnit);
            temperatureInput.value = formatNumber(tempInTargetUnit);
            wavelengthInput.value = formatNumber(wavelengthInTargetUnit);
            frequencyInput.value = formatNumber(frequencyInTargetUnit);
            wavenumberInput.value = formatNumber(wavenumberInTargetUnit);
            
            // Update spectral band display
            updateSpectralBandDisplay(wavelengthInM);
            
            setTimeout(() => lastUltimateChanged = null, 100);
        }

        // Initialize default values for custom selects
        const energySelect = document.querySelector('[data-target="energy-unit"]');
        const temperatureSelect = document.querySelector('[data-target="temperature-unit"]');
        const wavelengthSelect = document.querySelector('[data-target="wavelength-unit"]');
        const frequencySelect = document.querySelector('[data-target="frequency-unit"]');
        const wavenumberSelect = document.querySelector('[data-target="wavenumber-unit"]');
        const timeSelect = document.querySelector('[data-target="time-unit"]');
        if (energySelect) energySelect.currentValue = 'eV';
        if (temperatureSelect) temperatureSelect.currentValue = 'K';
        if (wavelengthSelect) wavelengthSelect.currentValue = 'nm';
        if (frequencySelect) frequencySelect.currentValue = 'THz';
        if (wavenumberSelect) wavenumberSelect.currentValue = 'cm-1';
        if (timeSelect) timeSelect.currentValue = 'ps';

        // Function to clear other inputs when one is cleared
        function clearOtherInputs(currentInput) {
            const inputs = [energyInput, temperatureInput, wavelengthInput, frequencyInput, wavenumberInput, timeInput];
            inputs.forEach(input => {
                if (input !== currentInput) {
                    input.value = '';
                }
            });
            // Hide spectral band display when all inputs are cleared
            if (spectralBandDisplay) {
                spectralBandDisplay.classList.remove('visible');
            }
        }

        // Enhanced input event listeners that handle clearing
        energyInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherInputs(energyInput);
                lastUltimateChanged = null;
            } else {
                updateFromEnergy();
            }
        });
        
        temperatureInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherInputs(temperatureInput);
                lastUltimateChanged = null;
            } else {
                updateFromTemperature();
            }
        });
        
        wavelengthInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherInputs(wavelengthInput);
                lastUltimateChanged = null;
            } else {
                updateFromWavelength();
            }
        });
        
        frequencyInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherInputs(frequencyInput);
                lastUltimateChanged = null;
            } else {
                updateFromFrequency();
            }
        });
        
        wavenumberInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherInputs(wavenumberInput);
                lastUltimateChanged = null;
            } else {
                updateFromWavenumber();
            }
        });
        
        timeInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherInputs(timeInput);
                lastUltimateChanged = null;
            } else {
                updateFromTime();
            }
        });
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

            rayleighRangeOutput.value = formatNumber(rayleighRangeInTargetUnit);
            divergenceOutput.value = formatNumber(divergenceInTargetUnit);

            // Calculate beam radius at distance if distance is provided
            const distanceValue = parseFloat(distanceInput.value);
            if (!isNaN(distanceValue) && distanceValue >= 0) {
                const distanceInM = distanceValue * beamSizeFactors[distanceUnit];
                
                // Calculate beam radius: w(z) = w0 * sqrt(1 + (z/zR)^2)
                const beamRadiusInM = beamWaistInM * Math.sqrt(1 + Math.pow(distanceInM / rayleighRangeInM, 2));
                const beamRadiusInTargetUnit = beamRadiusInM / beamSizeFactors[beamRadiusUnit];
                
                beamRadiusOutput.value = formatNumber(beamRadiusInTargetUnit);
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

    // Graphene Conversions Calculator
    const carrierDensityInput = document.getElementById('carrier-density-input');
    const fermiEnergyInput = document.getElementById('fermi-energy-input');
    const fermiWavenumberInput = document.getElementById('fermi-wavenumber-input');
    const gateVoltageSiO2Input = document.getElementById('gate-voltage-sio2-input');
    const gateVoltageHBNInput = document.getElementById('gate-voltage-hbn-input');
    const sio2ThicknessInput = document.getElementById('sio2-thickness-input');
    const hbnThicknessInput = document.getElementById('hbn-thickness-input');

    if (carrierDensityInput && fermiEnergyInput && fermiWavenumberInput && gateVoltageSiO2Input && gateVoltageHBNInput && sio2ThicknessInput && hbnThicknessInput) {
        // Physical constants
        const eps0 = 8.854e-12; // F/m
        const e = 1.602e-19;     // C
        const hbar = 1.055e-34;  // Js
        const h = 6.626e-34;     // Js (Planck constant)
        const vF = 1e6;          // m/s (Fermi velocity for graphene)
        const c = 3e8;           // m/s

        // Material constants
        const eps_SiO2 = 3.9;
        const eps_hBN = 3.0;

        // Unit conversion factors
        const carrierDensityFactors = {
            'cm-2': 1e4,  // cm^-2 to m^-2
            'm-2': 1      // m^-2 to m^-2
        };

        const fermiEnergyFactors = {
            'meV': 1e-3,
            'eV': 1,
            'J': 6.242e18  // J to eV
        };

        const fermiWavenumberFactors = {
            'mm-1': 1e3,
            'cm-1': 1e2,
            'm-1': 1
        };

        const voltageFactors = {
            'mV': 1e-3,
            'V': 1
        };

        const thicknessFactors = {
            'nm': 1e-9,
            'μm': 1e-6
        };

        let lastGrapheneChanged = null;

        function updateFromCarrierDensity() {
            const carrierDensityValue = parseFloat(carrierDensityInput.value);
            if (isNaN(carrierDensityValue) || carrierDensityValue === '' || carrierDensityValue <= 0) return;
            
            if (lastGrapheneChanged === 'carrier-density') return;
            lastGrapheneChanged = 'carrier-density';

            const carrierDensityUnit = getCurrentUnit('carrier-density-unit') || 'cm-2';
            const fermiEnergyUnit = getCurrentUnit('fermi-energy-unit') || 'eV';
            const fermiWavenumberUnit = getCurrentUnit('fermi-wavenumber-unit') || 'cm-1';
            const gateVoltageSiO2Unit = getCurrentUnit('gate-voltage-sio2-unit') || 'V';
            const gateVoltageHBNUnit = getCurrentUnit('gate-voltage-hbn-unit') || 'V';
            const sio2ThicknessUnit = getCurrentUnit('sio2-thickness-unit') || 'nm';
            const hbnThicknessUnit = getCurrentUnit('hbn-thickness-unit') || 'nm';

            // Convert to base units (m^-2)
            const n_m2 = carrierDensityValue * carrierDensityFactors[carrierDensityUnit];

            // Calculate Fermi energy: E_F = ħv_F√(πn)
            const Ef_J = hbar * vF * Math.sqrt(Math.PI * n_m2);
            const Ef_eV = Ef_J / e;
            const fermiEnergyInTargetUnit = Ef_eV / fermiEnergyFactors[fermiEnergyUnit];

            // Calculate Fermi wavenumber: ν̃ = E_F / (hc)
            const fermiWavenumberInM = Ef_J / (h * c);
            const fermiWavenumberInTargetUnit = fermiWavenumberInM / fermiWavenumberFactors[fermiWavenumberUnit];

            // Calculate gate voltage for SiO2: V_g = (n * e * d) / (ε₀ * ε_r)
            const sio2ThicknessValue = parseFloat(sio2ThicknessInput.value) || 285;
            const d_SiO2_m = sio2ThicknessValue * thicknessFactors[sio2ThicknessUnit];
            const Vg_SiO2 = (n_m2 * e * d_SiO2_m) / (eps0 * eps_SiO2);
            const gateVoltageSiO2InTargetUnit = Vg_SiO2 / voltageFactors[gateVoltageSiO2Unit];

            // Calculate gate voltage for hBN
            const hbnThicknessValue = parseFloat(hbnThicknessInput.value) || 10;
            const d_hBN_m = hbnThicknessValue * thicknessFactors[hbnThicknessUnit];
            const Vg_hBN = (n_m2 * e * d_hBN_m) / (eps0 * eps_hBN);
            const gateVoltageHBNInTargetUnit = Vg_hBN / voltageFactors[gateVoltageHBNUnit];

            fermiEnergyInput.value = formatNumber(fermiEnergyInTargetUnit);
            fermiWavenumberInput.value = formatNumber(fermiWavenumberInTargetUnit);
            gateVoltageSiO2Input.value = formatNumber(gateVoltageSiO2InTargetUnit);
            gateVoltageHBNInput.value = formatNumber(gateVoltageHBNInTargetUnit);

            setTimeout(() => lastGrapheneChanged = null, 100);
        }

        function updateFromFermiEnergy() {
            const fermiEnergyValue = parseFloat(fermiEnergyInput.value);
            if (isNaN(fermiEnergyValue) || fermiEnergyValue === '' || fermiEnergyValue <= 0) return;
            
            if (lastGrapheneChanged === 'fermi-energy') return;
            lastGrapheneChanged = 'fermi-energy';

            const carrierDensityUnit = getCurrentUnit('carrier-density-unit') || 'cm-2';
            const fermiEnergyUnit = getCurrentUnit('fermi-energy-unit') || 'eV';
            const fermiWavenumberUnit = getCurrentUnit('fermi-wavenumber-unit') || 'cm-1';
            const gateVoltageSiO2Unit = getCurrentUnit('gate-voltage-sio2-unit') || 'V';
            const gateVoltageHBNUnit = getCurrentUnit('gate-voltage-hbn-unit') || 'V';
            const sio2ThicknessUnit = getCurrentUnit('sio2-thickness-unit') || 'nm';
            const hbnThicknessUnit = getCurrentUnit('hbn-thickness-unit') || 'nm';

            // Convert to base units (eV)
            const Ef_eV = fermiEnergyValue * fermiEnergyFactors[fermiEnergyUnit];
            const Ef_J = Ef_eV * e;

            // Calculate carrier density: n = (E_F / (ħv_F))² / π
            const n_m2 = Math.pow(Ef_J / (hbar * vF), 2) / Math.PI;
            const carrierDensityInTargetUnit = n_m2 / carrierDensityFactors[carrierDensityUnit];

            // Calculate Fermi wavenumber: ν̃ = E_F / (hc)
            const fermiWavenumberInM = Ef_J / (h * c);
            const fermiWavenumberInTargetUnit = fermiWavenumberInM / fermiWavenumberFactors[fermiWavenumberUnit];

            // Calculate gate voltages
            const sio2ThicknessValue = parseFloat(sio2ThicknessInput.value) || 285;
            const d_SiO2_m = sio2ThicknessValue * thicknessFactors[sio2ThicknessUnit];
            const Vg_SiO2 = (n_m2 * e * d_SiO2_m) / (eps0 * eps_SiO2);
            const gateVoltageSiO2InTargetUnit = Vg_SiO2 / voltageFactors[gateVoltageSiO2Unit];

            const hbnThicknessValue = parseFloat(hbnThicknessInput.value) || 10;
            const d_hBN_m = hbnThicknessValue * thicknessFactors[hbnThicknessUnit];
            const Vg_hBN = (n_m2 * e * d_hBN_m) / (eps0 * eps_hBN);
            const gateVoltageHBNInTargetUnit = Vg_hBN / voltageFactors[gateVoltageHBNUnit];

            carrierDensityInput.value = formatNumber(carrierDensityInTargetUnit);
            fermiWavenumberInput.value = formatNumber(fermiWavenumberInTargetUnit);
            gateVoltageSiO2Input.value = formatNumber(gateVoltageSiO2InTargetUnit);
            gateVoltageHBNInput.value = formatNumber(gateVoltageHBNInTargetUnit);

            setTimeout(() => lastGrapheneChanged = null, 100);
        }

        function updateFromFermiWavenumber() {
            const fermiWavenumberValue = parseFloat(fermiWavenumberInput.value);
            if (isNaN(fermiWavenumberValue) || fermiWavenumberValue === '' || fermiWavenumberValue <= 0) return;
            
            if (lastGrapheneChanged === 'fermi-wavenumber') return;
            lastGrapheneChanged = 'fermi-wavenumber';

            const carrierDensityUnit = getCurrentUnit('carrier-density-unit') || 'cm-2';
            const fermiEnergyUnit = getCurrentUnit('fermi-energy-unit') || 'eV';
            const fermiWavenumberUnit = getCurrentUnit('fermi-wavenumber-unit') || 'cm-1';
            const gateVoltageSiO2Unit = getCurrentUnit('gate-voltage-sio2-unit') || 'V';
            const gateVoltageHBNUnit = getCurrentUnit('gate-voltage-hbn-unit') || 'V';
            const sio2ThicknessUnit = getCurrentUnit('sio2-thickness-unit') || 'nm';
            const hbnThicknessUnit = getCurrentUnit('hbn-thickness-unit') || 'nm';

            // Convert to base units (m^-1)
            const fermiWavenumberInM = fermiWavenumberValue * fermiWavenumberFactors[fermiWavenumberUnit];

            // Calculate Fermi energy: E_F = hcν̃
            const Ef_J = h * c * fermiWavenumberInM;
            const Ef_eV = Ef_J / e;
            const fermiEnergyInTargetUnit = Ef_eV / fermiEnergyFactors[fermiEnergyUnit];

            // Calculate carrier density
            const n_m2 = Math.pow(Ef_J / (hbar * vF), 2) / Math.PI;
            const carrierDensityInTargetUnit = n_m2 / carrierDensityFactors[carrierDensityUnit];

            // Calculate gate voltages
            const sio2ThicknessValue = parseFloat(sio2ThicknessInput.value) || 285;
            const d_SiO2_m = sio2ThicknessValue * thicknessFactors[sio2ThicknessUnit];
            const Vg_SiO2 = (n_m2 * e * d_SiO2_m) / (eps0 * eps_SiO2);
            const gateVoltageSiO2InTargetUnit = Vg_SiO2 / voltageFactors[gateVoltageSiO2Unit];

            const hbnThicknessValue = parseFloat(hbnThicknessInput.value) || 10;
            const d_hBN_m = hbnThicknessValue * thicknessFactors[hbnThicknessUnit];
            const Vg_hBN = (n_m2 * e * d_hBN_m) / (eps0 * eps_hBN);
            const gateVoltageHBNInTargetUnit = Vg_hBN / voltageFactors[gateVoltageHBNUnit];

            carrierDensityInput.value = formatNumber(carrierDensityInTargetUnit);
            fermiEnergyInput.value = formatNumber(fermiEnergyInTargetUnit);
            gateVoltageSiO2Input.value = formatNumber(gateVoltageSiO2InTargetUnit);
            gateVoltageHBNInput.value = formatNumber(gateVoltageHBNInTargetUnit);

            setTimeout(() => lastGrapheneChanged = null, 100);
        }

        function updateFromGateVoltageSiO2() {
            const gateVoltageValue = parseFloat(gateVoltageSiO2Input.value);
            const sio2ThicknessValue = parseFloat(sio2ThicknessInput.value);
            if (isNaN(gateVoltageValue) || gateVoltageValue === '' || isNaN(sio2ThicknessValue) || sio2ThicknessValue <= 0) return;
            
            if (lastGrapheneChanged === 'gate-voltage-sio2') return;
            lastGrapheneChanged = 'gate-voltage-sio2';

            const carrierDensityUnit = getCurrentUnit('carrier-density-unit') || 'cm-2';
            const fermiEnergyUnit = getCurrentUnit('fermi-energy-unit') || 'eV';
            const fermiWavenumberUnit = getCurrentUnit('fermi-wavenumber-unit') || 'cm-1';
            const gateVoltageSiO2Unit = getCurrentUnit('gate-voltage-sio2-unit') || 'V';
            const gateVoltageHBNUnit = getCurrentUnit('gate-voltage-hbn-unit') || 'V';
            const sio2ThicknessUnit = getCurrentUnit('sio2-thickness-unit') || 'nm';
            const hbnThicknessUnit = getCurrentUnit('hbn-thickness-unit') || 'nm';

            // Convert to base units (V)
            const Vg_V = gateVoltageValue * voltageFactors[gateVoltageSiO2Unit];

            // Calculate carrier density: n = (ε₀ * ε_r * V_g) / (e * d)
            const d_SiO2_m = sio2ThicknessValue * thicknessFactors[sio2ThicknessUnit];
            const n_m2 = (eps0 * eps_SiO2 * Vg_V) / (e * d_SiO2_m);
            const carrierDensityInTargetUnit = n_m2 / carrierDensityFactors[carrierDensityUnit];

            // Calculate Fermi energy
            const Ef_J = hbar * vF * Math.sqrt(Math.PI * n_m2);
            const Ef_eV = Ef_J / e;
            const fermiEnergyInTargetUnit = Ef_eV / fermiEnergyFactors[fermiEnergyUnit];

            // Calculate Fermi wavenumber: ν̃ = E_F / (hc)
            const fermiWavenumberInM = Ef_J / (h * c);
            const fermiWavenumberInTargetUnit = fermiWavenumberInM / fermiWavenumberFactors[fermiWavenumberUnit];

            // Calculate hBN gate voltage
            const hbnThicknessValue = parseFloat(hbnThicknessInput.value) || 10;
            const d_hBN_m = hbnThicknessValue * thicknessFactors[hbnThicknessUnit];
            const Vg_hBN = (n_m2 * e * d_hBN_m) / (eps0 * eps_hBN);
            const gateVoltageHBNInTargetUnit = Vg_hBN / voltageFactors[gateVoltageHBNUnit];

            carrierDensityInput.value = formatNumber(carrierDensityInTargetUnit);
            fermiEnergyInput.value = formatNumber(fermiEnergyInTargetUnit);
            fermiWavenumberInput.value = formatNumber(fermiWavenumberInTargetUnit);
            gateVoltageHBNInput.value = formatNumber(gateVoltageHBNInTargetUnit);

            setTimeout(() => lastGrapheneChanged = null, 100);
        }

        function updateFromGateVoltageHBN() {
            const gateVoltageValue = parseFloat(gateVoltageHBNInput.value);
            const hbnThicknessValue = parseFloat(hbnThicknessInput.value);
            if (isNaN(gateVoltageValue) || gateVoltageValue === '' || isNaN(hbnThicknessValue) || hbnThicknessValue <= 0) return;
            
            if (lastGrapheneChanged === 'gate-voltage-hbn') return;
            lastGrapheneChanged = 'gate-voltage-hbn';

            const carrierDensityUnit = getCurrentUnit('carrier-density-unit') || 'cm-2';
            const fermiEnergyUnit = getCurrentUnit('fermi-energy-unit') || 'eV';
            const fermiWavenumberUnit = getCurrentUnit('fermi-wavenumber-unit') || 'cm-1';
            const gateVoltageSiO2Unit = getCurrentUnit('gate-voltage-sio2-unit') || 'V';
            const gateVoltageHBNUnit = getCurrentUnit('gate-voltage-hbn-unit') || 'V';
            const sio2ThicknessUnit = getCurrentUnit('sio2-thickness-unit') || 'nm';
            const hbnThicknessUnit = getCurrentUnit('hbn-thickness-unit') || 'nm';

            // Convert to base units
            const Vg_V = gateVoltageValue * voltageFactors[gateVoltageHBNUnit];
            const d_hBN_m = hbnThicknessValue * thicknessFactors[hbnThicknessUnit];

            // Calculate carrier density
            const n_m2 = (eps0 * eps_hBN * Vg_V) / (e * d_hBN_m);
            const carrierDensityInTargetUnit = n_m2 / carrierDensityFactors[carrierDensityUnit];

            // Calculate Fermi energy
            const Ef_J = hbar * vF * Math.sqrt(Math.PI * n_m2);
            const Ef_eV = Ef_J / e;
            const fermiEnergyInTargetUnit = Ef_eV / fermiEnergyFactors[fermiEnergyUnit];

            // Calculate Fermi wavenumber: ν̃ = E_F / (hc)
            const fermiWavenumberInM = Ef_J / (h * c);
            const fermiWavenumberInTargetUnit = fermiWavenumberInM / fermiWavenumberFactors[fermiWavenumberUnit];

            // Calculate SiO2 gate voltage
            const sio2ThicknessValue = parseFloat(sio2ThicknessInput.value) || 285;
            const d_SiO2_m = sio2ThicknessValue * thicknessFactors[sio2ThicknessUnit];
            const Vg_SiO2 = (n_m2 * e * d_SiO2_m) / (eps0 * eps_SiO2);
            const gateVoltageSiO2InTargetUnit = Vg_SiO2 / voltageFactors[gateVoltageSiO2Unit];

            carrierDensityInput.value = formatNumber(carrierDensityInTargetUnit);
            fermiEnergyInput.value = formatNumber(fermiEnergyInTargetUnit);
            fermiWavenumberInput.value = formatNumber(fermiWavenumberInTargetUnit);
            gateVoltageSiO2Input.value = formatNumber(gateVoltageSiO2InTargetUnit);

            setTimeout(() => lastGrapheneChanged = null, 100);
        }

        // Function to clear other inputs when one is cleared
        function clearOtherGrapheneInputs(currentInput) {
            const inputs = [carrierDensityInput, fermiEnergyInput, fermiWavenumberInput, gateVoltageSiO2Input, gateVoltageHBNInput];
            inputs.forEach(input => {
                if (input !== currentInput) {
                    input.value = '';
                }
            });
        }

        // Initialize default values for custom selects
        const carrierDensitySelect = document.querySelector('[data-target="carrier-density-unit"]');
        const fermiEnergySelect = document.querySelector('[data-target="fermi-energy-unit"]');
        const fermiWavenumberSelect = document.querySelector('[data-target="fermi-wavenumber-unit"]');
        const gateVoltageSiO2Select = document.querySelector('[data-target="gate-voltage-sio2-unit"]');
        const gateVoltageHBNSelect = document.querySelector('[data-target="gate-voltage-hbn-unit"]');
        const sio2ThicknessSelect = document.querySelector('[data-target="sio2-thickness-unit"]');
        const hbnThicknessSelect = document.querySelector('[data-target="hbn-thickness-unit"]');
        
        if (carrierDensitySelect) carrierDensitySelect.currentValue = 'cm-2';
        if (fermiEnergySelect) fermiEnergySelect.currentValue = 'eV';
        if (fermiWavenumberSelect) fermiWavenumberSelect.currentValue = 'cm-1';
        if (gateVoltageSiO2Select) gateVoltageSiO2Select.currentValue = 'V';
        if (gateVoltageHBNSelect) gateVoltageHBNSelect.currentValue = 'V';
        if (sio2ThicknessSelect) sio2ThicknessSelect.currentValue = 'nm';
        if (hbnThicknessSelect) hbnThicknessSelect.currentValue = 'nm';

        // Enhanced input event listeners
        carrierDensityInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherGrapheneInputs(carrierDensityInput);
                lastGrapheneChanged = null;
            } else {
                updateFromCarrierDensity();
            }
        });

        fermiEnergyInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherGrapheneInputs(fermiEnergyInput);
                lastGrapheneChanged = null;
            } else {
                updateFromFermiEnergy();
            }
        });

        fermiWavenumberInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherGrapheneInputs(fermiWavenumberInput);
                lastGrapheneChanged = null;
            } else {
                updateFromFermiWavenumber();
            }
        });

        gateVoltageSiO2Input.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherGrapheneInputs(gateVoltageSiO2Input);
                lastGrapheneChanged = null;
            } else {
                updateFromGateVoltageSiO2();
            }
        });

        gateVoltageHBNInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                clearOtherGrapheneInputs(gateVoltageHBNInput);
                lastGrapheneChanged = null;
            } else {
                updateFromGateVoltageHBN();
            }
        });

        // SiO2 thickness change should trigger recalculation if SiO2 voltage has value
        sio2ThicknessInput.addEventListener('input', () => {
            if (gateVoltageSiO2Input.value.trim() !== '') {
                updateFromGateVoltageSiO2();
            }
        });

        // hBN thickness change should trigger recalculation if hBN voltage has value
        hbnThicknessInput.addEventListener('input', () => {
            if (gateVoltageHBNInput.value.trim() !== '') {
                updateFromGateVoltageHBN();
            }
        });
    }


});