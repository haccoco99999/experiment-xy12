# Where these skills come from

Both skills were copied without any change from public GitHub repositories on 2026-09-19.

| Skill | Source | Commit copied | Licence |
|---|---|---|---|
| web-design-guidelines | https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines | 063bee94c3f4df8453406c830b0a7df0f2860278 | GitHub shows no licence for this repository |
| frontend-design | https://github.com/anthropics/skills/tree/main/skills/frontend-design | 34040c9c568585f6929bedeaad110ad08f079624 | Apache License 2.0 (LICENSE.txt in the skill folder) |

Notes

- web-design-guidelines has no rules of its own. Each time it runs it downloads the rules from
  https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md,
  so it needs internet and follows whatever that file says at that moment.
  On 2026-09-19 that file was a plain list of interface review rules.
- To update a skill, copy its folder again from the source and change the commit above.

## frontend-pr-generator

Written in this project on 2026-09-19, not copied from anywhere. It has no external dependency: it reads the git diff and writes the commit title and PR body from the template inside its own SKILL.md. Triggered by the slash commands in `.claude/commands/pr.md` and `.claude/commands/generate-pr.md`.
