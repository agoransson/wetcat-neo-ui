'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the uiApp
 */
angular.module('uiApp')
  .controller('LoginCtrl', ['$scope', 'Auth', '$log', 'Session', function ($scope, Auth, $log, Session) {
      
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      $scope.credentials = {
        'email': 'test@test.se',
        'password': 'test'
      };
  
      $scope.login = function (credentials) {
        Auth.login(credentials).then(function (response) {
          if ( response.error !== true ) {
            $log.info('Success!');
            Session.create(response.data.userId, response.data.token, response.data.permissions);
          }

        }, function (response) {
          $log.warn(response);
        });
      };
  
    }]);
