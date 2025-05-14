// email-protection.js
document.addEventListener('DOMContentLoaded', function() {
    // Buscar todos los links de correo
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        // Obtener el correo electrónico
        const email = link.getAttribute('href').replace('mailto:', '');
        const displayText = link.textContent;
        
        // Ofuscar el correo
        const obfuscatedEmail = email.replace('@', ' [at] ').replace('.', ' [dot] ');
        
        // Establecer el texto ofuscado pero mantener el link funcional
        link.textContent = displayText;
        link.setAttribute('data-email', email);
        link.removeAttribute('href');
        
        // Agregar evento de clic
        link.addEventListener('click', function() {
            window.location.href = 'mailto:' + this.getAttribute('data-email');
        });
        
        // Mostrar el correo ofuscado al hover
        link.setAttribute('title', obfuscatedEmail);
    });
});