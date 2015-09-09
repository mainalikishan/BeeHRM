// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngFx', 'ngAnimate', 'ionic-datepicker', 'starter.controllers'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // then override any default you want
            window.plugins.nativepagetransitions.globalOptions.duration = 500;
            window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
            window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
            window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
            window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
            // these are used for slide left/right only currently
            window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
            window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.messages', {
        url: '/messages',
        views: {
            'menuContent': {
                templateUrl: 'templates/messages.html',
                controller: 'NotificationsCtrl'
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

    .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                    templateUrl: 'templates/browse.html'
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

    .state('app.leave', {
        url: '/leaves/:leaveId',
        views: {
            'menuContent': {
                templateUrl: 'templates/leave.html',
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
    $urlRouterProvider.otherwise('/app/dashboard');
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.transition('platform');
    $ionicConfigProvider.scrolling.jsScrolling('false');
    $ionicConfigProvider.views.transition('none');
})

// services
.service('Navigation', function($state, $ionicPlatform) {
    //directly binding events to this context
    this.goNative = function(direction, transitiontype) {
        $ionicPlatform.ready(function() {

            switch (transitiontype) {
                case "slide":
                    window.plugins.nativepagetransitions.slide({
                            "direction": direction
                        },
                        function(msg) {
                            console.log("success: " + msg);
                        },
                        function(msg) {
                            alert("error: " + msg);
                        }
                    );
                    break;
                case "flip":
                    window.plugins.nativepagetransitions.flip({
                            "direction": direction
                        },
                        function(msg) {
                            console.log("success: " + msg);
                        },
                        function(msg) {
                            alert("error: " + msg);
                        }
                    );
                    break;

                case "fade":
                    window.plugins.nativepagetransitions.fade({

                        },
                        function(msg) {
                            console.log("success: " + msg);
                        },
                        function(msg) {
                            alert("error: " + msg);
                        }
                    );
                    break;

                case "drawer":
                    window.plugins.nativepagetransitions.drawer({
                            "origin": direction,
                            "action": "open"
                        },
                        function(msg) {
                            console.log("success: " + msg);
                        },
                        function(msg) {
                            alert("error: " + msg);
                        }
                    );
                    break;

                case "curl":
                    window.plugins.nativepagetransitions.curl({
                            "direction": direction
                        },
                        function(msg) {
                            console.log("success: " + msg);
                        },
                        function(msg) {
                            alert("error: " + msg);
                        }
                    );
                    break;

                default:
                    window.plugins.nativepagetransitions.slide({
                            "direction": direction
                        },
                        function(msg) {
                            console.log("success: " + msg);
                        },
                        function(msg) {
                            alert("error: " + msg);
                        }
                    );
            }
        });
    };
})

// directives
.directive('goNative', function(Navigation) {
    return {
        restrict: 'A',
        link: function($scope, $el, attrs) {
            var direction = attrs.direction;
            var transitiontype = attrs.transitiontype;
            $scope.$on("$ionicView.beforeEnter", function() {
                Navigation.goNative(direction, transitiontype);
            });
        }
    };
})

.directive('hideFooter', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            if(!$rootScope.hideFooter) {
                $scope.$on("$ionicView.beforeEnter", function() {
                    $rootScope.hideFooter = true;
                });
                $scope.$on("$stateChangeStart", function() {
                    $rootScope.hideFooter = false;
                });
            }
        }
    };
})

.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            if (!$rootScope.hideTabs) {
                $scope.$on("$ionicView.beforeEnter", function() {
                    $rootScope.hideTabs = true;
                });
                $scope.$on("$stateChangeStart", function() {
                    $rootScope.hideTabs = false;
                });
            }
        }
    };
})
;
