(function () {
  function sectionIdsFromNav() {
    var ids = [];
    var seen = {};
    document.querySelectorAll(".nav a[href^='#']").forEach(function (a) {
      var id = (a.getAttribute("href") || "").replace(/^#/, "");
      if (id && !seen[id] && document.getElementById(id)) {
        seen[id] = true;
        ids.push(id);
      }
    });
    return ids;
  }

  function linksFor(id) {
    return document.querySelectorAll('.nav a[href="#' + id + '"]');
  }

  function setActive(id) {
    document.querySelectorAll(".nav a.is-active").forEach(function (a) {
      a.classList.remove("is-active");
      a.removeAttribute("aria-current");
    });
    if (!id) return;
    linksFor(id).forEach(function (a) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "true");
    });
  }

  function init() {
    var sectionIds = sectionIdsFromNav();
    var sections = sectionIds
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) return;

    var visible = new Map();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        });

        var best = null;
        var bestRatio = 0;
        sectionIds.forEach(function (id) {
          var ratio = visible.get(id) || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });

        if (best) {
          setActive(best);
          return;
        }

        var scrollBottom = window.scrollY + window.innerHeight;
        var docHeight = document.documentElement.scrollHeight;
        if (docHeight - scrollBottom < 120) {
          setActive(sectionIds[sectionIds.length - 1]);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    var hash = (location.hash || "").replace(/^#/, "");
    if (sectionIds.indexOf(hash) !== -1) {
      setActive(hash);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  (function navToggle() {
    var top = document.querySelector(".top");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!top || !toggle || !nav) return;

    function setOpen(open) {
      top.classList.toggle("is-nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(!top.classList.contains("is-nav-open"));
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  })();

  (function scrollProgress() {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function progress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
    }

    progress();
    window.addEventListener("scroll", progress, { passive: true });
    window.addEventListener("resize", progress);
  })();
})();
