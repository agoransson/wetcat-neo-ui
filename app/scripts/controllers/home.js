'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the uiApp
 */
angular.module('uiApp')
  .controller('HomeCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
  
      $scope.currentUser = $rootScope.currentUser;

    }]);
