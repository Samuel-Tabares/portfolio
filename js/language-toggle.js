// Objeto global para el efecto typing
const TypingEffect = {
  // Configuración
texts: {
  'es': "especializado en full-stack e IA",
  'en': "specialized in full-stack and AI"
},
  typingSpeed: 100,      // Velocidad de escritura (ms)
  deletingSpeed: 50,     // Velocidad de borrado (ms)
  pauseDelay: 2000,      // Pausa después de escribir (ms)
  
  // Estado interno
  element: null,         // Elemento DOM
  currentText: "",       // Texto actual que se está escribiendo
  currentIndex: 0,       // Posición actual en el texto
  isDeleting: false,     // Si está borrando o escribiendo
  timeout: null,         // Referencia al setTimeout
  currentLang: null,     // Idioma actual
  
  // Inicializar efecto
  init: function() {
    // Obtener elemento
    this.element = document.getElementById('typing-effect');
    if (!this.element) return false;
    
    // Obtener idioma inicial
    this.currentLang = document.documentElement.getAttribute('lang') || 'es';
    
    // Iniciar la animación
    this.start();
    
    return true;
  },
  
  // Iniciar la animación
  start: function() {
    // Limpiar timeout existente
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    
    // Resetear estado
    this.currentIndex = 0;
    this.isDeleting = false;
    
    // Actualizar idioma actual
    this.currentLang = document.documentElement.getAttribute('lang') || 'es';
    
    // Obtener texto para el idioma actual
    this.currentText = this.texts[this.currentLang] || "";
    
    // Iniciar ciclo de animación
    this.tick();
  },
  
  // Ciclo principal de la animación
  tick: function() {
    // Verificar si el idioma ha cambiado
    const newLang = document.documentElement.getAttribute('lang') || 'es';
    if (newLang !== this.currentLang) {
      // Si cambió el idioma, reiniciar con el nuevo
      this.start();
      return;
    }
    
    // Calcular el texto que se muestra actualmente
    const displayText = this.currentText.substring(0, this.currentIndex);
    
    // Actualizar el DOM
    if (this.element) {
      this.element.textContent = displayText;
    }
    
    // Lógica para escribir/borrar
    if (!this.isDeleting && this.currentIndex === this.currentText.length) {
      // Completó la escritura, esperar antes de empezar a borrar
      const self = this;
      this.timeout = setTimeout(function() {
        self.isDeleting = true;
        self.tick();
      }, this.pauseDelay);
    } 
    else if (this.isDeleting && this.currentIndex === 0) {
      // Completó el borrado, reiniciar escritura
      this.isDeleting = false;
      
      // Opcionalmente cambiar texto si hay varios
      // Para este caso específico no es necesario ya que depende del idioma
      
      this.tick();
    }
    else {
      // Continuar escribiendo o borrando
      this.currentIndex += this.isDeleting ? -1 : 1;
      
      // Programar próximo ciclo
      const speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
      const self = this;
      this.timeout = setTimeout(function() {
        self.tick();
      }, speed);
    }
  },
  
  // Detener la animación
  stop: function() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
};

// Función de utilidad para reemplazar la implementación actual
function setupTypingAnimation() {
  // Detener la animación existente si hay alguna
  if (TypingEffect.timeout) {
    TypingEffect.stop();
  }
  
  // Inicializar la animación
  TypingEffect.init();
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

function translateDates() {
    // Meses en español e inglés
    const months = {
        'es': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    // Términos actuales en español e inglés
    const currentTerms = {
        'es': 'Actualidad',
        'en': 'Present'
    };
    
    // Obtener el idioma actual
    const currentLang = document.documentElement.getAttribute('lang') || 'es';
    
    // Buscar todos los elementos con fechas (como p.date)
    const dateElements = document.querySelectorAll('.date');
    
    dateElements.forEach(dateElement => {
        let dateText = dateElement.innerText;
        
        // Manejar la traducción de "Actualidad" a "Present" y viceversa
        if (currentLang === 'en' && dateText.includes(currentTerms.es)) {
            dateText = dateText.replace(currentTerms.es, currentTerms.en);
        } else if (currentLang === 'es' && dateText.includes(currentTerms.en)) {
            dateText = dateText.replace(currentTerms.en, currentTerms.es);
        }
        
        // Reemplazar meses en el texto
        months.es.forEach((month, index) => {
            if (dateText.includes(month)) {
                if (currentLang === 'en') {
                    dateText = dateText.replace(month, months.en[index]);
                }
            }
        });
        
        months.en.forEach((month, index) => {
            if (dateText.includes(month)) {
                if (currentLang === 'es') {
                    dateText = dateText.replace(month, months.es[index]);
                }
            }
        });
        
        // Actualizar el texto
        dateElement.innerText = dateText;
    });
    
    // También traducir específicamente el elemento con data-translate="current"
    const currentElements = document.querySelectorAll('[data-translate="current"]');
    currentElements.forEach(element => {
        if (currentLang === 'es') {
            element.innerText = currentTerms.es;
        } else {
            element.innerText = currentTerms.en;
        }
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
    
    // Traducir tooltips del menú lateral
    const sideMenuLinks = document.querySelectorAll('.side-menu a');
    sideMenuLinks.forEach(link => {
        const href = link.getAttribute('href');
        let key = '';
        
        // Determinar qué clave de traducción usar según el href
        if (href === '#about') key = 'menu-about';
        else if (href === '#projects') key = 'menu-projects';
        else if (href === '#education') key = 'menu-education';
        
        // Aplicar traducción si existe
        if (key && translations[key] && translations[key][lang]) {
            link.setAttribute('data-section', translations[key][lang]);
        }
    });
    translateDates();

}

// Almacén de traducciones
const translations = {
    // Hero section
    'greeting': {
        'es': 'Hola, soy Samuel Tabares León',
        'en': 'Hi, I\'m Samuel Tabares León'
    },
      'job-title': {
    'es': 'Estudiante de Ingeniería de Software',
    'en': 'Software Engineering Student'
  },
  'hero-description': {
    'en': 'Software Engineering student with an <strong>analytical mindset and comprehensive vision</strong> specialized in <strong>full-stack development</strong>. I combine my knowledge in <strong>Python/Django, JavaScript/React, and modern web technologies</strong> to transform concepts into functional and scalable applications. My experience includes <strong>impactful academic and personal projects</strong>, such as a complete veterinary clinic application and an import platform with product rating system. Distinguished by my <strong>self-taught ability and rapid learning</strong>, I\'m passionate about exploring new technologies, especially in <strong>Artificial Intelligence and mobile development</strong>. My meticulous approach focuses on creating <strong>technically sound and user-centered solutions</strong>, constantly seeking to optimize processes and enhance the end-user experience. I transform complex challenges into opportunities to <strong>innovate and create value</strong> through code.',
    'es': 'Estudiante de Ingeniería de Software con <strong>mentalidad analítica y visión integral</strong> especializado en desarrollo <strong>full-stack</strong>. Combino mis conocimientos en <strong>Python/Django, JavaScript/React y tecnologías web modernas</strong> para transformar conceptos en aplicaciones funcionales y escalables. Mi experiencia incluye <strong>proyectos académicos y personales de impacto</strong>, como una aplicación completa para clínica veterinaria y una plataforma de importación con calificación de productos. Destacado por mi <strong>capacidad autodidacta y aprendizaje rápido</strong>, me apasiona explorar nuevas tecnologías, especialmente en <strong>Inteligencia Artificial y desarrollo móvil</strong>. Mi enfoque meticuloso se centra en crear <strong>soluciones técnicamente sólidas y centradas en el usuario</strong>, buscando constantemente optimizar procesos y mejorar la experiencia final. Transformo desafíos complejos en oportunidades para <strong>innovar y crear valor</strong> a través del código.'
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
  'es': '<strong>Desarrollo aplicaciones full-stack utilizando Python/Django, React y tecnologías modernas</strong>, con especial interés en la integración de <strong>inteligencia artificial y experiencias de usuario intuitivas</strong>.',
  'en': '<strong>I develop full-stack applications using Python/Django, React, and modern technologies</strong>, with special interest in integrating <strong>artificial intelligence and intuitive user experiences</strong>.'
},
'about-text-2': {
  'es': 'Actualmente estoy <strong>cursando Ingeniería de Software</strong> mientras trabajo en proyectos personales ambiciosos, incluyendo una <strong>aplicación veterinaria integral</strong> y un emprendimiento para <strong>crear portafolios profesionales personalizados</strong>.',
  'en': 'I am currently <strong>studying Software Engineering</strong> while working on ambitious personal projects, including a <strong>comprehensive veterinary application</strong> and a venture to <strong>create customized professional portfolios</strong>.'
},
'about-text-3': {
  'es': 'Mi objetivo es <strong>construir soluciones digitales innovadoras</strong> que combinen excelencia técnica con <strong>valor real para usuarios y empresas</strong>, aplicando un enfoque meticuloso y orientado a resultados.',
  'en': 'My goal is to <strong>build innovative digital solutions</strong> that combine technical excellence with <strong>real value for users and businesses</strong>, applying a meticulous and results-oriented approach.'
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
    
'ui-ux-heading': {
    'es': 'Diseño UI/UX',
    'en': 'UI/UX Design'
},
'devops-heading': {
    'es': 'DevOps & Infraestructura',
    'en': 'DevOps & Infrastructure'
},
'responsive-design': {
    'es': 'Diseño Responsive',
    'en': 'Responsive Design'
},
'web-accessibility': {
    'es': 'Accesibilidad Web',
    'en': 'Web Accessibility'
},
'wireframing': {
    'es': 'Wireframing',
    'en': 'Wireframing'
},
'user-experience': {
    'es': 'Experiencia de Usuario (UX)',
    'en': 'User Experience (UX)'
},
'vercel-deployment': {
    'es': 'Despliegue en Vercel',
    'en': 'Vercel Deployment'
},
'basic-docker': {
    'es': 'Docker Básico',
    'en': 'Basic Docker'
},
'basic-aws': {
    'es': 'AWS/Azure Básico',
    'en': 'Basic AWS/Azure'
},
'server-management': {
    'es': 'Gestión de Servidores',
    'en': 'Server Management'
},
'api-integration': {
    'es': 'Integración de APIs',
    'en': 'API Integration'
},
'automation': {
    'es': 'Automatización',
    'en': 'Automation'
},


//roadmap sections

'roadmap-heading': {
    'es': 'Mi Camino de Desarrollo',
    'en': 'My Development Roadmap'
},
'current-skills': {
    'es': 'Habilidades Dominadas',
    'en': 'Mastered Skills'
},
'learning-now': {
    'es': 'Fortaleciendo Actualmente',
    'en': 'Currently Strengthening'
},
'future-skills': {
    'es': 'Próximos Objetivos',
    'en': 'Future Goals'
},
'vision': {
    'es': 'Mi Visión Profesional',
    'en': 'My Professional Vision'
},
'vision-text': {
    'es': 'Desarrollar soluciones innovadoras que integren IA y tecnologías full-stack para resolver problemas reales, hacer el mundo más funcional y generar impacto positivo. Me veo creando ecosistemas digitales que combinen excelencia técnica con alto valor para usuarios y empresas.',
    'en': 'Developing innovative solutions that integrate AI and full-stack technologies to solve real problems, make the world more functional, and generate positive impact. I see myself creating digital ecosystems that combine technical excellence with high value for users and businesses.'
},
// Habilidades específicas mencionadas en el roadmap (que podrían necesitar traducción)
'skill-microservices': {
    'es': 'Arquitectura de Microservicios',
    'en': 'Microservices Architecture'
},
'skill-ai-integration': {
    'es': 'Integración APIs de IA (OpenAI)',
    'en': 'AI APIs integration (OpenAI)'
},
'skill-docker': {
    'es': 'Docker/Docker Compose',
    'en': 'Docker/Docker Compose'
},
'skill-design-patterns': {
    'es': 'Patrones de Diseño en Software',
    'en': 'Software Design Patterns'
},
'skill-ai-applications': {
    'es': 'Aplicaciones Prácticas de IA',
    'en': 'Practical AI Applications'
},
'skill-advanced-react': {
    'es': 'React Avanzado',
    'en': 'Advanced React'
},
'skill-ios': {
    'es': 'Desarrollo iOS/Apple',
    'en': 'iOS/Apple Development'
},
'skill-ai-specialization': {
    'es': 'Specialización en IA Aplicada',
    'en': 'Applied AI Specialization'
},
'skill-cloud': {
    'es': 'Cloud Computing (AWS/Azure)',
    'en': 'Cloud Computing (AWS/Azure)'
},
'skill-web3': {
    'es': 'Web3 y Tecnologías Emergentes',
    'en': 'Web3 and Emerging Technologies'
},
'skill-entrepreneurship': {
    'es': 'Emprendimiento Tecnológico',
    'en': 'Tech Entrepreneurship'
},

'status-ongoing': {
    'es': 'En desarrollo',
    'en': 'In progress'
},
'status-completed': {
    'es': 'Completado',
    'en': 'Completed'
},

// Métricas de proyectos
'tech-used': {
    'es': 'Tecnologías:',
    'en': 'Technologies:'
},
'metric-modules': {
    'es': 'Módulos',
    'en': 'Modules'
},
'metric-apis': {
    'es': 'Endpoints API',
    'en': 'API Endpoints'
},
'metric-database': {
    'es': 'Modelos DB',
    'en': 'DB Models'
},
'metric-endpoints': {
    'es': 'API Endpoints',
    'en': 'API Endpoints'
},
'metric-models': {
    'es': 'Modelos DB',
    'en': 'DB Models'
},
'metric-integrations': {
    'es': 'Integraciones',
    'en': 'Integrations'
},
'metric-size': {
    'es': 'Reducción Tamaño',
    'en': 'Size Reduction'
},
'metric-langs': {
    'es': 'Idiomas',
    'en': 'Languages'
},
'metric-performance': {
    'es': 'Performance',
    'en': 'Performance'
},

// Textos específicos de proyectos
'private-project': {
    'es': 'Proyecto Privado <i class="fas fa-lock"></i>',
    'en': 'Private Project <i class="fas fa-lock"></i>'
},

// Menú lateral
'menu-roadmap': {
    'es': 'Camino',
    'en': 'Roadmap'
},
'menu-contact': {
    'es': 'Contacto',
    'en': 'Contact'
},

// Opciones que faltan en el menú
'certificate-link': {
    'es': '<i class="fas fa-award"></i> Ver certificado',
    'en': '<i class="fas fa-award"></i> View certificate'
},
//seccion emprendimiento
'entrepreneurship-heading': {
    'es': 'Emprendimiento',
    'en': 'Entrepreneurship'
},
'portfolio-venture': {
    'es': 'Servicio de Creación de Portafolios Profesionales',
    'en': 'Professional Portfolio Creation Service'
},
'portfolio-venture-desc': {
    'es': 'Transformo perfiles profesionales en presencias digitales impactantes. Ofrezco un servicio completo de diseño y desarrollo de portafolios web personalizados para profesionales y pequeñas empresas.',
    'en': 'I transform professional profiles into impactful digital presences. I offer a complete service of design and development of custom web portfolios for professionals and small businesses.'
},
'service-features': {
    'es': 'Características del Servicio',
    'en': 'Service Features'
},
'feature-1': {
    'es': '<i class="fas fa-check"></i> Diseño personalizado adaptado a la identidad profesional',
    'en': '<i class="fas fa-check"></i> Custom design adapted to professional identity'
},
'feature-2': {
    'es': '<i class="fas fa-check"></i> Optimización SEO para mayor visibilidad',
    'en': '<i class="fas fa-check"></i> SEO optimization for greater visibility'
},
'feature-3': {
    'es': '<i class="fas fa-check"></i> Funcionalidades adaptadas a diferentes necesidades',
    'en': '<i class="fas fa-check"></i> Features adapted to different needs'
},
'feature-4': {
    'es': '<i class="fas fa-check"></i> Experiencia técnica con enfoque en rendimiento',
    'en': '<i class="fas fa-check"></i> Technical expertise with focus on performance'
},
'contact-for-info': {
    'es': 'Contactar para información <i class="fas fa-arrow-right"></i>',
    'en': 'Contact for information <i class="fas fa-arrow-right"></i>'
},
    // Projects section
    'projects-heading': {
        'es': 'Proyectos y Experiencia',
        'en': 'Projects and Experience'
    },
    'portfolio-title': {
        'es': 'Portafolio Web Profesional Optimizado',
        'en': 'Optimized Professional Web Portfolio'
    },
    'portfolio-desc': {
        'es': 'Desarrollo de un portafolio web personal con diseño responsive, cambio de tema claro/oscuro, sistema de cambio de idioma y animaciones dinámicas. Implementación de arquitectura modular y optimización de código para rendimiento.',
        'en': 'Development of a personal web portfolio with responsive design, light/dark theme switching, language change system, and dynamic animations. Implementation of modular architecture and code optimization for performance.'
    },
    'portfolio-tech': {
        'es': '<strong>Tecnologías:</strong> HTML5, CSS3, JavaScript ES6, CSS Variables, CSS Grid, Flexbox, Manipulación del DOM, LocalStorage, CSS Transitions y Transformaciones.',
        'en': '<strong>Technologies:</strong> HTML5, CSS3, JavaScript ES6, CSS Variables, CSS Grid, Flexbox, DOM Manipulation, LocalStorage, CSS Transitions and Transformations.'
    },
    'portfolio-exp-title': {
        'es': 'OPTIMIZACIÓN Y DESARROLLO DE PORTAFOLIO WEB',
        'en': 'WEB PORTFOLIO OPTIMIZATION AND DEVELOPMENT'
    },
    'portfolio-exp-1': {
        'es': '<strong>Refactorizado</strong> el código CSS de múltiples archivos en una solución unificada y optimizada, reduciendo el tamaño en un 40%',
        'en': '<strong>Refactored</strong> CSS code from multiple files into a unified and optimized solution, reducing size by 40%'
    },
    'portfolio-exp-2': {
        'es': '<strong>Implementado</strong> un sistema de cambio de idioma (español/inglés) utilizando JavaScript y almacenamiento local para persistencia',
        'en': '<strong>Implemented</strong> a language switching system (Spanish/English) using JavaScript and local storage for persistence'
    },
    'portfolio-exp-3': {
        'es': '<strong>Optimizado</strong> el rendimiento visual mediante ajustes en los colores y contrastes para mejorar la accesibilidad en ambos temas',
        'en': '<strong>Optimized</strong> visual performance by adjusting colors and contrasts to improve accessibility in both themes'
    },
    'portfolio-exp-4': {
        'es': '<strong>Mejorado</strong> la experiencia de usuario con animaciones y micro-interacciones suavizadas para ambos temas',
        'en': '<strong>Enhanced</strong> user experience with smoothed animations and micro-interactions for both themes'
    },
    'portfolio-exp-5': {
        'es': '<strong>Aplicado</strong> técnicas de optimización para dispositivos móviles, asegurando compatibilidad cross-browser y tiempos de carga reducidos',
        'en': '<strong>Applied</strong> mobile optimization techniques, ensuring cross-browser compatibility and reduced loading times'
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
    'view-demo': {
        'es': 'Ver Demo <i class="fas fa-external-link-alt"></i>',
        'en': 'View Demo <i class="fas fa-external-link-alt"></i>'
    },
    'view-code': {
        'es': 'Ver Código <i class="fab fa-github"></i>',
        'en': 'View Code <i class="fab fa-github"></i>'
    },
    'veterinary-title': {
    'es': 'Backend para Plataforma de Gestión Veterinaria',
    'en': 'Backend for Veterinary Management Platform'
},
'veterinary-desc': {
    'es': 'Desarrollo completo del backend para un sistema integral de gestión de clínicas veterinarias. Diseño e implementación de la arquitectura de datos, lógica de negocio, APIs y servicios para soportar múltiples módulos: pacientes, agendamiento, historias clínicas, prescripción y facturación.',
    'en': 'Complete backend development for a comprehensive veterinary clinic management system. Design and implementation of data architecture, business logic, APIs, and services to support multiple modules: patients, scheduling, medical records, prescription, and billing.'
},
'veterinary-exp-title': {
    'es': 'DESARROLLO BACKEND PARA SISTEMA VETERINARIO',
    'en': 'BACKEND DEVELOPMENT FOR VETERINARY SYSTEM'
},
'veterinary-exp-1': {
    'es': '<strong>Diseñado</strong> una arquitectura backend completa con 8 servicios interconectados y estructura de datos normalizada',
    'en': '<strong>Designed</strong> a complete backend architecture with 8 interconnected services and normalized data structure'
},
'veterinary-exp-2': {
    'es': '<strong>Implementado</strong> sistema de autenticación y autorización con 5 perfiles de usuario y permisos granulares',
    'en': '<strong>Implemented</strong> authentication and authorization system with 5 user profiles and granular permissions'
},
'veterinary-exp-3': {
    'es': '<strong>Desarrollado</strong> APIs RESTful para manipulación de historias clínicas, con soporte para documentos binarios y versionado',
    'en': '<strong>Developed</strong> RESTful APIs for medical records manipulation, with support for binary documents and versioning'
},
'veterinary-exp-4': {
    'es': '<strong>Creado</strong> algoritmos de optimización para agendamiento de citas y sistema de notificaciones automatizadas',
    'en': '<strong>Created</strong> optimization algorithms for appointment scheduling and automated notification system'
},
'veterinary-exp-5': {
    'es': '<strong>Integrado</strong> lógica de negocio para facturación con cálculos fiscales y reportes personalizados',
    'en': '<strong>Integrated</strong> business logic for billing with tax calculations and custom reports'
},
'metric-apis': {
    'es': 'Endpoints API',
    'en': 'API Endpoints'
},
'metric-database': {
    'es': 'Modelos DB',
    'en': 'DB Models'
},
'backend-role': {
    'es': 'Rol: Backend Lead <i class="fas fa-server"></i>',
    'en': 'Role: Backend Lead <i class="fas fa-server"></i>'
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
    'certificate-badge': {
    'es': 'Certificado Oficial',
    'en': 'Official Certificate'
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
    },
    'legal-text': {
    'es': 'Este sitio web, incluyendo todo su contenido, diseño, código y elementos visuales, está protegido por leyes nacionales e internacionales de propiedad intelectual.',
    'en': 'This website, including all its content, design, code, and visual elements, is protected by national and international intellectual property laws.'
},
'terms-link': {
    'es': 'Términos y Condiciones',
    'en': 'Terms and Conditions'
},
'copy-warning': {
    'es': 'Copia de contenido deshabilitada. El contenido de este sitio web está protegido por leyes de derechos de autor.',
    'en': 'Content copying is disabled. The content of this website is protected by copyright law.'
},
    
    // Tooltips del menú lateral
    'menu-about': {
        'es': 'Sobre Mí',
        'en': 'About Me'
    },
    'menu-projects': {
        'es': 'Proyectos',
        'en': 'Projects'
    },
    'menu-education': {
        'es': 'Educación',
        'en': 'Education'
    }
};

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupLanguageToggle();
});