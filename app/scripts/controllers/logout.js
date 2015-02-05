'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the uiApp
 */
angular.module('uiApp')
  .controller('LogoutCtrl', ['$scope', 'Auth', 'Session', '$log', function ($scope, Auth, Session, $log) {
  
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.logout = function () {
      Auth.logout().then(function (response) {
        $log.info(response);
      }, function (response) {
        $log.warn(response);
      });
    };

  }]);