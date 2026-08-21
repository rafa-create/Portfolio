(function () {
  var sectionIds = ["experience", "volunteering", "projects", "education", "downloads", "contact"];

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

        // Near bottom of page: force contact
        var scrollBottom = window.scrollY + window.innerHeight;
        var docHeight = document.documentElement.scrollHeight;
        if (docHeight - scrollBottom < 80) {
          setActive("contact");
        }
      },
      {
        root: null,
        // Favor the section sitting under the sticky header
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    // Initial state from hash or first visible section
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
})();
