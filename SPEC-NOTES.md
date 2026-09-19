# Notes on the specification (`THÍ NGHIỆM 1909.md`)

Findings from reviewing the file, and what was done about each. New findings are added while each
experiment is built.

## Decisions taken by you
- Scope: all 8 experiments. Look: 3D with three.js. Temperature contradictions: **follow the md exactly**.

## Contradictions kept exactly as written (one table controls them: `js/logic/temperature-bands.js`)
| Experiment | Where (md lines) | What the md says | Visible consequence |
|---|---|---|---|
| 1 (plants) | 207–215, 267–281, 797–803 | Pot A is "suitable 20–30 °C", default is 28 °C, but the table says 0–27 °C dies, 28–31 °C is "not normal", only 32–35 °C is healthy | A student who leaves 28 °C gets "growing not optimally" in pot B; the 4 "single missing factor" cases only look like the md when the temperature is 32–35 °C |
| 3 (chicks) | 2977–3020, 3579, 3774–3784, 4286–4302, 4366 | Control cage fixed at 37 °C; cage 2's example starts at 37 °C; but the table puts 36–39 °C in "not normal"; line 4366 calls 34 °C "suitable" | Cage 2 left at 37 °C shows heat-stress behaviour |

## Gaps in the md and how they were filled
| Where | Gap | Decision |
|---|---|---|
| Exp 1, 850–886 | Only single missing factors are described | Same rule as Exp 3 (lines 3842–3898, 4338–4356): all factors are combined, the worst effect decides, and every cause is listed |
| Exp 1, 351–364 | Order of placing pot A and pot B | Either pot may be placed first (each lands in its own place) |
| Exp 1, 463–477 | NPK before the soil was replaced by gravel | Accepted; the friendly note "Đất đã có chất khoáng rồi." appears |
| Exp 1, 143–163 | What happens to a tool after use | The tool flies away after its animation; its tray card gets a ✓ "used" mark; tools can be used again (the last action wins), bins stay on |
| Exp 1 | Undo | Not included (the md's answer is the reset button) |
| Exp 5, 6846 / 7846–7850 | Progress bar ends with "Cây con" but nothing happens there | Kept locked, as the md says |
| Exp 8, 13164–16469 | Every line was pasted as a heading (formatting broken) | Content followed, formatting ignored |

## Wording that is not in the md ("app" texts)
Short helper messages (for example "Chậu A là chậu đối chứng, em hãy thử với chậu B nhé.") live under `app:` in
`js/content/*.vi.js`, separate from the word-for-word `md:` texts (a test checks every `md:` sentence against the md).
