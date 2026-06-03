// security.js — minimal hardening, no UX-hostile blocks.
// Replaces a previous version that disabled right-click, text selection,
// DevTools shortcuts and ran an anti-debugger trap. All of those were
// bypassable noise that broke password managers and accessibility for
// the developer audience visiting this portfolio.
(function () {
    'use strict';

    // Anti-clickjacking: if loaded inside an iframe, escape to top.
    if (window.top !== window.self) {
        try {
            window.top.location.href = window.self.location.href;
        } catch (_) {
            // Cross-origin: silently ignore.
        }
    }

    // Prevent image drag (cheap deterrent against accidental drag-to-save).
    document.addEventListener('dragstart', function (e) {
        if (e.target && e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
})();
