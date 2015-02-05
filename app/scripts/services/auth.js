'use strict';

/**
 * @ngdoc service
 * @name uiApp.Auth
 * @description
 * # Auth
 * Factory in the uiApp.
 */
angular.module('uiApp')
  .factory('Auth', ['$http', 'Session', 'API_URL', 'USER_ROLES', '$log', '$rootScope', 'AUTH_EVENTS', '$q', function ($http, Session, API_URL, USER_ROLES, $log, $rootScope, AUTH_EVENTS, $q) {
    return {

      login: function (credentials) {
        var deferred = $q.defer();
        $http({
          method: 'post',
          url: API_URL + 'auth',
          data: credentials
        })
        .success(function (result) {
          deferred.resolve(result);
        })
        .error(function (result) {
          deferred.reject(result);
        });
        return deferred.promise;
      },

      logout: function () {
        var deferred = $q.defer();
        $http({
          method: 'delete',
          url: API_URL + 'auth/' + Session.token
        })
        .success(function (result) {
          deferred.resolve(result);
          Session.destroy();
          $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        })
        .error(function (result) {
          deferred.reject(result);
          Session.destroy();
          $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout);
        });
        return deferred.promise;
      },

      isAuthenticated: function () {
        return !!Session.id && !!Session.token;
      },
      
      isAuthorized: function (permission) {
        var permissions = {};

        // Make sure the permission is an object
        if( typeof permission !== 'object'){
          permissions = {};
          permissions.name = permission;
        }

        // Turn it into an array
        if (!angular.isArray(permissions)) {
          permissions = [permissions];
        }


console.log("innan");
console.log(permissions);
console.log("efter");

        // If the route permits all just return true
        if( permissions.indexOf(USER_ROLES.all) !== -1 ){
          return true;
        }
console.log(Session);

        // If session is not properly set, just return false
        if( angular.isUndefined(Session.permissions) || Session.permissions === null ){
          $log.warn('No set session!');
          return false;
        }

        var hasPermission = false;
        // Loop through all required permissions
        for( var i = 0; i < permissions.length; i++ ){
          
          // Loop through all owned permissions
          for( var j = 0; j < Session.permissions.length; j++ ){
            if( Session.permissions[j].hasOwnProperty('name') && Session.permissions[j].name === permissions[i].name){
              $log.info('User has authority!');
              hasPermission = true;
            }
          }
        }

        //$log.log('Has permission: ' + (hasPermission || permissions.indexOf(USER_ROLES.all) !== -1));
        return hasPermission;
        //return (this.isAuthenticated() && permissions.indexOf(Session.permissions) !== -1);
      }

    };
    
  }]);