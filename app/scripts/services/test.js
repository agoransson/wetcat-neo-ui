'use strict';

/**
 * @ngdoc service
 * @name uiApp.test
 * @description
 * # test
 * Factory in the uiApp.
 */
angular.module('uiApp')
  .factory('test', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
