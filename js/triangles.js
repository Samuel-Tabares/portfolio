// Script optimizado para animaciones de triángulos
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) return;

    const trianglesContainer = document.getElementById('triangles-container');
    if (!trianglesContainer) return;

    // Respect user preference for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const triangles = [];

    const globalState = {
        scrolling: false,
        scrollVelocity: 0,
        lastScrollTop: 0,
        scrollDirection: 0,
        currentScrollOffsetY: 0,
        lastScrollTriangleTime: 0,
        lastGlobalTriangleTime: 0,
        minTriangleCount: 45,  // Reduced from 180 — fewer GPU layers
        maxTriangleCount: 65,  // Reduced from 220
        pageHeight: 0,
        minSidePadding: 0
    };

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

    function triangleColor(isWhite, opacity) {
        if (document.body.classList.contains('light-theme')) {
            return `rgba(26,26,46,${opacity * 0.55})`;
        }
        return isWhite ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`;
    }

    function createTriangle(inheritScrollState = false, fadeInDuration = 1000, yPosition = null) {
        const triangle = document.createElement('div');
        triangle.classList.add('triangle');

        const isWhite = Math.random() > 0.5;
        const size = Math.random() * 60 + 10;
        const opacity = Math.random() * 0.6 + 0.2;

        triangle.style.opacity = '0';
        triangle.style.width = '0';
        triangle.style.height = '0';
        triangle.style.borderLeft = `${size/2}px solid transparent`;
        triangle.style.borderRight = `${size/2}px solid transparent`;
        triangle.style.borderBottom = `${size}px solid ${triangleColor(isWhite, opacity)}`;

        let posX;
        const rand = Math.random();
        const windowWidth = window.innerWidth;

        if (rand < 0.3) {
            posX = Math.random() * (windowWidth * 0.25);
        } else if (rand < 0.6) {
            posX = windowWidth * 0.75 + Math.random() * (windowWidth * 0.25);
        } else {
            posX = windowWidth * 0.25 + Math.random() * (windowWidth * 0.5);
        }

        triangle.style.left = `${posX}px`;

        let posY;
        if (yPosition !== null) {
            posY = yPosition;
        } else if (globalState.scrolling) {
            posY = globalState.scrollDirection > 0 ? -size : window.innerHeight + size;
        } else {
            posY = Math.random() * window.innerHeight;
        }
        triangle.style.top = `${posY}px`;

        const rotation = Math.random() * 360;
        const zIndex = Math.floor(Math.random() * 10);
        triangle.style.zIndex = zIndex;

        const lifespan = 9000 + Math.random() * 6000;
        const rotationSpeed = (Math.random() * 0.2) - 0.1;
        const driftX = (Math.random() * 0.4) - 0.2;
        const driftY = (Math.random() * 0.4) - 0.2;

        let initialOffsetY = 0;
        if (inheritScrollState && globalState.scrolling) {
            initialOffsetY = globalState.currentScrollOffsetY;
            const parallaxFactor = (10 - zIndex) / 10;
            // No translateZ — avoids creating separate GPU layers per element
            triangle.style.transform = `translate3d(0, ${initialOffsetY * parallaxFactor}px, 0) rotate(${rotation}deg)`;
        } else {
            triangle.style.transform = `rotate(${rotation}deg)`;
        }

        const triangleObj = {
            element: triangle,
            posX, posY, size, rotation,
            speed: 3 + Math.random() * 20,
            delay: Math.random() * 5,
            isWhite, opacity, zIndex,
            offsetY: initialOffsetY, offsetX: 0,
            velocityY: inheritScrollState ? globalState.scrollVelocity : 0,
            creationTime: Date.now(), lifespan,
            rotationSpeed, driftX, driftY,
            currentRotation: rotation,
            isVisible: true, fadingOut: false
        };

        triangles.push(triangleObj);
        trianglesContainer.appendChild(triangle);

        setTimeout(() => {
            triangle.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
            triangle.style.opacity = opacity;
        }, 10);

        setTimeout(() => { fadeOutAndRemoveTriangle(triangleObj); }, lifespan);

        return triangleObj;
    }

    function fadeOutAndRemoveTriangle(triangle) {
        if (triangle.fadingOut) return;
        triangle.fadingOut = true;
        triangle.isVisible = false;
        triangle.element.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        triangle.element.style.opacity = '0';
        triangle.element.style.transform += ' scale(0.5)';
        setTimeout(() => {
            const index = triangles.indexOf(triangle);
            if (index !== -1) {
                triangle.element.remove();
                triangles.splice(index, 1);
                generateReplacementTriangle();
            }
        }, 1000);
    }

    function generateReplacementTriangle() {
        const pageDimensions = getPageDimensions();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        if (Math.random() < 0.7) {
            let yPosition;
            if (Math.random() < 0.5 && scrollTop > 100) {
                yPosition = Math.random() * (scrollTop - 50);
            } else {
                yPosition = scrollTop + viewportHeight + Math.random() * (pageDimensions.height - scrollTop - viewportHeight);
            }
            createTriangle(false, 500, yPosition);
        } else {
            createTriangle(false, 500, scrollTop + (Math.random() * viewportHeight));
        }
    }

    function generateTrianglesOnScroll() {
        const now = Date.now();
        if (now - globalState.lastScrollTriangleTime < 300) return;

        let toGenerate = Math.floor(Math.random() * 2) + 1;
        if (triangles.length + toGenerate > globalState.maxTriangleCount) {
            toGenerate = Math.max(0, globalState.maxTriangleCount - triangles.length);
        }
        for (let i = 0; i < toGenerate; i++) createTriangle(true, 500);
        globalState.lastScrollTriangleTime = now;
    }

    function generateGlobalTriangles() {
        const now = Date.now();
        if (now - globalState.lastGlobalTriangleTime < 3000) return;
        if (triangles.length >= globalState.maxTriangleCount) return;

        const pageDimensions = getPageDimensions();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const toGenerate = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < toGenerate; i++) {
            const yPosition = Math.random() * pageDimensions.height;
            const distanceFromView = Math.abs(yPosition - (scrollTop + viewportHeight / 2));
            const probability = Math.min(distanceFromView / (viewportHeight * 2), 0.9);
            if (Math.random() < probability || triangles.length < globalState.minTriangleCount) {
                createTriangle(false, 800, yPosition);
            }
        }
        globalState.lastGlobalTriangleTime = now;
    }

    function checkOutOfScreenTriangles() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const buffer = 300;

        triangles.forEach(triangle => {
            if (triangle.fadingOut) return;

            // Use tracked position instead of getBoundingClientRect — avoids forced layout
            const apparentY = triangle.posY + triangle.offsetY;
            const apparentX = triangle.posX + triangle.offsetX;

            if (apparentY + triangle.size < scrollTop - buffer ||
                apparentY > scrollTop + viewportHeight + buffer ||
                apparentX + triangle.size < -buffer ||
                apparentX > window.innerWidth + buffer) {
                fadeOutAndRemoveTriangle(triangle);
            }
        });

        generateGlobalTriangles();
    }

    let animationRAF = null;
    let isPaused = false;

    function animateTriangles() {
        if (isPaused) {
            animationRAF = null;
            return;
        }
        triangles.forEach(triangle => {
            if (triangle.fadingOut || globalState.scrolling) return;
            triangle.currentRotation += triangle.rotationSpeed;
            triangle.offsetX += triangle.driftX;
            triangle.offsetY += triangle.driftY;
            triangle.element.style.transform = `translate3d(${triangle.offsetX}px, ${triangle.offsetY}px, 0) rotate(${triangle.currentRotation}deg)`;
        });
        animationRAF = requestAnimationFrame(animateTriangles);
    }

    // Pause animations when tab is hidden — saves CPU when user isn't watching.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isPaused = true;
        } else if (isPaused) {
            isPaused = false;
            if (!animationRAF) animationRAF = requestAnimationFrame(animateTriangles);
        }
    });

    function createInitialTriangles() {
        const pageDimensions = getPageDimensions();
        const totalTriangles = globalState.minTriangleCount;
        const numberOfSections = 15;
        const sectionHeight = pageDimensions.height / numberOfSections;
        const horizontalSections = 5;
        const sectionWidth = pageDimensions.width / horizontalSections;

        const trianglesPerHorizontalSection = [
            Math.ceil(totalTriangles * 0.3),
            Math.ceil(totalTriangles * 0.13),
            Math.ceil(totalTriangles * 0.14),
            Math.ceil(totalTriangles * 0.13),
            Math.ceil(totalTriangles * 0.3),
        ];

        let trianglesCreated = 0;

        for (let hSection = 0; hSection < horizontalSections; hSection++) {
            const hStart = hSection * sectionWidth;
            const trianglesForSection = trianglesPerHorizontalSection[hSection];

            for (let vSection = 0; vSection < numberOfSections; vSection++) {
                const vStart = vSection * sectionHeight;
                const toCreate = Math.ceil(trianglesForSection / numberOfSections);

                for (let i = 0; i < toCreate; i++) {
                    const posX = hStart + (Math.random() * sectionWidth);
                    const posY = vStart + (Math.random() * sectionHeight);

                    const triangle = document.createElement('div');
                    triangle.classList.add('triangle');

                    const isWhite = Math.random() > 0.5;
                    const size = Math.random() * 60 + 10;
                    const opacity = Math.random() * 0.6 + 0.2;

                    triangle.style.opacity = '0';
                    triangle.style.width = '0';
                    triangle.style.height = '0';
                    triangle.style.borderLeft = `${size/2}px solid transparent`;
                    triangle.style.borderRight = `${size/2}px solid transparent`;
                    triangle.style.borderBottom = `${size}px solid ${triangleColor(isWhite, opacity)}`;
                    triangle.style.left = `${posX}px`;
                    triangle.style.top = `${posY}px`;

                    const rotation = Math.random() * 360;
                    const zIndex = Math.floor(Math.random() * 10);
                    triangle.style.zIndex = zIndex;
                    triangle.style.transform = `rotate(${rotation}deg)`;

                    const triangleObj = {
                        element: triangle,
                        posX, posY, size, rotation,
                        speed: 3 + Math.random() * 20,
                        delay: Math.random() * 5,
                        isWhite, opacity, zIndex,
                        offsetY: 0, offsetX: 0, velocityY: 0,
                        creationTime: Date.now(),
                        lifespan: 9000 + Math.random() * 6000,
                        rotationSpeed: (Math.random() * 0.2) - 0.1,
                        driftX: (Math.random() * 0.4) - 0.2,
                        driftY: (Math.random() * 0.4) - 0.2,
                        currentRotation: rotation,
                        isVisible: true, fadingOut: false
                    };

                    triangles.push(triangleObj);
                    trianglesContainer.appendChild(triangle);

                    setTimeout(() => {
                        triangle.style.transition = 'opacity 1000ms ease-in-out';
                        triangle.style.opacity = opacity;
                    }, 10);

                    setTimeout(() => { fadeOutAndRemoveTriangle(triangleObj); }, triangleObj.lifespan);

                    trianglesCreated++;
                    if (trianglesCreated >= totalTriangles) return;
                }
            }
        }
    }

    createInitialTriangles();
    animationRAF = requestAnimationFrame(animateTriangles);

    let lastScrollTime = Date.now();
    let scrollTimer;
    let scrollRAFPending = false;

    // Reduced from 1000ms — slightly more responsive but still throttled
    setInterval(checkOutOfScreenTriangles, 1500);

    window.addEventListener('scroll', function() {
        const now = Date.now();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const timeDelta = now - lastScrollTime;

        if (timeDelta > 0) {
            const rawDelta = scrollTop - globalState.lastScrollTop;
            globalState.scrollVelocity = (globalState.scrollVelocity * 0.7) + (rawDelta * 0.3);
            globalState.scrollDirection = Math.sign(rawDelta);
        }

        globalState.scrolling = true;
        clearTimeout(scrollTimer);
        globalState.currentScrollOffsetY += -globalState.scrollVelocity * 2;

        generateTrianglesOnScroll();

        // Batch all DOM writes into a single rAF — prevents layout thrashing during scroll
        if (!scrollRAFPending) {
            scrollRAFPending = true;
            requestAnimationFrame(() => {
                triangles.forEach(triangle => {
                    if (triangle.fadingOut) return;

                    const parallaxFactor = (10 - triangle.zIndex) / 10;
                    triangle.velocityY = -globalState.scrollVelocity * parallaxFactor * 2;
                    triangle.offsetY += triangle.velocityY;

                    const rotationSpeed = Math.min(Math.abs(globalState.scrollVelocity / 10), 5);
                    triangle.currentRotation += rotationSpeed * globalState.scrollDirection * 0.3;

                    // Clamp scale change tighter — at high velocity, 0.3 made triangles visibly pop.
                    const scaleChange = Math.min(Math.abs(globalState.scrollVelocity / 100), 0.12);
                    triangle.element.style.transform = `translate3d(${triangle.offsetX}px, ${triangle.offsetY}px, 0) rotate(${triangle.currentRotation}deg) scale(${1 + scaleChange})`;

                    const opacityChange = Math.min(Math.abs(globalState.scrollVelocity / 100), 0.4);
                    triangle.element.style.opacity = Math.max(0.1, Math.min(0.9, triangle.opacity + opacityChange));
                });
                scrollRAFPending = false;
            });
        }

        // Use rAF-based inertia instead of setInterval — stays on compositor thread
        scrollTimer = setTimeout(() => {
            globalState.scrolling = false;

            function inertiaFrame() {
                let stillMoving = false;
                globalState.scrollVelocity *= 0.92;

                triangles.forEach(triangle => {
                    if (triangle.fadingOut) return;
                    triangle.velocityY *= 0.92;
                    triangle.offsetY += triangle.velocityY;

                    if (Math.abs(triangle.velocityY) > 0.1) {
                        stillMoving = true;
                        triangle.element.style.transform = `translate3d(${triangle.offsetX}px, ${triangle.offsetY}px, 0) rotate(${triangle.currentRotation + (triangle.velocityY * 0.05)}deg) scale(${1 + Math.min(Math.abs(triangle.velocityY) / 100, 0.2)})`;
                    } else {
                        triangle.element.style.opacity = triangle.opacity;
                    }
                });

                if (stillMoving && Math.abs(globalState.scrollVelocity) > 0.1) {
                    requestAnimationFrame(inertiaFrame);
                }
            }
            requestAnimationFrame(inertiaFrame);
        }, 150);

        globalState.lastScrollTop = scrollTop;
        lastScrollTime = now;
    }, { passive: true });

    // will-change hints for compositor — safe at this count (45-65 elements)
    const style = document.createElement('style');
    style.textContent = '.triangle { will-change: transform, opacity; position: absolute; }';
    document.head.appendChild(style);

    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            triangles.forEach(t => { if (t.element && t.element.parentNode) t.element.remove(); });
            triangles.length = 0;
            return;
        }
        getPageDimensions();
        if (triangles.length < globalState.minTriangleCount) {
            const toCreate = globalState.minTriangleCount - triangles.length;
            for (let i = 0; i < toCreate; i++) {
                const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
                createTriangle(false, 500, scrollOffset + (Math.random() * window.innerHeight));
            }
        }
    });
});
