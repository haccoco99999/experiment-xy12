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

- Done: Experiment 1 (mung bean), 2 (cabbage), 3 (chicks), 4 (lab rat), 5 (tomato flower), 6 (new plants from four parts) and 7 (butterfly life cycle). Experiments 2, 4, 5 and 6 were committed together on 2026-09-20 (`d1f2cbc`) and Experiment 7 was committed and pushed on 2026-09-20 when the user asked for it. Everything on `main` is pushed to `origin` (private repo `haccoco99999/experiment-xy12`).
- Not built (its card says "Sắp có"): 8 only. An earlier Experiment 8 build was on the local branch `exp8` (commit `701178a`: logic, content and experiment file, no tests or models). The user called its worktree an error and had the folder and the branch deleted on 2026-09-20 (never pushed; the commit can still be restored from the reflog for a while with `git branch exp8 701178a`). Build Experiment 8 from the specification as usual.
- Next assistant: the user said on 2026-09-20 that they will switch to Antigravity. See the first log entry for what to do first.

## Standing order from the user (2026-09-20): ended

The user first asked for all experiments to be built one after another, pausing at 90% usage and resuming after the reset. On 2026-09-20, when Experiment 7 was finished, the user asked to commit and push it and then to stop the automatic work. No scheduled job exists (the session-only resume job is gone). Rule 5 in AGENTS.md still applies to every assistant: at 90% usage stop, and go on only when the user says so.

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

### 2026-09-20 (latest), Claude: Experiment 7 done, committed and pushed

- Built: `js/content/exp7.vi.js` (every `md` string checked against the spec, lines 10942-13163), `js/models/butterfly.js` (`Mo.butterfly(sex)`, `Mo.eggs`, `Mo.larva`, `Mo.pupa`), `js/models/hostplant.js` (`Mo.hostPlant`, `Mo.leafPiece` whose bites are cut out with an alpha map, `Mo.ruler`) and `js/experiments/exp7.js` (core: scene, tray, side panel, drop routing, helpers `X.fly`, `X.tag`, `X.turn`) with `exp7-bfly.js` (placing, mating, the fertilization dialog, egg laying), `exp7-egg.js` (magnifier, hatching, `X.walk`), `exp7-larva.js` (feeding, three moults, ruler, pupation), `exp7-pupa.js` (magnifier on the pupa, the 3D cut with four dots, emergence) and `exp7-finale.js` (sorting, the end). Each mod adds itself to `Lab.exp7mods` and shares the object `X`. The logic and tests from the earlier entry (`js/logic/exp7.js`, `tests/exp7.test.js`) were used as written. Shared files touched: `index.html` (tags), `css/app.css` (fertilization dialog, locked buttons, diagram). `HUONG-DAN.txt` has "Cách chơi thí nghiệm 7"; `SPEC-NOTES.md` has 14 Exp 7 rows (gaps and choices; the larva lengths 3, 8, 16, 28, 42 mm are our own numbers).
- Tests: `node --test "tests/*.test.js"`: 100 tests, all pass (one new test checks that every text the logic asks for exists in the content file).
- Tested in a browser with a virtual clock and real pointer events: the whole game from the first drop to the final screen. Wrong drops first (butterfly outside the garden, male too far, female outside the leaf, magnifier away from the eggs, leaf and ruler away from the larva, a click elsewhere in the cut view, a wrong sorting card) each gave the md sentence. Then the mating, the fertilization dialog, laying, hatching, feeding with bites, three moults, the ruler (8 mm after the first moult), pupation, the cut with its four dots, the emergence, the sorting and the final screen with the diagram. No console errors. After a full run a reset gives the same `Lab.app.snapshot()` as a reset without play (47 geometries, 18 textures, 5 zones). Experiments 1 to 7 all open from the home page; card 8 says "Sắp có".
- Not tested: sound, touch screens, Firefox and Safari, opening `index.html` from `file://` (no headless Edge run this time), smoothness in real time (time was driven by hand), small window sizes. `tests/shots.js` has no Exp 7 scenarios (it has them for Exp 1 to 6).
- Rough edges, none blocking: (1) toasts at the top of the picture cover the butterflies or the pupa for a few seconds at some camera shots; (2) the new butterfly reuses the male model; (3) the J-shaped caterpillar and the parts inside the pupa are simple shapes; (4) the "under the leaf" camera sits below the table top level (outside the table) and looks across its front edge.
- The user asked for the commit and the push when Experiment 7 was done, then to stop the automatic work, and said they will switch to Antigravity. So no cron job is scheduled and nothing runs by itself.
- Next: Experiment 8 (cat, spec lines 13164-16469; the md has every line pasted as a heading, see `SPEC-NOTES.md`). Read `AGENTS.md` and this file first, then follow "Adding an experiment": logic + tests, content, models, wiring, `HUONG-DAN.txt`, `SPEC-NOTES.md`. Reuse from Exp 7: path movement with `CatmullRomCurve3` (`X.fly`, `X.walk`), `Lab.sceneDrag` for things dragged inside the picture, `UI.modal` for a diagram screen, the finale panel whose diagram lights up step by step, the sorting cards on pads. If a browser test shows a zero-size window, call `resize_window` 1280x720 and reload.

### 2026-09-20 (later), Claude: Experiment 6 done (uncommitted; some polish left)

- Built: `js/logic/exp6.js` + `tests/exp6.test.js` (9 tests), `js/content/exp6.vi.js` (every `md` string checked; spec lines 8942-10941 read in full), `js/models/sprouts.js` (`Mo.sproutPot(kind)`: the half-cut pot of Experiment 1 with one sample; `setLife(t)` grows it, t = 1 plantlet at day 14, t = 2 grown plant; `showSample`, `lensPoint`, `zoneBox`, `setSoil`), `js/experiments/exp6.js` (core: four places, 11-card tray, panel, drops, watering, magnifier) and `exp6-lapse.js` (start button, days 0 → 2 → 4 → 7 → 14, click a pot to zoom, classification with four cards, "TIẾP TỤC TUA NHANH", the end). Choices and gaps are in `SPEC-NOTES.md`; `HUONG-DAN.txt` has "Cách chơi thí nghiệm 6". Shared: `index.html` tags, `css/app.css` (place tags, five-day time bar, result chains, and a smaller progress bar when there are eight steps).
- Tested: all 88 tests pass. In a browser (real pointer events, time by hand): pots (wrong place message), samples (wrong pot, outside), water outside a pot, the soil card, the magnifier, the start button, days 0 to 14 with the germination sentence, clicking a pot to zoom and the back button, the classification (a wrong card goes back, four right cards), growing up and the final screen with the progress bar at 8 of 8. The console had no errors. A reset after a full run leaves the same snapshot except textures +2 (the cached "moist" soil textures) and geometries +1 (two full cycles in a row gave the same numbers, so these are cached items and not a leak).
- Not tested: sound, touch screens, Firefox and Safari, file:// captures in headless Edge (the scenarios `pots|samples|lens|water|d4|d14|zoom|classify|finale` are in `tests/shots.js` but were not run), the diagram and conclusion cards (they render but were not looked at), Experiments 1 to 5 after the last changes (they were not touched, but run the smoke check).
- Polish left: (1) the plants look small in the four-pot view (leaves were just made 1.5 times bigger; the stems in `life()` of sprouts.js can be taller); (2) look at the result tags over the pots with the wide panel open; (3) the sweet potato vine and the kalanchoe plantlets are simple shapes: check them with a click-to-zoom and adjust; (4) run the `tests/shots.js` scenarios for Experiment 6 in headless Edge (`?e=exp6`) and look at the pictures.
- Next: Experiment 7 (spec lines 10942-13163). Nothing is pushed. The user later said yes to committing Experiments 2, 4, 5 and 6 (done on 2026-09-20, one commit).

### 2026-09-20 (later), Claude: Experiment 5 done (uncommitted)

- Built: `js/logic/exp5.js` + `tests/exp5.test.js` (10 tests), `js/content/exp5.vi.js` (every `md` string checked against the spec, lines 6728-8941 read in full), `js/models/tomato.js` (the flower, cut lengthwise with clipping planes; the pollen stick; the pollen tube; the fruit that grows, ripens and is cut in half; a seed), `js/experiments/exp5.js` (core: scene, tray, side panel, placing, info table, magnifier) with `exp5-look.js` (the eight parts), `exp5-pollen.js`, `exp5-fert.js` (germination, tube, ovule, male cell) and `exp5-fruit.js` (fast forward, fruit, seeds, the end); each adds itself to `Lab.exp5mods` and shares the object `X`. Choices and gaps are in `SPEC-NOTES.md`; `HUONG-DAN.txt` has "Cách chơi thí nghiệm 5".
- Small changes in shared files: `css/app.css` (glowing dots, loaded-stick badge, time bar), `index.html` (tags), `tests/shots.js` (scenarios `placed|lens|cut|look|ready|pollen|loaded|fert|germ|tube|ovule|male|d7|d14|seeds|d30|finale`). Experiment 5 switches `renderer.localClippingEnabled` on for the cut flower. Note for the next experiments: `Lab.stage.shot` never goes closer than a camera distance of 3, so `w` below about 0.9 has no extra effect.
- Tested: all 78 tests pass. In a browser (real pointer events, time driven by hand) I played the whole story: placing the flower and the md messages for tools too early, the info table, the magnifier and the structure view, all eight dots (another order gives a hint), the stick (no pollen, wrong places, collecting, wrong places with pollen, pollinating), the germination click (a wrong click shows the md sentence), the tube (wrong release, half way, to the end), the ovule (wrong, right), the male cell (wrong, right), the fertilization, the fast forward (days 3, 7, 14 with the seeds, 21, 30), the cut fruit and the final screen. A reset after a full run leaves the same snapshot as a fresh start except one cached glow texture (it does not grow over two cycles). Experiments 1 to 4 still open and take a first drop; the console had no new errors. In headless Edge from `file://` I captured `look` and `germ` (1280x720); `finale` timed out once, like the flaky runs before.
- Not tested: sound, touch screens, Firefox and Safari, keyboard use, small window sizes for the cut halves.
- Next: Experiment 6 (spec lines 8942-10941). Nothing is pushed. (Committed later together with Experiment 6.)

### 2026-09-20 (later), Claude: Experiment 4 done (uncommitted)

- Built: `js/logic/exp4.js` + `tests/exp4.test.js` (10 tests), `js/content/exp4.vi.js` (every `md` string checked against the spec, lines 4859-6727 read in full), `js/models/rat.js` (white rat, see-through body with lungs, an airway from the nose, a stomach and a bladder), `js/experiments/exp4.js` (core: scene, tray, side panel, placing the rat, info table, magnifier, cameras `overview|air|waste|result`) with `exp4-air.js`, `exp4-wfw.js` and `exp4-finale.js` (each adds itself to `Lab.exp4mods` and shares the object `X`). Choices and gaps are in `SPEC-NOTES.md`; `HUONG-DAN.txt` has "Cách chơi thí nghiệm 4".
- Small changes in shared files: `css/app.css` (marks, result diagram, replay buttons, flow label colours), `index.html` (tags), `tests/shots.js` (scenarios `placed|info|air|airGo|food|water|later|waste|wfwGo|finale|replay`), `HUONG-DAN.txt`, `SPEC-NOTES.md`.
- Tested: all 67 tests pass. In a browser (real pointer events, time driven by hand) I played both orders (gases first, then water/food/waste first): wrong drops with the md messages, O₂ along the airway, CO₂ out, the bowl before the food, tools too far from the rat, tools while the rat is busy, waste dragged and tapped, urine dragged, the result screen, the replay with pause, resume and restart, the back button, the magnifier on the rat and on the food tray, the info table. A reset leaves the same snapshot as a fresh start (one extra glow texture, which is a cache, not a leak). Experiments 1 to 3 still open. The console had no errors. In headless Edge from `file://` I captured placed, air, waste, replay (1280x720) and finale (1024x768).
- Not tested: sound, touch screens, Firefox and Safari, smoothness in a visible window, the finished view on a small phone. Two headless runs timed out (`finale` once, `food` once) while the same scenarios worked on other runs, so it is probably the headless browser and not the page.
- Next: Experiment 5 (spec lines 6728-8941, staged locked steps). Nothing is pushed. (Committed later together with Experiment 6.)

### 2026-09-20 (later), Claude: Experiment 2 done (uncommitted)

- Built: `js/logic/exp2.js`, `js/content/exp2.vi.js`, `js/models/cabbage.js` (cabbage in the half-cut pot, plus the clear box), `js/models/molecules.js` (O₂, CO₂, magnifier), `js/experiments/exp2.js` (core) with `exp2-gas.js`, `exp2-water.js`, `exp2-tools.js`, `exp2-finale.js` (each adds itself to `Lab.exp2mods`), `tests/exp2.test.js` (10 tests). Gaps and choices are in `SPEC-NOTES.md`; `HUONG-DAN.txt` has "Cách chơi thí nghiệm 2".
- New shared pieces: `js/core/scenedrag.js` (drag things inside the 3D picture), `js/three/lens.js` (magnifier lens drawn with a second camera), `Lab.fx.flow` (beads along a path), progress bar state `open` (`Lab.ui.setProgress` takes tooltips as a 3rd argument), label anchor `center`, hook `Lab.stage.afterRender`, `Lab.app.snapshot` also counts `sceneItems` and `lens`, `js/models/plants.js` exposes `plantGroup`, `rootMat`, `rootsGroup`.
- Tested: all 56 tests pass. In a browser I played gas exchange first, then water and minerals, using real pointer drags (wrong and right moves, the md messages), the finale, "TƯƠNG TÁC TỔNG HỢP", the magnifier, the box and the back button. A reset at the end leaves the same snapshot as a fresh start. Experiments 1 and 3 still play to their results. The console had no errors.
- Also tested: water and minerals before gas exchange (minerals before water, photosynthesis before respiration), and real `file://` captures in headless Edge (1280x720: respiration, roots, everything at once; 1024x768: the finale). Scenarios `placed|resp|photo|root|lens|finale|synth` are in `tests/shots.js`.
- Not tested: sound, touch screens, Firefox and Safari, smoothness in a visible window (time was driven by hand), the box's look up close.
- Next: Experiment 4 (lab rat, spec lines 4859-6727). Nothing is pushed. (Committed later together with Experiment 6.)

