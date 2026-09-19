# HANDOFF.md: notes between assistants

Read `AGENTS.md` first (the rules), then this file. Only one assistant works in the folder at a time.

## How to hand over

Before you stop, add an entry at the top of the log below (newest first). Keep it short and factual:

- What you did (files) and what you tested. Say what you did not test.
- The test result of `node --test "tests/*.test.js"`.
- What is left and what the next assistant should do first.
- Open questions for the user.

Keep the last 5 entries. Delete older ones; git history keeps them.

## Where things stand

- Done: Experiment 1 (mung bean) and Experiment 3 (chicks).
- Not built (their cards say "Sắp có"): 2, 4, 5, 6, 7, 8. Order: 2 next (the user's choice), then 4, then 5 to 8.
- Not decided: which assistant builds each next experiment. The user decides.

## Suggested split of work

This is a suggestion from the plan. None of these tools has been tried on this project yet.

- Codex: `js/logic`, `js/content` and `tests`. Node can check this work, and its documentation shows no built-in browser.
- Antigravity: 3D models, `js/experiments`, CSS, and looking at the page in a browser with screenshots. Its documentation says Chrome must be the default browser, and this site has only been tried on Edge.
- Claude: review, integration, `HUONG-DAN.txt`, `SPEC-NOTES.md` and commits.

Experiments edit shared files, so hand over only at a clean point: the tests pass and this file is updated.

## First-time check for each new assistant

Open the folder `D:\Code\Thí nghiệm\v5` in the assistant's app and paste this:

> Read AGENTS.md and HANDOFF.md. List the five rules, one line each. Then run `node --test "tests/*.test.js"` and tell me how many tests passed. Do not change any file.

A good answer lists all five rules (including the 90% usage rule and Vietnamese commit messages) and reports the same number of passing tests as the latest log entry. The folder name has a space and Vietnamese letters, so this also shows that the path works in that app.

## Log (newest first)

### 2026-09-20, Claude

- Built Experiment 3 (chicks): `js/logic/exp3.js`, `js/content/exp3.vi.js`, `js/models/cage.js`, `chick.js`, `chick-brain.js`, `js/experiments/exp3.js`, `exp3-results.js`, `tests/exp3.test.js`. Gaps and choices are in `SPEC-NOTES.md`. Small additions to shared files: a chirp sound in `js/core/audio.js`, a wood shavings texture in `js/three/mat.js`, `Lab.loop.tickAll` in `js/core/tween.js`, Experiment 3 styles in `css/app.css`, Experiment 3 scenarios in `tests/shots.js`.
- Set up the shared files: `AGENTS.md`, this file, `tools/sync-skills.mjs`, `tests/agents-sync.test.js`, `.gitattributes`. `CLAUDE.md` now imports `AGENTS.md`. `GEMINI.md` is a copy of `AGENTS.md`. `.agents/skills` is a copy of `.claude/skills`.
- Tested: all tests pass (45). Experiment 3 was played through in a browser and in headless Edge from `file://` (1280x720 and 1024x768), for every case: all conditions, the default 37 °C, and the dead outcomes. A reset leaves nothing behind at three different moments.
- Not tested: smoothness in a visible window (the pane was hidden, time was driven by hand), sound, touch screens, Firefox, Safari. The other assistants have not read `AGENTS.md` yet (see the first-time check above).
- Added the humanizer skill (MIT, from github.com/blader/humanizer, with the user's yes) to `.claude/skills/humanizer` and synced it to `.agents/skills`. The whole file was read first. Its source is in `.claude/skills/SOURCES.md`.
- Committed locally in two commits (Experiment 3; shared files and skills). Nothing is pushed.
- Next: Experiment 2 (the user's choice).
