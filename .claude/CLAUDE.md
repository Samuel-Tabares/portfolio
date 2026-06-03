# Portfolio — Samuel Tabares León

## Stack

- Vanilla HTML5 / CSS3 / JavaScript (no framework)
- Deployed on Vercel: `https://portfolio-kappa-blue-50.vercel.app/`
- No build step — edits to files are live on push

## Purpose

Personal developer portfolio for Samuel Tabares León, software engineering student specializing in full-stack, Python/Django backend, and AI integration. Showcases projects, skills, and professional profile to recruiters and collaborators.

## Architecture

```
index.html          — single-page app, all sections inline
terms.html          — terms/privacy page
css/styles.css      — all styles, dark theme, CSS variables
js/
  script.js         — scroll behavior, section logic
  triangles.js      — background triangle canvas animation
  language-toggle.js — ES/EN bilingual toggle
  security.js       — security hardening
  email-protection.js — obfuscated email rendering
images/             — profile photo, project screenshots, OG image
assets/             — CV PDF
```

## Design

- Dark theme, dark bg `#121212`
- Animated geometric triangles as background (canvas-based, see `js/triangles.js`)
- Floating side navigation with Font Awesome icons
- Bilingual: Spanish default, English toggle via `?lang=en`
- Sections: About, Roadmap (timeline), Projects (cards), Education, Contact

## Key conventions

- All copy lives in `index.html` as inline text with `data-es` / `data-en` attributes for the lang toggle
- CSS variables defined at `:root` — use them, don't hardcode colors
- Animations: prefer CSS transitions; JS canvas only for the triangle background
- Performance: animations respect `prefers-reduced-motion`
- Images: optimize before adding to `/images/` (use `squoosh` or similar)

## Skills available

### Design & UI
| Skill | When to use |
|---|---|
| `/frontend-design` | Building new UI sections, components, or visual effects |
| `/impeccable` | Design polish and critique — sub-modes: `/delight` (micro-interactions), `/polish` (final QA), `/distill` (strip to essentials), `/bolder`, `/quieter`, `/critique` |
| `/emil-design-eng` | Animation craftsmanship — easing curves, stagger, physics-based interactions, CSS transforms |
| `/design-taste-frontend` | Opinionated design decisions with explicit reasoning; anti-generic-AI aesthetic |
| `/high-end-visual-design` | Premium/editorial aesthetic sensibility |
| `/web-design-guidelines` | Accessibility and UX audit against Vercel's Web Interface Guidelines |
| `/imagegen` | Generating OG images, project thumbnails, or hero visuals |

### Copy & SEO
| Skill | When to use |
|---|---|
| `/portfolio-copywriter` | Bio, project descriptions, section headlines — always outputs ES + EN |
| `/copywriting` | Persuasive copy for any page section: headlines, CTAs, value propositions |
| `/seo-audit` | Technical and on-page SEO audit of the site |
| `/cro` | Conversion optimization for the contact section and CTAs |
| `/writing-guidelines` | Review any prose against Vercel's writing/voice guidelines |

### Deployment & performance
| Skill | When to use |
|---|---|
| `/deploy-to-vercel` | Deploy or configure Vercel settings |
| `/vercel-optimize` | Performance tuning — Core Web Vitals, bundle size, loading |

### Meta
| Skill | When to use |
|---|---|
| `/commit` | Always use this when committing — conventional commit format |
