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

### 2026-11-26, Copilot: khóa toàn bộ tiêu đề và nhãn bằng tiếng Việt

- Đã gỡ hoàn toàn selector ngôn ngữ và bản dịch English khỏi `src/ModernHome.svelte`, `src/i18n.ts`, `src/catalog.ts` và `LabModernApi`. Locale cố định `vi`, old key `lab.locale` được xóa khi mở trang để một lần chọn English trước đây không thể quay lại giao diện English sau reload.
- Đã cập nhật kiểm thử để không cho phép `addMessages('en')`, `setLocale`, `Garden Science Lab`, `Start exploring`, `EXPERIMENT...` hoặc bộ chọn ngôn ngữ xuất hiện trong shell. `HUONG-DAN.txt` ghi rõ toàn bộ title, info, label và nút đều dùng tiếng Việt.
- Browser đặt `lab.locale=en` rồi reload: khóa bị xóa, trang chủ không có selector, `html.lang=vi`. Đã mở 8/8 thí nghiệm ở trạng thái đầu và kịch bản kết quả cuối; document title, heading, text hiển thị và `aria-label` không chứa các chuỗi English được kiểm tra; 8/8 không có page error. Build hiện tại shell 149,09 KB, gzip 51,12 KB; offline 3.150.681 byte.
- `npm run check:modern`: 0 error/0 warning; `npm run check:typescript`: đạt; `node --test "tests/*.test.js"`: 157/157 đạt; audit 0 lỗ hổng. Chưa đánh giá phát âm bằng screen reader thật. Câu hỏi mở: không.

### 2026-11-26, Copilot: áp dụng các chuẩn hoạt cảnh và WCAG pause/stop

- Đã thêm nút "Tạm dừng hoạt cảnh" ở topbar, lưu trạng thái `lab.motion`, dừng cả CSS animation, tween và ticker 3D, vẫn render khung tĩnh khi reset/chất lượng thay đổi và tiếp tục đúng vị trí khi bấm lại. Đã tách pause của người dùng khỏi trạng thái tab ẩn để chuyển tab không tự gỡ pause.
- Đã thêm anticipation giảm chuyển động 160 ms cho thao tác rót nước/rải khoáng ở thí nghiệm 1, 2, 6 và đưa que lấy phấn ở thí nghiệm 5. Không biến dạng kích thước sinh học. Đã đổi transition nhiệt độ, trứng thụ tinh, card, zone, pulse và shell hiện đại sang `transform`/`opacity`, bỏ animation `width`, `background` và `box-shadow`.
- `node --test "tests/*.test.js"`: 157/157 đạt. `npm run check:modern`: 0 error/0 warning; `npm run check:typescript`: đạt; audit 0 lỗ hổng; review code không tìm thấy lỗi đáng kể. Browser: pause đóng băng vị trí tween, thông báo vẫn hiện, reload giữ pause, reset dựng cảnh tĩnh, 4 kịch bản 1/2/5/6 chạy đủ; axe 0 violation; 390 px không tràn.
- Build: shell 154,86 KB, gzip 52,96 KB; offline 3.156.457 byte. Chưa kiểm tra trên laptop 8 GB vật lý hoặc screen reader thật. Còn lại: benchmark phần cứng và kiểm tra đọc bằng công cụ hỗ trợ nếu cần tuyên bố WCAG chính thức. Câu hỏi mở: không.

### 2026-11-26, Copilot: đối chiếu 12 nguyên tắc hoạt cảnh

- Không sửa mã sản phẩm. Đã đọc Overshoot/Disney 12 principles và đối chiếu tween, camera, model động vật/thực vật, hiệu ứng và CSS. Ước tính: 8/12 nguyên tắc dùng rõ (staging, pose-to-pose, slow in/out, arcs, secondary action, timing/spacing, solid form, appeal); squash/stretch, anticipation, overlap/follow-through và exaggeration còn ở mức một phần.
- Điểm mạnh: easing time-based và `outBack`/`outBounce` trong `js/core/tween.js`, camera staging/reduced-motion trong `js/three/stage.js`, curve/path/particle trong `js/three/fx.js`, các pose của gà/chuột/bướm và nhịp cánh/camera trong `js/models/*` và `js/experiments/*`.
- Rủi ro cần xử lý trước khi tuyên bố WCAG đầy đủ: nhiều CSS/ambient loop tự chạy quá 5 giây (`css/app.css:108`, `:136`, `js/experiments/exp1.js:343`, `exp7.js:148`, `exp8.js:227`) không có nút pause/stop chung cho người dùng; `Lab.loop.pause/resume` tồn tại nhưng chưa nối ra UI. Một vài transition còn dùng `width`, `background`, `box-shadow` thay vì chỉ `transform`/`opacity` (`css/app.css:150`, `:298`). `node --test "tests/*.test.js"`: 155/155 đạt.
- Đề xuất nếu áp dụng: thêm một nút "Tạm dừng hoạt cảnh" toàn site, giữ hoạt cảnh khoa học bắt buộc nhưng giảm/bỏ trang trí, chuẩn hóa anticipation 120–180 ms và follow-through nhẹ, không dùng squash/stretch/exaggeration làm sai kích thước sinh học. Chưa benchmark máy 8 GB thật trong lượt này; không có lỗi mới do review. Câu hỏi mở: không.

### 2026-11-26, Copilot: thêm i18n và thống kê tiêu đề Svelte

- Đã cài `@sveltia/i18n` 1.5.0, thêm bản Tiếng Việt/English cho trang chủ, tên nhóm, 8 tiêu đề thẻ và tiêu đề thanh thí nghiệm. Đã thêm `src/i18n.ts`, thống kê TypeScript trong `src/catalog.ts`, selector ngôn ngữ, số liệu 8/8/4/4 và chi tiết độ dài; lựa chọn được lưu bằng `lab.locale`.
- Đã thay `check:modern` bằng `svelte-check-native` 1.12.2 chạy với TypeScript native preview 7, vẫn giữ `check:typescript` cho TypeScript 6.0.3. `npm run check:modern`: 0 error/0 warning. `npm run check:typescript`: đạt. `node --test "tests/*.test.js"`: 155/155 đạt. `npm audit --audit-level=high`: 0 lỗ hổng.
- Build: `lab-modern.js` 154,89 KB, gzip 52,97 KB, dưới hạn mức 60 KB; file offline 3.153.713 byte. Trình duyệt `file://`: đổi Tiếng Việt/English đúng, giữ lựa chọn sau reload, tiêu đề bài 1 đổi theo locale nhưng gốc bài vẫn được đánh dấu `lang="vi"`; reset giữ tiêu đề và không tràn tại 390 px. Axe: 0 violation cho tiếng Việt/English và hết cảnh báo label-content-name-mismatch; phần contrast trên nền gradient/canvas vẫn cần kiểm tra tay.
- Chỉ Sveltia I18n và bộ kiểm tra native được đưa vào; các gói DnD, OGL/GSAP, state, editor, backend, toast, skeleton, picker và animation copy/paste không được cài vì trùng hoặc chưa có nhu cầu. Chưa dịch nội dung khoa học bên trong thí nghiệm; chưa commit/push. Còn lại: xác nhận translation English với giáo viên nếu cần sửa cách diễn đạt. Câu hỏi mở: không.

### 2026-11-26, Copilot: hoàn thành nâng cấp toàn bộ 8 thí nghiệm

- Đã thêm trang chủ Svelte/Threlte (`src/`, `dist-modern/`), làm mới môi trường, vật liệu, hiệu ứng và bố cục 3D dùng chung, ba mức đồ họa, thao tác bàn phím cho kéo/thả và các hành động trong cảnh, focus dialog/panel, giảm chuyển động, tạm dừng khi tab ẩn, điện thoại dọc và file offline một tệp.
- `npm run check:modern`: đạt. `node --test "tests/*.test.js"`: 152/152 đạt. `git --no-pager diff --check`: sạch. `npm run build`: shell 114.112 byte, gzip 40,34 KB; `Thi-nghiem-tat-ca-trong-1-file.html` 3.110.231 byte. Kiểm thử hiệu năng tự dựng lại artifact trước khi đo để không đọc file cũ.
- Trình duyệt: 8 trạng thái đầu mở được từ `file://`, không có request mạng ngoài hay page error; 8 kịch bản mục tiêu chạy đủ, trong đó các trạng thái kết thúc 2/4/5/6/7/8 hoàn thành. Axe WCAG 2 A/AA và 2.1 A/AA: 0 violation cho trang chủ và 8 bài; các mục `color-contrast` trên canvas/gradient và `label-content-name-mismatch` còn cần kiểm tra tay. Ảnh 1024×768 và 390×844 không tràn ngang; picker bàn phím, focus bài 8, chế độ Nhẹ và hạt trong reduced motion đã kiểm tra trực tiếp.
- Chưa chạy benchmark trên laptop 8 GB vật lý, chưa xác nhận đầy đủ WCAG thủ công với người dùng/thiết bị hỗ trợ và chưa commit hay push. Công cụ đọc usage không có trong phiên này nên không thể báo phần trăm giới hạn. Còn lại: người dùng kiểm tra hình thức/nội dung khoa học; không có lỗi đã biết hoặc câu hỏi mở.
