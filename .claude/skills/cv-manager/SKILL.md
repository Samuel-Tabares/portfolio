---
name: cv-manager
description: Maintain and update Samuel Tabares León's CV/résumé (ES + EN PDFs) by editing the HTML sources and re-rendering. Use WHENEVER Samuel says "update my CV/résumé/hoja de vida", "I shipped/finished X, add it to my CV", "I have a new project/experience/skill for my CV", "regenerate my CV", "change my CV profile", or describes work/achievements that belong on a résumé. The CV is EMPLOYER/INTERNSHIP-facing (different audience from his other platforms). This skill edits cv_es.html / cv_en.html and re-renders to PDF with Playwright — it does NOT rewrite the design, only updates data while keeping the exact same structure, layout and 1-page format.
---

# CV Manager

You maintain Samuel's CV. He tells you what changed ("I finished the AI SaaS", "add a new experience", "update my profile") and you edit the HTML sources, keep the design identical, and re-render fresh ES + EN PDFs.

## ⚠️ CRITICAL: this is the ONE employer-facing artifact

Unlike GitHub/Portfolio/LinkedIn (builder/freelance-facing), the CV targets **HR recruiters and internship coordinators at normal companies**. Adapt accordingly:
- Tone: solid, employable student-engineer. Keep "seeking internship / development opportunities".
- Do NOT make it sound like a founder pitch. No "I sell custom solutions" framing.
- Still lead with the real strength: applied AI + backend. Just framed for employers, not clients.
- Everything factual still comes from the SSOT — same truth, recruiter framing.

## How it works (design stays, data updates)

The CV lives as two HTML files that are the **single source of the design**:
- `source/cv_es.html` — Spanish
- `source/cv_en.html` — English

You **edit the data inside these HTML files**, never the CSS/layout. Then re-render to PDF via the script. The design, columns, colors, fonts and 1-page format must stay identical.

## Prerequisites (check once per session)

```bash
python3 -c "import playwright" 2>/dev/null || pip install playwright --break-system-packages
playwright install chromium 2>/dev/null
python3 -c "import pypdf" 2>/dev/null || pip install pypdf --break-system-packages
```

## Workflow

1. **Read the SSOT:** `~/.claude/skills-library/_shared/ssot.md` — for facts (projects, stack, education, dates). Never invent; if a metric/detail is missing, ask Samuel.
2. **Detect SSOT updates.** If the trigger introduces a new fact (shipped project, new role, new cert), update the SSOT FIRST (keeps all agents in sync), then update the CV.
3. **Edit BOTH HTML files** (`cv_es.html` and `cv_en.html`) with the change. ES and EN must stay in sync — same content, natural in each language. ES uses neutral professional Spanish (the CV is formal; no voseo here).
4. **Keep it 1 page.** This design fits one A4 page. If adding content overflows, trim the weakest/oldest item (usually an older project) rather than shrinking fonts. Tell Samuel what you trimmed.
5. **Re-render:**
   ```bash
   CV_OUT_DIR=/path/to/output python3 scripts/render_cv.py both
   ```
   (Ask Samuel for his desired output folder, or default to the skill's `output/`.)
6. **Verify 1 page.** The script warns if a PDF exceeds 1 page. If it does, trim and re-render.
7. **Show Samuel** what changed (which section, which file) and deliver both PDFs.

## What can change (data only)

| Section | HTML location | Notes |
|---|---|---|
| Profile / Perfil | `.profile` paragraph | 1 paragraph, employer-facing |
| Experience | `.job` blocks | newest first; keep metrics real |
| Skills bars | `.skillrow` | label + level + bar width % |
| Stack chips | `.chips` (in sidebar) | tech names only |
| Languages | `.item` under Languages/Idiomas | |
| Education | `.edu` blocks | |
| Certifications/Awards | `.edu` blocks at bottom | |
| Contact | `.item` under Contact | email = SSOT canonical |

## What must NOT change
- CSS, layout, columns, colors, fonts, spacing.
- The 1-page constraint.
- The dark sidebar / light main structure.
- Section order.
> If Samuel wants a design change (not data), confirm explicitly — that's a redesign, not a data update, and you edit CSS carefully then.

## Skill-level mapping (respect evidence levels)
When adding a skill bar or chip, use the SSOT evidence levels:
- 🟢 Production → can be a skill bar with high % (80-90).
- 🟡 In practice → bar with intermediate % (60-70) labeled "Intermedio/Intermediate".
- 🌱 Learning → do NOT add as a skill bar. At most a chip if relevant, or omit. (e.g. Ruby stays off the CV until there's a project.)

## Hard rules
- **Edit data, never design.** Same structure always.
- **Both languages, every time.** ES + EN in sync.
- **Keep 1 page.** Trim, don't shrink.
- **Employer-facing tone.** Not founder/freelance pitch.
- **Never invent** metrics, dates, or tech. Pull from SSOT or ask.
- **Update SSOT first** when a new fact appears.
- **Email = SSOT canonical** (samitabaleon@gmail.com unless Samuel changed it).
- **Banned phrases** (from SSOT): no "Perfectionist", "Eager learner", hardcoded age, "fourth-semester", TreeSet/HashMap/BTree junior framing, MongoDB as a highlight.

## Reference files
- `~/.claude/skills-library/_shared/ssot.md` — facts & brand
- `source/cv_es.html`, `source/cv_en.html` — the editable CV (design + data)
- `scripts/render_cv.py` — re-renders HTML → PDF, checks 1-page

## Example interactions

**User:** "I deployed the multi-agent system to production. Update my CV."
**You:** Update SSOT (multi-agent: in progress → production). In both HTML files, move/keep the multi-agent `.job` block, change its `.meta` from "En construcción/In progress" to "En producción/In production", refine the bullet if there's a new metric (ask). Re-render both. Confirm still 1 page. Deliver 2 PDFs.

**User:** "Add Ruby to my CV, I've been studying it."
**You:** Per SSOT, Ruby is 🌱 learning — no project yet. I won't add it as a skill bar (would misrepresent level). If you have a real Ruby project, I'll feature the project instead. Confirm?

**User:** "Make my profile shorter and punchier."
**You:** Rewrite the `.profile` paragraph in both files, employer-facing, keep AI+backend lead. Re-render. Show before/after.
