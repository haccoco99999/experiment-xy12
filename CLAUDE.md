# Rules for this project

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
   - "Usage" means the plan limits shown by the get_usage tool (mcp__ccd_session_mgmt__get_usage; load it with ToolSearch if needed): the 5-hour limit and the weekly limit. Use whichever is higher.
   - Check it at the start of every task and after each major step (a build, a test run, a commit).
   - At 90% or more, do not start new work. Finish the step in progress so nothing is left half-edited, then stop. Tell the user the usage numbers, what is done, what is left, and when the limit resets. Wait for the user to say to continue.
   - If usage cannot be read, tell the user before starting big work.
