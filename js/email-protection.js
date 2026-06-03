// email-protection.js
// Soft anti-scrape: keeps mailto links functional and accessible,
// but adds an obfuscated `title` attribute (basic deterrent for naive crawlers).
// The previous version stripped the href which broke keyboard activation
// and screen-reader semantics.
document.addEventListener('DOMContentLoaded', function () {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach(link => {
        const email = link.getAttribute('href').replace('mailto:', '');
        const obfuscated = email.replace('@', ' [at] ').replace(/\./g, ' [dot] ');
        link.setAttribute('title', obfuscated);
        link.setAttribute('rel', 'nofollow');
    });
});
