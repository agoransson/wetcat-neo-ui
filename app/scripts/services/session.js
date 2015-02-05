'use strict';

/**
 * @ngdoc service
 * @name uiApp.Session
 * @description
 * # Session
 * Service in the uiApp.
 */
angular.module('uiApp')
  .service('Session', function ($rootScope, $localStorage, $log) {

    this.create = function (userId, userToken, userPermissions) {
      this.id = userId;
      this.token = userToken;
      this.permissions = userPermissions;

      $localStorage.user = this;
    };

    this.restore = function () {
      if( !(angular.isUndefined($localStorage.user) || $localStorage.user === null) ){
        $log.info('session storage loaded!');
        this.id = $localStorage.user.id;
        this.token = $localStorage.user.token;
        this.permissions = $localStorage.user.permissions;
      }else{
        $log.warn('session storage not loaded');
      }
    };

    this.destroy = function () {
      this.id = null;
      this.token = null;
      this.permissions = null;

      delete $localStorage.user;
    };
    
    return this;

  });