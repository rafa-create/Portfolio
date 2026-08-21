(function () {
  var KEY = "port-lang";

  function readLang() {
    var q = /(?:\?|&)lang=(en|fr)\b/.exec(location.search);
    if (q) return q[1];
    try {
      var s = localStorage.getItem(KEY);
      if (s === "en" || s === "fr") return s;
    } catch (e) {}
    var n = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return n === "en" ? "en" : "fr";
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {}
    var titles = window.PORT_TITLES || {};
    if (titles[lang]) document.title = titles[lang];
    var desc = window.PORT_DESC || {};
    var meta = document.querySelector('meta[name="description"]');
    if (meta && desc[lang]) meta.setAttribute("content", desc[lang]);
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-set") === lang ? "true" : "false");
    });
  }

  var lang = readLang();
  document.documentElement.lang = lang;
  if (window.PORT_TITLES && window.PORT_TITLES[lang]) {
    document.title = window.PORT_TITLES[lang];
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(lang);
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-set"));
      });
    });
  });
})();
