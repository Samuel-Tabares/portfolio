// Script optimizado para animaciones de triángulos con distribución por toda la pantalla
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en un dispositivo móvil
    if (window.innerWidth <= 768) {
        // No ejecutar el script de triángulos en dispositivos móviles
        return;
    }
    
    // Configurar contenedor
    const trianglesContainer = document.getElementById('triangles-container');
    if (!trianglesContainer) return;
    
    const triangles = [];
    
    // Estado global para sincronizar triángulos
    const globalState = {
        scrolling: false,
        scrollVelocity: 0,
        lastScrollTop: 0,
        scrollDirection: 0,
        currentScrollOffsetY: 0,
        lastScrollTriangleTime: 0,
        lastGlobalTriangleTime: 0,
        minTriangleCount: 180, // Aumentado de 150 a 180 para tener más triángulos
        maxTriangleCount: 220, // Aumentado de 180 a 220 para tener más triángulos
        pageHeight: 0,
        minSidePadding: 0 // Reducido a 0 para permitir triángulos en todo el ancho
    };
    
    // Obtener dimensiones de la página
    function getPageDimensions() {
        const body = document.body;
        const html = document.documentElement;
        
        const pageWidth = window.innerWidth;
        const pageHeight = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        
        globalState.pageHeight = pageHeight;
        
        return { width: pageWidth, height: pageHeight };
    }
    
    // Función para crear un triángulo con vida limitada
    function createTriangle(inheritScrollState = false, fadeInDuration = 1000, yPosition = null) {
        const triangle = document.createElement('div');
        triangle.classList.add('triangle');
        
        // Color aleatorio (blanco o negro)
        const isWhite = Math.random() > 0.5;
        
        // Tamaño aleatorio (entre 10px y 70px)
        const size = Math.random() * 60 + 10;
        
        // Opacidad aleatoria
        const opacity = Math.random() * 0.6 + 0.2;
        
        // Iniciar invisible para fade in
        triangle.style.opacity = '0';
        
        // Crear triángulo con CSS
        triangle.style.width = '0';
        triangle.style.height = '0';
        triangle.style.borderLeft = `${size/2}px solid transparent`;
        triangle.style.borderRight = `${size/2}px solid transparent`;
        triangle.style.borderBottom = `${size}px solid ${isWhite ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`}`;
        
        // Distribución horizontal por toda la pantalla pero con mayor concentración en los costados
        let posX;
        const rand = Math.random();
        const windowWidth = window.innerWidth;
        
        // Nueva lógica de distribución: 60% en los costados, 40% en el centro
        if (rand < 0.3) {
            // 30% de probabilidad - zona izquierda (0-25% del ancho)
            posX = Math.random() * (windowWidth * 0.25);
        } else if (rand < 0.6) {
            // 30% de probabilidad - zona derecha (75-100% del ancho)
            posX = windowWidth * 0.75 + Math.random() * (windowWidth * 0.25);
        } else {
            // 40% de probabilidad - zona central (25-75% del ancho)
            posX = windowWidth * 0.25 + Math.random() * (windowWidth * 0.5);
        }
        
        triangle.style.left = `${posX}px`;
        
        // Posición vertical específica o aleatoria
        let posY;
        if (yPosition !== null) {
            // Usar posición Y específica si se proporciona
            posY = yPosition;
        } else if (globalState.scrolling) {
            // Crear en función de la dirección del scroll
            posY = globalState.scrollDirection > 0 ? -size : window.innerHeight + size;
        } else {
            // Posición aleatoria si no hay scroll
            posY = Math.random() * window.innerHeight;
        }
        triangle.style.top = `${posY}px`;
        
        // Rotación inicial aleatoria
        const rotation = Math.random() * 360;
        
        // Profundidad aleatoria para efecto 3D
        const zIndex = Math.floor(Math.random() * 10);
        triangle.style.zIndex = zIndex;
        
        // Velocidad y retraso aleatorios para animación base
        const speed = 3 + Math.random() * 20;
        const delay = Math.random() * 5;
        
        // Tiempo de vida aleatorio entre 9-15 segundos
        const lifespan = 9000 + Math.random() * 6000;
        
        // Variables para movimiento independiente
        const rotationSpeed = (Math.random() * 0.2) - 0.1;
        const driftX = (Math.random() * 0.4) - 0.2;
        const driftY = (Math.random() * 0.4) - 0.2;
        
        // Si debe heredar el estado actual de scroll
        let initialOffsetY = 0;
        if (inheritScrollState && globalState.scrolling) {
            // Heredar el offset actual para integrarse al efecto de scroll
            initialOffsetY = globalState.currentScrollOffsetY;
            
            // Aplicar transformación que incluye el efecto de scroll actual
            const parallaxFactor = (10 - zIndex) / 10;
            
            // Inicializar con el desplazamiento actual
            triangle.style.transform = `
                translate3d(0, ${initialOffsetY * parallaxFactor}px, ${zIndex * 10}px) 
                rotate(${rotation}deg)
            `;
        } else {
            // Aplicar transformación inicial normal
            triangle.style.transform = `rotate(${rotation}deg) translateZ(${zIndex * 10}px)`;
        }
        
        // Propiedades del triángulo
        const triangleObj = {
            element: triangle,
            posX,
            posY,
            size,
            rotation,
            speed,
            delay,
            isWhite,
            opacity,
            zIndex,
            // Propiedades para efectos
            offsetY: initialOffsetY,
            offsetX: 0,
            velocityY: inheritScrollState ? globalState.scrollVelocity : 0,
            creationTime: Date.now(),
            lifespan: lifespan,
            // Movimiento independiente
            rotationSpeed: rotationSpeed,
            driftX: driftX,
            driftY: driftY,
            currentRotation: rotation,
            // Estado de visibilidad
            isVisible: true,
            fadingOut: false
        };
        
        triangles.push(triangleObj);
        trianglesContainer.appendChild(triangle);
        
        // Fade in suave
        setTimeout(() => {
            triangle.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
            triangle.style.opacity = opacity;
        }, 10);
        
        // Programar eliminación después del tiempo de vida
        setTimeout(() => {
            fadeOutAndRemoveTriangle(triangleObj);
        }, lifespan);
        
        return triangleObj;
    }
    
    // Función para desvanecer y eliminar un triángulo
    function fadeOutAndRemoveTriangle(triangle) {
        if (triangle.fadingOut) return; // Evitar duplicación
        
        triangle.fadingOut = true;
        triangle.isVisible = false;
        
        // Animación de desvanecimiento
        triangle.element.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        triangle.element.style.opacity = '0';
        triangle.element.style.transform = `${triangle.element.style.transform} scale(0.5)`;
        
        // Eliminar después de la animación
        setTimeout(() => {
            const index = triangles.indexOf(triangle);
            if (index !== -1) {
                triangle.element.remove();
                triangles.splice(index, 1);
                
                // Crear un nuevo triángulo en alguna parte de la página
                generateReplacementTriangle();
            }
        }, 1000);
    }
    
    // Función para generar un triángulo de reemplazo en cualquier parte de la página
    function generateReplacementTriangle() {
        // Obtener las dimensiones actuales
        const pageDimensions = getPageDimensions();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // Decidir aleatoriamente dónde crear el triángulo
        // 70% de probabilidad de crearlo en una parte no visible de la página
        if (Math.random() < 0.7) {
            let yPosition;
            
            // Elegir entre la parte superior o inferior no visible de la página
            if (Math.random() < 0.5 && scrollTop > 100) {
                // Parte superior no visible
                yPosition = Math.random() * (scrollTop - 50);
            } else {
                // Parte inferior no visible
                yPosition = scrollTop + viewportHeight + Math.random() * (pageDimensions.height - scrollTop - viewportHeight);
            }
            
            createTriangle(false, 500, yPosition);
        } else {
            // 30% de probabilidad de crearlo en la parte visible
            const yPosition = scrollTop + (Math.random() * viewportHeight);
            createTriangle(false, 500, yPosition);
        }
    }
    
    // Función para generar nuevos triángulos durante el scroll
    function generateTrianglesOnScroll() {
        const now = Date.now();
        
        // Limitar la frecuencia de generación
        if (now - globalState.lastScrollTriangleTime < 200) return;
        
        // Siempre generar 1-3 triángulos al hacer scroll
        let trianglesToGenerate = Math.floor(Math.random() * 3) + 1; // Aumentado de 1-2 a 1-3
        
        // Limitar al máximo
        if (triangles.length + trianglesToGenerate > globalState.maxTriangleCount) {
            trianglesToGenerate = Math.max(0, globalState.maxTriangleCount - triangles.length);
        }
        
        // Generar triángulos
        for (let i = 0; i < trianglesToGenerate; i++) {
            createTriangle(true, 500); // Heredar estado, aparecer más rápido
        }
        
        globalState.lastScrollTriangleTime = now;
    }
    
    // Función para generar triángulos periódicamente en todas partes de la página
    function generateGlobalTriangles() {
        const now = Date.now();
        
        // Limitar frecuencia a cada 3 segundos
        if (now - globalState.lastGlobalTriangleTime < 3000) return;
        
        // Solo generar si estamos por debajo del máximo
        if (triangles.length >= globalState.maxTriangleCount) return;
        
        // Obtener dimensiones y posición actual
        const pageDimensions = getPageDimensions();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // Generar 2-4 triángulos en partes aleatorias de la página
        const toGenerate = Math.floor(Math.random() * 3) + 2; // Aumentado de 1-3 a 2-4
        
        for (let i = 0; i < toGenerate; i++) {
            // Posición Y aleatoria en toda la página
            const yPosition = Math.random() * pageDimensions.height;
            
            // Si la posición está muy lejos de la vista, dar más probabilidad
            // Esto favorece la generación en partes no visibles
            const distanceFromView = Math.abs(yPosition - (scrollTop + viewportHeight/2));
            const probability = Math.min(distanceFromView / (viewportHeight * 2), 0.9);
            
            if (Math.random() < probability || triangles.length < globalState.minTriangleCount) {
                createTriangle(false, 800, yPosition);
            }
        }
        
        globalState.lastGlobalTriangleTime = now;
    }
    
    // Comprobar triángulos fuera de pantalla periódicamente
    function checkOutOfScreenTriangles() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const buffer = 300; // Área extra para considerar antes de eliminar
        
        triangles.forEach(triangle => {
            if (triangle.fadingOut) return; // Ignorar los que ya se están desvaneciendo
            
            const rect = triangle.element.getBoundingClientRect();
            
            // Si está completamente fuera de la pantalla con buffer
            if (rect.bottom < -buffer || 
                rect.top > viewportHeight + buffer || 
                rect.right < -buffer || 
                rect.left > window.innerWidth + buffer) {
                
                // Desvanecer suavemente
                fadeOutAndRemoveTriangle(triangle);
            }
        });
        
        // Generar triángulos globalmente mientras comprobamos
        generateGlobalTriangles();
    }
    
    // Animar el movimiento independiente de los triángulos
    function animateTriangles() {
        triangles.forEach(triangle => {
            if (triangle.fadingOut || globalState.scrolling) return; // No animar durante scroll o desvanecimiento
            
            // Actualizar rotación
            triangle.currentRotation += triangle.rotationSpeed;
            
            // Actualizar posición
            triangle.offsetX += triangle.driftX;
            triangle.offsetY += triangle.driftY;
            
            // Aplicar transformación
            triangle.element.style.transform = `
                translate3d(${triangle.offsetX}px, ${triangle.offsetY}px, ${triangle.zIndex * 10}px) 
                rotate(${triangle.currentRotation}deg)
            `;
        });
        
        requestAnimationFrame(animateTriangles);
    }
    
    // Crear triángulos iniciales distribuidos por toda la página
    function createInitialTriangles() {
        const pageDimensions = getPageDimensions();
        const totalTriangles = globalState.minTriangleCount;
        
        // Calcular cuántas secciones verticales necesitamos para distribución uniforme
        const numberOfSections = 30; // Más secciones para distribución más uniforme
        const sectionHeight = pageDimensions.height / numberOfSections;
        
        // Secciones horizontales para distribución más uniforme
        const horizontalSections = 5; // 5 secciones horizontales
        const sectionWidth = pageDimensions.width / horizontalSections;
        
        // Distribución por sección horizontal (60% en costados, 40% en centro)
        const trianglesPerHorizontalSection = [
            Math.ceil(totalTriangles * 0.3), // 30% en la sección izquierda (0)
            Math.ceil(totalTriangles * 0.13), // 13% en la sección 1
            Math.ceil(totalTriangles * 0.14), // 14% en la sección central (2)
            Math.ceil(totalTriangles * 0.13), // 13% en la sección 3
            Math.ceil(totalTriangles * 0.3), // 30% en la sección derecha (4)
        ];
        
        let trianglesCreated = 0;
        
        // Crear triángulos para cada sección horizontal y vertical
        for (let hSection = 0; hSection < horizontalSections; hSection++) {
            const hStart = hSection * sectionWidth;
            const hEnd = hStart + sectionWidth;
            const trianglesForThisHSection = trianglesPerHorizontalSection[hSection];
            
            // Distribuir verticalmente
            for (let vSection = 0; vSection < numberOfSections; vSection++) {
                const vStart = vSection * sectionHeight;
                
                // Determinar cuántos triángulos crear en esta sección horizontal+vertical
                const toCreateInThisSection = Math.ceil(trianglesForThisHSection / numberOfSections);
                
                for (let i = 0; i < toCreateInThisSection; i++) {
                    // Posiciones aleatorias dentro de esta sección específica
                    const posX = hStart + (Math.random() * sectionWidth);
                    const posY = vStart + (Math.random() * sectionHeight);
                    
                    // Crear el triángulo con la posición específica
                    const triangle = document.createElement('div');
                    triangle.classList.add('triangle');
                    
                    // Configuración similar a createTriangle pero con posición específica
                    const isWhite = Math.random() > 0.5;
                    const size = Math.random() * 60 + 10;
                    const opacity = Math.random() * 0.6 + 0.2;
                    
                    triangle.style.opacity = '0';
                    triangle.style.width = '0';
                    triangle.style.height = '0';
                    triangle.style.borderLeft = `${size/2}px solid transparent`;
                    triangle.style.borderRight = `${size/2}px solid transparent`;
                    triangle.style.borderBottom = `${size}px solid ${isWhite ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`}`;
                    triangle.style.left = `${posX}px`;
                    triangle.style.top = `${posY}px`;
                    
                    const rotation = Math.random() * 360;
                    const zIndex = Math.floor(Math.random() * 10);
                    triangle.style.zIndex = zIndex;
                    triangle.style.transform = `rotate(${rotation}deg) translateZ(${zIndex * 10}px)`;
                    
                    // Propiedades del triángulo
                    const triangleObj = {
                        element: triangle,
                        posX,
                        posY,
                        size,
                        rotation,
                        speed: 3 + Math.random() * 20,
                        delay: Math.random() * 5,
                        isWhite,
                        opacity,
                        zIndex,
                        offsetY: 0,
                        offsetX: 0,
                        velocityY: 0,
                        creationTime: Date.now(),
                        lifespan: 9000 + Math.random() * 6000,
                        rotationSpeed: (Math.random() * 0.2) - 0.1,
                        driftX: (Math.random() * 0.4) - 0.2,
                        driftY: (Math.random() * 0.4) - 0.2,
                        currentRotation: rotation,
                        isVisible: true,
                        fadingOut: false
                    };
                    
                    triangles.push(triangleObj);
                    trianglesContainer.appendChild(triangle);
                    
                    // Fade in suave
                    setTimeout(() => {
                        triangle.style.transition = `opacity 1000ms ease-in-out`;
                        triangle.style.opacity = opacity;
                    }, 10);
                    
                    // Programar eliminación
                    setTimeout(() => {
                        fadeOutAndRemoveTriangle(triangleObj);
                    }, triangleObj.lifespan);
                    
                    trianglesCreated++;
                    
                    // Si ya hemos creado todos los triángulos, salimos
                    if (trianglesCreated >= totalTriangles) {
                        console.log(`Triángulos iniciales creados: ${trianglesCreated}`);
                        return;
                    }
                }
            }
        }
        
        console.log(`Triángulos iniciales creados: ${trianglesCreated}`);
    }
    
    // Crear triángulos iniciales
    createInitialTriangles();
    
    // Iniciar animación independiente
    requestAnimationFrame(animateTriangles);
    
    // Variables para efecto de scroll
    let lastScrollTime = Date.now();
    let scrollTimer;
    
    // Comprobar triángulos fuera de pantalla cada segundo
    // Esto también generará nuevos triángulos globalmente
    setInterval(checkOutOfScreenTriangles, 1000);
    
    // Efecto de scroll
    window.addEventListener('scroll', function() {
        const now = Date.now();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const timeDelta = now - lastScrollTime;
        
        // Calcular velocidad real de scroll (px/ms)
        if (timeDelta > 0) {
            const rawDelta = scrollTop - globalState.lastScrollTop;
            // Suavizar la velocidad para evitar cambios bruscos
            globalState.scrollVelocity = (globalState.scrollVelocity * 0.7) + (rawDelta * 0.3);
            globalState.scrollDirection = Math.sign(rawDelta);
        }
        
        globalState.scrolling = true;
        clearTimeout(scrollTimer);
        
        // Acumular desplazamiento global
        globalState.currentScrollOffsetY += -globalState.scrollVelocity * 2;
        
        // Generar nuevos triángulos durante el scroll
        generateTrianglesOnScroll();
        
        // Aplicar efecto a cada triángulo
        triangles.forEach(triangle => {
            if (triangle.fadingOut) return; // Ignorar los que se están desvaneciendo
            
            // Factor de paralaje basado en profundidad
            const parallaxFactor = (10 - triangle.zIndex) / 10;
            
            // Velocidad actual basada en velocidad de scroll (invertida para efecto visual)
            triangle.velocityY = -globalState.scrollVelocity * parallaxFactor * 2;
            
            // Acumular el desplazamiento
            triangle.offsetY += triangle.velocityY;
            
            // Calcular rotación basada en velocidad
            const rotationSpeed = Math.min(Math.abs(globalState.scrollVelocity / 10), 5);
            const newRotation = triangle.currentRotation + (rotationSpeed * globalState.scrollDirection * 0.3);
            triangle.currentRotation = newRotation;
            
            // Calcular escala basada en velocidad absoluta de scroll
            const scaleChange = Math.min(Math.abs(globalState.scrollVelocity / 100), 0.3);
            const newScale = 1 + scaleChange;
            
            // Aplicar transformación con efecto de scroll
            triangle.element.style.transform = `
                translate3d(${triangle.offsetX}px, ${triangle.offsetY}px, ${triangle.zIndex * 10}px) 
                rotate(${newRotation}deg) 
                scale(${newScale})
            `;
            
            // Ajustar opacidad basada en velocidad
            const opacityChange = Math.min(Math.abs(globalState.scrollVelocity / 100), 0.4);
            triangle.element.style.opacity = Math.max(0.1, Math.min(0.9, triangle.opacity + opacityChange));
        });
        
        // Programar detección de fin de scroll
        scrollTimer = setTimeout(() => {
            globalState.scrolling = false;
            
            // Aplicar inercia al detener el scroll
            const inertiaInterval = setInterval(() => {
                let stillMoving = false;
                
                globalState.scrollVelocity *= 0.92; // Reducción de velocidad global
                
                triangles.forEach(triangle => {
                    if (triangle.fadingOut) return; // Ignorar los que se están desvaneciendo
                    
                    // Reducir velocidad gradualmente
                    triangle.velocityY *= 0.92;
                    
                    // Aplicar velocidad restante
                    triangle.offsetY += triangle.velocityY;
                    
                    // Si hay movimiento significativo
                    if (Math.abs(triangle.velocityY) > 0.1) {
                        stillMoving = true;
                        
                        // Actualizar posición con inercia
                        triangle.element.style.transform = `
                            translate3d(${triangle.offsetX}px, ${triangle.offsetY}px, ${triangle.zIndex * 10}px) 
                            rotate(${triangle.currentRotation + (triangle.velocityY * 0.05)}deg) 
                            scale(${1 + Math.min(Math.abs(triangle.velocityY) / 100, 0.2)})
                        `;
                    } else {
                        // Restaurar opacidad original
                        triangle.element.style.opacity = triangle.opacity;
                    }
                });
                
                // Detener inercia cuando todo se estabiliza
                if (!stillMoving || Math.abs(globalState.scrollVelocity) < 0.1) {
                    clearInterval(inertiaInterval);
                }
            }, 30);
        }, 150);
        
        globalState.lastScrollTop = scrollTop;
        lastScrollTime = now;
    });
    
    // Agregar regla CSS para perspectiva 3D
    const style = document.createElement('style');
    style.textContent = `
        .triangles-container {
            perspective: 1000px;
        }
    `;
    document.head.appendChild(style);
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', function() {
        // Si cambiamos a un tamaño móvil, desactivar animaciones
        if (window.innerWidth <= 768) {
            // Eliminar todos los triángulos
            triangles.forEach(triangle => {
                if (triangle.element && triangle.element.parentNode) {
                    triangle.element.remove();
                }
            });
            triangles.length = 0;
            return;
        }
        
        // Obtener nuevas dimensiones
        getPageDimensions();
        
        // Asegurarse de que haya suficientes triángulos al cambiar el tamaño
        if (triangles.length < globalState.minTriangleCount) {
            const toCreate = globalState.minTriangleCount - triangles.length;
            for (let i = 0; i < toCreate; i++) {
                const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
                const viewportHeight = window.innerHeight;
                const yPosition = scrollOffset + (Math.random() * viewportHeight);
                createTriangle(false, 500, yPosition);
            }
        }
    });
});