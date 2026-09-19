/* ONE temperature table for every experiment (Experiment 1 plants, Experiment 3 chicks).
   It is kept EXACTLY as written in the md (section 27 of Experiment 1, section 32 of Experiment 3):

        0–27 °C   too cold      – cannot survive
       28–31 °C   cool          – alive but not normal
       32–35 °C   ideal         – healthy
       36–39 °C   warm          – alive but not normal
       40–60 °C   too hot       – cannot survive (after 7 days)

   The md contradicts itself here (e.g. plant pot A is called "suitable 20–30 °C", the default is 28 °C, the
   control chick cage is 37 °C). You chose to follow the md exactly. If you ever want to change the rules,
   edit the numbers below – nothing else needs to change. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.Lab = root.Lab || {}; root.Lab.logic = root.Lab.logic || {}; root.Lab.logic.temperatureBands = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var BANDS = [
    { id: 'cold', min: 0, max: 27 },
    { id: 'cool', min: 28, max: 31 },
    { id: 'ideal', min: 32, max: 35 },
    { id: 'warm', min: 36, max: 39 },
    { id: 'hot', min: 40, max: 60 }
  ];
  var MIN = 0, MAX = 60;

  function bandOf(t) {
    t = Math.round(Math.max(MIN, Math.min(MAX, Number(t))));
    for (var i = 0; i < BANDS.length; i++) if (t >= BANDS[i].min && t <= BANDS[i].max) return BANDS[i];
    return BANDS[BANDS.length - 1];
  }
  function rangeLabel(id) {
    for (var i = 0; i < BANDS.length; i++) if (BANDS[i].id === id) return BANDS[i].min + '–' + BANDS[i].max + '°C';
    return '';
  }

  return { BANDS: BANDS, MIN: MIN, MAX: MAX, bandOf: bandOf, rangeLabel: rangeLabel };
});
