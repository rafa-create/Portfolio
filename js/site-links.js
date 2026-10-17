// Adresses des sites externes du portfolio.
// Modifier cette liste lorsqu'un domaine change.
(function () {
  "use strict";

  var sites = Object.freeze({
    beatonstep: "https://beatonstep.app/"
  });

  function appliquerLiens() {
    document.querySelectorAll("a[data-site-link]").forEach(function (lien) {
      var url = sites[lien.getAttribute("data-site-link")];
      if (url) lien.setAttribute("href", url);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", appliquerLiens, { once: true });
  } else {
    appliquerLiens();
  }
})();
