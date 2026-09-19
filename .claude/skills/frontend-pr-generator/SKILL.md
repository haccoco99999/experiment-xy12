---
name: frontend-pr-generator
description: Analyze git staged changes or a git diff and produce a Conventional Commit title with a Vietnamese description plus a structured frontend Pull Request body. Use when asked to "generate a PR", "viết mô tả PR", "tạo commit message", or when the user runs /pr or generate-pr.
metadata:
  argument-hint: "[base-branch | --staged | <commit-range>]"
---

# Role: Frontend PR & Git Commit Specialist

Analyze git diff/staged changes to generate conventional commit titles and structured frontend Pull Requests.

## How to run

1. Read the changes before writing anything:
   - Default: `git diff --staged`. If nothing is staged, use `git diff`. If that is also empty, compare against the base branch: `git diff main...HEAD`.
   - An argument overrides the default: a branch name means `git diff <branch>...HEAD`, `--staged` forces staged only, a commit range is used as given.
   - Use `git diff --stat` first to see the scope, then read the full diff for the files that matter.
2. Derive the scope from the touched files, not from guesswork. Read a file when the diff alone does not explain the change.
3. Output the commit title first, then the PR body. Leave placeholders (`url`, `#[TICKET_ID]`) in place when the information is not in the repo; say plainly which parts you could not fill in.
4. Do not commit, push, or open the PR unless the user asks.

## Title Convention
Format: `<type>(<scope>): <short description in Vietnamese>`

- `<type>`: `feat` | `fix` | `refactor` | `style` | `perf` | `chore` | `test` | `docs`
- `<scope>`: Affected feature, component, or module (kebab-case, e.g., `order-filter`, `auth-modal`).
- `<short description>`:
  - Language: Vietnamese only.
  - Case: lowercase first letter, no trailing period.
  - Tone: Imperative/action-oriented verbs (e.g., `thêm`, `cập nhật`, `sửa lỗi`, `tối ưu`).
  - Example: `feat(order-filter): thêm bộ lọc trạng thái đơn hàng và xuất excel`

---

## PR Body Template
Always output the PR description using the exact markdown structure below:

## 📌 Summary
- [Core motivation and objective]
- [Key UI/UX or business logic updates]

## 🛠 Technical Changes
- **Component & UI:** New/modified components, styling libraries.
- **State & Data Fetching:** State management, hooks, API integration.
- **Breaking Changes / Side Effects:** Contract changes or legacy regressions.

## 📱 Responsive & UI Verification
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Dark / Light mode

## 📸 Media (Screenshots / Recordings)
| Before | After |
| ------ | ----- |
| ![Before](url) | ![After](url) |
*(Cover loading, empty, and error states when applicable)*

## 🧪 Testing Steps
1. Navigate to: `...`
2. Perform action: `...`
3. Expected result: `...`

## 🔗 References
- Ticket ID: `#[TICKET_ID]`
