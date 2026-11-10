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

- Done: all 8 experiments: 1 (mung bean), 2 (a potted plant, no kind named since 2026-11-10), 3 (chicks), 4 (lab rat), 5 (tomato flower), 6 (new plants from four parts), 7 (butterfly life cycle) and 8 (reproduction and life cycle; a cat in the md, a pig since 2026-11-10, merged into `main` through PR #2). Experiments 2, 4, 5, 6 and 7 are committed and pushed; Experiment 8 was built on 2026-09-21 and committed and pushed when the user asked for it. `main` is in sync with `origin` (private repo `haccoco99999/experiment-xy12`) after that push. On 2026-11-10 four fixes from the user's Word file (Experiments 1, 2, 4, 5) were committed on branch `feature/exp-2` and merged into `main` through PR #1 (merge commit `575b549`); the live site was rebuilt from it. A branch `feature/exp-1` was also made from `main`; see the log.
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

### 2026-11-10 (later), Claude: Experiment 8 changed from a cat to a pig (merged into `main`, PR #2)

- The user wrote "kiểm tra ở thí nghiệm số 8: con mèo đổi thành con heo" and, asked with a screenshot, chose "Đổi sang con heo" (change the animal), not "the cat looks like a pig".
- New model `js/models/pig.js` (`Mo.pig`, same API as the old `Mo.cat`); `js/models/cat.js` removed (`git rm`), script tag in `index.html` changed, `Mo.cat(` → `Mo.pig(` in `js/experiments/exp8*.js`. The fetus in `js/models/cells.js` got a snout. Internal ids (`kitten`, `cats`, `showCatInfo`, `decideCat`) were left as they are.
- Texts: a new `user` group in `js/content/exp8.vi.js` holds every md sentence with "mèo" rewritten for a pig, merged over `md` by `merge` in `js/experiments/exp8.js` (same pattern as Exp 2). App texts changed in place. Pig facts added by us (marks Ngày 0/10/20/30 and 30/70/Gần ngày sinh, eyes open at birth, starts eating at 2 weeks, "cơ thể nặng hơn nhiều" at 6 months) are listed in `SPEC-NOTES.md` (new table "Asked later"). Home card: 🐷 "Sinh sản và vòng đời của heo".
- New test in `tests/exp8.test.js`: after the merge no text says "mèo", the lists keep their lengths, the fetus bar starts where the embryo bar ends, the newborn has "mắt đã mở".
- `tests/shots.js`: the Exp 8 `fetus` scenario taps a missed part again. Before this change it already stopped at "timeout: the four parts" (the tail tap was missed; checked with the old `cells.js` too), so every later Exp 8 scenario failed in the 800x600 pane.
- Tests: `node --test "tests/*.test.js"`: 116 tests, all pass. Browser (dev server, 800x600 pane, scripted scenarios): `identify`, `kitten`, `growth`, `finale` render with pigs and no "mèo" on screen; home card shows the pig. After `finale` + reset (twice) the snapshot equals a fresh start (geometries 33, textures 10). No console errors from the new code.
- Not tested: `file://` (only a script tag name changed), real hand dragging, phone sizes, sound. The pig facts were not checked by the user.
- `HUONG-DAN.txt` updated (Exp 8 line in the list, a note at the top of "Cách chơi thí nghiệm 8", marks, the newborn's open eyes).
- Committed on `feature/exp-8-pig` (`adde541`), pushed, PR haccoco99999/experiment-xy12#2 opened and merged into `main` on 2026-11-11, all at the user's request (merge commit `f226c9e`). Tests on `main` after the merge: 116, all pass. GitHub Pages started rebuilding from it. The branch is kept. Open question for the user: are the pig facts and the new day marks acceptable?

### 2026-11-10, Claude: four fixes from the user's Word file (Experiments 1, 2, 4 and 5), merged into `main` (PR #1)

- Source: `C:\Users\ADMIN\Downloads\fix lỗi thí nghiệm.docx` (4 requests and a picture of a whole tomato plant with roots). The user confirmed: Exp 4 gas exchange keeps dragging; the four lines show while the rat excretes; Exp 5 keeps the clicks on the fruit (days 14 and 30); the plant shows its roots like the picture.
- Exp 1: NPK bag removed (logic `js/logic/exp1.js`, texts, tray, `doNpk` in `js/experiments/exp1.js`, tests in `tests/logic.test.js`). `Mo.npkBag` is kept for Exp 2.
- Exp 2: no "rau cải" on screen. The five changed md sentences moved to a new `user` group in `js/content/exp2.vi.js`, merged over `md` in `js/experiments/exp2.js` (the text-fidelity test only checks `md`). Home card subtitle in `js/core/app.js`. The 3D plant is the same.
- Exp 4: waste and urine come out by themselves (`autoExcrete` in `js/experiments/exp4-wfw.js`), the four lines are `app.bodyFlows` shown in a side-panel card from `renderPanel` in `js/experiments/exp4.js`. `promptKeys` gives no task for waste/urine. The `waste` camera shot, `excrete`, `pending`, `isNear` and the waste tap in `onPick` are gone.
- Exp 5: new model `js/models/tomato-plant.js` (script tag added in `index.html`), more detailed cut face and `facePoint`/`locules`/`seedSpots` in `Mo.tomatoFruit` (`js/models/tomato.js`), new flow in `js/experiments/exp5-fruit.js` (white fade to the plant at day 7, magnifier at day 14 and at the cut, plate, button "XEM KẾT QUẢ" before the results panel; `X.finaleShown` in `js/experiments/exp5.js`). New md labels "Thịt quả" and "Phần dịch nhầy" (both in the spec), app text `seeResults`.
- `tests/shots.js`: Exp 4 scenarios no longer call `excrete`; Exp 5 `finale` presses "XEM KẾT QUẢ" (add `&cut=1` to stop at the cut fruit).
- Docs: `HUONG-DAN.txt` (Exp 1 step 2, Exp 2 intro and step 1, Exp 4 step 5, Exp 5 steps 8 to 11) and a new first table in `SPEC-NOTES.md` listing every change that differs from the md.
- Tests: `node --test "tests/*.test.js"`: 115 tests, all pass. Browser (dev server, 800x600 pane, scripted scenarios): Exp 1 tray without NPK, Exp 2 placed plant, Exp 4 `wfwGo` and `finale`, Exp 5 `d7`, `seeds`, `d30`, `finale&cut=1`, `finale`: all render, no console errors from the new code. Leak check: after `finale` + reset, Exp 4 and Exp 5 give the same snapshot as the code before these changes (geometries 33, textures 9; the 9th texture is a shared cache, the old code gives 9 too).
- Not tested: opening `index.html` from `file://` (the browser pane shows file:// only as a static snapshot, and headless Edge on this machine no longer writes screenshots, even for https://example.com; the change only adds one classic `<script>` tag, no fetch), a full hand playthrough with real dragging, phone or tablet sizes, sound.
- Done after review: the user asked for the commit on `feature/exp-2`, a branch `feature/exp-1` from the old `main`, a PR and the merge. PR haccoco99999/experiment-xy12#1 was merged on 2026-11-10 (commit `575b549`); GitHub Pages rebuilt and the live Experiment 1 tray has no NPK. Both feature branches are kept. Next: nothing open.

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
