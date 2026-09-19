# Notes on the specification (`THÍ NGHIỆM 1909.md`)

Findings from reviewing the file, and what was done about each. New findings are added while each
experiment is built.

A copy of the specification (a snapshot of the original) is kept in `docs/THÍ NGHIỆM 1909.md`; the line numbers below
refer to it. If you change the original, copy it into `docs/` again so the two stay the same.

## Decisions taken by you
- Scope: all 8 experiments. Look: 3D with three.js. Temperature contradictions: **follow the md exactly**.

## Contradictions kept exactly as written (one table controls them: `js/logic/temperature-bands.js`)
| Experiment | Where (md lines) | What the md says | Visible consequence |
|---|---|---|---|
| 1 (plants) | 207–215, 267–281, 797–803 | Pot A is "suitable 20–30 °C", default is 28 °C, but the table says 0–27 °C dies, 28–31 °C is "not normal", only 32–35 °C is healthy | A student who leaves 28 °C gets "growing not optimally" in pot B; the 4 "single missing factor" cases only look like the md when the temperature is 32–35 °C |
| 3 (chicks) | 2977–3020, 3579, 3774–3784, 4286–4302, 4366 | Control cage fixed at 37 °C; cage 2's example starts at 37 °C; but the table puts 36–39 °C in "not normal"; line 4366 calls 34 °C "suitable" | Cage 2 left at 37 °C shows heat-stress behaviour. Cage 1 (37 °C) is always shown healthy (md 3592–3605); the table only decides cage 2 |

## Gaps in the md and how they were filled
| Where | Gap | Decision |
|---|---|---|
| Exp 1, 850–886 | Only single missing factors are described | Same rule as Exp 3 (lines 3842–3898, 4338–4356): all factors are combined, the worst effect decides, and every cause is listed |
| Exp 1, 351–364 | Order of placing pot A and pot B | Either pot may be placed first (each lands in its own place) |
| Exp 1, 463–477 | NPK before the soil was replaced by gravel | Accepted; the friendly note "Đất đã có chất khoáng rồi." appears |
| Exp 1, 143–163 | What happens to a tool after use | The tool flies away after its animation; its tray card gets a ✓ "used" mark; tools can be used again (the last action wins), bins stay on |
| Exp 1 | Undo | Not included (the md's answer is the reset button) |
| Exp 3, 2849–2856 and 3198–3221 | The tray list has no cages, yet step 1 says the student places two cages on the table | Two cards (Chuồng 1, Chuồng 2) were added to the tray. Each cage lands in its own place (cage 1 left, cage 2 right) wherever it is dropped on the table |
| Exp 3, 3162 | "Có hai đèn chiếu sáng", but the tray has one lamp | Cage 1's lamp is part of the cage and always lit. The tray lamp is for cage 2 |
| Exp 3, 3270–3276 and 4084–4098 | No message for a chick or tool dropped too early | Chicks and tools before both cages are on the table show "Hãy đặt hai chuồng nuôi lên bàn thí nghiệm."; tools before both chicks are in show "Đã đặt đủ hai chuồng. Hãy đặt gà con vào đúng chuồng." |
| Exp 3, 3087–3093 and 4510–4512 | Message for a food tray, bowl or lamp dropped on cage 1 | Uses the md's info message "Chuồng 1 luôn được giữ đủ 5 yếu tố để làm điều kiện so sánh."; the lid on cage 1 shows "Nắp chỉ được sử dụng cho chuồng 2." |
| Exp 3, 4233–4243 | "Before the start the student may still open the lid, if the design allows" | Allowed: click the lid on cage 2 to lift it off. Other items cannot be taken out (the reset button is the answer, as in Experiment 1) |
| Exp 3, 3609–3840 | For a single missing food, water or O₂ the md says only "may die if it lasts"; light only "less activity" | Scores per cause: light 1 (not normal), food 2 (weak), water and O₂ 3 (very weak, alive), cold and hot 5 (dead, per the table). Scores add up: 5 or more = dead, 3 or more = very weak, 2 = weak, 1 = not normal. The md's examples (sections 35, 49, 50) all come out as written. The numbers are in `LEVEL_OF` in js/logic/exp3.js |
| Exp 3, 3934 | Cage 2 weight is optional ("nếu được mô phỏng") | Shown as an estimate by outcome: 75 g healthy, 72 g not normal, 68 g weak, 62 g very weak, none when dead. Only cage 1 (65 g → 75 g) comes from the md. Numbers are in `WEIGHT_AFTER` in js/logic/exp3.js |
| Exp 3, 3780 and 3784 | The table says "chết" (dead) | Shown gently: the chick lies down, eyes closed, paler colour, and the text says "Không sống được sau 7 ngày" |
| Exp 3, 3526–3534 | The confirmation box before the start is optional | Used, with the md's words |
| Exp 3, 3998–4006 and 4545–4575 | Two similar conclusions (results screen and completion screen) | Both shown: the first under the comparison table, the second on the "Hoàn thành" tab, which also plays the fanfare and confetti the first time it is opened |
| Exp 3, 4370–4424 | Chick animations are only listed | Seven behaviours are drawn and blended smoothly: normal, looking for food, looking for water, low O₂, hot, cold, weak. Several causes at once combine their behaviours |
| Exp 5, 6846 / 7846–7850 | Progress bar ends with "Cây con" but nothing happens there | Kept locked, as the md says |
| Exp 8, 13164–16469 | Every line was pasted as a heading (formatting broken) | Content followed, formatting ignored |

## Wording that is not in the md ("app" texts)
Short helper messages (for example "Chậu A là chậu đối chứng, em hãy thử với chậu B nhé.") live under `app:` in
`js/content/*.vi.js`, separate from the word-for-word `md:` texts (a test checks every `md:` sentence against the md).
