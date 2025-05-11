// Corrección para la animación de typing
function setupTypingAnimation() {
    const typingElement = document.getElementById('typing-effect');
    if (!typingElement) return;
    
    // Detener cualquier animación previa
    if (window.typingInterval) {
        clearInterval(window.typingInterval);
        window.typingInterval = null;
    }
    
    // Obtener el idioma actual
    const currentLang = document.documentElement.getAttribute('lang') || 'es';
    
    // Textos según el idioma
    const texts = {
        es: "En proceso de desarrollo full-stack",
        en: "Full-stack developer in training"
    };
    
    const typingText = texts[currentLang];
    
    // Inicializar variables
    let index = 0;
    let isDeleting = false;
    const typingSpeed = 100; // Velocidad de escritura
    const deletingSpeed = 50; // Velocidad de borrado
    const delayAfterTyping = 2000; // Pausa antes de borrar
    
    // Función para el efecto de typing
    function type() {
        // Comprobar si el elemento existe y si no ha cambiado el idioma
        if (!typingElement || currentLang !== (document.documentElement.getAttribute('lang') || 'es')) {
            clearInterval(window.typingInterval);
            window.typingInterval = null;
            return;
        }
        
        const currentText = typingText.substring(0, index);
        typingElement.textContent = currentText;
        
        if (!isDeleting && index === typingText.length) {
            setTimeout(() => isDeleting = true, delayAfterTyping);
        } else if (isDeleting && index === 0) {
            isDeleting = false;
        }
        
        index += isDeleting ? -1 : 1;
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(type, speed);
    }
    
    // Iniciar la animación
    type();
    window.typingInterval = setInterval(() => {}, 100); // Mantener una referencia para poder detenerla
}

// Función para manejar el cambio de idioma
function setupLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;
    
    // Inicializar estado
    const currentLang = localStorage.getItem('language') || 'es';
    document.documentElement.setAttribute('lang', currentLang);
    langToggle.classList.add(`${currentLang}-active`);
    
    // Carga el idioma guardado al iniciar
    translatePage(currentLang);
    
    // Iniciar la animación de typing con el idioma actual
    setupTypingAnimation();
    
    // Manejador de click para cambiar idioma
    langToggle.addEventListener('click', () => {
        // Obtener el idioma actual
        const currentLang = document.documentElement.getAttribute('lang') || 'es';
        
        // Cambiar al idioma opuesto
        const newLang = currentLang === 'es' ? 'en' : 'es';
        
        // Actualizar clases para la animación
        langToggle.classList.remove(`${currentLang}-active`);
        langToggle.classList.add(`${newLang}-active`);
        
        // Guardar preferencia
        localStorage.setItem('language', newLang);
        document.documentElement.setAttribute('lang', newLang);
        
        // Realizar la traducción
        translatePage(newLang);
        
        // Reiniciar la animación de typing con el nuevo idioma
        setupTypingAnimation();
    });
}

// Función para traducir el contenido de la página
function translatePage(lang) {
    // Obtener todos los elementos con atributos de traducción
    const translatableElements = document.querySelectorAll('[data-translate]');
    
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            element.innerHTML = translations[key][lang];
        }
    });
    
    // También puedes traducir atributos como placeholders, alt, etc.
    const elementsWithTranslatableAttrs = document.querySelectorAll('[data-translate-attr]');
    elementsWithTranslatableAttrs.forEach(element => {
        const data = element.getAttribute('data-translate-attr').split(',');
        data.forEach(item => {
            const [attr, key] = item.trim().split(':');
            if (translations[key] && translations[key][lang] && attr) {
                element.setAttribute(attr, translations[key][lang]);
            }
        });
    });
}

// Almacén de traducciones
const translations = {
    // Hero section
    'greeting': {
        'es': 'Hola, soy Samuel Tabares León',
        'en': 'Hi, I\'m Samuel Tabares León'
    },
    'job-title': {
        'es': 'Ingeniero de software',
        'en': 'Software Engineer'
    },
    'hero-description': {
        'es': 'Tengo capacidad excepcional para <strong>aprender rápidamente</strong> nuevas tecnologías y <strong>perfeccionista</strong> orientado a resultados de calidad. <strong>Domino Python/Django, HTML5/CSS3 y JavaScript/React</strong> para desarrollo integral, combinando pensamiento crítico y autonomía para <strong>resolver problemas complejos</strong>. Mi enfoque es <strong>transformar</strong> sistemas para que realmente <strong>mejoren la experiencia del usuario final</strong>, pues como persona que interactúa diariamente con tecnología, comprendo la frustración de usar herramientas mal diseñadas. Busco <strong>liderar</strong> soluciones que optimicen procesos empresariales mientras elevan genuinamente la <strong>calidad de vida</strong> de quienes las utilizan.',
        'en': 'I have exceptional ability to <strong>quickly learn</strong> new technologies and a <strong>perfectionist</strong> approach focused on quality results. <strong>Proficient in Python/Django, HTML5/CSS3, and JavaScript/React</strong> for comprehensive development, combining critical thinking and autonomy to <strong>solve complex problems</strong>. My focus is to <strong>transform</strong> systems to truly <strong>enhance the end-user experience</strong>, as someone who interacts with technology daily, I understand the frustration of using poorly designed tools. I seek to <strong>lead</strong> solutions that optimize business processes while genuinely elevating the <strong>quality of life</strong> for those who use them.'
    },
    'download-cv': {
        'es': 'Descargar CV',
        'en': 'Download CV'
    },
    
    // About section
    'about-heading': {
        'es': 'Sobre Mí',
        'en': 'About Me'
    },
    'about-text-1': {
        'es': '<strong>Domino Python/Django, HTML5/CSS3 y JavaScript/React</strong> para desarrollo integral, combinando pensamiento crítico y autonomía para <strong>resolver problemas complejos</strong>.',
        'en': '<strong>Proficient in Python/Django, HTML5/CSS3, and JavaScript/React</strong> for comprehensive development, combining critical thinking and autonomy to <strong>solve complex problems</strong>.'
    },
    'about-text-2': {
        'es': 'Mi enfoque es <strong>transformar</strong> sistemas para que realmente <strong>mejoren la experiencia del usuario final</strong>, pues como persona que interactúa diariamente con tecnología, comprendo la frustración de usar herramientas mal diseñadas.',
        'en': 'My focus is to <strong>transform</strong> systems to truly <strong>enhance the end-user experience</strong>, as someone who interacts with technology daily, I understand the frustration of using poorly designed tools.'
    },
    'about-text-3': {
        'es': 'Busco <strong>liderar</strong> soluciones que optimicen procesos empresariales mientras elevan genuinamente la <strong>calidad de vida</strong> de quienes las utilizan.',
        'en': 'I seek to <strong>lead</strong> solutions that optimize business processes while genuinely elevating the <strong>quality of life</strong> for those who use them.'
    },
    'personal-skills': {
        'es': 'Competencias Personales',
        'en': 'Personal Skills'
    },
    'skill-problem-solving': {
        'es': 'Resolutivo',
        'en': 'Problem Solver'
    },
    'skill-fast-learning': {
        'es': 'Aprendizaje Rápido',
        'en': 'Fast Learner'
    },
    'skill-critical-thinking': {
        'es': 'Pensamiento Crítico',
        'en': 'Critical Thinker'
    },
    'skill-leadership': {
        'es': 'Liderazgo',
        'en': 'Leadership'
    },
    'skill-helpful': {
        'es': 'Servicial',
        'en': 'Helpful'
    },
    
    // Skills section
    'skills-heading': {
        'es': 'Habilidades Técnicas',
        'en': 'Technical Skills'
    },
    'languages-heading': {
        'es': 'Lenguajes',
        'en': 'Languages'
    },
    'frameworks-heading': {
        'es': 'Frameworks/Librerías',
        'en': 'Frameworks/Libraries'
    },
    'databases-heading': {
        'es': 'Bases de Datos',
        'en': 'Databases'
    },
    'tools-heading': {
        'es': 'Herramientas y Plataformas',
        'en': 'Tools and Platforms'
    },
    
    // Projects section
    'projects-heading': {
        'es': 'Proyectos y Experiencia',
        'en': 'Projects and Experience'
    },
    'portfolio-title': {
        'es': 'Portafolio Web Profesional',
        'en': 'Professional Web Portfolio'
    },
    'portfolio-desc': {
        'es': 'Desarrollo de un portafolio web personal completo con diseño responsive, tema claro/oscuro y navegación intuitiva para mostrar proyectos y habilidades.',
        'en': 'Development of a complete personal web portfolio with responsive design, light/dark theme, and intuitive navigation to showcase projects and skills.'
    },
    'portfolio-tech': {
        'es': '<strong>Tecnologías:</strong> HTML5, CSS3, JavaScript, Flexbox, Media Queries.',
        'en': '<strong>Technologies:</strong> HTML5, CSS3, JavaScript, Flexbox, Media Queries.'
    },
    'importa-title': {
        'es': 'Importa Colombia',
        'en': 'Importa Colombia'
    },
    'importa-desc': {
        'es': 'Aplicación web para mostrar y evaluar productos importados de China a Colombia, con sistema de likes/dislikes y reseñas con calificaciones de estrellas.',
        'en': 'Web application to showcase and evaluate products imported from China to Colombia, with likes/dislikes system and star-rating reviews.'
    },
    'importa-tech': {
        'es': '<strong>Tecnologías:</strong> React, Django REST Framework, Bootstrap 5, Python.',
        'en': '<strong>Technologies:</strong> React, Django REST Framework, Bootstrap 5, Python.'
    },
    'view-demo': {
        'es': 'Ver Demo <i class="fas fa-external-link-alt"></i>',
        'en': 'View Demo <i class="fas fa-external-link-alt"></i>'
    },
    'view-code': {
        'es': 'Ver Código <i class="fab fa-github"></i>',
        'en': 'View Code <i class="fab fa-github"></i>'
    },
    'portfolio-exp-title': {
        'es': 'DESARROLLO DE PORTAFOLIO WEB RESPONSIVE',
        'en': 'RESPONSIVE WEB PORTFOLIO DEVELOPMENT'
    },
    'portfolio-exp-1': {
        'es': '<strong>Diseñé</strong> la arquitectura completa del sitio con enfoque en experiencia de usuario y accesibilidad',
        'en': '<strong>Designed</strong> the complete site architecture with a focus on user experience and accessibility'
    },
    'portfolio-exp-2': {
        'es': '<strong>Implementé</strong> un sistema de tema claro/oscuro persistente con localStorage para preferencias del usuario',
        'en': '<strong>Implemented</strong> a persistent light/dark theme system with localStorage for user preferences'
    },
    'portfolio-exp-3': {
        'es': '<strong>Desarrollé</strong> componentes HTML semánticos y estilizados mediante CSS moderno con variables personalizadas',
        'en': '<strong>Developed</strong> semantic HTML components styled with modern CSS using custom variables'
    },
    'portfolio-exp-4': {
        'es': '<strong>Programé</strong> interacciones dinámicas con JavaScript puro, incluyendo efectos de typing y navegación suave',
        'en': '<strong>Programmed</strong> dynamic interactions with vanilla JavaScript, including typing effects and smooth navigation'
    },
    'portfolio-exp-5': {
        'es': '<strong>Optimicé</strong> la estructura para rendimiento y SEO con metadatos apropiados y carga eficiente de recursos',
        'en': '<strong>Optimized</strong> the structure for performance and SEO with appropriate metadata and efficient resource loading'
    },
    'importa-exp-title': {
        'es': 'DESARROLLO FULLSTACK IMPORTA COLOMBIA',
        'en': 'FULLSTACK DEVELOPMENT IMPORTA COLOMBIA'
    },
    'importa-exp-1': {
        'es': '<strong>Desarrollé</strong> un backend API REST con Django, implementando modelos para productos, reseñas y sistema de likes',
        'en': '<strong>Developed</strong> a REST API backend with Django, implementing models for products, reviews, and likes system'
    },
    'importa-exp-2': {
        'es': '<strong>Diseñé</strong> la interfaz frontend con React y Bootstrap 5, con enfoque en experiencia de usuario',
        'en': '<strong>Designed</strong> the frontend interface with React and Bootstrap 5, focusing on user experience'
    },
    'importa-exp-3': {
        'es': '<strong>Implementé</strong> autenticación básica para usuarios anónimos mediante IP para reseñas y valoraciones',
        'en': '<strong>Implemented</strong> basic authentication for anonymous users via IP for reviews and ratings'
    },
    'importa-exp-4': {
        'es': '<strong>Integré</strong> sistema de calificaciones con estrellas y funcionalidad para likes/dislikes',
        'en': '<strong>Integrated</strong> star rating system and functionality for likes/dislikes'
    },
    'importa-exp-5': {
        'es': '<strong>Optimicé</strong> la carga y visualización de datos con peticiones asíncronas y gestión de estados',
        'en': '<strong>Optimized</strong> data loading and visualization with asynchronous requests and state management'
    },
    
    // Education section
    'education-heading': {
        'es': 'Educación',
        'en': 'Education'
    },
    'software-eng': {
        'es': 'INGENIERÍA DE SOFTWARE',
        'en': 'SOFTWARE ENGINEERING'
    },
    'university': {
        'es': 'CORPORACIÓN UNIVERSITARIA EMPRESARIAL ALEXANDER VON HUMBOLDT',
        'en': 'ALEXANDER VON HUMBOLDT BUSINESS UNIVERSITY CORPORATION'
    },
    'current': {
        'es': 'Actualidad',
        'en': 'Present'
    },
    'english-b2': {
        'es': 'B2 INGLÉS',
        'en': 'ENGLISH B2'
    },
    'highschool': {
        'es': 'BACHILLER',
        'en': 'HIGH SCHOOL DIPLOMA'
    },
    'view-certificate': {
        'es': 'Ver certificado →',
        'en': 'View certificate →'
    },
    
    // Languages section
    'languages-title': {
        'es': 'Idiomas',
        'en': 'Languages'
    },
    'spanish': {
        'es': 'ESPAÑOL',
        'en': 'SPANISH'
    },
    'native': {
        'es': 'Nativo',
        'en': 'Native'
    },
    'english': {
        'es': 'INGLÉS',
        'en': 'ENGLISH'
    },
    'english-level': {
        'es': 'Nivel B2 | Certificado American School Way',
        'en': 'B2 Level | American School Way Certificate'
    },
    
    // Contact section
    'contact-heading': {
        'es': 'Contacto',
        'en': 'Contact'
    },
    'contact-description': {
        'es': 'Estoy disponible para nuevas oportunidades y colaboraciones, mándame un correo explicándome tu situación y en el menor tiempo posible estaremos en contacto.',
        'en': 'I am available for new opportunities and collaborations. Send me an email explaining your situation and I will get back to you as soon as possible.'
    },
    
    // References section
    'references-heading': {
        'es': 'Referencias',
        'en': 'References'
    },
    
    // Footer
    'copyright': {
        'es': 'Todos los derechos reservados.',
        'en': 'All rights reserved.'
    }
};

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupLanguageToggle();
});