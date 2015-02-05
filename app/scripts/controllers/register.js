'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the uiApp
 */
angular.module('uiApp')
  .controller('RegisterCtrl', ['$scope', 'User', '$log', function ($scope, User, $log) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.create = function (credentials) {
      User.create(credentials).then(function (response) {
        if ( response.error === true ) {
          $log.error('Error creating user!');
        } else {
          $log.info('User created!');
        }
      }, function () {
        $log.error('Error creating user!');
      });
    };

  }]);
