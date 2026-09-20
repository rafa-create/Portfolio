(function () {
  "use strict";

  var canvas = document.getElementById("sim3d-canvas");
  var toggle = document.getElementById("sim3d-toggle");
  var reset = document.getElementById("sim3d-reset");
  var speed = document.getElementById("sim3d-speed");
  var speedValue = document.getElementById("sim3d-speed-value");
  if (!canvas || !toggle || !reset || !speed || !speedValue) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Demonstration with stylized orbital paths, not a scale-accurate physics model.
  var bodies = [
    { orbit: 0.82, size: 0.105, tilt: 0.16, rate: 1.50, phase: 0.4, color: "#72d4dc" },
    { orbit: 1.35, size: 0.155, tilt: -0.32, rate: 0.88, phase: 2.1, color: "#f0b777" },
    { orbit: 1.96, size: 0.18, tilt: 0.44, rate: 0.51, phase: 4.2, color: "#b6a4f4" }
  ];
  var width = 1;
  var height = 1;
  var yaw = -0.48;
  var pitch = -0.48;
  var time = 0;
  var lastFrame = 0;
  var visible = true;
  var dragging = false;
  var previousX = 0;
  var previousY = 0;
  var paused = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function position(orbit, angle, tilt) {
    var depth = orbit * Math.sin(angle);
    return {
      x: orbit * Math.cos(angle),
      y: depth * Math.sin(tilt),
      z: depth * Math.cos(tilt)
    };
  }

  function project(point) {
    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var x = point.x * cy - point.z * sy;
    var z = point.x * sy + point.z * cy;
    var y = point.y * cp - z * sp;
    z = point.y * sp + z * cp;
    var scale = Math.min(width, height) * 0.76 / (5.4 - z);
    return { x: width / 2 + x * scale, y: height / 2 - y * scale, z: z, scale: scale };
  }

  function sphere(point, radius, color, isSun) {
    var center = project(point);
    var size = Math.max(1, radius * center.scale);
    var halo = ctx.createRadialGradient(center.x, center.y, size * 0.25, center.x, center.y, size * (isSun ? 2.9 : 1.7));
    halo.addColorStop(0, isSun ? "rgba(255,193,104,0.44)" : "rgba(255,255,255,0.10)");
    halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(center.x, center.y, size * (isSun ? 2.9 : 1.7), 0, Math.PI * 2);
    ctx.fill();

    var surface = ctx.createRadialGradient(
      center.x - size * 0.3, center.y - size * 0.35, size * 0.08,
      center.x, center.y, size
    );
    surface.addColorStop(0, "#ffffff");
    surface.addColorStop(0.3, color);
    surface.addColorStop(1, isSun ? "#c55c3b" : "#26364d");
    ctx.fillStyle = surface;
    ctx.beginPath();
    ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    var background = ctx.createRadialGradient(width * 0.5, height * 0.48, 5, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
    background.addColorStop(0, "#22354b");
    background.addColorStop(1, "#0d1826");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    // Deterministic stars: the background stays still while the camera moves.
    for (var i = 0; i < 70; i += 1) {
      var sx = ((i * 73.79 + 17.1) % 101) / 101 * width;
      var sy = ((i * 37.43 + 11.7) % 103) / 103 * height;
      ctx.fillStyle = "rgba(215,235,255," + (0.16 + (i % 5) * 0.09) + ")";
      ctx.beginPath();
      ctx.arc(sx, sy, i % 9 === 0 ? 1.2 : 0.65, 0, Math.PI * 2);
      ctx.fill();
    }

    bodies.forEach(function (body) {
      ctx.beginPath();
      for (var step = 0; step <= 120; step += 1) {
        var p = project(position(body.orbit, step / 120 * Math.PI * 2, body.tilt));
        if (step === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(176,208,227,0.38)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    });

    var objects = bodies.map(function (body) {
      var point = position(body.orbit, time * body.rate + body.phase, body.tilt);
      return { point: point, radius: body.size, color: body.color, depth: project(point).z, sun: false };
    });
    objects.push({ point: { x: 0, y: 0, z: 0 }, radius: 0.25, color: "#ffdc84", depth: 0, sun: true });
    objects.sort(function (a, b) { return a.depth - b.depth; });
    objects.forEach(function (object) {
      sphere(object.point, object.radius, object.color, object.sun);
    });
  }

  function syncToggle() {
    toggle.querySelector("[data-fr]").textContent = paused ? "Relancer" : "Pause";
    toggle.querySelector("[data-en]").textContent = paused ? "Resume" : "Pause";
  }

  function frame(now) {
    if (lastFrame && !paused && visible && !document.hidden) {
      time += Math.min((now - lastFrame) / 1000, 0.05) * Number(speed.value);
      draw();
    }
    lastFrame = now;
    window.requestAnimationFrame(frame);
  }

  toggle.addEventListener("click", function () {
    paused = !paused;
    syncToggle();
    draw();
  });

  reset.addEventListener("click", function () {
    yaw = -0.48;
    pitch = -0.48;
    time = 0;
    speed.value = "1";
    speedValue.textContent = "1×";
    draw();
  });

  speed.addEventListener("input", function () {
    speedValue.textContent = Number(speed.value).toLocaleString(
      document.documentElement.lang === "en" ? "en-US" : "fr-FR"
    ) + "×";
  });

  canvas.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) return;
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    yaw += (event.clientX - previousX) * 0.008;
    pitch = Math.max(-1.4, Math.min(1.4, pitch + (event.clientY - previousY) * 0.008));
    previousX = event.clientX;
    previousY = event.clientY;
    draw();
  });
  function stopDragging() { dragging = false; }
  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);
  canvas.addEventListener("lostpointercapture", stopDragging);
  canvas.addEventListener("keydown", function (event) {
    var delta = 0.12;
    if (event.key === "ArrowLeft") yaw -= delta;
    else if (event.key === "ArrowRight") yaw += delta;
    else if (event.key === "ArrowUp") pitch = Math.max(-1.4, pitch - delta);
    else if (event.key === "ArrowDown") pitch = Math.min(1.4, pitch + delta);
    else return;
    event.preventDefault();
    draw();
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      lastFrame = 0;
    }, { threshold: 0.01 });
    observer.observe(canvas);
  }
  document.addEventListener("visibilitychange", function () { lastFrame = 0; });
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize);
  syncToggle();
  resize();
  window.requestAnimationFrame(frame);
})();
