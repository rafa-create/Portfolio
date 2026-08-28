(function () {
  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      if (!text) return;

      function copied() {
        var was = lang();
        btn.classList.add("is-copied");
        btn.setAttribute("aria-live", "polite");
        btn.setAttribute(
          "aria-label",
          was === "en" ? "Credential ID copied" : "CeDiD copié"
        );
        window.setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.removeAttribute("aria-live");
          btn.removeAttribute("aria-label");
        }, 1600);
      }

      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          if (document.execCommand("copy")) copied();
        } catch (e) {}
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(copied).catch(fallback);
      } else {
        fallback();
      }
    });
  });
})();
