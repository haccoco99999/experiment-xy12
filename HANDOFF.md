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

### 2026-11-26, Copilot: rà soát thiết kế và kiến trúc 3D

- Không sửa mã sản phẩm. Đã rà trang chủ Svelte/Threlte, shell classic Three.js, CSS, camera, chất lượng đồ họa, kéo/thả, hiệu ứng, dữ liệu catalog, luồng học tập và độ lớn bản offline.
- Browser: trang chủ desktop/mobile và thí nghiệm 1/3 đã kiểm tra trực quan. `axe` WCAG 2 A/AA và 2.1 A/AA: 0 lỗi trên trang chủ và thí nghiệm 1. Mở `index.html` bằng `file://` cho đến thí nghiệm 1: không có page/console error.
- Kết luận thiết kế: giữ Svelte 5 + Threlte/Three.js + WebGLRenderer, đổi trang chủ thành vườn 3D có hotspot và cảnh thí nghiệm thành diorama toàn màn hình với bảng điều khiển theo ngữ cảnh. Điện thoại dọc hiện đưa cùng lúc cả khay và panel xuống dưới nên vùng cảnh 3D còn rất ít; đây là điểm ưu tiên đầu tiên. Catalog hiện lặp ở `js/core/app.js` và `src/i18n.ts`; `three` dev là 0.187 nhưng runtime là r185.
- `npm run check:modern`: 0 error/0 warning; `npm run check:typescript`: đạt; `node --test "tests/*.test.js"`: 157/157 đạt. Chưa triển khai redesign, chưa benchmark laptop 8 GB thật hoặc screen reader thật. Còn lại: báo cáo phương án và xin người dùng chọn mức triển khai. Câu hỏi mở: ưu tiên prototype 1 bài hay chuyển toàn bộ 8 bài.

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
