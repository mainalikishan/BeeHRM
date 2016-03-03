angular.module('beehrm', ['ionic', 'ionic.service.core', 'ngCordova', 'ngStorage', 'ngFx', 'ngAnimate', 'ionic-datepicker', 'beehrm.directives', 'beehrm.services', 'beehrm.factories', 'beehrm.controllers'])
  .constant('urls', {
    BASE_API: 'http://youngminds.com.np/beehrm_mobile/'
  })

.run(['$ionicPlatform', '$cordovaDialogs', '$state', '$localStorage',
  function($ionicPlatform, $cordovaDialogs, $state, $localStorage) {

  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      "onNotification": function(notification) {
        var goState = notification._payload.$state;
        var goStateparams = notification._payload.$stateParams;
        if(typeof goState !== 'undefined') {
          // if(typeof goStateparams !== 'undefined') {
          //   $state.go(goState, goStateparams);
          // } else {
          //   $state.go(goState);
          // }
          $cordovaDialogs.confirm(notification.text, notification.title, ['OK', 'Cancel'])
            .then(function(buttonIndex) {
              if (buttonIndex == 1) {
                if(typeof goStateparams !== 'undefined') {
                  $state.go(goState, goStateparams);
                } else {
                  $state.go(goState);
                }
              }
            });
          return true;
        }
      },
      "onRegister": function(data) {
        console.log(data);
        $localStorage.deviceToken = data;
      },
      "pluginConfig": {
        "android": {
          "iconColor": "#F8C300"
        }
      }
    });
    var callback = function(pushToken) {
    };

    push.register(callback);
    // then override any default you want
    if (window.plugins) {
      window.plugins.nativepagetransitions.globalOptions.duration = 400;
      window.plugins.nativepagetransitions.globalOptions.iosdelay = 250;
      window.plugins.nativepagetransitions.globalOptions.androiddelay = 250;
      window.plugins.nativepagetransitions.globalOptions.winphonedelay = 250;
      window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
      // these are used for slide left/right only currently
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#445963");
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.access', {
    url: '/access',
    views: {
      'menuContent': {
        templateUrl: 'templates/access.html'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.events', {
    url: '/events',
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html',
        controller: 'EventsCtrl'
      }
    }
  })

  .state('app.notifications', {
    url: '/notifications',
    views: {
      'menuContent': {
        templateUrl: 'templates/notifications.html',
        controller: 'NotificationsCtrl'
      }
    }
  })

  .state('app.leaves', {
    url: '/leaves',
    views: {
      'menuContent': {
        templateUrl: 'templates/leaves.html',
        controller: 'LeavesCtrl'
      }
    }
  })

  .state('app.leavesBalance', {
    url: '/leaves-balance',
    views: {
      'menuContent': {
        templateUrl: 'templates/leaves.balance.html'
      }
    }
  })

  .state('app.leave', {
    url: '/leaves/:leaveId',
    views: {
      'menuContent': {
        templateUrl: 'templates/leave.html',
        controller: 'LeaveCtrl'
      }
    }
  })

  .state('app.bulletinBoard', {
    url: '/bulletinBoards/:bulletinId',
    views: {
      'menuContent': {
        templateUrl: 'templates/bulletin.html',
        controller: 'BulletinBoardCtrl'
      }
    }
  })

  .state('app.payslips', {
    url: '/payslips',
    views: {
      'menuContent': {
        templateUrl: 'templates/payslips.html',
        controller: 'PayslipsCtrl'
      }
    }
  })

  .state('app.payslip', {
    url: '/payslips/:slipId',
    views: {
      'menuContent': {
        templateUrl: 'templates/payslip.html',
        controller: 'PayslipCtrl'
      }
    }
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/access');
  $ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.transition('platform');
  $ionicConfigProvider.scrolling.jsScrolling('false');
  $ionicConfigProvider.views.transition('none');

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
    return {
      'request': function(config) {
        config.headers = config.headers || {};
        if ($localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.token;
        }
        return config;
      },
      'responseError': function(response) {
        if (response.status === 401) {
          $location.path('/app/login');
        } else if (response.status === 403) {
          $location.path('/app/access');
        }
        return $q.reject(response);
      }
    };
  }]);
}]);
