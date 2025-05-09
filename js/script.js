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
    const sections = document.querySelectorAll('section');
    const sideLinks = document.querySelectorAll('.side-menu a');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            // Quitar la clase active de todos los enlaces
            sideLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Añadir la clase active al enlace correspondiente
            const activeLink = document.querySelector(`.side-menu a[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink); // Inicializar al cargar la página

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


    // --- Preparado para incorporar efectos de triángulos (desactivados por ahora) ---
    // El código para los triángulos se incorporará cuando se reciban instrucciones específicas
});

// Función para inicializar los carruseles de imágenes
   // Añadimos una función para asegurar que las imágenes de los proyectos se muestren correctamente
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



// Función placeholder para futuras animaciones de triángulos
function activateTriangles() {
    // Esta función se implementará según instrucciones posteriores
    console.log("Función de triángulos lista para implementarse");
    
    const trianglesContainer = document.getElementById('triangles-container');
    if (trianglesContainer) {
        trianglesContainer.style.opacity = '1';
        trianglesContainer.style.zIndex = '0';
        
        // Aquí iría la lógica para crear y animar los triángulos
    }
}