'use strict';

/**
 * @ngdoc overview
 * @name uiApp
 * @description
 * # uiApp
 *
 * Main module of the application.
 */
angular
  .module('uiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngStorage'
  ])
  
  .constant('API_URL', 'http://localhost:8000/api/v1/')

  /*
   * Define auth events, the auth interceptor will push these events when it detects 
   */
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })

  /*
   * Set the possible authorization rules, this is based on the "Group" label in the databse. Each group should have a corresponding USER_ROLE.
   */
  .constant('USER_ROLES', {
    all: '*',
    super: {name: 'Super'},
    admin: {name: 'Admin'},
    stock: {name: 'Stock'},
    user: {name: 'User'}
  })

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'USER_ROLES', function ($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/');

    // Public routes
    $stateProvider
      .state('public', {
        abstract: true,
        template: '<ui-view/>',
        data: {
          authorizedRoles: [USER_ROLES.super]
        },
        resolve: {
        }
      })
      .state('public.home', {
        url: '/',
        templateUrl: 'views/public.html',
        controller: 'HomeCtrl',
      })

      .state('public.login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })

      .state('public.register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })

      .state('public.logout', {
        url: '/logout',
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl'
      });

    // User routes
    $stateProvider
      .state('user', {
        abstract: true,
        template: '<ui-view/>',
        data: {
          authorizedRoles: [USER_ROLES.user]
        }
      });

    // Admin routes
    $stateProvider
      .state('admin', {
        abstract: true,
        template: '<ui-view/>',
        data: {
          authorizedRoles: [USER_ROLES.admin]
        }
      });

  }])

  /*
   * Intercept all HTTP outgoing traffic, we do this to add the X-Auth-Token to the request.
   */
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  }])

  /*
   * 
   */
  .run(['$rootScope', 'AUTH_EVENTS', 'USER_ROLES', 'Auth', 'Session', '$log', '$state', '$localStorage', function ($rootScope, AUTH_EVENTS, USER_ROLES, Auth, Session, $log, $state, $localStorage) {

      $rootScope.currentUser = null;
      $rootScope.userRoles = USER_ROLES;
      $rootScope.isAuthorized = Auth.isAuthorized;
      $rootScope.isAuthenticated = Auth.isAuthenticated;
      $rootScope.logout = Auth.logout;

      $rootScope.pageTypes = ['front', 'text', 'news', 'carousel', 'maps', 'faq', 'animation', 'bigfooter'];
      $rootScope.pagePermissions = ['*', 'user', 'admin'];

      $rootScope.productsEnabled = true;
      $rootScope.blogsEnabled = true;

      $rootScope.productTypes = ['typ1', 'typ2'];

      Session.restore();

      $rootScope.language = 'sv';


      if( !(angular.isUndefined($localStorage.language) || $localStorage.language === null) ){
        $rootScope.language = $localStorage.language;
      }

      // -- START ALERTS --
      // Possible types: 'success', 'info', 'warning', 'danger'
      $rootScope.alerts = [];
      $rootScope.addAlert = function (type, messages) {
        angular.forEach(messages, function (message) {
          $rootScope.alerts.push({ type: type, msg: message });
        });
      };
      $rootScope.closeAlert = function (index) {
        $rootScope.alerts.splice(index);
      };
      // -- END ALERTS --

/*
// This causes infite loops!!
      $rootScope.$on('$stateChangeStart', function (event, next) {
        var permissions = next.data.authorizedRoles;
        if(!Auth.isAuthenticated()){
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          if(!Auth.isAuthorized(permissions)){
            event.preventDefault();
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          }else{
            $log.info('Permitted but not logged in');
          }
        }else{
          if(!Auth.isAuthorized(permissions)){
            event.preventDefault();
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          }else{
            $log.info('Permitted and logged in');
          }
        }
      });
*/

      $rootScope.$on(AUTH_EVENTS.loginSuccess, function (data) {
        $log.info('Event: loginSuccess');
        if(!Auth.isAuthorized(USER_ROLES.admin)){
          $state.go('user.profile');
        }else{
          $state.go('admin.home');
        }
        // Go to public after any login
        $state.go('public.home');
        $log.log(data);
      });

      $rootScope.$on(AUTH_EVENTS.loginFailed, function (data) {
        $log.info('Event: loginFailed');
        $log.log(data);
      });

      $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (data) {
        $log.info('Event: logoutSuccess');
        $state.go('public.home');
        $log.log(data);
      });

      $rootScope.$on(AUTH_EVENTS.sessionTimeout, function (data) {
        $log.info('Event: sessionTimeout');
        $state.go('public.login');
        $log.log(data);
      });

      $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (data) {
        $log.info('Event: notAuthenticated');
        $log.log(data);
      });

      $rootScope.$on(AUTH_EVENTS.notAuthorized, function (data) {
        $log.info('Event: notAuthorized');
        $state.go('public.login');
        $log.log(data);
      });
    
    }]);