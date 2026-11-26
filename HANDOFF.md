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

### 2026-11-26, Copilot: đánh giá style Biome Lab cho 8 thí nghiệm

- Không sửa mã sản phẩm. Đã xem showcase và ảnh chạy Biome Lab, đọc build brief cùng Iteration 1–Final pass, rồi đối chiếu với cảnh 3D, model và luồng học tập hiện tại.
- Phán quyết: khả thi nếu lấy ngôn ngữ `procedural terrarium / faceted diorama`, một cảnh 3D trung tâm, control nhỏ hai bên và phản hồi môi trường tức thời. Không sao chép dashboard tối, slider kỹ thuật và nhiều biểu đồ; thay bằng nền sân vườn sáng, ít control hơn, chữ tiếng Việt lớn và luồng từng bước.
- Phạm vi áp dụng: 1/2/6 rất hợp; 3/4 hợp với cutaway; 5 dùng macro cutaway; 7 dùng cụm vòng đời trên diorama; 8 chỉ dùng style này cho khối cảnh, còn tế bào/phôi cần Scientific Cutaway riêng. React Three Fiber chỉ là stack của Biome Lab; dự án hiện nên giữ Three.js/Threlte.
- Chưa chạy test vì chỉ đánh giá và cập nhật `HANDOFF.md`; test gần nhất 159/159. Còn lại: nếu được duyệt, dựng moodboard/light prototype cho thí nghiệm 1 với island/pedestal, 1 luồng control và 1 thẻ quan sát; trước đó vẫn phải sửa race thao tác đã review. Câu hỏi mở: nền tối như ảnh hay bản sáng sân vườn.

### 2026-11-26, Copilot: đánh giá phong cách 3D cho 8 thí nghiệm

- Không sửa mã sản phẩm. Đã đối chiếu low-poly/toon, soft 3D/clay, sci-fi/hologram, realistic PBR, Spline và asset packs với 8 model hiện có, ba mức đồ họa, reset/offline và đối tượng học sinh tiểu học.
- Khuyến nghị: `Soft Low-Poly Specimen Diorama` là style chủ đạo; giữ vật liệu matte trong roughness 0,55–0,95, cạnh bo nhẹ, ánh sáng sân vườn, thêm chế độ `Scientific Cutaway` trong suốt cho khí, rễ, hoa, noãn, tế bào và phôi. Không dùng realistic PBR toàn site; sci-fi chỉ là lớp overlay tối đa ở phần vi mô.
- Giữ Three.js/Threlte và model tạo bằng code. Spline chỉ dùng để sketch vì bản Vanilla JS cần local server và animation/events không có trong mọi dạng export. Không trộn asset packs Quaternius/KayKit; giấy phép phải kiểm từng pack và style/dung lượng khó đồng nhất. WebGPU chưa ưu tiên; Three.js vẫn khuyến nghị WebGL cho pure WebGL app.
- Chưa chạy test vì lượt này chỉ đánh giá style và cập nhật `HANDOFF.md`; test gần nhất 159/159. Còn lại: sau khi chốt style, làm moodboard 1 cảnh ngoài trời và 1 cảnh mặt cắt trước khi áp dụng rộng. Câu hỏi mở: duyệt hay đổi tone giữa trẻ em và giáo cụ.

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
