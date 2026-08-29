(function () {
  var SWIPE_THRESHOLD = 45;

  function currentLang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function bindSwipe(root, onPrev, onNext) {
    var stage = root.querySelector(".slide-stage");
    if (!stage) return;

    var startX = 0;
    var startY = 0;

    stage.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchend",
      function (e) {
        var touch = e.changedTouches[0];
        if (!touch) return;

        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;

        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

        if (dx < 0) onNext();
        else onPrev();
      },
      { passive: true }
    );
  }

  function bindSlideshow(root, slides) {
    var img = root.querySelector("[data-slide-img]");
    var cap = root.querySelector("[data-slide-cap]");
    var dots = root.querySelector("[data-slide-dots]");
    var i = 0;

    if (!img || !cap || !dots) return;

    function show(n) {
      i = (n + slides.length) % slides.length;
      var slide = slides[i];
      img.src = slide.src;
      img.alt = slide[currentLang()];
      cap.textContent = slide[currentLang()];
      dots.querySelectorAll("button").forEach(function (button, idx) {
        button.setAttribute("aria-selected", idx === i ? "true" : "false");
      });
    }

    slides.forEach(function (_, idx) {
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", "Slide " + (idx + 1));
      button.addEventListener("click", function () {
        show(idx);
      });
      dots.appendChild(button);
    });

    var prev = root.querySelector("[data-slide-prev]");
    var next = root.querySelector("[data-slide-next]");
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });

    bindSwipe(
      root,
      function () { show(i - 1); },
      function () { show(i + 1); }
    );

    document.querySelectorAll(".lang button").forEach(function (button) {
      button.addEventListener("click", function () {
        show(i);
      });
    });

    show(0);
  }

  window.initSlideshows = function (sets) {
    if (!sets) return;
    document.querySelectorAll("[data-slideshow]").forEach(function (root) {
      var key = root.getAttribute("data-slideshow");
      if (sets[key]) bindSlideshow(root, sets[key]);
    });
  };
})();
