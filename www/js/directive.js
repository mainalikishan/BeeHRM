angular.module('beehrm.directives', [])

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
});
