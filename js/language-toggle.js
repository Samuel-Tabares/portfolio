// Objeto global para el efecto typing
const TypingEffect = {
  // Configuración
texts: {
  'es': "construyendo agentes de IA y backends a medida",
  'en': "building AI agents and custom backends"
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

// Meta description / OG / Twitter / title — kept in sync with current language
// so social previews and SEO snapshots match what the visitor sees.
const metaCopy = {
    es: {
        title: 'Samuel Tabares León | Software Engineer & Builder · AI Agents',
        description: 'Software engineer y builder. Construyo agentes de IA y backends a medida que automatizan problemas cotidianos. Python, Rust, sistemas multi-agente y automatización.'
    },
    en: {
        title: 'Samuel Tabares León | Software Engineer & Builder · AI Agents',
        description: 'Software engineer and builder. I build custom AI agents and backends that automate everyday problems. Python, Rust, multi-agent systems and automation.'
    }
};

function syncMetaForLang(lang) {
    const copy = metaCopy[lang] || metaCopy.es;
    document.title = copy.title;

    const selectors = [
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="twitter:title"]',
        'meta[property="twitter:description"]'
    ];

    selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        if (sel.includes('title')) {
            el.setAttribute('content', copy.title);
        } else {
            el.setAttribute('content', copy.description);
        }
    });
}

// Función para manejar el cambio de idioma
function setupLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;

    const currentLang = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('lang', currentLang);
    langToggle.classList.add(`${currentLang}-active`);

    translatePage(currentLang);
    syncMetaForLang(currentLang);
    setupTypingAnimation();

    langToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'es' ? 'en' : 'es';

        langToggle.classList.remove(`${currentLang}-active`);
        langToggle.classList.add(`${newLang}-active`);

        localStorage.setItem('language', newLang);
        document.documentElement.setAttribute('lang', newLang);

        translatePage(newLang);
        syncMetaForLang(newLang);
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
    const currentLang = document.documentElement.getAttribute('lang') || 'en';

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
                else if (href === '#roadmap') key = 'menu-roadmap';
                else if (href === '#contact') key = 'menu-contact';
        
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
    'es': 'Software Engineer & Builder',
    'en': 'Software Engineer & Builder'
  },
  'hero-description': {
    'es': 'Diseño y construyo <strong>agentes de IA, sistemas multi-agente y backends personalizados</strong> — soluciones hechas a medida, no plantillas. Mi foco hoy es la <strong>IA aplicada</strong>: agentes autónomos, automatización, RAG y LLMs, con una base sólida de ingeniería backend en <strong>Python y Rust</strong>. Si tenés un problema real que vale la pena resolver con tecnología nueva, hablemos.',
    'en': 'I design and build <strong>AI agents, multi-agent systems and custom backends</strong> — tailored solutions, not templates. My focus today is <strong>applied AI</strong>: autonomous agents, automation, RAG and LLMs, on a solid backend foundation in <strong>Python and Rust</strong>. If you have a real problem worth solving with new tech, let\'s talk.'
  },
  'job-title-en-redundant': { 'es': '', 'en': '' },
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
  'es': 'Soy software engineer y <strong>builder</strong>. Construyo <strong>agentes de IA y sistemas backend a medida</strong> que automatizan procesos manuales y resuelven problemas concretos. Mi sweet spot: soluciones 100% personalizadas — agentes autónomos self-hosted, sistemas multi-agente e integraciones complejas — no plantillas ni código que se rompe en seis meses.',
  'en': 'I\'m a software engineer and <strong>builder</strong>. I create <strong>custom AI agents and backend systems</strong> that automate manual work and solve concrete problems. My sweet spot: 100% tailored solutions — self-hosted autonomous agents, multi-agent systems and complex integrations — not templates, not code that breaks in six months.'
},
'about-text-2': {
  'es': 'Voy más allá del agente "básico" de n8n: trabajo con frameworks de agentes autónomos totalmente personalizables (como OpenClaw) y orquestación multi-agente. Y todo eso lo sostengo con ingeniería backend real — he construido desde un <strong>bot de pedidos en producción escrito en Rust</strong> hasta <strong>arquitecturas de microservicios</strong> y <strong>backends Django con 20+ endpoints</strong>. Cada proyecto, un problema real, no una demo.',
  'en': 'I go beyond the "basic" n8n agent: I work with fully customizable autonomous agent frameworks (like OpenClaw) and multi-agent orchestration. And I back it all with real backend engineering — I\'ve built everything from a <strong>production WhatsApp ordering bot written in Rust</strong> to <strong>microservice architectures</strong> and <strong>Django backends with 20+ endpoints</strong>. Every project, a real problem, not a demo.'
},
'about-text-3': {
  'es': 'Trabajo de forma <strong>directa y enfocada</strong>: pocas reuniones, mucho código, decisiones documentadas. Aprendo rápido y me adapto a lo que el problema necesite. Si querés algo <strong>construido bien la primera vez</strong>, esa es la idea.',
  'en': 'I work <strong>directly and focused</strong>: few meetings, lots of code, documented decisions. I learn fast and adapt to whatever the problem needs. If you want something <strong>built right the first time</strong>, that\'s the idea.'
},
    'personal-skills': {
        'es': 'Competencias Personales',
        'en': 'Personal Skills'
    },
    'skill-problem-solving': {
        'es': 'Resolución de problemas',
        'en': 'Problem-solving'
    },
    'skill-fast-learning': {
        'es': 'Aprendizaje rápido',
        'en': 'Fast learner'
    },
    'skill-critical-thinking': {
        'es': 'Pensamiento crítico',
        'en': 'Critical thinking'
    },
    'skill-adaptive': {
        'es': 'Alta adaptabilidad',
        'en': 'Highly adaptive'
    },
    'skill-product-thinking': {
        'es': 'Visión de producto',
        'en': 'Product thinking'
    },
    
    // Skills section
    'skills-heading': {
        'es': 'Habilidades Técnicas',
        'en': 'Technical Skills'
    },
    'ai-agents-heading': {
        'es': 'IA & Agentes',
        'en': 'AI & Agents'
    },
    'languages-heading': {
        'es': 'Lenguajes',
        'en': 'Languages'
    },
    'backend-heading': {
        'es': 'Backend',
        'en': 'Backend'
    },
    'frontend-heading': {
        'es': 'Frontend',
        'en': 'Frontend'
    },
    'databases-heading': {
        'es': 'Bases de Datos',
        'en': 'Databases'
    },
    'devops-heading': {
        'es': 'DevOps & Herramientas',
        'en': 'DevOps & Tools'
    },
    'skill-ai-agents': {
        'es': 'Agentes de IA',
        'en': 'AI agents'
    },
    'skill-multi-agent': {
        'es': 'Sistemas multi-agente',
        'en': 'Multi-agent systems'
    },
    'skill-llms': {
        'es': 'LLMs (OpenAI / locales)',
        'en': 'LLMs (OpenAI / local)'
    },
    'skill-rag': {
        'es': 'RAG · Pinecone',
        'en': 'RAG · Pinecone'
    },
    'skill-rest-apis': {
        'es': 'REST APIs · JWT',
        'en': 'REST APIs · JWT'
    },
    'skill-microservices-arch': {
        'es': 'Microservicios · Hexagonal',
        'en': 'Microservices · Hexagonal'
    },
    'skill-responsive-a11y': {
        'es': 'Responsive · Accesibilidad',
        'en': 'Responsive · Accessibility'
    },
    'skill-automation-n8n': {
        'es': 'Automatización · n8n',
        'en': 'Automation · n8n'
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
    'es': 'Crear algo nuevo que resuelva los problemas que el avance tecnológico acelerado está trayendo. Me proyecto hacia donde la tecnología vaya marcando el rumbo — igual que me moví hacia los agentes de IA cuando emergieron. Quiero construir productos que combinen IA, automatización e ingeniería sólida para hacerle la vida más fácil a las personas y ofrecer lo que nadie más ofrece.',
    'en': 'To build something new that solves the problems brought by accelerating technology. I move toward wherever tech is heading — just as I moved into AI agents when they emerged. I want to build products that combine AI, automation and solid engineering to make people\'s lives easier and offer what nobody else does.'
},
// Habilidades específicas mencionadas en el roadmap (que podrían necesitar traducción)
'skill-python-django': {
    'es': 'Python / Django / Django REST',
    'en': 'Python / Django / Django REST'
},
'skill-backend-arch': {
    'es': 'Backend & arquitectura (microservicios, hexagonal)',
    'en': 'Backend & architecture (microservices, hexagonal)'
},
'skill-ai-integration': {
    'es': 'Integración de APIs de IA (OpenAI)',
    'en': 'AI APIs integration (OpenAI)'
},
'skill-restful-pg-docker': {
    'es': 'RESTful APIs · PostgreSQL · Docker',
    'en': 'RESTful APIs · PostgreSQL · Docker'
},
'skill-js-react-ts': {
    'es': 'JavaScript / React · TypeScript',
    'en': 'JavaScript / React · TypeScript'
},
'skill-autonomous-agents': {
    'es': 'Agentes de IA autónomos & multi-agente',
    'en': 'Autonomous & multi-agent AI'
},
'skill-rust-backend': {
    'es': 'Rust (axum, tokio) para backend & sistemas',
    'en': 'Rust (axum, tokio) for backend & systems'
},
'skill-rag-llm-vector': {
    'es': 'RAG, LLMs locales & vector databases (Pinecone)',
    'en': 'RAG, local LLMs & vector databases (Pinecone)'
},
'skill-openclaw': {
    'es': 'OpenClaw / frameworks de agentes self-hosted',
    'en': 'OpenClaw / self-hosted agent frameworks'
},
'skill-applied-ml': {
    'es': 'Machine Learning aplicado',
    'en': 'Applied Machine Learning'
},
'skill-ruby-learning': {
    'es': 'Ruby (en aprendizaje)',
    'en': 'Ruby (learning)'
},
'skill-ai-saas': {
    'es': 'Productos de IA como servicio (Agents-as-a-Service / SaaS)',
    'en': 'AI products as a service (Agents-as-a-Service / SaaS)'
},
'skill-ai-web3': {
    'es': 'Integración IA × Web3 / blockchain',
    'en': 'AI × Web3 / blockchain integration'
},
'skill-ml-finetuning': {
    'es': 'Profundización en ML & fine-tuning',
    'en': 'Deeper ML & fine-tuning'
},
'skill-advanced-cloud': {
    'es': 'Cloud avanzado',
    'en': 'Advanced cloud'
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
'status-in-progress': {
    'es': 'En construcción',
    'en': 'In progress'
},
'status-production': {
    'es': 'En producción',
    'en': 'In production'
},
'in-construction-badge': {
    'es': 'En construcción <i class="fas fa-hammer"></i>',
    'en': 'In progress <i class="fas fa-hammer"></i>'
},
'production-badge': {
    'es': 'En producción <i class="fas fa-circle-check"></i>',
    'en': 'In production <i class="fas fa-circle-check"></i>'
},

// AI SaaS project
'ai-saas-title': {
    'es': 'SaaS de IA Personal Multi-Modelo',
    'en': 'Multi-Model Personal AI SaaS'
},
'ai-saas-desc': {
    'es': 'Asistente de IA personal donde hablás con distintos modelos en un solo lugar, con memoria persistente e integración a tus apps (correo, calendario, documentos). Genera PDFs y correos, ajusta tu calendario y recopila información por vos. Un SaaS que centraliza tu IA, resolviendo el problema de tener modelos dispersos sin memoria entre ellos.',
    'en': 'A personal AI assistant where you talk to multiple models in one place, with persistent memory and integration to your apps (email, calendar, documents). It generates PDFs and emails, adjusts your calendar and gathers information for you. A SaaS that centralizes your AI, solving the problem of scattered models with no memory between them.'
},

// Multi-Agent system
'multi-agent-title': {
    'es': 'Sistema Multi-Agente',
    'en': 'Multi-Agent System'
},
'multi-agent-desc': {
    'es': 'Sistema de agentes de IA especializados que se comunican entre sí, cada uno dedicado a una función concreta. Construido para una vertical real (oficios/tradies en Australia). Demuestra orquestación multi-agente: agentes que colaboran, se pasan tareas y resuelven en conjunto.',
    'en': 'A system of specialized AI agents that communicate with each other, each dedicated to a specific function. Built for a real vertical (tradies in Australia). Demonstrates multi-agent orchestration: agents that collaborate, hand off tasks and solve together.'
},

// Trabix
'trabix-title': {
    'es': 'Trabix — Bot de pedidos en Rust',
    'en': 'Trabix — Ordering bot in Rust'
},
'trabix-desc': {
    'es': 'Bot de pedidos por WhatsApp para un negocio real, escrito en <strong>Rust</strong>. Sistema completo, no demo: máquina de estados de conversación, persistencia en PostgreSQL, flujo de pedidos y checkout, handoff a asesor, timers con recuperación de timeouts, y un simulador local que corre el mismo runtime de producción. Dockerizado y desplegado en Railway.',
    'en': 'WhatsApp ordering bot for a real business, written in <strong>Rust</strong>. A full system, not a demo: conversation state machine, PostgreSQL persistence, order & checkout flow, advisor handoff, timers with timeout recovery, and a local simulator running the same production runtime. Dockerized and deployed on Railway.'
},
'metric-commits': {
    'es': 'Commits',
    'en': 'Commits'
},
'metric-releases': {
    'es': 'Releases',
    'en': 'Releases'
},
'metric-agents': {
    'es': 'Agentes',
    'en': 'Agents'
},
'metric-models': {
    'es': 'Modelos IA',
    'en': 'AI Models'
},
'lead-dev-role': {
    'es': 'Rol: Builder & Lead Dev <i class="fas fa-hammer"></i>',
    'en': 'Role: Builder & Lead Dev <i class="fas fa-hammer"></i>'
},
'ai-builder-role': {
    'es': 'Rol: AI Builder <i class="fas fa-robot"></i>',
    'en': 'Role: AI Builder <i class="fas fa-robot"></i>'
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


// Proyecto Sistema de Perfumería
'perfumeria-title': {
    'es': 'Sistema de Perfumería - Arquitectura de Microservicios',
    'en': 'Perfumery System - Microservices Architecture'
},
'perfumeria-desc': {
    'es': 'Sistema integral para la gestión de una perfumería implementado como arquitectura completa de microservicios con API Gateway centralizado e interfaces de usuario individuales. Demuestra integración entre Java, Python y Node.js con gestión completa de proveedores, clientes y productos.',
    'en': 'Comprehensive system for perfumery management implemented as a complete microservices architecture with centralized API Gateway and individual user interfaces. Demonstrates integration between Java, Python, and Node.js with complete management of suppliers, clients, and products.'
},
'perfumeria-exp-title': {
    'es': 'DESARROLLO DE ARQUITECTURA DE MICROSERVICIOS',
    'en': 'MICROSERVICES ARCHITECTURE DEVELOPMENT'
},
'perfumeria-exp-1': {
    'es': '<strong>Diseñado</strong> una arquitectura completa de microservicios con API Gateway centralizado para gestión unificada de 4 servicios independientes',
    'en': '<strong>Designed</strong> a complete microservices architecture with centralized API Gateway for unified management of 4 independent services'
},
'perfumeria-exp-2': {
    'es': '<strong>Implementado</strong> microservicios usando múltiples tecnologías: Java/Spring Boot para proveedores, Python/FastAPI para clientes, y Node.js/Express para productos',
    'en': '<strong>Implemented</strong> microservices using multiple technologies: Java/Spring Boot for suppliers, Python/FastAPI for clients, and Node.js/Express for products'
},
'perfumeria-exp-3': {
    'es': '<strong>Desarrollado</strong> interfaces de usuario individuales para cada microservicio con gestión CRUD completa y navegación intuitiva',
    'en': '<strong>Developed</strong> individual user interfaces for each microservice with complete CRUD management and intuitive navigation'
},
'perfumeria-exp-4': {
    'es': '<strong>Creado</strong> scripts de automatización para inicio/parada del sistema completo con detección automática de servicios en ejecución',
    'en': '<strong>Created</strong> automation scripts for complete system startup/shutdown with automatic detection of running services'
},
'perfumeria-exp-5': {
    'es': '<strong>Configurado</strong> containerización con Docker, migraciones de BD automáticas (Alembic, JPA, Sequelize) y documentación API con Swagger',
    'en': '<strong>Configured</strong> Docker containerization, automatic DB migrations (Alembic, JPA, Sequelize), and API documentation with Swagger'
},

// Métricas específicas del proyecto
'metric-microservices': {
    'es': 'Microservicios',
    'en': 'Microservices'
},
'metric-technologies': {
    'es': 'Tecnologías',
    'en': 'Technologies'
},

// Rol específico
'architect-role': {
    'es': 'Rol: Arquitecto Full-Stack <i class="fas fa-sitemap"></i>',
    'en': 'Role: Full-Stack Architect <i class="fas fa-sitemap"></i>'
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
    'german': {
        'es': 'ALEMÁN',
        'en': 'GERMAN'
    },
    'german-level': {
        'es': 'En proceso — A1',
        'en': 'In progress — A1'
    },
    'certificate-badge': {
    'es': 'Certificado Oficial',
    'en': 'Official Certificate'
},
    
    // Contact section
    'contact-heading': {
        'es': 'Trabajemos juntos',
        'en': 'Let\'s work together'
    },
    'contact-description': {
        'es': 'Disponible para <strong>proyectos freelance</strong>: agentes de IA, automatización, backends a medida e integraciones. Contame tu proyecto y te respondo en menos de 24h con un primer estimado claro de alcance y tiempos. Si encaja, encaja.',
        'en': 'Available for <strong>freelance projects</strong>: AI agents, automation, custom backends and integrations. Tell me about your project and I\'ll reply within 24h with a clear first estimate of scope and timeline. If it fits, it fits.'
    },
    'form-name': { 'es': 'Nombre', 'en': 'Name' },
    'form-email': { 'es': 'Email', 'en': 'Email' },
    'form-whatsapp': { 'es': 'WhatsApp:', 'en': 'WhatsApp:' },
    'composer-to':      { 'es': 'Para:', 'en': 'To:' },
    'composer-from':    { 'es': 'De:', 'en': 'From:' },
    'composer-subject': { 'es': 'Asunto:', 'en': 'Subject:' },
    'form-ph-name':    { 'es': 'Tu nombre', 'en': 'Your name' },
    'form-ph-email':   { 'es': 'tu@correo.com', 'en': 'you@email.com' },
    'form-ph-message': {
        'es': 'Hola Samuel, quiero contarte sobre mi proyecto…',
        'en': 'Hi Samuel, I want to tell you about my project…'
    },
    'form-project-type': { 'es': 'Tipo de proyecto', 'en': 'Project type' },
    'form-budget': { 'es': 'Presupuesto estimado (USD)', 'en': 'Estimated budget (USD)' },
    'form-budget-unsure': { 'es': 'Aún no lo tengo claro', 'en': 'Not sure yet' },
    'form-message': { 'es': 'Contame el proyecto', 'en': 'Tell me about the project' },
    'form-submit': { 'es': 'Enviar', 'en': 'Send' },
    'form-select-placeholder': { 'es': 'Seleccioná una opción', 'en': 'Select an option' },
    'form-opt-ai-agent': { 'es': 'Agente de IA / automatización', 'en': 'AI agent / automation' },
    'form-opt-backend': { 'es': 'Backend / API a medida', 'en': 'Custom backend / API' },
    'form-opt-ai': { 'es': 'Integración de IA', 'en': 'AI integration' },
    'form-opt-mvp': { 'es': 'MVP desde cero', 'en': 'MVP from scratch' },
    'form-opt-other': { 'es': 'Otro', 'en': 'Other' },
    'form-fallback-text': { 'es': 'o escribime directo a', 'en': 'or email me directly at' },
    'form-status-sending': { 'es': 'Enviando…', 'en': 'Sending…' },
    'form-status-success': { 'es': '✓ Mensaje enviado. Te respondo en menos de 24h.', 'en': '✓ Message sent. I\'ll reply within 24h.' },
    'form-status-error': { 'es': 'Algo falló. Probá enviarme un email directo mientras.', 'en': 'Something failed. Try emailing me directly in the meantime.' },
    'skip-link-text': { 'es': 'Saltar al contenido', 'en': 'Skip to content' },
    
    // References section
    'references-heading': {
        'es': 'Referencias',
        'en': 'References'
    },

    // Testimonials section
    'testimonials-heading': {
        'es': 'Lo que dicen',
        'en': 'What they say'
    },
    'testimonial-1-quote': {
        'es': 'Samuel entrega rápido y la calidad del código se ve. Documenta las decisiones, no improvisa.',
        'en': 'Samuel delivers fast and the code quality shows. He documents decisions, doesn\'t improvise.'
    },
    'testimonial-1-role': {
        'es': 'Docente — Ingeniería de Software',
        'en': 'Professor — Software Engineering'
    },
    'testimonial-2-quote': {
        'es': 'Se nota que piensa la arquitectura antes de codear. Eso ahorra meses de refactor después.',
        'en': 'You can tell he thinks through the architecture before coding. Saves months of refactor down the line.'
    },
    'testimonial-2-role': {
        'es': 'Compañera de carrera — Ingeniería de Software',
        'en': 'Classmate — Software Engineering'
    },
    'testimonials-note': {
        'es': '¿Trabajamos juntos? Si te sirve, te pido el quote después del proyecto.',
        'en': 'Worked with me? Happy to swap a quote for the testimonial after we ship.'
    },

    // GitHub stats
    'github-stats-heading': {
        'es': 'Actividad en GitHub',
        'en': 'GitHub activity'
    },
    'gh-heatmap-title': {
        'es': 'Mapa de contribuciones — año en curso',
        'en': 'Contribution heatmap — year to date'
    },
    'gh-heatmap-meta': {
        'es': 'Desde enero de 2026',
        'en': 'Since January 2026'
    },
    'gh-summary-title': {
        'es': 'Resumen de lenguajes',
        'en': 'Language summary'
    },
    'gh-summary-meta': {
        'es': 'Por repos · por commits',
        'en': 'By repos · by commits'
    },
    'gh-activity-title': {
        'es': 'Gráfico de actividad',
        'en': 'Activity graph'
    },
    'gh-activity-meta': {
        'es': 'Últimos 12 meses',
        'en': 'Past 12 months'
    },
    'gh-loading': {
        'es': 'Cargando…',
        'en': 'Loading…'
    },
    'gh-heatmap-empty': {
        'es': 'Sin contribuciones públicas todavía este año.',
        'en': 'No public contributions yet this year.'
    },
    'gh-heatmap-error': {
        'es': 'El servicio del mapa no está disponible.',
        'en': 'Heatmap service unavailable.'
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
    },
        'menu-roadmap': {
        'es': 'Camino',
        'en': 'Roadmap'
    },
            'menu-contact': {
        'es': 'Contacto',
        'en': 'Contact'
    },
};

// Expose the translation dictionary to other scripts (e.g. the contact-form
// status messages live in script.js but need bilingual strings).
window.translations = translations;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupLanguageToggle();
});