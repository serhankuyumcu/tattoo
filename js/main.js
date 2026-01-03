// Main JavaScript
(function() {
    // Language handling
    let currentLang = localStorage.getItem('language') || 'tr';
    
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = window.siteTranslations[lang];
            
            for (const k of keys) {
                value = value[k];
            }
            
            if (value) {
                element.textContent = value;
            }
        });
        
        // Update language button
        document.getElementById('currentLang').textContent = lang.toUpperCase();
    }
    
    // Initialize language
    document.addEventListener('DOMContentLoaded', () => {
        updateLanguage(currentLang);
        
        // Language selector
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');
        
        langBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', () => {
            langDropdown?.classList.remove('show');
        });
        
        langDropdown?.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                updateLanguage(lang);
            });
        });
        
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        const isAlwaysScrolled = navbar.classList.contains('always-scrolled');
        
        function updateNavbar() {
            if (isAlwaysScrolled) {
                navbar.classList.add('scrolled');
                return;
            }
            
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // Initial check
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenuBtn?.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
        });
        
        mobileMenu?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
            });
        });
        
        // Image slider for About section
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index]?.classList.add('active');
            dots[index]?.classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // Auto-advance slider
        setInterval(nextSlide, 3000);
        
        // Click handlers for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Load gallery
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid && window.galleryData) {
            // Modal elements
            const modal = document.getElementById('galleryModal');
            const modalClose = document.getElementById('galleryModalClose');
            const modalImage = document.getElementById('galleryModalImage');
            const modalTitle = document.getElementById('galleryModalTitle');
            const modalCounter = document.getElementById('galleryModalCounter');
            const prevBtn = document.getElementById('galleryPrev');
            const nextBtn = document.getElementById('galleryNext');
            
            let currentImages = [];
            let currentImageIndex = 0;

            function updateModal() {
                modalImage.src = currentImages[currentImageIndex];
                modalCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
            }

            window.galleryData.forEach(item => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.setAttribute('data-title', item.title);
                div.innerHTML = `
                    <img src="${item.coverImage}" alt="${item.title}" loading="lazy">
                    
                    <!-- Default Overlay (Hides on Hover) -->
                    <div class="gallery-overlay-default">
                        <div class="gallery-item-title-static" data-i18n="gallery.categories.${item.id}">${item.title}</div>
                        <div class="gallery-item-category-static" data-i18n="gallery.types.${item.categoryId}">${item.category}</div>
                    </div>

                    <!-- Hover Overlay (Shows on Hover) -->
                    <div class="gallery-overlay-hover">
                        <h3 class="gallery-hover-title" data-i18n="gallery.categories.${item.id}">${item.title}</h3>
                        <span class="gallery-hover-category" data-i18n="gallery.types.${item.categoryId}">${item.category}</span>
                        <button class="view-btn" data-i18n="gallery.viewGallery">View Gallery</button>
                    </div>
                `;
                
                div.addEventListener('click', () => {
                    currentImages = item.images;
                    currentImageIndex = 0;
                    // For modal title, we need to get the translated text
                    const currentLang = localStorage.getItem('language') || 'tr';
                    const translatedTitle = window.siteTranslations?.[currentLang]?.gallery?.categories?.[item.id] || item.title;
                    modalTitle.textContent = translatedTitle;
                    
                    updateModal();
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                });
                
                galleryGrid.appendChild(div);
            });
            
            // Update language for newly added gallery items
            updateLanguage(currentLang);

            // Modal Controls
            modalClose?.addEventListener('click', () => {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });

            prevBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                updateModal();
            });

            nextBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                updateModal();
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!modal.classList.contains('show')) return;
                
                if (e.key === 'Escape') {
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                } else if (e.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                    updateModal();
                } else if (e.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                    updateModal();
                }
            });

            // Close on background click
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Set current year in footer
        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    });
})();
