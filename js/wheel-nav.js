(function () {
  'use strict';

  // ─── Section registry ────────────────────────────────────────────────────────

  const SECTIONS = [
    { id: 'hero',         es: 'Inicio',      en: 'Home' },
    { id: 'about',        es: 'Sobre mí',    en: 'About' },
    { id: 'skills',       es: 'Habilidades', en: 'Skills' },
    { id: 'roadmap',      es: 'Camino',      en: 'Roadmap' },
    { id: 'projects',     es: 'Proyectos',   en: 'Projects' },
    { id: 'education',    es: 'Educación',   en: 'Education' },
    { id: 'languages',    es: 'Idiomas',     en: 'Languages' },
    { id: 'contact',      es: 'Contacto',    en: 'Contact' },
    { id: 'testimonials', es: 'Testimonios', en: 'Testimonials' },
    { id: 'references',   es: 'Colegas',     en: 'Colleagues' },
    { id: 'github-stats', es: 'GitHub',      en: 'GitHub' },
  ];

  // ─── Config ──────────────────────────────────────────────────────────────────

  const DRAG_THRESHOLD  = 60;   // px per section step (distance-based)
  const TILT_X          = 50;   // deg rotateX at ±1 slot
  const CURVE_Y         = 20;   // px translateY arc at ±1 slot
  const SLOT_WIDTH      = 140;  // px between label centers
  const VISIBLE_SLOTS   = 4;    // slots shown each side before culling
  const HISTORY_WINDOW  = 8;    // pointer events kept for velocity
  const MOVE_THRESHOLD  = 6;    // px before a tap becomes a drag
  const SCROLL_LOCK_MS  = 1200; // ms to suppress observer after programmatic scroll

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function getLang() {
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'es';
  }

  function project(startIndex, rawDelta, _history, total) {
    const dir = Math.sign(rawDelta);
    if (Math.abs(rawDelta) < 20 || dir === 0) return startIndex;
    const distSteps = Math.floor(Math.abs(rawDelta) / DRAG_THRESHOLD);
    return clamp(startIndex + dir * Math.max(1, distSteps), 0, total - 1);
  }

  // ─── WheelNav class ──────────────────────────────────────────────────────────

  class WheelNav {
    constructor(sections) {
      this.sections     = sections;
      this.activeIndex  = 0;
      this.scrollLocked = false;
      this.lockTimer    = null;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Drag state
      this.isDragging      = false;
      this.dragStart       = null;
      this.dragStartIndex  = 0;
      this.dragHistory     = [];
      this.dragDelta       = 0;
      this.dragMoved       = false;

      this._build();
      this._setupObserver();
      this._setupKeyboard();
      this._bindPointerEvents();
      this._hideSideMenu();
      this._watchLang();
    }

    // ── DOM construction ──────────────────────────────────────────────────────

    _build() {
      this.nav = document.createElement('nav');
      this.nav.className = 'sticky-nav';
      this.nav.setAttribute('aria-label', 'Section navigation');

      this.selector = document.createElement('div');
      this.selector.className = 'wheel-selector';
      this.selector.setAttribute('role', 'listbox');
      this.selector.setAttribute('aria-orientation', 'horizontal');
      this.selector.setAttribute('tabindex', '0');

      this.stage = document.createElement('div');
      this.stage.className = 'wheel-stage';

      this.labelEls = this.sections.map((section, i) => {
        const btn = document.createElement('button');
        btn.id = `wl-${section.id}`;
        btn.className = 'wheel-label';
        btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
        btn.textContent = section[getLang()];
        btn.addEventListener('click', () => {
          // dragMoved is not reset in _endDrag, so the click that fires right
          // after pointerup still sees the drag state. Best-effort on touch.
          if (!this.dragMoved) this._select(i);
        });
        this.stage.appendChild(btn);
        return btn;
      });

      this.selector.appendChild(this.stage);
      this.nav.appendChild(this.selector);
      document.body.appendChild(this.nav);

      this._render();
    }

    _hideSideMenu() {
      const sideMenu = document.querySelector('.side-menu');
      if (sideMenu) sideMenu.setAttribute('hidden', '');
    }

    // ── Scroll detection ──────────────────────────────────────────────────────

    _setupObserver() {
      // Detection band: middle 50% of the viewport
      const band     = Math.round(window.innerHeight * 0.25);
      const elements = this.sections
        .map(s => document.getElementById(s.id))
        .filter(Boolean);

      // Track all currently-visible sections; pick the one occupying most band height
      this._visibleHeights = new Map();

      this.observer = new IntersectionObserver(
        (entries) => {
          if (this.scrollLocked) return;

          for (const entry of entries) {
            if (entry.isIntersecting) {
              this._visibleHeights.set(entry.target.id, entry.intersectionRect.height);
            } else {
              this._visibleHeights.delete(entry.target.id);
            }
          }

          let bestId = null, bestH = 0;
          for (const [id, h] of this._visibleHeights) {
            if (h > bestH) { bestH = h; bestId = id; }
          }
          if (!bestId) return;

          const idx = this.sections.findIndex(s => s.id === bestId);
          if (idx !== -1 && idx !== this.activeIndex) {
            this.activeIndex = idx;
            this._render();
          }
        },
        {
          rootMargin: `-${band}px 0px -${band}px 0px`,
          threshold: Array.from({ length: 11 }, (_, i) => i * 0.1),
        }
      );

      elements.forEach(el => this.observer.observe(el));
    }

    // ── Keyboard ──────────────────────────────────────────────────────────────

    _setupKeyboard() {
      this.selector.addEventListener('keydown', (e) => {
        let next = this.activeIndex;
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            next = clamp(this.activeIndex - 1, 0, this.sections.length - 1);
            break;
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            next = clamp(this.activeIndex + 1, 0, this.sections.length - 1);
            break;
          case 'Home':
            e.preventDefault();
            next = 0;
            break;
          case 'End':
            e.preventDefault();
            next = this.sections.length - 1;
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            this._select(this.activeIndex);
            return;
          default:
            return;
        }
        this._select(next);
      });
    }

    // ── Pointer / drag ────────────────────────────────────────────────────────

    _bindPointerEvents() {
      this.selector.addEventListener('pointerdown', (e) => {
        this.selector.setPointerCapture(e.pointerId);
        this._startDrag(e.clientX);
      });
      this.selector.addEventListener('pointermove', (e) => {
        this._moveDrag(e.clientX);
      });
      this.selector.addEventListener('pointerup', (e) => {
        this._endDrag(e.clientX);
      });
      this.selector.addEventListener('pointercancel', () => {
        this._cancelDrag();
      });
    }

    _startDrag(clientX) {
      this.isDragging     = true;
      this.dragStart      = clientX;
      this.dragStartIndex = this.activeIndex;
      this.dragHistory    = [{ x: clientX, t: performance.now() }];
      this.dragMoved      = false;
      this.dragDelta      = 0;
      this.selector.classList.add('wheel-selector--dragging');
      this._render();
    }

    _moveDrag(clientX) {
      if (!this.isDragging || this.dragStart === null) return;
      const delta = clientX - this.dragStart;
      if (Math.abs(delta) > MOVE_THRESHOLD) this.dragMoved = true;
      this.dragHistory = [
        ...this.dragHistory.slice(-(HISTORY_WINDOW - 1)),
        { x: clientX, t: performance.now() },
      ];
      this.dragDelta = delta;
      this._render();
    }

    _endDrag(clientX) {
      if (!this.isDragging || this.dragStart === null) return;
      const rawDelta = this.dragStart - clientX; // positive = dragged left = wants next
      const startIdx = this.dragStartIndex;
      const hist     = this.dragHistory;
      const wasDrag  = this.dragMoved;

      this.isDragging = false;
      this.dragStart  = null;
      this.dragHistory = [];
      this.dragDelta  = 0;
      this.selector.classList.remove('wheel-selector--dragging');

      if (wasDrag) {
        const projected = project(startIdx, rawDelta, hist, this.sections.length);
        if (projected !== startIdx) this._select(projected);
      }
      // If !wasDrag: tap — the label's click handler fires and calls _select.

      this._render();
    }

    _cancelDrag() {
      this.isDragging  = false;
      this.dragStart   = null;
      this.dragHistory = [];
      this.dragMoved   = false;
      this.dragDelta   = 0;
      this.selector.classList.remove('wheel-selector--dragging');
      this._render();
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    _select(index) {
      const section = this.sections[index];
      const el = document.getElementById(section.id);
      if (!el) return;

      this.activeIndex = index;
      this._render();

      // Lock the scroll observer while programmatic scroll is in flight.
      this.scrollLocked = true;
      if (this.lockTimer) clearTimeout(this.lockTimer);
      this.lockTimer = setTimeout(() => { this.scrollLocked = false; }, SCROLL_LOCK_MS);

      el.scrollIntoView({
        behavior: this.reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }

    // ── Render ────────────────────────────────────────────────────────────────

    _render() {
      const { activeIndex, dragDelta, isDragging, reducedMotion } = this;
      const dragNorm = dragDelta / DRAG_THRESHOLD;

      this.selector.setAttribute('aria-activedescendant', `wl-${this.sections[activeIndex].id}`);

      this.labelEls.forEach((btn, i) => {
        const slot   = i - activeIndex;
        const pos    = reducedMotion ? slot : slot + dragNorm;
        const absPos = Math.abs(pos);

        if (absPos > VISIBLE_SLOTS) {
          btn.hidden = true;
          return;
        }
        btn.hidden = false;

        const isActive  = i === activeIndex;
        const opacity   = Math.max(0, 1 - 0.65 * absPos);

        const transform = reducedMotion
          ? `translateX(${slot * SLOT_WIDTH}px)`
          : [
              `translateX(${pos * SLOT_WIDTH}px)`,
              `translateY(${pos * pos * CURVE_Y}px)`,
              `rotateX(${-pos * TILT_X}deg)`,
            ].join(' ');

        const transition = reducedMotion || isDragging
          ? 'none'
          : 'transform 120ms ease-out, opacity 120ms ease-out';

        btn.style.transform  = transform;
        btn.style.opacity    = opacity;
        btn.style.transition = transition;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.classList.toggle('wheel-label--active', isActive);
        btn.textContent = this.sections[i][getLang()];
      });
    }

    // ── Language sync ─────────────────────────────────────────────────────────

    _watchLang() {
      const observer = new MutationObserver(() => this._render());
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang'],
      });
    }
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    window.__wheelNav = new WheelNav(SECTIONS);
  });
})();
