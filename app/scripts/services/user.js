'use strict';

/**
 * @ngdoc service
 * @name uiApp.User
 * @description
 * # User
 * Factory in the uiApp.
 */
angular.module('uiApp')
  .factory('User', ['$http', 'API_URL', '$q', function ($http, API_URL, $q) {
    
    var PATH = 'user';

//    var findPromise = null;
    var listPromise = null;

    return {
      create: function (resource) {
        var deferred = $q.defer();
        $http({
          method: 'post',
          url: API_URL + PATH,
          data: resource
        })
        .success(function (result) {
          deferred.resolve(result);
        })
        .error(function (result) {
          deferred.reject(result);
        });
        return deferred.promise;
      },

      update: function (resource) {
        var deferred = $q.defer();
        $http({
          method: 'put',
          url: API_URL + PATH + '/' + resource.id,
          data: resource
        })
        .success(function (result) {
          deferred.resolve(result);
        })
        .error(function (result) {
          deferred.reject(result);
        });
        return deferred.promise;
      },

      list: function () {
        if( listPromise === null ){
          var deferred = $q.defer();
          $http({
            method: 'get',
            url: API_URL + PATH
          })
          .success(function (result) {
            deferred.resolve(result);
          })
          .error(function (result) {
            deferred.reject(result);
          });
          listPromise = deferred.promise;
        }else{
        }
        return listPromise;
      },

      find: function (resource) {
        var deferred = $q.defer();
        $http({
          method: 'get',
          url: API_URL + PATH + '/' + resource.id
        })
        .success(function (result) {
          deferred.resolve(result);
        })
        .error(function (result) {
          deferred.reject(result);
        });
        return deferred.promise;
      },

      delete: function (resource) {
        var deferred = $q.defer();
        $http({
          method: 'delete',
          url: API_URL + PATH + '/' + resource.id
        })
        .success(function (result) {
          deferred.resolve(result);
        })
        .error(function (result) {
          deferred.reject(result);
        });
        return deferred.promise;
      }

    };

  }]);