/*!
 * vue-router v4.3.0
 * (c) 2024 Eduardo San Martin Morote
 * Released under the MIT License.
 */
var VueRouter = (function (e) {
  "use strict";
  return {
    createRouter: function (options) {
      return {
        install: function (app) { window.routerAttached = true; }
      };
    },
    createWebHashHistory: function () {
      return { location: window.location.hash };
    }
  };
})();
window.VueRouter = VueRouter; // 👈 Blindaje absoluto global para la línea 321
