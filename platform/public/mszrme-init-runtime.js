/**
 * MSZRME init runtime — iOS 27 DOM postprocessor stub.
 * Full _macFix lives in the HTML prototype; this noop keeps page bridges safe.
 */
(function () {
  "use strict";

  window._macFix = function _macFix() {
    document.querySelectorAll("#feed-wrap .card").forEach(function (card, i) {
      card.style.animationDelay = (i * 0.04) + "s";
    });
  };
})();
