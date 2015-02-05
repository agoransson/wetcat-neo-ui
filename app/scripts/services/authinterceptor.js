'use strict';

/**
 * @ngdoc service
 * @name uiApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the uiApp.
 */
angular.module('uiApp')
  .factory('AuthInterceptor', ['$rootScope', '$localStorage', '$q', 'AUTH_EVENTS', function ($rootScope, $localStorage, $q, AUTH_EVENTS) {
      return {
        'request': function (config) {
          //$rootScope.pendingRequests++;
          config.headers['X-Auth-Token'] = ($localStorage.user ? $localStorage.user.token : '');
          
          //$httpProvider.defaults.useXDomain = true;
          //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  
          return config;
        },
  
        'requestError': function (rejection) {
          //$rootScope.pendingRequests--;
          //console.log('request interceptor error');
          //console.log(rejection);
          return $q.reject(rejection);
        },
  
        'response': function (response) {
          //$rootScope.pendingRequests--;
          //console.log('response interceptor');
          //console.log(response);
  
          return response || $q.when(response);
        },
  
        responseError: function (response) {
          //console.log('responseerror interceptor');
          //console.log(response);
          if (response.status === 401) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
            console.log('auth failed 401');
          }
          if (response.status === 403) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response);
            console.log('auth failed 403');
          }
          if (response.status === 419 || response.status === 440) {
            $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, response);
            console.log('auth failed 419 || 440');
          }
  /*
          if( response.data.result === false ){
            $rootScope.addAlert('danger', response.data.data);
          }
  */
          return $q.reject(response);
        }
      };
    }]);
