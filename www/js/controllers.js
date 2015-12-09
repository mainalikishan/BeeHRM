angular.module('beehrm.controllers', [])
  .controller('AppCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$localStorage', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPopup', 'Auth', 'Me',
    function($rootScope, $scope, $state, $timeout, $localStorage, $ionicSideMenuDelegate, $ionicLoading, $ionicPopup, Auth, Me) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      $scope.loginShow = false;
      $timeout(function() {
        if (typeof $localStorage.token !== 'undefined') {
          $scope.userInfo = $localStorage.userInfo;
          $state.go('app.dashboard');
        } else {
          $scope.loginShow = true;
        }
        $ionicLoading.hide();
      }, 1000);


      $scope.$on('$ionicView.enter', function() {
        $ionicSideMenuDelegate.canDragContent(false);
      });
      $scope.$on('$ionicView.leave', function() {
        $ionicSideMenuDelegate.canDragContent(true);
      });

      function getUserWithLeavesAndPaySlips() {
        Me.include({
          0: 'applications',
          1: 'payslip',
        }).success(function(res) {
          $localStorage.notifications = res.data.notifications;
          delete res.data.notifications;
          $localStorage.userInfo = res.data;
          $scope.userInfo = $localStorage.userInfo;

          $state.go('app.dashboard');
          $ionicLoading.hide();
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Whoops',
              template: e.message,
              buttons: [{
                text: 'OK',
                type: 'button-primary'
              }]
            });
          }, 1000);
        });
      }

      $scope.loginData = {};

      $scope.login = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
        $scope.loginShow = false;
        Auth.login({
          email: $scope.loginData.email,
          password: $scope.loginData.password
        }).success(function(res) {
          $localStorage.token = res.token;
          getUserWithLeavesAndPaySlips();
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Whoops',
              template: e.message,
              buttons: [{
                text: 'OK',
                type: 'button-primary'
              }]
            });
          }, 1000);
        });
      };

      $scope.logout = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
        Auth.logout(function() {

          $timeout(function() {
            $scope.loginShow = true;
            $state.go('app.login');
            $ionicLoading.hide();
          }, 1000);
        });
      };
    }
  ])

.controller('DashboardCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, $ionicLoading, $ionicPopup, $localStorage, Me) {
  $scope.userInfo = $localStorage.userInfo;

  $scope.items = [];
  for (var i = 0; i < 10; i++) {
    (function() {
      var j = i;
      $timeout(function() {
        $scope.items[j] = {
          title: 'Office shall runs this Sunday',
          dt: '2015-January-' + parseInt(j + 1) + '',
          id: j
        };
        $ionicScrollDelegate.resize();
      }, j * 1000);
    })();
  }

})


.controller('NotificationsCtrl', function($scope, $rootScope, $localStorage) {

  $scope.notifications = $localStorage.notifications.data;

})

.controller('EventsCtrl', function($scope) {

  $scope.items = [{
    title: 'बाबुको मुख हेर्ने दिन - भाद्र २७, आइतवार',
    day: '13',
    month: 'Sep',
    id: 1
  }, {
    title: 'दर खाने - भाद्र २९, मङ्गलवार',
    status: 'P',
    day: '15',
    month: 'Sep',
    id: 2
  }, {
    title: 'ऋषिपञ्चमी व्रत - आश्विन १, शुक्रवार',
    status: 'A',
    day: '18',
    month: 'Sep',
    id: 3
  }, {
    title: 'घटस्थापना - आश्विन २६, मङ्गलवार',
    status: 'A',
    day: '13',
    month: 'Oct',
    id: 4
  }, {
    title: 'फूलपाती - कार्तिक ३, मङ्गलवार',
    status: 'A',
    day: '20',
    month: 'Oct',
    id: 5
  }, {
    title: 'कालरात्री - कार्तिक ४, बुधवार',
    status: 'R',
    day: '21',
    month: 'Oct',
    id: 6
  }, {
    title: 'महाअष्टमी - कार्तिक ४, बुधवार',
    status: 'A',
    day: '22',
    month: 'Oct',
    id: 7
  }, {
    title: 'विजया दशमी - कार्तिक ५, बिहिवार',
    status: 'R',
    day: '22',
    month: 'Oct',
    id: 8
  }, {
    title: 'काग तिहार - कार्तिक २३, सोमवार',
    status: 'A',
    day: '09',
    month: 'Nov',
    id: 9
  }, {
    title: 'कुकुर तिहार - कार्तिक २४, मङ्गलवार',
    status: 'A',
    day: '10',
    month: 'Nov',
    id: 10
  }];
})


.controller('LeavesCtrl', function($scope, $localStorage, $timeout, $rootScope, $cordovaNetwork, $ionicLoading, $ionicPopup, $state, All) {
  $scope.show = false;

  $ionicLoading.show({
    template: 'Loading...'
  });

  $scope.moreDataCanBeLoaded = function() {
    return false;
  };

  $ionicLoading.show({
    template: 'Loading...'
  });

  // listen for Online event
  $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
    var onlineState = networkState;
    $ionicLoading.show({
      template: 'Syncing data...'
    });
    actionIfOnline();
  });

  var isOffline = $cordovaNetwork.isOffline();

  if (isOffline) {
    $timeout(function() {
      $rootScope.applications = $localStorage.userInfo.applications.data;
      $scope.show = true;
      $ionicLoading.hide();
    }, 1000);
  } else {
    actionIfOnline();
  }

  function actionIfOnline() {
    All.leaveApplication({
    }).success(function(res) {
      delete $localStorage.userInfo.applications;
      $localStorage.userInfo.applications = res;
      $rootScope.applications = $localStorage.userInfo.applications.data;

      $scope.total_pages = res.meta.pagination.total_pages;
      $scope.current_page = res.meta.pagination.current_page;

      $scope.show = true;
      $ionicLoading.hide();

      $timeout(function() {
        if ($scope.total_pages != $scope.current_page) {
          $scope.moreDataCanBeLoaded = function() {
            return true;
          };
        }
      }, 1000);
    }).error(function(e) {
      $timeout(function() {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Whoops',
          template: e.message,
          buttons: [{
            text: 'OK',
            type: 'button-primary'
          }]
        });
      }, 1000);
    });

    $scope.loadMore = function() {
      var page = parseInt($scope.current_page) + 1;
      All.leaveApplication({
        0: 'page='+page
      }).success(function(res) {
        $timeout(function() {
          $rootScope.applications = $rootScope.applications.concat(res.data);
          $scope.total_pages = res.meta.pagination.total_pages;
          $scope.current_page = res.meta.pagination.current_page;
          if ($scope.total_pages == $scope.current_page) {
            $scope.moreDataCanBeLoaded = function() {
              return false;
            };
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
      }).error(function(e) {
        $timeout(function() {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Whoops',
            template: e.message,
            buttons: [{
              text: 'OK',
              type: 'button-primary'
            }]
          });
        }, 1000);
      });
    };
  }
})

.controller('LeaveCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $localStorage, $stateParams, $filter, $ionicPopup, $state) {
  $scope.show = false;

  $ionicLoading.show({
    template: 'Loading...'
  });

  $scope.applications = $rootScope.applications;

  var leaveId = $stateParams.leaveId;

  function fetchDetails(leaveId) {
    var found = $filter('filter')($scope.applications, {
      id: leaveId
    });

    if (found.length) {
      return found[0];
    } else {
      return 'NOTFOUND';
    }
  }

  var hasDetails = fetchDetails(leaveId);

  // Simulate a delay
  $timeout(function() {
    $ionicLoading.hide();
    if (hasDetails == 'NOTFOUND') {
      $ionicPopup.alert({
        title: 'Whoops',
        template: 'Something went wrong!',
        buttons: [{
          text: 'OK',
          type: 'button-primary',
          onTap: function(e) {
            $state.go('app.leaves');
          }
        }]
      });
    } else {
      $scope.leaveDetails = hasDetails;
      $scope.show = true;
    }
  }, 1000);
})

.controller('ApplyLeaveCtrl', function($scope, $ionicModal, $timeout) {

  $scope.expandText = function() {
    var element = document.getElementById("txtnotes");
    element.style.height = element.scrollHeight + "px";
  };

  // Form data for the leave modal
  $scope.options = [{
    name: "Paid",
    id: 1
  }, {
    name: "Unpaid",
    id: 2
  }];
  $scope.leaveData = {
    'leaveType': $scope.options[1],
  };

  // Create the leave modal that we will use later
  $ionicModal.fromTemplateUrl('templates/leave.apply.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the leave modal to close it
  $scope.closeLeave = function() {
    $scope.modal.hide();
  };

  // Open the leave modal
  $scope.applyLeave = function() {
    $scope.modal.show();
  };

  // Perform the leave action when the user submits the leave form
  $scope.doLeave = function() {
    console.log('Doing leave', $scope.leaveData);

    // Simulate a leave delay. Remove this and replace with your leave
    // code if using a leave system
    $timeout(function() {
      $scope.closeLeave();
    }, 1000);
  };

  $scope.startDatepickerObject = {
    titleLabel: 'Select Date', //Optional
    todayLabel: 'Today', //Optional
    closeLabel: 'Close', //Optional
    setLabel: 'Set', //Optional
    setButtonType: 'button-balanced button-outline', //Optional
    todayButtonType: 'button-balanced button-outline', //Optional
    closeButtonType: 'button-balanced button-outline', //Optional
    mondayFirst: true, //Optional
    templateType: 'popup', //Optional
    modalHeaderColor: 'bar-primary', //Optional
    modalFooterColor: 'bar-primary', //Optional
    callback: function(val) { //Mandatory
      startDatePickerCallback(val);
    }
  };

  $scope.startDate = new Date();

  var startDatePickerCallback = function(val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.startDate = val;
      console.log('Selected date is : ', val);
    }
  };

  $scope.endDatepickerObject = {
    titleLabel: 'Select Date', //Optional
    todayLabel: 'Today', //Optional
    closeLabel: 'Close', //Optional
    setLabel: 'Set', //Optional
    setButtonType: 'button-balanced button-outline', //Optional
    todayButtonType: 'button-balanced button-outline', //Optional
    closeButtonType: 'button-balanced button-outline', //Optional
    mondayFirst: true, //Optional
    templateType: 'popup', //Optional
    modalHeaderColor: 'bar-primary', //Optional
    modalFooterColor: 'bar-primary', //Optional
    callback: function(val) { //Mandatory
      endDatePickerCallback(val);
    }
  };

  $scope.endDate = new Date();

  var endDatePickerCallback = function(val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.endDate = val;
      console.log('Selected date is : ', val);
    }
  };
})

.controller('PayslipCtrl', function($scope) {

  $scope.items = [{
    title: 'January',
    netSalary: '38,405.91',
    id: 1
  }, {
    title: 'February',
    netSalary: '38,405.91',
    id: 2
  }, {
    title: 'March',
    netSalary: '27,887.46',
    id: 3
  }, {
    title: 'April',
    netSalary: '27,887.46',
    id: 4
  }, {
    title: 'May',
    netSalary: '38,405.91',
    id: 5
  }, {
    title: 'June',
    netSalary: '38,405.91',
    id: 6
  }, {
    title: 'July',
    netSalary: '38,405.91',
    id: 7
  }, {
    title: 'August',
    netSalary: '38,405.00',
    id: 8
  }, {
    title: 'September',
    netSalary: '48,410.00',
    id: 9
  }, {
    title: 'October',
    netSalary: '38,405.00',
    id: 10
  }, {
    title: 'November',
    netSalary: '38,405.00',
    id: 11
  }, {
    title: 'December',
    netSalary: '38,405.00',
    id: 12
  }];


});
