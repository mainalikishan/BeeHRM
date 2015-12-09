angular.module('beehrm', ['ionic', 'ngCordova', 'ngStorage', 'ngFx', 'ngAnimate', 'ionic-datepicker', 'beehrm.directives', 'beehrm.services', 'beehrm.factories', 'beehrm.controllers'])
  .constant('urls', {
    BASE_API: 'http://192.168.10.9:8000'
  })

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {

    StatusBar.backgroundColorByHexString("#3D4B55");
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
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
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
        templateUrl: 'templates/leaves.balance.html',
        controller: 'LeavesCtrl'
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

  .state('app.payslips', {
    url: '/payslips',
    views: {
      'menuContent': {
        templateUrl: 'templates/payslips.html',
        controller: 'PayslipCtrl'
      }
    }
  })

  .state('app.payslip', {
    url: '/payslips/:slipId',
    views: {
      'menuContent': {
        templateUrl: 'templates/payslip.html',
        controller: 'LeaveCtrl'
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
  $urlRouterProvider.otherwise('/app/login');
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
        if (response.status === 401 || response.status === 403) {
          $location.path('/app/login');
        }
        return $q.reject(response);
      }
    };
  }]);
});
