# `gh` CLI cheatsheet — GitHub Profile Manager

All commands assume `gh` is authenticated as `Samuel-Tabares`.
Verify: `gh auth status` · `gh api user --jq .login`

## Repo editing

```bash
# Set / change description
gh repo edit Samuel-Tabares/<repo> --description "One clear line."

# Add topics (repeat --add-topic)
gh repo edit Samuel-Tabares/<repo> --add-topic rust --add-topic whatsapp-bot --add-topic automation

# Remove a topic
gh repo edit Samuel-Tabares/<repo> --remove-topic old-topic

# Set homepage / website
gh repo edit Samuel-Tabares/<repo> --homepage "https://samueltabares.com"

# Make private (reversible — preferred for cleanup)
gh repo edit Samuel-Tabares/<repo> --visibility private --accept-visibility-change-consequences

# Make public again
gh repo edit Samuel-Tabares/<repo> --visibility public --accept-visibility-change-consequences

# Archive (read-only, still visible — rarely needed)
gh repo archive Samuel-Tabares/<repo>
```

## Listing & inspecting repos

```bash
# Full inventory with brand-relevant signals
gh repo list Samuel-Tabares --limit 100 \
  --json name,description,visibility,isArchived,primaryLanguage,pushedAt,stargazerCount \
  --jq 'sort_by(.pushedAt) | reverse'

# Find repos missing a description
gh repo list Samuel-Tabares --limit 100 --json name,description \
  --jq '.[] | select(.description == "" or .description == null) | .name'

# View one repo's current metadata
gh repo view Samuel-Tabares/<repo> --json name,description,repositoryTopics,homepageUrl,visibility
```

## Profile README

```bash
# Clone the special profile repo
gh repo clone Samuel-Tabares/Samuel-Tabares /tmp/profile-readme
cd /tmp/profile-readme

# ... edit README.md ...

git add README.md
git commit -m "Update profile README: <summary>"
git push
```

## Bio & profile fields (REST API — needs `user` scope on token)

```bash
# Bio (max ~160 chars)
gh api -X PATCH user -f bio="Software engineer & builder · custom AI agents + backends · Python · Rust · AI/LLM"

# Other profile fields
gh api -X PATCH user -f name="Samuel Tabares León"
gh api -X PATCH user -f company="Freelance · Building AI systems"
gh api -X PATCH user -f location="Armenia, Quindío, Colombia"
gh api -X PATCH user -f blog="https://samueltabares.com"

# Read current profile to confirm
gh api user --jq '{name, bio, company, location, blog}'
```

If a PATCH returns 403/404 on the field, the token lacks `user` scope:
re-auth with `gh auth refresh -s user` or fall back to manual UI (Edit profile).

## NOT automatable — output manual steps instead

### Pinned repos
> Go to https://github.com/Samuel-Tabares → "Customize your pins" → select up to 6 in the desired order → Save.

### Social account links (the icon row under the bio)
> Edit profile → "Social accounts" → paste URLs (LinkedIn, portfolio, ORCID, etc.).

## Notes
- `--accept-visibility-change-consequences` is required by `gh` for visibility flips; without it the command errors.
- Topics must be lowercase, hyphenated, no spaces.
- Never run `gh repo delete`. Curation = private, not delete.
