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

    // --- Mejora para dispositivos táctiles ---
    function setupTouchDevices() {
        const isTouchDevice = 'ontouchstart' in window || 
                             navigator.maxTouchPoints > 0 || 
                             navigator.msMaxTouchPoints > 0;
        
        if (isTouchDevice) {
            projectCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Toggle active state
                    if (this.classList.contains('active')) {
                        this.classList.remove('active');
                    } else {
                        // Desactivar otros cards
                        projectCards.forEach(c => c.classList.remove('active'));
                        // Activar este card
                        this.classList.add('active');
                    }
                });
            });
        }
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

    // --- Inicialización ---
    // Inicializar observador de intersección para navegación
    const observer = setupIntersectionObserver();
    
    // Configurar smooth scroll
    setupSmoothScroll();
    
    // Preparar menú móvil
    setupMobileMenu();
    
    // Configurar cambio de tema
    setupThemeSwitch();
    
    // Optimizar para dispositivos táctiles
    setupTouchDevices();
    
    // Optimizar imágenes
    optimizeProjectImages();
    
    // Actualizar año en el footer
    updateFooterYear();
    
    // Configurar handler de resize
    setupResizeHandler();
});