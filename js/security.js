// security.js - Versión con solución definitiva para el problema del cursor
(function() {
    // Verificar si estamos en un iframe y bloquear si es así (anti-embedding)
    if (window.top !== window.self) {
        document.body.innerHTML = 'Ver este sitio en iframe no está permitido.';
        return;
    }
    
    // ============= CONFIGURAR CURSOR GLOBAL =============
    // Aplicar cursor de puntero a todo el documento
    function applyCursorStyles() {
        // Eliminar cualquier hoja de estilo anterior que hayamos creado
        const oldStyleElement = document.getElementById('security-cursor-styles');
        if (oldStyleElement) {
            oldStyleElement.remove();
        }
        
        // Crear un estilo para el cursor global
        const styleElement = document.createElement('style');
        styleElement.id = 'security-cursor-styles';
        styleElement.type = 'text/css';
        styleElement.innerHTML = `
            /* Estilos base para todos los elementos */
            body * {
                cursor: default;
            }
            
            /* Cursor de mano para los elementos interactivos - con alta especificidad */
            html body a,
            html body button,
            html body .cta-button,
            html body .social-link,
            html body .social-links a,
            html body #theme-switch,
            html body .theme-toggle-btn,
            html body #lang-toggle,
            html body .lang-toggle-btn,
            html body .lang-option,
            html body .side-menu a,
            html body .side-menu li,
            html body .project-link,
            html body .project-links a,
            html body .certificate a,
            html body .back-link,
            html body .logo,
            html body [role="button"],
            html body input[type="submit"],
            html body input[type="button"],
            html body input[type="reset"],
            html body .contact-method {
                cursor: pointer !important;
            }
            
            /* Selección aún más específica para elementos problemáticos */
            html body #theme-switch *,
            html body .theme-toggle-btn *,
            html body #lang-toggle *,
            html body .lang-toggle-btn *,
            html body .lang-option *,
            html body .social-link *,
            html body .social-links a * {
                cursor: pointer !important;
            }
            
            /* Cursor de texto para campos de entrada */
            html body input:not([type="submit"]):not([type="button"]):not([type="reset"]),
            html body textarea,
            html body [contenteditable="true"] {
                cursor: text !important;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Función para aplicar directamente el cursor a elementos difíciles
    function applyInlineCursorStyles() {
        // Lista de selectores para elementos que necesitan el cursor pointer
        const pointerSelectors = [
            '#theme-switch', '.theme-toggle-btn', 
            '#lang-toggle', '.lang-toggle-btn', '.lang-option',
            '.social-link', '.social-links a', 
            '.cta-button', '.project-link', '.project-links a',
            '.side-menu a', '.side-menu li',
            '.logo', '.back-link', '.certificate a'
        ];
        
        // Seleccionar elementos y modificar directamente el atributo style
        pointerSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el) {
                    // Establecer el estilo inline con !important
                    el.style.setProperty('cursor', 'pointer', 'important');
                    
                    // También aplicar a todos los hijos
                    Array.from(el.querySelectorAll('*')).forEach(child => {
                        child.style.setProperty('cursor', 'pointer', 'important');
                    });
                }
            });
        });
        
        // Forzar específicamente elementos por ID que podrían ser problemáticos
        const themeBtn = document.getElementById('theme-switch');
        const langBtn = document.getElementById('lang-toggle');
        
        if (themeBtn) {
            themeBtn.style.setProperty('cursor', 'pointer', 'important');
            Array.from(themeBtn.querySelectorAll('*')).forEach(child => {
                child.style.setProperty('cursor', 'pointer', 'important');
            });
        }
        
        if (langBtn) {
            langBtn.style.setProperty('cursor', 'pointer', 'important');
            Array.from(langBtn.querySelectorAll('*')).forEach(child => {
                child.style.setProperty('cursor', 'pointer', 'important');
            });
        }
    }
    
    // ============= DESHABILITAR CLIC DERECHO =============
    document.addEventListener('contextmenu', function(e) {
        // No bloquear en elementos de formulario (para permitir funcionalidades como corrección ortográfica)
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        
        e.preventDefault();
        showCopyMessage();
        return false;
    }, true);

    // ============= DESHABILITAR ATAJOS DE TECLADO =============
    document.addEventListener('keydown', function(e) {
        // Prevenir F12 (DevTools)
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            showCopyMessage();
            return false;
        }
        
        // Prevenir Ctrl+Shift+I / Cmd+Option+I (Inspector)
        if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) || 
            (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73))) {
            e.preventDefault();
            showCopyMessage();
            return false;
        }
        
        // Prevenir Ctrl+Shift+J / Cmd+Option+J (Console)
        if ((e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) || 
            (e.metaKey && e.altKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74))) {
            e.preventDefault();
            showCopyMessage();
            return false;
        }
        
        // Prevenir Ctrl+U / Cmd+Option+U (View Source)
        if ((e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) || 
            (e.metaKey && e.altKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85))) {
            e.preventDefault();
            showCopyMessage();
            return false;
        }
        
        // Prevenir Ctrl+S / Cmd+S (Save)
        if ((e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) || 
            (e.metaKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83))) {
            e.preventDefault();
            showCopyMessage();
            return false;
        }
        
        // Prevenir Ctrl+Shift+C / Cmd+Option+C (Inspector Elements)
        if ((e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) ||
            (e.metaKey && e.altKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67))) {
            e.preventDefault();
            showCopyMessage();
            return false;
        }
        
        // No bloquear otras teclas para permitir navegación normal
    }, true);

    // ============= DESHABILITAR SELECCIÓN DE TEXTO =============
    document.addEventListener('selectstart', function(e) {
        // Permitir selección en campos de formulario
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        
        e.preventDefault();
        return false;
    }, true);
    
    // ============= BLOQUEAR ARRASTRAR IMÁGENES =============
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, true);
    
    // Asegurarnos que todas las imágenes tengan draggable="false"
    function disableDraggableImages() {
        document.querySelectorAll('img').forEach(function(img) {
            img.setAttribute('draggable', 'false');
            img.style.webkitUserDrag = 'none'; // Para Safari
        });
    }
    
    // ============= BLOQUEAR COPIAR TEXTO =============
    document.addEventListener('copy', function(e) {
        // Permitir copiar en campos de formulario
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        
        e.preventDefault();
        showCopyMessage();
        return false;
    }, true);
    
    // ============= OBSERVAR CAMBIOS EN EL DOM =============
    // Configurar un MutationObserver para detectar cambios en el DOM
    const observeDOM = (function(){
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        
        return function(obj, callback){
            if(!obj || obj.nodeType !== 1) return; 
            
            if(MutationObserver){
                // Configurar un nuevo observer
                const mutationObserver = new MutationObserver(callback);
                
                // Observar cambios en el childList y subárboles
                mutationObserver.observe(obj, { childList: true, subtree: true });
                
                return mutationObserver;
            } 
            else if(window.addEventListener){
                // Fallback para navegadores que no soportan MutationObserver
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();
    
    // ============= BLOQUEAR INSPECCIÓN DE ELEMENTOS =============
    // Detectar apertura de DevTools mediante cambio de tamaño de consola
    let devToolsDetected = false;
    
    const devtools = {
        isOpen: false,
        orientation: undefined
    };
    
    // Función para mostrar mensaje de copia
    function showCopyMessage() {
        // Verificar si ya existe el mensaje para evitar duplicados
        if (document.getElementById('copy-message')) {
            return;
        }
        
        // Detectar idioma actual para mostrar el mensaje correcto
        const isEnglish = document.documentElement.getAttribute('lang') === 'en';
        
        // Crear el elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.id = 'copy-message';
        messageElement.style.position = 'fixed';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.backgroundColor = 'rgba(35, 35, 35, 0.95)';
        messageElement.style.color = '#fff';
        messageElement.style.padding = '15px 25px';
        messageElement.style.borderRadius = '8px';
        messageElement.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        messageElement.style.zIndex = '10000';
        messageElement.style.textAlign = 'center';
        messageElement.style.fontSize = '16px';
        messageElement.style.maxWidth = '80%';
        messageElement.style.cursor = 'default';
        
        // Mensaje según idioma
        messageElement.textContent = isEnglish 
            ? 'Content copying is disabled. The content of this website is protected by copyright law.'
            : 'Copia de contenido deshabilitada. El contenido de este sitio web está protegido por leyes de derechos de autor.';
        
        // Añadir al DOM
        document.body.appendChild(messageElement);
        
        // Eliminar después de 3 segundos
        setTimeout(function() {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }
    
    // Detección de DevTools basada en debugger
    // Detección mejorada de DevTools
function detectDevTools() {
    const threshold = 160;
    
    // Método 1: Comparar dimensiones de ventana
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    // Método 2: Revisar el objeto console
    let consoleOpen = false;
    const div = document.createElement('div');
    
    Object.defineProperty(div, 'id', {
        get: function() {
            consoleOpen = true;
            return 'id';
        }
    });
    
    // Evitar errores en caso de consola deshabilitada
    try {
        console.log('%c', div);
        console.clear();
    } catch(e) {}
    
    // Método 3: Verificar si las funciones de la consola han sido sobrescritas
    let nativeConsoleLog = true;
    try {
        nativeConsoleLog = console.log.toString().includes('[native code]');
    } catch(e) {}
    
    // Combinar resultados
    if (widthThreshold || heightThreshold || consoleOpen || !nativeConsoleLog) {
        if (!devToolsDetected) {
            devToolsDetected = true;
            showCopyMessage();
        }
        return true;
    }
    
    devToolsDetected = false;
    return false;
}

// Ejecutar la detección periódicamente
setInterval(function() {
    const result = detectDevTools();
    
    // Actualizar el estado de devtools
    devtools.isOpen = result;
    devtools.orientation = (window.outerWidth - window.innerWidth > 160) ? 'vertical' : 'horizontal';
    
}, 1000);
    
    // ============= FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN =============
    function updateAll() {
        // 1. Aplicar estilos de cursor global vía CSS
        applyCursorStyles();
        
        // 2. Aplicar estilos inline a elementos específicos
        applyInlineCursorStyles();
        
        // 3. Desactivar arrastre de imágenes
        disableDraggableImages();
        
        // 4. Aplicar userSelect: none a todo el texto no editable
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li').forEach(element => {
            // Solo aplicar si no es un campo de formulario o está dentro de un link/botón
            if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA' && 
                !element.closest('a') && !element.closest('button')) {
                
                // Aplicar todas las variantes de userSelect
                element.style.userSelect = 'none';
                element.style.webkitUserSelect = 'none';
                element.style.mozUserSelect = 'none';
                element.style.msUserSelect = 'none';
            }
        });
    }
    
    // ============= EJECUTAR AL CARGAR =============
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateAll();
            
            // Establecer un observador para cambios en el DOM
            observeDOM(document.body, function() {
                // Pequeño retraso para asegurar que se completen los cambios
                setTimeout(updateAll, 50);
            });
        });
    } else {
        updateAll();
        
        // Establecer un observador para cambios en el DOM
        observeDOM(document.body, function() {
            // Pequeño retraso para asegurar que se completen los cambios
            setTimeout(updateAll, 50);
        });
    }
    
    // También verificar después de que el DOM esté completamente cargado
    window.addEventListener('load', function() {
        updateAll();
        
        // Aplicar de nuevo después de pequeños intervalos para atrapar todo
        setTimeout(updateAll, 100);
        setTimeout(updateAll, 500);
        setTimeout(updateAll, 1000);
    });
    
    // Intervalo regular para asegurar que los estilos se mantengan
    setInterval(updateAll, 2000);
    
    // Agregar una marca de agua oculta con mensaje de copyright
    const watermark = document.createElement('div');
    watermark.style.display = 'none';
    watermark.innerHTML = `
        <!-- 
        ================================================================
        SITIO WEB DE SAMUEL TABARES LEÓN
        ================================================================
        © ${new Date().getFullYear()} Samuel Tabares León
        Código protegido bajo leyes de derechos de autor.
        Prohibida su reproducción, distribución o modificación sin autorización.
        ================================================================
        -->
    `;
    document.body.appendChild(watermark);
    
    console.log('%c⚠️ Advertencia de Seguridad', 'font-size:16px; font-weight:bold; color:red;');
    console.log('%cEste sitio está protegido. Cualquier intento de copiar contenido o código está prohibido y podría tener consecuencias legales.', 'font-size:12px;');
    // Añadir esto a tu security.js
// Técnica avanzada de anti-debugging
(() => {
    function antiDebug() {
        const startTime = new Date();
        
        // Esta función crea un retraso imperceptible normalmente,
        // pero se ralentiza significativamente cuando las DevTools están abiertas
        function debuggerTrap() {
            const dummy = new Function("debugger");
            dummy();
        }
        
        // Ejecutar la trampa
        debuggerTrap();
        
        // Verificar si tardó demasiado (señal de que el debugger está abierto)
        const endTime = new Date();
        if (endTime - startTime > 100) {
            // Bloquear la página si se detecta un debugger
            document.body.innerHTML = `
                <div style="height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <div>
                        <h1>Acceso Restringido</h1>
                        <p>Esta página está protegida contra herramientas de desarrollo.</p>
                    </div>
                </div>
            `;
        }
    }
    
    // Ejecutar periódicamente
    setInterval(antiDebug, 1000);
})();
// Añadir al inicio de security.js
// Detección de iframe
if (window.self !== window.top) {
    // Si el sitio está cargado en un iframe
    window.top.location.href = window.self.location.href;
}
})();