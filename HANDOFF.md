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

- Done: all 8 experiments: 1 (mung bean), 2 (cabbage), 3 (chicks), 4 (lab rat), 5 (tomato flower), 6 (new plants from four parts), 7 (butterfly life cycle) and 8 (cat reproduction and life cycle). Experiments 2, 4, 5, 6 and 7 are committed and pushed; Experiment 8 was built on 2026-09-21 and committed and pushed when the user asked for it. `main` is in sync with `origin` (private repo `haccoco99999/experiment-xy12`) after that push.
- Not built: nothing. The home page has 8 open cards. The plan still lists polish and a single-file export (`Thi-nghiem-tat-ca-trong-1-file.html`); ask the user before starting either.
- An earlier Experiment 8 build (commit `701178a`, local branch `exp8`) was deleted at the user's request on 2026-09-20 and was not used.

## Standing order from the user (2026-09-20): ended

The user first asked for all experiments to be built one after another, pausing at 90% usage and resuming after the reset. On 2026-09-20, when Experiment 7 was finished, the user asked to commit and push it and then to stop the automatic work. No scheduled job exists (the session-only resume job is gone). Rule 5 in AGENTS.md still applies to every assistant: at 90% usage stop, and go on only when the user says so. On 2026-09-21 the user asked for Experiment 8 ("start experiment 8") and later for the commit and push after it; nothing else is scheduled.

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

### 2026-09-22 (later), Claude: deployed the site to GitHub Pages (free), at the user's request

- The user asked how to put the site on the web for free and whether GitHub supports it. Answered: GitHub Pages is free but only for a public repo, and since the site ships plain unminified JS, a visitor can already read all app code via View Source once it is live anywhere — a private repo would only have hidden the spec copy in `docs/` and the working notes (`HANDOFF.md`, `SPEC-NOTES.md`), not the app code. Gave three options (Netlify with the repo kept private, GitHub Pages with the repo made public, or a no-Git drag-and-drop host); the user chose GitHub Pages with the repo public.
- Did: `gh repo edit haccoco99999/experiment-xy12 --visibility public` (was private), then `gh api -X POST repos/haccoco99999/experiment-xy12/pages -f "source[branch]=main" -f "source[path]=/"` to turn on Pages (branch deploy, no build step, matches this project). Confirmed the build finished (`gh api .../pages/builds/latest` → `"status":"built"`). Live at https://haccoco99999.github.io/experiment-xy12/. No app code changed.
- Updated `HUONG-DAN.txt`: "Cách mở" now lists the web address as Cách 1 (no download, needs internet) alongside the existing double-click-`index.html` method as Cách 2 (offline); "Cách chia sẻ" now leads with sending the link, with the old zip/folder method kept below for offline sharing.
- Tested: opened https://haccoco99999.github.io/experiment-xy12/ in the browser pane — home page shows all 8 cards, no console errors; opened Experiment 1, the 3D table and tool tray render correctly, no console errors. Did not click through Experiments 2 to 8 on the live URL (they are unchanged code, already verified locally in the 2026-09-21 entry below). `node --test "tests/*.test.js"`: 115 tests, all pass (no logic files touched).
- Not tested: a phone or tablet on the live URL, a custom domain (not requested).
- Not done: `HUONG-DAN.txt` is changed locally but not committed or pushed — AGENTS.md says commit only when the user asks, and this session was not asked yet. Next assistant (or this one, later): ask the user, then `git add HUONG-DAN.txt HANDOFF.md` and commit in Vietnamese Conventional Commits form (e.g. `docs: thêm địa chỉ web vào HUONG-DAN.txt`).
- Open question for the user: none blocking. The repo `haccoco99999/experiment-xy12` is now public on GitHub (was private) — if that turns out to be unwanted, it can be switched back to private in GitHub repo Settings, but note that reverts Pages too (Pages needs a public repo on the free plan).

### 2026-09-22, Claude: fixed - Experiment 8's cat could not be dragged (a real bug, not user error)

- The user reported: "cannot drag and drop the cat" in Experiment 8. Cause found in `css/app.css`: `#hud > * { pointer-events: auto; }` (line 79) is an ID selector, so by CSS specificity it silently overrode `.veil`'s own `pointer-events: none` (line 305) — a class selector loses to an ID selector regardless of which is written later in the file. The `.veil` div (`js/experiments/exp8.js`, the white fade used between scenes) is a direct child of `#hud`, covers the full screen (`inset:0`) and sits above everything (`z-index:30`). Being invisible (`opacity:0`) did not stop it from blocking clicks: it silently swallowed every real pointer event anywhere in Experiment 8, so no card, cat, sperm, egg, timeline mark or sorting card could be dragged or clicked. `tests/shots.js` never caught this because its scripted playthroughs call `el.dispatchEvent(...)` straight on the target element, which skips the browser's normal hit-testing and so never notices an invisible layer on top.
- Fix: one line in `css/app.css` (line 80) - added `#hud > .veil` to the existing list of HUD children that must stay click-through (the same list already covering `#labels`, `#zones`, `#toasts`, `#caption`). No JS changed.
- Tested in a browser with the real drag tool (not the virtual-clock scripted kind): first reproduced the break on `#exp8` (dragging "MÈO ĐỰC" onto the table did nothing, no console error; `getComputedStyle` showed the veil's `pointer-events` as `"auto"`, and `elementFromPoint` over the tray returned the veil). After the fix, on a fresh reload with no patches, both cats drag onto the table normally and the start button unlocks. Spot-checked Experiment 7 to confirm the shared CSS file was not broken elsewhere (`.veil` exists only in Experiment 8, so nothing else was touched). `node --test "tests/*.test.js"`: 115 tests, all pass (unchanged - this is a CSS-only fix).
- Not tested: a real touch screen, Firefox/Safari, opening from `file://`.
- Not done: nothing else was requested. Committed and pushed at the user's request.

### 2026-09-21 (latest), Claude: review of the whole project, `package.json`, and a full playthrough of all 8 experiments

- Added `package.json` (private, no build step): `npm test` runs `node --test "tests/*.test.js"`, `npm run serve` the dev server, `npm run shots` the shots page, and `puppeteer-core ^25.11.0` is recorded as the only dev dependency (it was already in `node_modules` with nothing naming it).
- Added Experiment 7 and Experiment 8 scenarios to `tests/shots.js`, so every experiment can now be played by script (`?e=exp7&s=finale`, `?e=exp8&s=finale`; checkpoints in between: exp7 `pair|mated|laid|eggs|larva|fed|pupa|cut|adult|finale`, exp8 `place|identify|cells|fert|zygote|embryo|fetus|kitten|growth|adultCat|finale`). New shared helpers there: `until(label, test, max)` waits on the virtual clock, `pickPoint/tapPick` click a real point **on** a 3D object (its box centre can sit behind another part, which is why the fetus tail was missed at first), `panelBtn/pressPanel`, `marks()` walks a timeline bar.
- Played all 8 from `file://` in headless Edge at 1280x720 (`tools/make-shots-page.mjs` page, virtual clock, real pointer events): exp1 `healthy`, exp2 `synth`, exp3 `healthy`, exp4 `replay`, exp5 `finale`, exp6 `finale`, exp7 `finale`, exp8 `finale`. Every one reached its end screen, no console errors or warnings anywhere. End states: exp2/4/5/6/7/8 report `finished`/`complete` true, exp1 and exp3 reach the results table (their 4th step stays `active` while the student reads it, as designed).
- Cosmetic, seen in the end screenshots: in the sorting tray of exp7 and exp8 a long card label is clipped by the ✓ badge ("MÈO CON L… DẦN"). Experiment 5's progress bar keeps a padlock on step 6 "Cây con" on the completion screen; `js/logic/exp5.js` never sets `st[5]` and `tests/exp5.test.js:125` asserts exactly that, so it is a decision, not a slip - the seedling belongs to Experiment 6.
- Ran `node --test "tests/*.test.js"`: 115 tests, all pass. `git status` before this task was clean, `main` equals `origin/main`, the spec copy in `docs/` is byte-for-byte the original one level up. Nothing is committed: `package.json` (new), `tests/shots.js` and this file are the changed files.
- Checked in a browser over `http://127.0.0.1:4173` (1280x720 and 1024x600) and, the real check, from `file://` in headless Edge at 1280x720: the home page shows 8 open cards, all 8 experiments open, fonts load, tray thumbnails bake, no console errors or warnings. Leak check: opened exp1, then all 8 in a row, then exp1 twice more; `Lab.app.snapshot()` gave the same numbers every time (geometries 37, textures 24, zones 3, 1 ticker, 0 tweens, 0 labels).
- Lifecycle is clean: 8 `dispose:` functions, 8 hint `setInterval`s and 8 matching `clearInterval`s, no `window`/`document` listeners left in `js/experiments` or `js/models`.
- Found, not fixed: (1) tray cards are `role="button" tabindex="0"` but `Lab.drag.bindCard` has no `keydown`, so Enter and Space do nothing (verified live); (2) `.card` has `touch-action: none` (`css/app.css:112`), so on a touch screen a finger starting on a card cannot scroll the tray, and exp6 at 1024x600 shows 6 of 11 cards with the rest needing a scroll; (3) `UI.modal` handles Escape only inside `UI.confirm`, so the help and info dialogs close by clicking outside only; (4) nothing automated covers `js/core`, `js/three`, `js/models`, `js/experiments` - the scripted playthroughs above are the nearest thing.
- Not tested: sound, a real touch screen, Firefox and Safari, phone-sized windows, wrong moves in exp7 and exp8 this time (the new scenarios play the right path only; the earlier entries tested the wrong moves by hand).
- Next: the user decides whether to fix items 1 and 2 above - a few lines in `js/core/dragdrop.js` and `css/app.css`. Nothing else is open.

### 2026-09-21, Claude: Experiment 8 done, committed and pushed

- Built (spec lines 13164-16469, read in full): `js/logic/exp8.js` + `tests/exp8.test.js` (14 tests, plus the text-fidelity check; `phase` says where the student is, `phaseDone`/`advance` move on, generic timelines `decideMark/applyMark/markStates`), `js/content/exp8.vi.js` (every `md` string checked), models `js/models/cat.js` (`Mo.cat({sex, age, pose})`: one model for the male, the female, the newborn kitten up to a one-year adult; `setAge`, `setPose`, `highlight`) and `js/models/cells.js` (`Mo.sperm`, `Mo.egg` with `setZygote`, `Mo.embryo` with `setT(0…3)`, `Mo.fetus` with `setStage(0…2)` and clickable parts), and `js/experiments/exp8.js` (core: the garden table and a purple "inside" backdrop built lazily, the tray, the side panel with the buttons on top, the timeline bar `X.tlBegin/tlGo`, the magnifier, click routing `X.clicks`, the white fade `X.fade`) with `exp8-cells.js` (place, identify, sperm and egg, fertilization, zygote), `exp8-grow.js` (embryo and fetus timelines, fetus parts), `exp8-born.js` (birth, newborn kitten, growth timeline, comparing three kittens, adult timeline) and `exp8-finale.js` (eight cards and slots, arrows, final panel, read-only review). Each mod adds itself to `Lab.exp8mods` and shares the object `X`. Shared files touched: `index.html` (tags), `css/app.css` (fade, info card, timeline bar). `HUONG-DAN.txt` has "Cách chơi thí nghiệm 8" and `SPEC-NOTES.md` has 16 Exp 8 rows (gaps and choices).
- Tests: `node --test "tests/*.test.js"`: 115 tests, all pass.
- Tested in a browser (1280x720, virtual clock, real pointer events): the whole game from the first drop to the final screen and the review. Wrong moves gave the md sentences: a cat outside the table, a click elsewhere while identifying, a sperm or egg in the wrong area, a sperm too far from the egg, a click on the egg, the glass away from the zygote, a locked timeline mark by button and by slider, a click away from the kitten, a wrong sorting card. Also checked: the 9-step bar fits, the lens tour on the kitten, the fetus part clicks, the comparison outline, the arrows and the animated diagram. No console errors. A reset after a full run equals a second reset (geometries 37, textures 12, zones 12, nothing else left); a reset without play has 2 fewer textures (the cached "kitten" fur and the glow texture, made during play, so they are cache, not a leak). Experiments 1 to 8 all open from the home page.
- Not tested: sound, touch screens, Firefox and Safari, opening `index.html` from `file://`, real-time smoothness (time was driven by hand), small windows (the 9-step bar and the panel were only looked at at 1280x720). `tests/shots.js` has no Exp 7 or Exp 8 scenarios.
- Rough edges, none blocking: (1) the "inside" backdrop is a plain gradient with floating dots, the embryo, fetus and cells are simple shapes; (2) the magnifier ring covers the zygote, so the student must click the ring to put the glass away before clicking the zygote; (3) toasts at the top sometimes cover the picture for a few seconds; (4) the mother's "lie" pose is a low standing cat; (5) on the final screen the wide panel makes the table small; (6) the review shows text only, not the 3D pictures.
- Next: nothing is left in the 8-experiment plan. Ideas the user may want: polish (rough edges above, Exp 6 plants look small), `tests/shots.js` scenarios for Exp 7 and 8, a run from `file://` in Chrome or Edge, and the single-file export (ask first). If a browser test shows a zero-size window, call `resize_window` 1280x720 and reload.

### 2026-09-20 (earlier), Claude: Experiment 7 done, committed and pushed

- Built: `js/content/exp7.vi.js` (every `md` string checked against the spec, lines 10942-13163), `js/models/butterfly.js` (`Mo.butterfly(sex)`, `Mo.eggs`, `Mo.larva`, `Mo.pupa`), `js/models/hostplant.js` (`Mo.hostPlant`, `Mo.leafPiece` whose bites are cut out with an alpha map, `Mo.ruler`) and `js/experiments/exp7.js` (core: scene, tray, side panel, drop routing, helpers `X.fly`, `X.tag`, `X.turn`) with `exp7-bfly.js` (placing, mating, the fertilization dialog, egg laying), `exp7-egg.js` (magnifier, hatching, `X.walk`), `exp7-larva.js` (feeding, three moults, ruler, pupation), `exp7-pupa.js` (magnifier on the pupa, the 3D cut with four dots, emergence) and `exp7-finale.js` (sorting, the end). Each mod adds itself to `Lab.exp7mods` and shares the object `X`. The logic and tests from the earlier entry (`js/logic/exp7.js`, `tests/exp7.test.js`) were used as written. Shared files touched: `index.html` (tags), `css/app.css` (fertilization dialog, locked buttons, diagram). `HUONG-DAN.txt` has "Cách chơi thí nghiệm 7"; `SPEC-NOTES.md` has 14 Exp 7 rows (gaps and choices; the larva lengths 3, 8, 16, 28, 42 mm are our own numbers).
- Tests: `node --test "tests/*.test.js"`: 100 tests, all pass (one new test checks that every text the logic asks for exists in the content file).
- Tested in a browser with a virtual clock and real pointer events: the whole game from the first drop to the final screen. Wrong drops first (butterfly outside the garden, male too far, female outside the leaf, magnifier away from the eggs, leaf and ruler away from the larva, a click elsewhere in the cut view, a wrong sorting card) each gave the md sentence. Then the mating, the fertilization dialog, laying, hatching, feeding with bites, three moults, the ruler (8 mm after the first moult), pupation, the cut with its four dots, the emergence, the sorting and the final screen with the diagram. No console errors. After a full run a reset gives the same `Lab.app.snapshot()` as a reset without play (47 geometries, 18 textures, 5 zones). Experiments 1 to 7 all open from the home page; card 8 says "Sắp có".
- Not tested: sound, touch screens, Firefox and Safari, opening `index.html` from `file://` (no headless Edge run this time), smoothness in real time (time was driven by hand), small window sizes. `tests/shots.js` has no Exp 7 scenarios (it has them for Exp 1 to 6).
- Rough edges, none blocking: (1) toasts at the top of the picture cover the butterflies or the pupa for a few seconds at some camera shots; (2) the new butterfly reuses the male model; (3) the J-shaped caterpillar and the parts inside the pupa are simple shapes; (4) the "under the leaf" camera sits below the table top level (outside the table) and looks across its front edge.
- The user asked for the commit and the push when Experiment 7 was done, then to stop the automatic work, and said they will switch to Antigravity. So no cron job is scheduled and nothing runs by itself.
- Next: Experiment 8 (cat, spec lines 13164-16469; the md has every line pasted as a heading, see `SPEC-NOTES.md`). Read `AGENTS.md` and this file first, then follow "Adding an experiment": logic + tests, content, models, wiring, `HUONG-DAN.txt`, `SPEC-NOTES.md`. Reuse from Exp 7: path movement with `CatmullRomCurve3` (`X.fly`, `X.walk`), `Lab.sceneDrag` for things dragged inside the picture, `UI.modal` for a diagram screen, the finale panel whose diagram lights up step by step, the sorting cards on pads. If a browser test shows a zero-size window, call `resize_window` 1280x720 and reload.

Older entries are in git history (`git log -- HANDOFF.md`).
