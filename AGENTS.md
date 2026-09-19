# AGENTS.md: rules for every AI assistant in this folder

This project is a website of 8 interactive science experiments for primary school students, in Vietnamese ("Phòng thí nghiệm sân vườn"). It is plain HTML, CSS and JavaScript, with 3D drawn by three.js, and it opens by double-clicking `index.html`. The user is not a programmer: explain things in simple, plain language, in the language the user writes in.

Several assistants (Claude, Codex, Antigravity) take turns in this folder. This file is the single source of rules for all of them. `CLAUDE.md` imports it. `GEMINI.md` is an exact copy of it (`node tools/sync-skills.mjs` keeps it so, and a test checks it).

## Start and end of every task

1. Read `HANDOFF.md`. It says what is done, what comes next, and what the last assistant could not finish.
2. Only one assistant works in the folder at a time. If `git status` shows changes you did not make, ask the user before you touch those files.
3. Before you stop, add an entry at the top of the log in `HANDOFF.md`: what you did, the test result, what is left, open questions.

## Rules

1. **Answer clear and direct.**
   - Start with the answer or the result, then give only the details that matter.
   - Use short, plain sentences. No filler, no long introductions, no repeating the question.
   - Say clearly when something is not done, not checked, or uncertain.

2. **Use maximum caution and deeper reasoning to optimize results.**
   - Think the task through before acting. Read the relevant files instead of guessing.
   - Check your work before reporting it: run the tests, open the page, compare with the source. Report honestly what was and was not verified.
   - Be extra careful with anything hard to undo (deleting or overwriting files, publishing to GitHub): look at exactly what is affected first.
   - When the best choice is not obvious, compare the options and give one clear recommendation.

3. **Keep HUONG-DAN.txt up to date.**
   - When you finish a new experiment, or change anything the guide describes, update HUONG-DAN.txt in the same task.
   - Write it in Vietnamese, clear and direct, using the humanizer skill: https://github.com/blader/humanizer
   - Mark the experiment as done in "Thí nghiệm hiện có" and add a "Cách chơi thí nghiệm N" section with numbered steps. Fix every statement that is no longer true (for example "Sắp có", where texts live, the folder list).
   - If the skill is not installed, read its SKILL.md (https://raw.githubusercontent.com/blader/humanizer/main/SKILL.md) and use it only as a writing guide.
   - Write only facts you have checked in the project. Before you finish, check the result for the skill's main tells: dashes, curly quotes, bold text, emojis, and "not X but Y" wording.

4. **Write git commits in Conventional Commits format, in Vietnamese.**
   - Format: `type(scope): mô tả ngắn`, then a blank line and a description of what changed and why. The scope is optional.
   - Keep the standard English type keywords (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert). Write the short description and the body in Vietnamese.
   - Keep the subject on one line, under about 72 characters, with no final period. Keep trailers such as Co-Authored-By in their standard form.
   - Example:

     ```
     feat(exp1): thêm thí nghiệm 1 về yếu tố sống của cây đậu xanh

     Thêm khay dụng cụ, bảng điều khiển nhiệt độ, tua nhanh 14 ngày và bảng so sánh kết quả.
     ```

5. **Stop when usage reaches 90%.**
   - "Usage" means the plan limits your own app shows, such as the 5-hour limit and the weekly limit. Use whichever is higher.
   - Check it at the start of every task and after each major step (a build, a test run, a commit).
   - At 90% or more, do not start new work. Finish the step in progress so nothing is left half-edited, then stop. Tell the user the usage numbers, what is done, what is left, and when the limit resets. Wait for the user to say to continue.
   - If usage cannot be read, tell the user before starting big work.

## The project in brief

- No build step, no server, no `import`, no `fetch`, no external image or font files: everything must work from `file://`. Scripts are classic `<script>` tags listed in `index.html` (order matters) and share one global object, `Lab`.
- `vendor/three.classic.js` is three.js r185. Do not edit anything in `vendor/`.
- Layers: `js/core` (start-up, UI, drag and drop, tween, audio), `js/three` (stage, garden, materials, shapes, effects, labels), `js/models` (3D objects made from simple shapes, 1 unit = 10 cm), `js/logic` (pure rules, also run by the tests in Node), `js/content` (all Vietnamese text), `js/experiments` (wires one experiment together and returns `{ dispose, api }`). Tween durations are in seconds.
- Texts: each `js/content/expN.vi.js` has `md` (copied word for word from the specification; a test checks every sentence) and `app` (short helper messages the specification does not have).
- Reset means "throw everything away and build again" (`Lab.app.reset`). `Lab.app.snapshot()` counts what is left over; after a reset it must equal a fresh start.
- One temperature table, `js/logic/temperature-bands.js`, serves Experiments 1 and 3. It follows the specification exactly, even where the specification contradicts itself (the user's decision). Write every contradiction and every gap you fill in `SPEC-NOTES.md`. Never fix science content silently.
- The home page lists all 8 experiments. A card becomes active when `Lab.experiments.expN` exists.

## The specification

`THÍ NGHIỆM 1909.md`, Vietnamese, about 16,500 lines. The original is one level above this folder (`D:\Code\Thí nghiệm\`). A copy is in `docs/`. Lines: Experiment 1 = 1-1353, 2 = 1354-2796, 3 = 2797-4858, 4 = 4859-6727, 5 = 6728-8941, 6 = 8942-10941, 7 = 10942-13163, 8 = 13164-16469.

## Adding an experiment

Done so far: Experiments 1 and 3. Next: 2 and 4 (two topics), then 5 to 8 (staged, locked steps). Work in this order:

1. Read the whole section of the specification. Note gaps and contradictions in `SPEC-NOTES.md`.
2. Write `js/logic/expN.js` (pure rules) and `tests/expN.test.js`. Copy the shape of `exp1.js` and `exp3.js`.
3. Write `js/content/expN.vi.js`.
4. Build the models in `js/models`, then `js/experiments/expN.js`, and add the new `<script>` tags to `index.html`. Reuse the shared kit. Change shared files (`js/core`, `js/three`, `css/app.css`) only when needed, in small steps that keep the finished experiments working.
5. Update `HUONG-DAN.txt` and `SPEC-NOTES.md` (rule 3), run the tests, and look at the page in a browser.

## Testing

- `node --test "tests/*.test.js"` (keep the quotes; Node 24). All tests must pass before you hand over.
- To look at the page: `python tools/dev-server.py` serves the folder at http://127.0.0.1:4173 with no cache. For scripted screenshots run `node tools/make-shots-page.mjs`, then open `tests/shots.html?e=exp3&s=healthy` (scenarios are in `tests/shots.js`; they use a virtual clock, so machine speed does not matter).
- The last check is the real one: open `index.html` from the disk (`file://`) in Chrome or Edge.
- Say what you tested and what you did not.

## Git

- Branch `main`. Commit only when the user asks. Never push unless the user asks. Never force-push.
- Add files by name. Never use `git add -A`. Never add `docs/`: it holds the specification copy the user chose not to publish.
- Many experiments touch the same files (`index.html`, `css/app.css`, `HUONG-DAN.txt`, `SPEC-NOTES.md`, `HANDOFF.md`, `js/core`, `js/three`). This is why only one assistant works at a time.

## Skills

`.claude/skills` is the master copy. `.agents/skills` is the copy for Codex and Antigravity. After you change a skill, run `node tools/sync-skills.mjs`. The same script copies this file to `GEMINI.md`. A test fails if a copy differs. The humanizer skill (rule 3) is in the folder as `.claude/skills/humanizer/SKILL.md`, so writing HUONG-DAN.txt does not need the internet.
