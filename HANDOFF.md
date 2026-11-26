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

- Done: all 8 experiments: 1 (mung bean), 2 (a potted plant, no kind named since 2026-11-10), 3 (chicks), 4 (lab rat), 5 (tomato flower), 6 (new plants from four parts), 7 (butterfly life cycle) and 8 (reproduction and life cycle; a cat in the md, a pig since 2026-11-10, merged into `main` through PR #2). The 2026-11-26 redesign is in the current worktree: Svelte/Threlte home, shared Three.js visual refresh, three quality levels, keyboard scene actions, reduced-motion and visibility controls, persisted global motion pause/resume, safe anticipation cues, portrait layout, accessibility fixes, Vietnamese-only Sveltia I18n for home/title copy, TypeScript title statistics, and the generated one-file export `Thi-nghiem-tat-ca-trong-1-file.html`. The original classic-script path and `file://` fallback remain.
- Not built: nothing. The home page has 8 open cards and every experiment can be opened from the normal site or the one-file export. The redesign is not committed or pushed because the user did not ask for a commit.
- An earlier Experiment 8 build (commit `701178a`, local branch `exp8`) was deleted at the user's request on 2026-09-20 and was not used.

## Standing order from the user (2026-11-26): completed

On 2026-11-26 the user asked to redesign all 8 experiments, continue without approval gates and report when the whole pass was complete. That implementation is now in the current worktree. No scheduled job exists. Rule 5 in AGENTS.md still applies to later assistants; the usage-reading tool was unavailable in this session.

## Verification commands after this handoff

- `npm run check:modern`
- `npm run check:typescript`
- `npm run build`
- `node --test "tests/*.test.js"`
- `git --no-pager diff --check`
- `npm audit --audit-level=high`

Experiments edit shared files, so hand over only at a clean point: the tests pass and this file is updated.

## Svelte toolkit decisions (2026-11-26)

- Use `@sveltia/i18n` 1.5.0 for the client-only Svelte shell as a Vietnamese-only message source. It owns `vi` home copy, experiment titles, MF2 counts and `html lang`; no language selector or English dictionary is shipped. Science body copy remains in the existing `js/content` files.
- Use `svelte-check-native` 1.12.2 with `@typescript/native-preview`; keep TypeScript 6.0.3 for the existing Vite build and keep a separate `check:typescript` command.
- Do not add a generic DOM drag/drop library. Projected Three.js targets already use `Lab.drag` and the keyboard picker, so `sveltednd` would duplicate that contract.
- Do not add Motion Core/OGL beside Threlte/Three.js; adding a second GPU renderer would increase bundle/runtime cost and bypass the existing quality controls.
- Do not add Stately, Nabu, Atom Forge, Svileo, Blossom, phantom-ui or Svelte Spell UI now. The current static/offline shell has no backend/editor, no server state, no color authoring, no async skeleton state and already has a shared accessible toast/animation layer.
- Svelte Agentation is useful for an explicit design-review workflow, but it is not a runtime dependency and was not installed.

## First-time check for each new assistant

Open the folder `D:\Code\Thí nghiệm\v5` in the assistant's app and paste this:

> Read AGENTS.md and HANDOFF.md. List the five rules, one line each. Then run `node --test "tests/*.test.js"` and tell me how many tests passed. Do not change any file.

A good answer lists all five rules (including the 90% usage rule and Vietnamese commit messages) and reports the same number of passing tests as the latest log entry. The folder name has a space and Vietnamese letters, so this also shows that the path works in that app.

## Log (newest first)

### 2026-11-26, Copilot: đánh giá UX và motion prototype thí nghiệm 1

- Review read-only bằng `usability-heuristics`, `interaction-design`, `ui-animation`, `find-animation-opportunities` và `review-animations`; không sửa mã sản phẩm. Browser đã kiểm desktop, màn hình dọc, pause và reduced motion; axe WCAG 2/2.1 A/AA: 0 violation.
- Verdict: `Block`. `handleDrop` trong `js/experiments/exp1.js` không khóa khay khi `busy > 0`; kiểm thử thật nhận liên tiếp nước rồi sỏi cho hai kết quả `{ok:true}`, `busy=2`, bốn tween và một cue/camera chung. `actionFocused`/`actionCue` có thể bị thao tác sau ghi đè, rồi thao tác trước kéo camera về góc tổng quan khi thao tác sau chưa xong.
- Điểm cần cải thiện tiếp theo: cue 116×70 chưa có chữ nên dễ bị hiểu thành đồ trang trí ở điện thoại; trạng thái `Có nước`/`Thiếu chất khoáng` và dấu tick xuất hiện ngay khi drop được nhận, trước khi hoạt cảnh hoàn thành; help trong `js/content/exp1.vi.js` vẫn chỉ nói kéo, chưa nói chạm rồi chọn vị trí.
- Nên giữ: camera 650/720 ms cho mục tiêu giải thích, SVG dùng `transform`/`opacity` và path draw, pause/reduced motion đúng, 3D dành khoảng 61,8% chiều cao vùng nhìn điện thoại, không tràn ngang, hit target các thẻ 92×112 px. Không nên thêm bounce/ambient motion cho thẻ và tiến trình dùng thường xuyên.
- `node --test "tests/*.test.js"`: 159/159 đạt nhưng test hiện tại chưa bắt được race khi hai dụng cụ chạy liên tiếp. Còn lại: khóa toàn khay lúc bận, thêm test hành vi và làm rõ copy/cue rồi review lại. Câu hỏi mở: không.

### 2026-11-26, Copilot: cài 5 skill UX và UX animation

- Đã cài `interaction-design`, `ui-animation`, `find-animation-opportunities`, `review-animations` và `usability-heuristics` vào `.claude/skills`, đồng bộ sang `.agents/skills` và khóa trong `skills-lock.json`.
- Nguồn `rolemodel/skills` không còn cung cấp `usability-heuristics`; đã dùng bản tương đương đã kiểm Snyk Pass từ `jpoindexter/design-skills`. Bốn nguồn còn lại là `wshobson/agents`, `mblode/agent-skills` và `emilkowalski/skills`.
- `tests/agents-sync.test.js` giờ kiểm đủ 13 skill đã chọn giữa 3D, animation, Svelte và UX. `node tools/sync-skills.mjs`: hai bản khớp; `package.json` và `package-lock.json` không đổi; không có runtime/CDN mới.
- `node --test "tests/*.test.js"`: 159/159 đạt; `git diff --check`: sạch. Chưa áp dụng skill vào giao diện, chưa sửa prototype và chưa chốt mẫu theo yêu cầu. Còn lại: dùng các skill mới cho audit UX/motion trước khi chỉnh code; câu hỏi mở: không.

### 2026-11-26, Copilot: khảo sát skill UX và UX animation

- Không sửa mã sản phẩm và chưa cài skill mới. Đã tra, so sánh nội dung, mức phổ biến và cảnh báo bảo mật của các skill cho interaction design, UI motion, usability heuristics, Laws of UX và animation review.
- Bộ ưu tiên: `interaction-design` (17,7 nghìn lượt), `ui-animation` (11,3 nghìn), `find-animation-opportunities` (283,9 nghìn), `review-animations` (338 nghìn), `usability-heuristics` và `charles-ux-animation` (312 lượt nhưng tài liệu sâu). Các skill trên đều Snyk Pass; không cần CDN hay runtime mới.
- Có thể thêm `design-motion-principles` khi cần một quy trình create/audit và `laws-of-ux` khi cần kiểm hit area, feedback và cognitive load. Chưa chọn `micro-interaction` của iart-ai vì skill đó có cảnh báo Snyk về tải code từ esm.sh; đã có `60fps-animation`, nên không cần cài thêm `animation-performance` ngay.
- Chưa chạy test vì lượt này chỉ nghiên cứu và cập nhật `HANDOFF.md`; test gần nhất vẫn 159/159. Chưa cài skill hay áp dụng lên giao diện vì người dùng chưa chốt mẫu. Còn lại: lấy 5 skill ưu tiên để cài sau khi duyệt; câu hỏi mở: bộ tối thiểu hay bộ đầy đủ.

### 2026-11-26, Copilot: cài skill và prototype hoạt cảnh thí nghiệm 1

- Đã cài và khóa 8 skill trong `.claude/skills`, đồng bộ sang `.agents/skills`: ba skill Three.js, ba skill animation/SVG/accessibility, hai skill Svelte. `package.json` và runtime không thêm animation library nào; `skills-lock.json` ghi nguồn và commit của từng skill.
- Thí nghiệm 1 trong `js/experiments/exp1.js` có thao tác chạm dùng chung picker với bàn phím, camera tập trung vào chậu B khi tưới nước/rải sỏi/đặt thùng, rồi quay lại góc tổng quan. `css/app.css` thêm SVG chỉ đường nhẹ; pause dừng cả 3D tween và SVG. Reduced motion giữ nguyên camera và hiện trạng thái SVG tĩnh. `HUONG-DAN.txt` đã cập nhật.
- Browser 1024×768: pause giữ nguyên toàn bộ giá trị camera, cue bị dừng; sau thao tác camera về đúng góc tổng quan. Trên 390×844, pointer touch tổng hợp mở picker đúng vị trí, không tràn ngang. Reduced motion giữ camera bất biến và SVG dùng `animation:none`, `opacity: 1`. Bản offline `file://`: picker chạy, không page/console error, không tài nguyên HTTP ngoài.
- `npm run check:modern`: 0 error/0 warning; `npm run check:typescript`: đạt; `node --test "tests/*.test.js"`: 159/159 đạt; audit 0 lỗ hổng; `git diff --check`: sạch. Build: shell 149,086 byte, gzip 51,64 KB; offline 3.155.315 byte, vẫn dưới budget.
- Chưa benchmark laptop 8 GB thật hoặc screen reader thật; chưa áp dụng prototype cho 7 bài còn lại. Còn lại: người dùng duyệt hình và quyết định mở rộng; câu hỏi mở: không có. Công cụ đọc usage vẫn không khả dụng nên không báo được phần trăm giới hạn.

### 2026-11-26, Copilot: khảo sát skill hoạt cảnh, SVG và 3D

- Không sửa mã sản phẩm. Đã tra Skills.sh và kho nguồn chính thức cho GSAP, Three.js, SVG animation, LottieFiles motion design, Remotion, Rive và Svelte 5.
- Nên thêm có chọn lọc vào skill workspace: `threejs-animation`, `threejs-interaction`, `threejs-performance`; `svg-animation`, `accessible-animation`, `60fps-animation`; `svelte-code-writer` hoặc `svelte-core-bestpractices`. Thêm `motion-design` chỉ sau khi loại phần Creator MCP/referral vì Skills.sh đang có cảnh báo Snyk prompt injection.
- Không nên cài GSAP, Remotion, Rive hoặc Lottie runtime vào web hiện tại. GSAP trùng luồng `Lab.tween`; Remotion có cảnh báo Snyk và phù hợp xuất video hơn; Rive thêm renderer/asset pipeline; Lottie tăng file nhưng ít cải thiện điều khiển 3D.
- `node --test "tests/*.test.js"`: 157/157 đạt sau nghiên cứu; lượt này không thay đổi mã sản phẩm ngoài `HANDOFF.md`. Chưa cài skill hoặc benchmark skill mới. Còn lại: nếu được duyệt, cài đúng nhóm skill đã chọn rồi chạy đồng bộ `.claude/.agents`. Câu hỏi mở: cài ngay skill hay chỉ dùng báo cáo để chọn.
