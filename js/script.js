document.addEventListener('DOMContentLoaded', () => {
    // --- Efecto de Escritura (Typing Effect) ---
    const typingText = "En proceso de desarrollo full-stack"; // Texto personalizado
    const typingElement = document.getElementById('typing-effect');
    let index = 0;
    let isDeleting = false;
    const typingSpeed = 100; // Velocidad de escritura
    const deletingSpeed = 50; // Velocidad de borrado
    const delayAfterTyping = 2000; // Pausa antes de borrar

    function type() {
        if (typingElement) { // Verifica que el elemento exista
            const currentText = typingText.substring(0, index);
            typingElement.textContent = currentText;

            if (!isDeleting && index === typingText.length) {
                setTimeout(() => isDeleting = true, delayAfterTyping);
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                // Podrías cambiar el texto aquí si quieres un ciclo de varios textos
            }

            index += isDeleting ? -1 : 1;
            const speed = isDeleting ? deletingSpeed : typingSpeed;
            setTimeout(type, speed);
        }
    }
    if (typingElement) type(); // Inicia el efecto solo si el elemento existe

    // --- Navegación Activa al Hacer Scroll ---
    // Definición extremadamente simplificada para setActiveLink
    function setActiveLink() {
        // Obtener posición actual de scroll
        const scrollPos = window.scrollY;
        
        // Detectar de manera forzada qué rango de scroll corresponde a cada sección
        // IMPORTANTE: Estos valores deben ajustarse según la altura real de tus secciones
        if (scrollPos < 450) {
            setActiveLinkById();
        } else if (scrollPos < 2000) {
            setActiveLinkById('about');
        } else if (scrollPos < 3690) {
            setActiveLinkById('projects');
        } else if (scrollPos < 4560){
            setActiveLinkById('education');
        }else{
            setActiveLinkById();
        }
    }
    
    // Función auxiliar para activar un enlace específico por ID
    function setActiveLinkById(id) {
        // Quitar la clase active de todos los enlaces
        document.querySelectorAll('.side-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Añadir la clase active al enlace correspondiente
        const activeLink = document.querySelector(`.side-menu a[href="#${id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Aplicar smooth scroll a los enlaces del menú
    function applySmoothScroll() {
        const sideLinks = document.querySelectorAll('.side-menu a');
        
        sideLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar enlaces activos después del scroll
                    setTimeout(() => {
                        sideLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        history.pushState(null, null, targetId);
                    }, 800);
                }
            });
        });
    }

    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink);

    // --- Menú Lateral para Móviles ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');

    // Crear el botón de menú para móviles si no existe
    if (!menuToggle && window.innerWidth <= 768) {
        const header = document.querySelector('header');
        const headerContainer = document.querySelector('.header-container');
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Abrir menú');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        headerContainer.insertBefore(toggleBtn, headerContainer.firstChild);
        
        toggleBtn.addEventListener('click', () => {
            sideMenu.classList.toggle('active');
            
            const icon = toggleBtn.querySelector('i');
            if (sideMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
                toggleBtn.setAttribute('aria-label', 'Cerrar menú');
            } else {
                icon.className = 'fas fa-bars';
                toggleBtn.setAttribute('aria-label', 'Abrir menú');
            }
        });
    }
    
    // Cerrar el menú al hacer clic en un enlace (en móviles)
    const sideLinks = document.querySelectorAll('.side-menu a');
    sideLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sideMenu.classList.remove('active');
                const toggleBtn = document.querySelector('.menu-toggle');
                if (toggleBtn) {
                    const icon = toggleBtn.querySelector('i');
                    icon.className = 'fas fa-bars';
                    toggleBtn.setAttribute('aria-label', 'Abrir menú');
                }
            }
        });
    });

    // --- Cambio de Tema (Claro/Oscuro) con iconos ---
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // Función para actualizar el icono del botón de tema
    function updateThemeIcon() {
        // Verificar si existe el botón primero
        if (!themeSwitch) return;
        
        // Limpiar los iconos actuales
        themeSwitch.innerHTML = '';
        
        // Crear y añadir los iconos de sol y luna
        const moonIcon = document.createElement('i');
        moonIcon.className = 'fas fa-moon';
        
        const sunIcon = document.createElement('i');
        sunIcon.className = 'fas fa-sun';
        
        themeSwitch.appendChild(moonIcon);
        themeSwitch.appendChild(sunIcon);
        
        // Ajustar el estado inicial según el tema actual
        if (body.classList.contains('light-theme')) {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'translateY(0)';
            moonIcon.style.opacity = '0';
            moonIcon.style.transform = 'translateY(20px)';
        } else {
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'translateY(0)';
            sunIcon.style.opacity = '0';
            sunIcon.style.transform = 'translateY(20px)';
        }
    }

    if (themeSwitch) {
        // Inicializar el icono al cargar la página
        updateThemeIcon();
        
        themeSwitch.addEventListener('click', () => {
            // Cambiar entre temas
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
            
            // Actualizar el icono
            updateThemeIcon();
        });

        // Verificar tema guardado en localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            updateThemeIcon();
        }
    }

    // --- Actualizar Año en Footer ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Efecto de hover para proyectos en móviles ---
    const projectCards = document.querySelectorAll('.project-experience-card');
    
    // Detectar dispositivos táctiles
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    
    // Si es un dispositivo táctil, modificar comportamiento del hover
    if (isTouchDevice()) {
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                // Si el card ya está activo, desactivarlo
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    return;
                }
                
                // Desactivar todos los cards
                projectCards.forEach(c => c.classList.remove('active'));
                
                // Activar solo el card actual
                this.classList.add('active');
            });
        });
    }
    ajustarImagenesProyectos();
    applySmoothScroll();
    setActiveLink(); // Ejecutar una vez para inicializar
    activateTriangles(); //ejecutar los triangulos
});

// Función para ajustar imágenes de proyectos
function ajustarImagenesProyectos() {
    const imagenes = document.querySelectorAll('.project-image');
    imagenes.forEach(img => {
        // Aseguramos que la imagen tiene los estilos adecuados
        img.style.width = '100%';
        img.style.height = 'auto';
        
        // Cuando la imagen carga, ajustamos el contenedor si es necesario
        img.onload = function() {
            // El contenedor ya tiene los estilos CSS necesarios para ajustarse automáticamente
            // así que aquí solo podemos añadir lógica adicional si fuera necesario
            console.log('Imagen cargada correctamente: ' + img.alt);
        };
    });
}

function activateTriangles() {
    // Asegurarse de que el contenedor existe
    const trianglesContainer = document.getElementById('triangles-container');
    if (!trianglesContainer) return;
    
    // Hacer visible el contenedor
    trianglesContainer.style.opacity = '1';
    trianglesContainer.style.zIndex = '0';
    
    // Cargar el script de triángulos dinámicamente
    const trianglesScript = document.createElement('script');
    trianglesScript.src = 'js/triangles.js'; // Asegúrate de crear este archivo con el código de triángulos
    document.body.appendChild(trianglesScript);
}