angular.module('beehrm.directives', [])
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
            $scope.$on("$stateChangeStart", function() {
                Navigation.goNative(direction, transitiontype);
            });
        }
    };
})

.directive('showFooter', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            if (!$rootScope.showFooter) {
                $scope.$on("$ionicView.beforeEnter", function() {
                    $rootScope.showFooter = true;
                });
                $scope.$on("$stateChangeStart", function() {
                    $rootScope.showFooter = false;
                });
            }
        }
    };
})

.directive('showTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            if (!$rootScope.showTabs) {
                $scope.$on("$ionicView.beforeEnter", function() {
                    $rootScope.showTabs = true;
                });
                $scope.$on("$stateChangeStart", function() {
                    $rootScope.showTabs = false;
                });
            }
        }
    };
})

.directive('showLeaveFooter', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            if (!$rootScope.showLeaveFooter) {
                $scope.$on("$ionicView.beforeEnter", function() {
                    $rootScope.showLeaveFooter = true;
                });
                $scope.$on("$stateChangeStart", function() {
                    $rootScope.showLeaveFooter = false;
                });
            }
        }
    };
})

.directive('showLeaveTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            if (!$rootScope.showLeaveTabs) {
                $scope.$on("$ionicView.beforeEnter", function() {
                    $rootScope.showLeaveTabs = true;
                });
                $scope.$on("$stateChangeStart", function() {
                    $rootScope.showLeaveTabs = false;
                });
            }
        }
    };
})
;