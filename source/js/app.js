(function($) {
  'use strict';

  /**
   * app.js
   * This is our main app JS which controls all component and vendor
   */

  $(document).ready(function() {

    var global = $('body');

    // Initialize global.js if 'body' appears
    if (global.length > 0) {
      var Global = require('./components/global.js')
    }

  });

}) (jQuery);
