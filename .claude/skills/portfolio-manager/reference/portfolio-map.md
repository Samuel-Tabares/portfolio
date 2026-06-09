# Portfolio Map — samueltabares.com

> Reference for portfolio-manager skill. Maps SSOT fields to exact file locations and keys.
> Portfolio path: `/Users/samueltabares/Desktop/portfolio/`

## Files that contain copy

| File | What lives there |
|---|---|
| `index.html` | HTML structure + ES default text for all sections |
| `js/language-toggle.js` | `translations` object (ES+EN pairs), `metaCopy` (title/description per lang), `TypingEffect.texts` |

Every text change requires editing **both files** — HTML for the ES default, `translations` for the ES+EN runtime pair.

---

## Bilingual system

- HTML element: `<p data-translate="hero-description">ES text here</p>`
- Translation key: `translations['hero-description'] = { es: '...', en: '...' }` in `language-toggle.js`
- On page load, `translatePage()` replaces `innerHTML` with the active language's value from `translations`.
- **Rule:** never change one without the other. The HTML default is ES; the translations object drives EN (and is authoritative for both).

Meta tags / page title use a separate object at the top of `language-toggle.js`:
```js
const metaCopy = {
    es: { title: '...', description: '...' },
    en: { title: '...', description: '...' }
};
```

Typing animation text:
```js
TypingEffect.texts = { 'es': '...', 'en': '...' }
```

---

## Section → SSOT → file location map

### Hero section (`#hero`)

| Content | SSOT source | HTML location | Translation key |
|---|---|---|---|
| Name (static) | — | `index.html:103` | `greeting` |
| Job title (static) | — | `index.html:104` | `job-title` |
| Typing animation | one-liner (short) | `language-toggle.js:5-7` `TypingEffect.texts` | — |
| Hero description | one-liner + tech focus | `index.html:111-113` | `hero-description` |
| Page title | one-liner | `index.html:34` + `metaCopy.title` | — |
| Meta description | one-liner + stack | `index.html:8` + `metaCopy.description` | — |
| JSON-LD description | one-liner | `index.html:893` | — |

### About section (`#about`)

| Content | SSOT source | HTML location | Translation key |
|---|---|---|---|
| Paragraph 1 (builder identity) | Who he is + differentiator | `index.html:141` | `about-text-1` |
| Paragraph 2 (technical depth) | Tech stack + project evidence | `index.html:142` | `about-text-2` |
| Paragraph 3 (work style) | Brand voice | `index.html:143` | `about-text-3` |

### Skills section (`#skills`)

6 category blocks in `index.html:176-293`. Each has a heading + left/right item lists.

| Category | Heading key | Items (not keyed — hardcoded) |
|---|---|---|
| IA & Agentes | `ai-agents-heading` | AI agents, multi-agent, LLMs, RAG |
| Lenguajes | `languages-heading` | Python, Rust, TypeScript, JavaScript |
| Backend | `backend-heading` | Django/DRF, FastAPI, REST APIs, Microservices |
| Frontend | `frontend-heading` | React, HTML5/CSS3, Tailwind, Responsive |
| Bases de Datos | `databases-heading` | PostgreSQL, SQL, SQLite, MySQL |
| DevOps & Tools | `devops-heading` | Docker, Railway/Vercel, Git, n8n |

Items inside categories that have `data-translate` keys: `skill-ai-agents`, `skill-multi-agent`, `skill-llms`, `skill-rag`, `skill-rest-apis`, `skill-microservices-arch`, `skill-responsive-a11y`, `skill-automation-n8n`.

Language items (Python, Rust, TypeScript, JS) are hardcoded without translate keys — edit HTML directly, no translations needed.

**SSOT mapping:**
- `🟢 Production` tech → Skills grid (the 6 categories above)
- New language → add `<li>` to the appropriate category in `index.html`, no translation key needed if the name is the same in ES/EN

### Roadmap section (`#roadmap`)

Three timeline items + one vision block in `index.html:296-357`.

| Block | CSS class | SSOT source | Translation keys |
|---|---|---|---|
| Mastered | `.roadmap-item.current` | `🟢 Production` | `current-skills` + `skill-python-django`, `skill-backend-arch`, `skill-ai-integration`, `skill-restful-pg-docker`, `skill-js-react-ts` |
| Learning now | `.roadmap-item.learning` | `🟡 In active practice` | `learning-now` + `skill-autonomous-agents`, `skill-rust-backend`, `skill-rag-llm-vector`, `skill-openclaw`, `skill-applied-ml`, `skill-ruby-learning` |
| Future goals | `.roadmap-item.future` | `🌱 Aspirational` | `future-skills` + `skill-ai-saas`, `skill-ai-web3`, `skill-ml-finetuning`, `skill-advanced-cloud` |
| Vision | `.roadmap-item.vision` | Direction section | `vision`, `vision-text` |

### Projects section (`#projects`)

`index.html:360-645`. Each card is a `div.project-experience-card`.

Current cards (in order):
1. SaaS IA Personal Multi-Modelo — keys: `ai-saas-title`, `ai-saas-desc`
2. Sistema Multi-Agente — keys: `multi-agent-title`, `multi-agent-desc`
3. Trabix Bot (Rust) — keys: `trabix-title`, `trabix-desc`
4. Clínica Veterinaria Backend — keys: `veterinary-title`, `veterinary-desc`
5. Sistema Perfumería — keys: `perfumeria-title`, `perfumeria-desc`
6. Importa Colombia — keys: `importa-title`, `importa-desc`
7. Portfolio Web — keys: `portfolio-title`, `portfolio-desc`

**Card HTML template** (copy this for new cards, replace ALL_CAPS placeholders):

```html
<div class="project-experience-card" itemscope itemtype="http://schema.org/SoftwareApplication" data-project-card style="--card-h: 340px">
    <meta itemprop="applicationCategory" content="CATEGORY" />
    <meta itemprop="operatingSystem" content="OS" />
    <div class="project-info">
        <div class="tech-stack">
            <div class="tech-label" data-translate="tech-used">Tecnologías:</div>
            <div class="tech-badges">
                <span class="tech-badge"><i class="ICON_CLASS"></i> TECH_NAME</span>
            </div>
        </div>
        <div class="project-links">
            <!-- Public repo: -->
            <a href="GITHUB_URL" target="_blank" class="project-link" data-translate="view-code">Código <i class="fab fa-github"></i></a>
            <!-- Private: -->
            <!-- <span class="project-link disabled" data-translate="private-project">Privado <i class="fas fa-lock"></i></span> -->
            <!-- In progress: -->
            <!-- <span class="project-link disabled" data-translate="in-construction-badge">En construcción <i class="fas fa-hammer"></i></span> -->
            <span class="project-link role-badge">ROLE_LABEL <i class="fas fa-ICON"></i></span>
        </div>
    </div>
    <div class="project-card">
        <div class="project-image-container" style="--img-ar: W/H">
            <img src="images/PROJECT_IMAGE.png" alt="ALT_TEXT" class="project-image" loading="lazy">
            <div class="project-thumb-overlay">
                <span data-translate="SLUG-title">ES TITLE</span>
                <span class="project-expand-icon"><i class="fas fa-plus"></i></span>
            </div>
        </div>
        <div class="project-kpis">
            <div class="metric"><div class="metric-value">VAL</div><div class="metric-label" data-translate="metric-KEY">LABEL</div></div>
        </div>
        <div class="project-status STATUS_CLASS" data-translate="status-STATUS">ES STATUS</div>
    </div>
    <div class="experience-detail">
        <h3 data-translate="SLUG-title">ES TITLE</h3>
        <p data-translate="SLUG-desc">ES DESCRIPTION</p>
    </div>
</div>
```

**Status classes and keys:**
- Completed: `class="project-status completed"` + `data-translate="status-completed"` → "Completado" / "Completed"
- In development: `class="project-status ongoing"` + `data-translate="status-ongoing"` → "En desarrollo" / "In progress"
- In production: `class="project-status completed"` + `data-translate="status-production"` → "En producción" / "In production"
- In construction: `class="project-status ongoing"` + `data-translate="status-in-progress"` → "En construcción" / "Under construction"

**Translations to add for each new card** (in `language-toggle.js`):
```js
'SLUG-title': { 'es': 'ES Title', 'en': 'EN Title' },
'SLUG-desc': {
    'es': 'ES description text',
    'en': 'EN description text'
},
```

### Education section (`#education`)

`index.html:648-662`. Static content — CUE university entry. Only changes if Samuel adds a new formal degree or educational institution.

| Content | SSOT source | Translation key |
|---|---|---|
| Degree name | — | `software-eng` |
| Institution | — | `university` |
| Date | Education dates | date in `.date` element (translated by `translateDates()`) |
| Location | — | hardcoded (static) |

To add a new timeline entry (e.g. a significant certification): copy the `.timeline-item` block, add new translation keys.

### Languages section (`#languages`)

Static — Spanish (native), English (B2, certificate link), German (A1). Changes only if level changes or new language added.

### Contact section (`#contact`)

`index.html:707-772`. Copy: `contact-heading`, `contact-description`. Update if availability or project types change.

### JSON-LD structured data

`index.html:882-904`. Key fields that mirror the SSOT:
- `description` (line 893) — matches one-liner
- `jobTitle` (line 890) — "Software Engineer & Builder"
- `skills` (line 895) — comma-separated tech list from `🟢 Production`

---

## Insertion order for new project cards

Cards go in this priority order (top = most prominent):
1. AI projects in construction (featured, top)
2. Production systems (Trabix ecosystem)
3. Full-stack / backend with real scope
4. Academic / learning projects (bottom)

When adding a new card, insert it at the correct position in the list.

---

## Images

- Cards use `images/` directory
- Default placeholder: `images/og-image.jpg` (used for cards without a real screenshot)
- Add real screenshots when available: optimize first (squoosh), PNG preferred
- `--img-ar: W/H` sets the aspect ratio — measure actual image dimensions and use them
