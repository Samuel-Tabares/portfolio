document.addEventListener('DOMContentLoaded', () => {
    // --- Efecto de Escritura (Typing Effect) ---
    const typingText = "en proceso de desarrollo, encaminado al Full-Stack"; // Texto personalizado
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
// Función para activar iconos del menú según el desplazamiento
function setActiveLink() {
    // Obtener posición actual de scroll
    const scrollPos = window.scrollY;
    
    // Limpiar todos los enlaces activos primero
    document.querySelectorAll('.side-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Activar enlace según posición de scroll (ajustado para 3 iconos)
    // Estos valores son estimados y deben ajustarse según tu contenido específico
    if (scrollPos > 480 && scrollPos < 1930) {
        // Sección Sobre Mí (primer icono)
        document.querySelector('.side-menu a[href="#about"]')?.classList.add('active');
    } else if (scrollPos > 1930 && scrollPos < 5000) {
        // Sección Proyectos (segundo icono)
        document.querySelector('.side-menu a[href="#projects"]')?.classList.add('active');
    } else if (scrollPos > 5000 && scrollPos < 6000){
        // Sección Educación (tercer icono)
        document.querySelector('.side-menu a[href="#education"]')?.classList.add('active');
    }
    
    // Descomentar esta línea para ver la posición de scroll actual en la consola
    // console.log("Posición de scroll:", scrollPos);
}

// Activar función cuando se hace scroll
window.addEventListener('scroll', setActiveLink);

// También activar al cargar la página
window.addEventListener('load', () => {
    // Pequeño retraso para asegurar que todo esté cargado
    setTimeout(setActiveLink, 100);
});
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

// Versión simplificada para el cambio de tema
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

if (themeSwitch) {
    console.log("Botón de tema encontrado");
    
    themeSwitch.addEventListener('click', () => {
        console.log("Botón de tema clickeado");
        
        // Simplemente alternar la clase
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');
        
        // Guardar el nuevo tema
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        
        console.log("Tema cambiado a:", currentTheme);
    });
    
    // Verificar tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' && body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        console.log("Tema inicializado a 'light' desde localStorage");
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
    
    // Ajustar imágenes de proyectos
    function ajustarImagenesProyectos() {
        const imagenes = document.querySelectorAll('.project-image');
        imagenes.forEach(img => {
            // Aseguramos que la imagen tiene los estilos adecuados
            img.style.width = '100%';
            img.style.height = 'auto';
            
            // Cuando la imagen carga, ajustamos el contenedor si es necesario
            img.onload = function() {
                console.log('Imagen cargada correctamente: ' + img.alt);
            };
        });
    }
    
    ajustarImagenesProyectos();
    applySmoothScroll();
    setActiveLink(); // Ejecutar una vez para inicializar
})