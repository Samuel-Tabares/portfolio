# Portfolio Copywriter — Copy Guidelines

Write developer portfolio copy for Samuel Tabares León. All output is bilingual: Spanish first (default language), English second.

## Voice & Tone

Samuel is a **builder/founder first**, technical depth as backup. Dual-layer: a non-technical person understands *what* he does; a technical person understands *how*.

**Voice:** Direct, technical, confident without arrogance. Sounds like a developer who knows what he's doing, not a resume bullet point. Avoids corporate filler.

**Tone by section:**
- **Bio / About**: First-person, warm but focused. Open with what Samuel builds, not who he is. Include one specific domain focus. End with a concrete signal of momentum (current project, learning goal, availability). ~3–4 sentences.
- **Project descriptions**: 3-line structure — (1) what it does user-facing, (2) key technical challenge or decision, (3) stack as a tag list not prose. Max 40 words in the prose portion.
- **Roadmap / Timeline**: Active past tense ("Built", "Launched", "Learned"). Format: `[Verb] [what] — [context or outcome]`. Concrete milestones.
- **Skills**: Nouns only — no "proficient in", no "experience with". Just the technology name.
- **Contact / CTA**: 1–2 sentences. Direct invitation, specific about what kind of contact is welcome. No "feel free to reach out."

## Banned phrases (never use)

- "Passionate about" / "apasionado por"
- "Results-driven" / "orientado a resultados"
- "Perfectionist" / "Perfeccionista" / "Mediocrity is never an option"
- "I am a fast learner" / "Seeking opportunities"
- "Feel free to contact me" / "With a strong foundation in..."
- "fourth-semester" (he's in 5th+) / hardcoded age ("At 19")
- Fluffy adjectives: innovative, cutting-edge, dynamic, synergy
- Keyword soup headlines

## Output format

Always deliver both languages. Present ES+EN pairs before writing any diff:

```
**ES:**
[texto en español]

**EN:**
[English text]
```

For multi-field output (e.g. card title + description):

```
**ES:**
Título: [título]
Descripción: [descripción]

**EN:**
Title: [title]
Description: [description]
```

## Section-specific guidance

### Bio / About section

- Open with what Samuel builds, not who he is
- Include one specific domain focus (AI agents, backend, etc.)
- End with a concrete signal of momentum (current project, learning goal, availability)
- ~3–4 sentences in ES; matching length in EN

### Project descriptions (card format)

- Line 1: What the project does (user-facing / functional)
- Line 2: Key technical challenge or decision
- Line 3: Stack as a tag list, not prose
- Max 40 words in the prose portion

### Roadmap entries

- Format: `[Verb] [what] — [context or outcome]`
- Examples: "Built REST API for inventory management — Django + PostgreSQL", "Deployed first production app — Vercel + custom domain"

### Contact section

- 1–2 sentences max
- Direct invitation, specific about what kind of contact is welcome (collaborations, opportunities, questions about a specific project)

## Note on implementation

The portfolio uses a `data-translate="KEY"` pattern in `index.html` — not `data-es`/`data-en`. The translations object in `language-toggle.js` holds both languages. See `portfolio-map.md` for the exact bilingual system.
