/* Lab.models.chickBrain – decides what a chick does from moment to moment (walk, peck, eat, drink, look, rest,
   chirp) and how its body reacts (panting, spread wings, shivering, crouching). The numbers it reads (the
   "profile") come from js/logic/exp3.js. Positions are local to the cage. A seeded random generator keeps every
   run the same. */
(function (Lab) {
  'use strict';
  var U = Lab.util, Mo = Lab.models;

  /* ctx: {bounds:{x0,x1,z0,z1}, floorY, food():{x,z}|null, water():{x,z}|null, obstacles():[{x,z,r}], onChirp(), seed, x, z} */
  Mo.chickBrain = function (chick, ctx) {
    var rnd = U.rng(ctx.seed || 1), B = ctx.bounds, pose = chick.pose;
    var prof = Object.assign({}, Lab.logic.exp3 ? Lab.logic.exp3.BASE : {});
    var s = { mode: 'idle', t: 0.8, lift: 0, x: ctx.x || 0, z: ctx.z || 0, heading: 0, tx: 0, tz: 0, blinkIn: 2 + rnd() * 2, blink: 0, chirpIn: 3, peck: 0, sip: 0, yawPh: rnd() * 6, moving: 0, chirpFlutter: 0 };

    function pick(w) {
      var sum = 0, k; for (k in w) sum += w[k];
      var r = rnd() * sum; for (k in w) { r -= w[k]; if (r <= 0) return k; }
      return 'idle';
    }
    function blocked(x, z, extra) {
      return (ctx.obstacles ? ctx.obstacles() : []).some(function (o) { return Math.hypot(x - o.x, z - o.z) < o.r + (extra || 0); });
    }
    function randomSpot() {
      for (var i = 0; i < 8; i++) {
        var x = U.lerp(B.x0, B.x1, rnd()), z = U.lerp(B.z0, B.z1, rnd());
        if (!blocked(x, z, 0.2)) return { x: x, z: z };
      }
      return { x: 0, z: B.z1 };
    }
    function goTo(x, z) { s.tx = x; s.tz = z; }
    function spotBeside(p) { return { x: p.x, z: p.z - 0.62 }; }   // stand behind the tray / bowl, facing the camera

    function choose() {
      var act = prof.activity * (1 - 0.85 * prof.weak), food = ctx.food && ctx.food(), water = ctx.water && ctx.water();
      if (prof.lie > 0.5) { s.mode = 'lie'; s.t = 9; return; }
      if (prof.huddle > 0.45 && rnd() < 0.85) { s.mode = 'huddle'; s.t = 4 + rnd() * 3; goTo(B.x0 + 0.1, B.z0 + 0.15); return; }
      if (prof.wings > 0.5 && prof.pant > 0.5 && rnd() < 0.7) { s.mode = 'cool'; s.t = 4 + rnd() * 3; goTo(B.x1 - 0.25, B.z1); return; }
      var m = pick({
        idle: 1 + 2.4 * (1 - act), walk: 2 * act, look: 0.8,
        forage: 0.5 * act + 3.8 * prof.seekFood * (0.4 + 0.6 * act),
        eat: food ? 2.4 * act * (1 - prof.seekFood) : 0, drink: water ? 1.8 * act * (1 - prof.seekWater) : 0,
        search: 3.4 * prof.seekWater * (0.4 + 0.6 * act),
        rest: 0.25 + 3.2 * prof.sleepy + 3.6 * prof.weak, chirp: 0.5 * act + 2.6 * prof.chirp
      });
      s.mode = m; s.t = 1.5 + rnd() * 2; s.peck = 0; s.sip = 0;
      if (m === 'walk') { var p = randomSpot(); goTo(p.x, p.z); s.t = 6; }
      else if (m === 'forage') { var q = randomSpot(); goTo(q.x, q.z); s.t = 3 + rnd() * 2.5; }
      else if (m === 'search') { var r = randomSpot(); goTo(rnd() < 0.5 ? B.x0 : B.x1, r.z); s.t = 4 + rnd() * 2; }
      else if (m === 'eat') { var f = spotBeside(food); goTo(f.x, f.z); s.t = 5; }
      else if (m === 'drink') { var d = spotBeside(water); goTo(d.x, d.z); s.t = 5; }
      else if (m === 'chirp') { s.t = 0.9; s.chirpFlutter = 0; if (ctx.onChirp) ctx.onChirp(); }
      else if (m === 'rest') s.t = 3 + rnd() * 3;
    }

    function step(dt, time) {
      var act = prof.activity * (1 - 0.85 * prof.weak), dead = prof.lie > 0.5;
      s.t -= dt; if (s.t <= 0) choose();
      /* --- movement --- */
      var moveMode = s.mode === 'walk' || s.mode === 'forage' || s.mode === 'search' || s.mode === 'eat' || s.mode === 'drink' || s.mode === 'huddle' || s.mode === 'cool';
      var dx = s.tx - s.x, dz = s.tz - s.z, dist = Math.hypot(dx, dz), arrived = dist < 0.1, speed = 0;
      if (moveMode && !arrived && !dead) {
        speed = (s.mode === 'forage' ? 0.55 : 0.95) * Math.max(0.15, act) * (s.mode === 'huddle' || s.mode === 'cool' ? 1.3 : 1);
        var want = Math.atan2(dx, dz), diff = Math.atan2(Math.sin(want - s.heading), Math.cos(want - s.heading));
        s.heading += diff * (1 - Math.exp(-dt * 7));
        if (Math.abs(diff) < 1.1) { s.x += Math.sin(s.heading) * speed * dt; s.z += Math.cos(s.heading) * speed * dt; }
      } else if ((s.mode === 'eat' || s.mode === 'drink') && arrived) {          // face the tray / bowl
        var tgtPos = s.mode === 'eat' ? (ctx.food && ctx.food()) : (ctx.water && ctx.water());
        if (tgtPos) { var w2 = Math.atan2(tgtPos.x - s.x, tgtPos.z - s.z - 0.0), df = Math.atan2(Math.sin(w2 - s.heading), Math.cos(w2 - s.heading)); s.heading += df * (1 - Math.exp(-dt * 6)); }
      }
      s.x = U.clamp(s.x, B.x0 - 0.15, B.x1 + 0.15); s.z = U.clamp(s.z, B.z0 - 0.1, B.z1 + 0.1);
      (ctx.obstacles ? ctx.obstacles() : []).forEach(function (o) {                // slide around the tray, bowl and lamp foot
        var ox = s.x - o.x, oz = s.z - o.z, d = Math.hypot(ox, oz);
        if (d < o.r && d > 1e-4) { s.x = o.x + ox / d * o.r; s.z = o.z + oz / d * o.r; }
      });
      s.moving = speed > 0.02 ? 1 : 0;

      /* --- body pose --- */
      var walkAmt = s.moving * Math.min(1, speed / 0.9 + 0.2);
      var headDown = 0, headYaw = 0, beak = 0, crouch = 0, eye = 1 - 0.65 * prof.sleepy - 0.3 * prof.weak, neck = 0;
      s.yawPh += dt * 0.9;
      if (s.mode === 'idle' || s.mode === 'look' || s.mode === 'chirp') headYaw = Math.sin(s.yawPh * (s.mode === 'look' ? 2.2 : 1)) * (s.mode === 'look' ? 0.75 : 0.35);
      if (s.mode === 'forage') { s.peck += dt * (5.5 + 3 * act); headDown = Math.max(0, Math.sin(s.peck * 2)) * 0.95; headYaw = Math.sin(s.yawPh * 1.7) * 0.4; }
      if (s.mode === 'eat') { if (arrived) { s.peck += dt * 7; headDown = Math.max(0, Math.sin(s.peck * 2)) * 1.0; } }
      if (s.mode === 'drink' && arrived) { s.sip += dt; var c = (s.sip % 2.2) / 2.2; headDown = c < 0.45 ? 1 : 0; beak = c < 0.45 ? 0.25 : c < 0.6 ? 0.45 : 0; neck = c >= 0.45 && c < 0.65 ? 0.6 : 0; }
      if (s.mode === 'search') { headYaw = Math.sin(s.yawPh * 3) * 0.85; beak = 0.18 + 0.2 * Math.max(0, Math.sin(time * 3.4)); }
      if (s.mode === 'chirp') { s.chirpFlutter += dt; beak = Math.max(0, Math.sin(s.chirpFlutter * 24)) * 0.55 * (s.chirpFlutter < 0.6 ? 1 : 0); }
      if (s.mode === 'rest') { crouch = 0.9; eye = Math.min(eye, 0.12); }
      if (s.mode === 'huddle' || s.mode === 'cool') { if (arrived) { crouch = s.mode === 'huddle' ? 0.9 : 0.1; } }
      crouch = Math.max(crouch, prof.huddle * 0.5 * (s.moving ? 0.4 : 1), prof.weak * 0.35 * (s.moving ? 0.3 : 1), prof.sleepy * 0.25 * (s.moving ? 0 : 1));
      s.blinkIn -= dt; if (s.blinkIn <= 0) { s.blink = 0.16; s.blinkIn = 2.4 + rnd() * 3; }
      if (s.blink > 0) { s.blink -= dt; eye = Math.min(eye, 0.08); }
      /* the things the profile always does, whatever the chick is busy with */
      var pantBeak = prof.pant * (0.35 + 0.4 * (0.5 + 0.5 * Math.sin(time * (14 + prof.pant * 8))));
      neck = Math.max(neck, prof.neck * (0.8 + 0.2 * Math.sin(time * 2.6)));
      headDown += 0.28 * prof.weak * (dead ? 0 : 1);
      pose.walk = walkAmt; pose.headDown = Math.min(1, headDown); pose.headYaw = headYaw; pose.headTilt = 0.18 * prof.weak * Math.sin(time * 0.7);
      pose.beak = Math.max(beak, pantBeak); pose.neck = neck; pose.wing = prof.wings * (0.8 + 0.2 * Math.sin(time * 5)); pose.flap = prof.pant;
      pose.fluff = Math.max(prof.fluff, s.mode === 'rest' ? 0.25 : 0); pose.shiver = prof.shiver; pose.pale = prof.pale;
      pose.crouch = crouch; pose.lie = prof.lie; pose.eye = eye;
      pose.breath = 0.012 + 0.05 * prof.pant + 0.014 * prof.weak; pose.rate = 12 + 46 * prof.pant;
      if (dead) { pose.walk = 0; pose.headDown = 0.2; pose.beak = 0; pose.neck = 0; pose.wing = 0; pose.flap = 0; pose.shiver = 0; pose.eye = 0.05; pose.breath = 0; pose.crouch = 1; }
      if (s.lift > 0.05) { pose.wing = Math.max(pose.wing, 0.55); pose.flap = 1; pose.walk = 0; }   // still in the air: flutter down
      chick.group.position.set(s.x, ctx.floorY + s.lift, s.z);
      chick.group.rotation.y = s.heading;
      chick.update(dt, time);
    }

    return {
      state: s,
      setProfile: function (p) { Object.keys(p).forEach(function (k) { prof[k] = p[k]; }); },
      step: step,
      /* put the chick down at a place and let it decide afresh */
      place: function (x, z, heading) { s.x = x; s.z = z; s.heading = heading || 0; s.tx = x; s.tz = z; s.mode = 'idle'; s.t = 0.6; chick.group.position.set(x, ctx.floorY + s.lift, z); chick.group.rotation.y = s.heading; }
    };
  };
})(window.Lab);
