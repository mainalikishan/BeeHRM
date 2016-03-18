angular.module('beehrm.directives', [])

.directive('goNative', ['Navigation', function(Navigation) {
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
}])

.directive('showFooter', ['$rootScope', '$localStorage', function($rootScope, $localStorage) {
  return {
    restrict: 'A',
    link: function($scope, $el) {
      if (!$rootScope.showFooter) {
        $scope.$on("$ionicView.beforeEnter", function() {
          if (typeof $localStorage.checkInOut !== 'undefined' && $localStorage.checkInOut === true) {
            $rootScope.showFooter = true;
          } else {
            $rootScope.showFooter = false;
          }

        });
        $scope.$on("$stateChangeStart", function() {
          $rootScope.showFooter = false;
        });
      }
    }
  };
}])

.directive('showTabs', ['$rootScope', function($rootScope) {
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
}])

.directive('showLeaveFooter', ['$rootScope', function($rootScope) {
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
}])

.directive('showLeaveTabs', ['$rootScope', function($rootScope) {
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
}]);
