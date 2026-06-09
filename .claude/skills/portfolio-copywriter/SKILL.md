---
name: portfolio-copywriter
description: Write, rewrite, or improve copy for Samuel's portfolio — bio, project descriptions, section headlines, CTA text, and About/Roadmap/Contact content. Always outputs bilingual ES + EN pairs. Trigger on: "escribe la descripción de este proyecto", "mejora mi bio", "redacta el texto de la sección X", "how should I describe this project", "help me write the about section", "copy for", "texto para". Do NOT trigger for code changes, CSS, or animation work.
---

# Portfolio Copywriter

Write developer portfolio copy for Samuel Tabares León. All output is bilingual: Spanish first (default language), English second.

## Voice & Tone

Samuel is a software engineering student from Colombia, specializing in full-stack development, Python/Django backend, and AI integration. He's building real things and solving real problems.

**Voice:** Direct, technical, confident without arrogance. Sounds like a developer who knows what he's doing, not a resume bullet point. Avoids corporate filler.

**Tone by section:**
- **Bio / About**: First-person, warm but focused. Shows genuine interest in the craft.
- **Project descriptions**: Outcome-first. What does it do, what problem does it solve, what stack was used. 2–3 sentences max per project card.
- **Roadmap / Timeline**: Active past tense ("Built", "Launched", "Learned"). Concrete milestones.
- **Skills**: Nouns only — no "proficient in", no "experience with". Just the technology name.
- **Contact / CTA**: Short, direct invitation. No "feel free to reach out."

## Banned language

Never use:
- "Passionate about" / "apasionado por"
- "Results-driven" / "orientado a resultados"
- "I am a fast learner"
- "Seeking opportunities"
- "Feel free to contact me"
- "With a strong foundation in..."
- Fluffy adjectives: innovative, cutting-edge, dynamic, synergy

## Output format

Always deliver both languages. Format:

```
**ES:**
[Spanish copy]

**EN:**
[English copy]
```

For multi-field output (e.g., project card with title + description + tags):

```
**ES:**
Título: [título]
Descripción: [descripción]
Tags: [tecnologías]

**EN:**
Title: [title]
Description: [description]
Tags: [technologies]
```

## Section-specific guidance

### Bio / About section

- Open with what Samuel builds, not who he is
- Include one specific domain focus (AI integration, backend systems, etc.)
- End with a concrete signal of momentum (current project, learning goal, or availability)
- Target: 3–4 sentences in ES, matching length in EN

### Project descriptions (card format)

- Line 1: What the project does (user-facing or functional description)
- Line 2: Key technical challenge or decision
- Line 3: Stack (as a tag list, not prose)
- Max 40 words in the prose portion

### Roadmap entries

- Format: `[Verb] [what] — [context or outcome]`
- Examples: "Built REST API for inventory management — Django + PostgreSQL", "Deployed first production app — Vercel + custom domain"

### Contact section

- Keep it to 1–2 sentences
- Direct invitation with a specific signal of what kind of contact is welcome (collaborations, opportunities, questions about a specific project)

## HTML attribute format

When copy goes into `index.html`, remind the user of the bilingual attribute pattern:

```html
<p data-es="Texto en español" data-en="English text">Texto en español</p>
```

The `language-toggle.js` script reads `data-es` and `data-en` and swaps on toggle.

## Project card layout (redesign-stage.css)

The expanded card is a 3-column CSS grid. Current dimensions:

| Property | Value |
|---|---|
| Left panel (`project-info`) | 364px |
| Center panel (image + KPIs) | 476px |
| Right panel (`experience-detail`) | 364px |
| `max-width` expanded | 1204px |
| `grid-template-rows` expanded | `calc(var(--card-h, 317px) + 170px)` |

Collapsed state: `grid-template-columns: 0px 476px 0px`, `grid-template-rows: var(--card-h, 255px)`.

**Critical:** the card has `justify-content: center` so the grid tracks overflow symmetrically on smaller viewports — the image always stays centered. Do NOT remove this.

**Height:** use the fixed calc `calc(var(--card-h, 317px) + 150px)` for the expanded row, NOT `auto`. This keeps the `grid-template-rows` transition smooth. The side panels have `overflow-y: auto` so they scroll if their content is taller.

When adding a new project card, use `style="--card-h: 317px"` on the `.project-experience-card`.

**`experience-detail` panel:** only include `<p data-translate="...">` — the `<h3>` is hidden via CSS (`display: none`) so do not rely on it for the project name. The title already appears in the image overlay.
