angular.module('beehrm.controllers', [])
  .controller('AppCtrl', ['$scope', '$state', '$timeout', '$localStorage', '$ionicSideMenuDelegate', '$ionicLoading', '$cordovaDialogs', 'Auth', 'Me', 'All',
    function($scope, $state, $timeout, $localStorage, $ionicSideMenuDelegate, $ionicLoading, $cordovaDialogs, Auth, Me, All) {
      $ionicLoading.show({
        template: 'Loading...'
      });

      $scope.$on('$ionicView.enter', function() {
        $ionicSideMenuDelegate.canDragContent(false);
      });
      $scope.$on('$ionicView.leave', function() {
        $ionicSideMenuDelegate.canDragContent(true);
      });

      $timeout(function() {
        if (typeof $localStorage.accessData !== 'undefined') {
            $state.go('app.login');
        } else {
          $scope.accessShow = true;
        }
        $ionicLoading.hide();
      }, 1000);

      $scope.accessData = {};

      $scope.access = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
        Auth.access({
          org_key: $scope.accessData.orgKey
        }).success(function(res) {
          $scope.accessShow = false;
          $localStorage.accessData = res;
          $ionicLoading.hide();
          $state.go('app.login');
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      };

    }
  ])

  .controller('LoginCtrl', ['$scope', '$state', '$timeout', '$localStorage', '$ionicSideMenuDelegate', '$ionicLoading', '$cordovaDialogs', '$cordovaNetwork', '$ionicHistory', 'Auth', 'Me', 'All',
    function($scope, $state, $timeout, $localStorage, $ionicSideMenuDelegate, $ionicLoading, $cordovaDialogs, $cordovaNetwork, $ionicHistory, Auth, Me, All) {
      $ionicLoading.show({
        template: 'Loading...'
      });

      $scope.$on('$ionicView.enter', function() {
        $ionicSideMenuDelegate.canDragContent(false);
      });
      $scope.$on('$ionicView.leave', function() {
        $ionicSideMenuDelegate.canDragContent(true);
      });

      $timeout(function() {
        if (typeof $localStorage.token !== 'undefined') {
          $scope.userInfo = $localStorage.userInfo;
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            var onlineState = networkState;
            $ionicLoading.show({
              template: 'Syncing data...'
            });
            getBulletin();
          });

          var isOnline = $cordovaNetwork.isOnline();

          if (isOnline) {
            getBulletin();
          } else {
            $state.go('app.dashboard');
          }
        } else {
          $scope.loginShow = true;
        }
        $ionicLoading.hide();
      }, 1000);

      function getUserWithLeavesAndPaySlips() {
        Me.include({
          0: 'applications',
          1: 'payslip',
        }).success(function(res) {
          $localStorage.notifications = res.data.notifications;
          delete res.data.notifications;
          $localStorage.userInfo = res.data;
          $scope.userInfo = $localStorage.userInfo;
          getBulletin();
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      }

      function getBulletin() {
        All.bulletinBoard({}).success(function(res) {
          $localStorage.bulletinBoard = res.data;
          $state.go('app.dashboard');
          $ionicLoading.hide();
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      }

      $scope.loginData = {};

      $scope.login = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
        Auth.login({
          email: $scope.loginData.email,
          password: $scope.loginData.password
        }).success(function(res) {
          $scope.loginShow = false;
          $localStorage.token = res.token;
          getUserWithLeavesAndPaySlips();
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      };

      $scope.logout = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
        Auth.logout(function() {
          $timeout(function() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $scope.loginShow = true;
            $state.go('app.login');
            $ionicLoading.hide();
          }, 1000);
        });
      };
    }
  ])

.controller('DashboardCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, $ionicLoading, $cordovaDialogs, $localStorage, Me) {
  $scope.userInfo = $localStorage.userInfo;
  $rootScope.bulletinBoard = $localStorage.bulletinBoard;

})


.controller('NotificationsCtrl', function($scope, $localStorage, Me) {

  $scope.notifications = $localStorage.notifications.data;

  $scope.doRefresh = function() {
    Me.include({}).success(function(res) {
      delete $localStorage.notifications;
      $localStorage.notifications = res.data.notifications;
      $scope.notifications = res.data.notifications.data;
      $scope.$broadcast('scroll.refreshComplete');
    }).error(function(e) {
      $timeout(function() {
        $ionicLoading.hide();
        $cordovaDialogs.alert(e.message, 'Whoops', 'OK')
          .then(function() {
            if (e.status_code == 401) {
              $state.go('app.login');
            }
          });
      }, 1000);
    });
  };
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


.controller('LeavesCtrl', function($scope, $localStorage, $timeout, $rootScope, $cordovaNetwork, $ionicLoading, $cordovaDialogs, $state, All) {
  $scope.leavesShow = false;

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
    leavesIfOnline();
  });

  var isOffline = $cordovaNetwork.isOffline();

  if (isOffline) {
    $timeout(function() {
      $rootScope.applications = $localStorage.userInfo.applications.data;
      $scope.leavesShow = true;
      $ionicLoading.hide();
    }, 1000);
  } else {
    leavesIfOnline();
  }

  function leavesIfOnline() {
    All.leaveApplication({}).success(function(res) {
      delete $localStorage.userInfo.applications;
      $localStorage.userInfo.applications = res;
      $rootScope.applications = $localStorage.userInfo.applications.data;

      $scope.total_pages = res.meta.pagination.total_pages;
      $scope.current_page = res.meta.pagination.current_page;

      $scope.leavesShow = true;
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
        $cordovaDialogs.alert(e.message, 'Whoops', 'OK')
          .then(function() {
            if (e.status_code == 401) {
              $state.go('app.login');
            }
          });
      }, 1000);
    });

    $scope.loadMore = function() {
      var page = parseInt($scope.current_page) + 1;
      All.leaveApplication({
        0: 'page=' + page
      }).success(function(res) {
        $timeout(function() {
          $scope.total_pages = res.meta.pagination.total_pages;
          $scope.current_page = res.meta.pagination.current_page;
          if ($scope.total_pages == $scope.current_page) {
            $scope.moreDataCanBeLoaded = function() {
              return false;
            };
          }
          $rootScope.applications = $rootScope.applications.concat(res.data);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
      }).error(function(e) {
        $timeout(function() {
          $ionicLoading.hide();
          $cordovaDialogs.alert(e.message, 'Whoops', 'OK')
            .then(function() {
              if (e.status_code == 401) {
                $state.go('app.login');
              }
            });
        }, 1000);
      });
    };
  }
})

.controller('LeaveCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $localStorage, $stateParams, $filter, $cordovaDialogs, $state) {
  $scope.leaveShow = false;

  $ionicLoading.show({
    template: 'Loading...'
  });

  var leaveId = $stateParams.leaveId;

  function fetchDetails(leaveId) {
    var found = $filter('filter')($rootScope.applications, {
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
      $cordovaDialogs.alert('Something went wrong', 'Whoops', 'OK')
        .then(function() {
          $state.go('app.leaves');
        });
    } else {
      $scope.leaveDetails = hasDetails;
      $scope.leaveShow = true;
    }
  }, 1000);
})

.controller('BulletinBoardCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $localStorage, $stateParams, $filter, $cordovaDialogs, $state) {
  $scope.bulletinShow = false;

  $ionicLoading.show({
    template: 'Loading...'
  });

  var bulletinId = $stateParams.bulletinId;

  function fetchDetails(bulletinId) {
    var found = $filter('filter')($rootScope.bulletinBoard, {
      id: bulletinId
    });

    if (found.length) {
      return found[0];
    } else {
      return 'NOTFOUND';
    }
  }

  var hasDetails = fetchDetails(bulletinId);

  // Simulate a delay
  $timeout(function() {
    $ionicLoading.hide();
    if (hasDetails == 'NOTFOUND') {
      $cordovaDialogs.alert('Something went wrong', 'Whoops', 'OK')
        .then(function() {
          $state.go('app.dashboard');
        });
    } else {
      $scope.bulletinDetails = hasDetails;
      $scope.bulletinShow = true;
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

.controller('PayslipsCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $localStorage, $cordovaNetwork, $cordovaDialogs, Me) {
  $scope.payslipsShow = false;

  $ionicLoading.show({
    template: 'Loading...'
  });

  // listen for Online event
  $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
    var onlineState = networkState;
    $ionicLoading.show({
      template: 'Syncing data...'
    });
    payslipsIfOnline();
  });

  var isOffline = $cordovaNetwork.isOffline();

  if (isOffline) {
    $timeout(function() {
      $rootScope.payslip = $localStorage.payslip;
      $scope.payslipsShow = true;
      $ionicLoading.hide();
    }, 1000);
  } else {
    payslipsIfOnline();
  }

  function payslipsIfOnline() {
    Me.include({
      0: 'payslip',
    }).success(function(res) {
      $localStorage.payslip = res.data.payslip.data;
      $rootScope.payslip = $localStorage.payslip;
      $scope.payslipsShow = true;
      $ionicLoading.hide();
    }).error(function(e) {
      $timeout(function() {
        $ionicLoading.hide();
        $cordovaDialogs.alert(e.message, 'Whoops', 'OK')
          .then(function() {
            if (e.status_code == 401) {
              $state.go('app.login');
            }
          });
      }, 1000);
    });
  }
})


.controller('PayslipCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $localStorage, $stateParams, $filter, $cordovaDialogs, $state) {
  $scope.payslipShow = false;

  $ionicLoading.show({
    template: 'Loading...'
  });

  var slipId = $stateParams.slipId;

  function fetchDetails(slipId) {
    var found = $filter('filter')($rootScope.payslip, {
      id: slipId
    });

    if (found.length) {
      return found[0];
    } else {
      return 'NOTFOUND';
    }
  }

  var hasDetails = fetchDetails(slipId);

  // Simulate a delay
  $timeout(function() {
    $ionicLoading.hide();
    if (hasDetails == 'NOTFOUND') {
      $cordovaDialogs.alert('Something went wrong', 'Whoops', 'OK')
        .then(function() {
          $state.go('app.payslips');
        });
    } else {
      $scope.payslipDetails = hasDetails;
      $scope.payslipShow = true;
    }
  }, 1000);
});
