document.addEventListener('DOMContentLoaded', () => {
    // Caching de elementos DOM frecuentemente utilizados
    const body = document.body;
    const sideMenu = document.querySelector('.side-menu');
    const sideLinks = document.querySelectorAll('.side-menu a');
    const themeSwitch = document.getElementById('theme-switch');
    const currentYearElement = document.getElementById('currentYear');
    const projectCards = document.querySelectorAll('.project-experience-card');

    // --- Navegación inteligente por scroll usando Intersection Observer ---
    function setupIntersectionObserver() {
        // Recolectar todas las secciones basadas en los enlaces del menú
        const navSections = {};
        const sectionElements = [];
        
        // Mapear enlaces a secciones
        sideLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    navSections[targetId] = link;
                    sectionElements.push(targetElement);
                }
            }
        });
        
        // Opciones para el observer - cuando la sección está 30% visible
        const observerOptions = {
            root: null, // viewport
            rootMargin: '-20% 0px -70% 0px', // Márgenes para considerar la sección visible
            threshold: 0 // Cualquier porcentaje visible
        };
        
        // Función para manejar entradas visibles
        const observerCallback = (entries) => {
            // Encuentra la entrada con la mayor proporción visible
            let maxRatio = 0;
            let maxEntry = null;
            
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    maxEntry = entry;
                }
            });
            
            // Si hay una entrada visible, actualiza el menú
            if (maxEntry) {
                // Primero, limpia todos los enlaces activos
                sideLinks.forEach(link => link.classList.remove('active'));
                
                // Luego activa el enlace correspondiente
                const targetId = `#${maxEntry.target.id}`;
                if (navSections[targetId]) {
                    navSections[targetId].classList.add('active');
                }
            }
        };
        
        // Crear e iniciar el observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // Observar todas las secciones
        sectionElements.forEach(section => {
            observer.observe(section);
        });
        
        return observer;
    }

    // --- Smooth Scroll mejorado ---
    function setupSmoothScroll() {
        sideLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calcular el offset basado en el header
                    const headerOffset = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Smooth scroll a la sección
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar enlaces activos y URL
                    sideLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    history.pushState(null, null, targetId);
                    
                    // Cerrar el menú móvil si está abierto
                    if (window.innerWidth <= 768) {
                        sideMenu.classList.remove('active');
                        const menuToggle = document.querySelector('.menu-toggle');
                        if (menuToggle) {
                            const icon = menuToggle.querySelector('i');
                            if (icon) {
                                icon.className = 'fas fa-bars';
                                menuToggle.setAttribute('aria-label', 'Abrir menú');
                            }
                        }
                    }
                }
            });
        });
    }
    
    // --- Menú Móvil mejorado ---
    function setupMobileMenu() {
        // Si el menú móvil no existe y estamos en viewport móvil, crearlo
        if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
            const headerContainer = document.querySelector('.header-container');
            
            if (headerContainer) {
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'menu-toggle';
                toggleBtn.setAttribute('aria-label', 'Abrir menú');
                toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
                
                headerContainer.insertBefore(toggleBtn, headerContainer.firstChild);
                
                // Manejar apertura/cierre del menú
                toggleBtn.addEventListener('click', () => {
                    sideMenu.classList.toggle('active');
                    
                    const icon = toggleBtn.querySelector('i');
                    if (icon) {
                        if (sideMenu.classList.contains('active')) {
                            icon.className = 'fas fa-times';
                            toggleBtn.setAttribute('aria-label', 'Cerrar menú');
                        } else {
                            icon.className = 'fas fa-bars';
                            toggleBtn.setAttribute('aria-label', 'Abrir menú');
                        }
                    }
                });
            }
        }
    }

    // --- Tema Claro/Oscuro ---
    function setupThemeSwitch() {
        if (themeSwitch) {
            themeSwitch.addEventListener('click', () => {
                // Alternar clases de tema
                body.classList.toggle('light-theme');
                body.classList.toggle('dark-theme');
                
                // Guardar preferencia
                const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
                localStorage.setItem('theme', currentTheme);
            });
            
            // Cargar preferencia guardada
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light' && body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
            }
        }
    }

    // --- Project cards: click to expand/collapse (all devices) ---
    function setupTouchDevices() {
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('expanded');
            });
        });
    }

    // --- Skill categories: measure collapsed/expanded dimensions ---
    function setupSkillDimensions() {
        document.querySelectorAll('.skill-category').forEach(card => {
            const anchor = card.querySelector('.skill-anchor');
            if (!anchor) return;

            // Collapsed: anchor natural size
            card.style.setProperty('--collapsed-w', anchor.offsetWidth + 'px');
            card.style.setProperty('--collapsed-h', anchor.offsetHeight + 'px');

            // Expanded: clone off-screen, strip all constraints, measure each
            // panel individually so left and right get their own exact widths.
            const clone = card.cloneNode(true);
            clone.style.setProperty('position', 'fixed', 'important');
            clone.style.setProperty('top', '-9999px', 'important');
            clone.style.setProperty('left', '-9999px', 'important');
            clone.style.setProperty('visibility', 'hidden', 'important');
            clone.style.setProperty('pointer-events', 'none', 'important');
            clone.style.setProperty('transition', 'none', 'important');
            clone.style.setProperty('width', 'max-content', 'important');
            clone.style.setProperty('height', 'auto', 'important');
            clone.style.setProperty('overflow', 'visible', 'important');
            clone.style.setProperty('grid-template-columns', 'max-content max-content max-content', 'important');
            clone.style.setProperty('grid-template-rows', 'auto', 'important');

            clone.style.setProperty('align-items', 'start', 'important');

            ['.skill-left', '.skill-right'].forEach(sel => {
                const panel = clone.querySelector(sel);
                if (!panel) return;
                panel.style.setProperty('overflow', 'visible', 'important');
                panel.style.setProperty('min-width', 'max-content', 'important');
                panel.style.setProperty('width', 'max-content', 'important');
                panel.style.setProperty('height', 'auto', 'important');
                panel.style.setProperty('opacity', '1', 'important');
                panel.style.setProperty('transform', 'none', 'important');
                const ul = panel.querySelector('ul');
                if (ul) ul.style.setProperty('height', 'auto', 'important');
            });

            document.body.appendChild(clone);
            const leftPanel  = clone.querySelector('.skill-left');
            const rightPanel = clone.querySelector('.skill-right');
            const leftW  = leftPanel  ? leftPanel.offsetWidth  : 0;
            const rightW = rightPanel ? rightPanel.offsetWidth : 0;
            const expandedH  = clone.offsetHeight;
            document.body.removeChild(clone);

            // Both panels get the same width = the wider of the two
            const panelW = Math.max(leftW, rightW);
            card.style.setProperty('--left-w',    panelW + 'px');
            card.style.setProperty('--right-w',   panelW + 'px');
            card.style.setProperty('--expanded-w', (panelW * 2 + anchor.offsetWidth) + 'px');
            card.style.setProperty('--expanded-h', expandedH + 'px');
        });
    }

    // --- Skill categories: click to expand/collapse ---
    function setupSkillCards() {
        document.querySelectorAll('.skill-category').forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('expanded');
            });
        });
    }

    // --- Optimización de imágenes ---
    function optimizeProjectImages() {
        const projectImages = document.querySelectorAll('.project-image');
        
        projectImages.forEach(img => {
            // Configurar estilo para carga correcta
            img.style.width = '100%';
            img.style.height = 'auto';
            
            // Lazy loading nativo para imágenes que lo soportan
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Notificar carga exitosa
            img.addEventListener('load', () => {
                // Remover la clase de placeholder si existe
                img.classList.remove('placeholder');
            });
            
            // Manejar errores
            img.addEventListener('error', () => {
                console.warn(`Error al cargar la imagen: ${img.src}`);
                // Reemplazar con imagen de placeholder si falla
                img.src = 'images/placeholder.png';
            });
        });
    }

    // --- Año actual en el footer ---
    function updateFooterYear() {
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }

    // --- Detector de cambio de tamaño para menú responsive ---
    function setupResizeHandler() {
        const debouncedResize = debounce(() => {
            // Recrear menú móvil si es necesario
            setupMobileMenu();
            
            // Re-optimizar imágenes en caso de cambio de orientación
            optimizeProjectImages();
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
    }

    // Utilidad de debounce para eventos frecuentes
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // --- Contact form (Resend integration) ---
    function setupContactForm() {
        const form = document.getElementById('contact-form');
        const status = document.getElementById('form-status');
        if (!form) return;

        const t = (key) => (window.translations && window.translations[key]
            ? window.translations[key][document.documentElement.lang || 'en']
            : null);

        const startedAt = Date.now();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');

            status.className = 'form-status';
            status.textContent = t('form-status-sending') || 'Sending…';
            submitBtn.disabled = true;

            const payload = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                whatsapp: form.whatsapp ? form.whatsapp.value.trim() : '',
                subject: form.project_type.value || 'general',
                message: form.message.value.trim(),
                website: form.website ? form.website.value : '',
                startedAt,
            };

            try {
                const res = await fetch(form.getAttribute('action') || '/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(payload),
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok || !json.ok) throw new Error(json.error || 'bad-response');

                form.reset();
                status.className = 'form-status success';
                status.textContent = t('form-status-success') || '✓ Sent. Reply within 24h.';
            } catch (err) {
                status.className = 'form-status error';
                status.textContent = t('form-status-error') || 'Failed. Email me directly meanwhile.';
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    // --- Reveal on scroll ---
    function setupRevealOnScroll() {
        const targets = document.querySelectorAll('section, .project-experience-card, .testimonial');
        if (!targets.length || !('IntersectionObserver' in window)) return;
        targets.forEach(el => el.classList.add('reveal'));
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
        targets.forEach(el => io.observe(el));
    }

    // --- Scroll progress bar ---
    function setupScrollProgress() {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);
        let ticking = false;
        const update = () => {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
            bar.style.width = pct + '%';
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    // --- Mobile skill items: mirror icon to the right for centered layout ---
    function setupMobileSkillIcons() {
        if (window.innerWidth > 450) return;
        document.querySelectorAll('.skill-left ul li, .skill-right ul li').forEach(li => {
            if (li.dataset.mobileIconDone) return;
            const icon = li.querySelector('i');
            if (!icon) return;
            const clone = icon.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            li.appendChild(clone);
            li.dataset.mobileIconDone = 'true';
        });
    }

    // --- Keyboard support for project & skill cards ---
    function setupCardKeyboard() {
        projectCards.forEach(card => {
            if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('expanded');
                }
            });
        });
        document.querySelectorAll('.skill-category').forEach(card => {
            if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('expanded');
                }
            });
        });
    }

    // --- Inicialización ---
    const observer = setupIntersectionObserver();
    setupSmoothScroll();
    setupMobileMenu();
    setupThemeSwitch();
    setupTouchDevices();
    setupSkillCards();
    document.fonts.ready.then(() => setupSkillDimensions());
    optimizeProjectImages();
    updateFooterYear();
    setupResizeHandler();
    setupContactForm();
    setupRevealOnScroll();
    setupScrollProgress();
    setupCardKeyboard();
    setupMobileSkillIcons();
});