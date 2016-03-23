angular.module('beehrm.controllers', [])
  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicHistory', '$cordovaDialogs', '$cordovaNetwork', 'Auth', 'All',
    function($scope, $rootScope, $state, $timeout, $localStorage, $ionicSideMenuDelegate, $ionicLoading, $ionicHistory, $cordovaDialogs, $cordovaNetwork, Auth, All) {
      $ionicLoading.show({
        template: 'Loading...'
      });

      $scope.$on('$ionicView.enter', function() {
        $ionicSideMenuDelegate.canDragContent(false);
      });
      $scope.$on('$ionicView.leave', function() {
        $ionicSideMenuDelegate.canDragContent(true);
      });

      $scope.isOnline = false;

      document.addEventListener("deviceready", function() {

        $scope.isOnline = $cordovaNetwork.isOnline();

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
          $scope.isOnline = true;
        });

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
          $scope.isOnline = false;
        });

        if (typeof $localStorage.userInfo !== 'undefined') {
          $rootScope.userInfo = $localStorage.userInfo;
          $rootScope.userInfo.image = ($localStorage.userInfo.image === 'data:image/png;base64,') ? 'img/profile_avatar.png' : $localStorage.userInfo.image;
          if (typeof $localStorage.deviceTokenRegistered == 'undefined') {
            Auth.deviceToken({
              deviceToken: $localStorage.deviceToken._token
            }).success(function(res) {
              $localStorage.deviceTokenRegistered = true;
              $state.go('app.dashboard', {}, {
                reload: true
              });
            }).error(function(e) {
              $timeout(function() {
                $ionicLoading.hide();
                $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
              }, 1000);
            });
          } else {
            if (typeof $localStorage.checkInOutDate === 'undefined') {
              $localStorage.checkInOutDate = null;
            }
            $localStorage.checkInOut = false;
            All.checkInOut({
              0: 'date=' + $localStorage.checkInOutDate
            }).success(function(res) {
              if (res === 'CHECKINOUTENABLE') {
                $localStorage.checkInOut = true;
              }

              if (typeof $localStorage.checkInOutEvent === 'undefined' || $localStorage.checkInOutEvent === 'CHECKEDIN') {
                $scope.checkInOutLabel = 'CHECK IN';
              } else {
                $scope.checkInOutLabel = 'CHECK OUT';
              }

              $state.go('app.dashboard', {}, {
                reload: true
              });
            }).error(function(e) {
              $timeout(function() {
                $ionicLoading.hide();
                $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
                $state.go('app.dashboard', {}, {
                  reload: true
                });
              }, 1000);
            });
          }
        } else if (typeof $localStorage.accessData !== 'undefined') {
          $state.go('app.login', {}, {
            reload: true
          });
        } else {
          $scope.accessShow = true;
        }

        $timeout(function() {
          $ionicLoading.hide();
        }, 1000);

        $scope.accessData = {};

        $scope.access = function() {
          if ($scope.isOnline) {
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
          } else {
            $cordovaDialogs.alert('Please check your internet connection', 'Whoops', 'OK');
          }
        };

        $scope.logout = function() {
          $cordovaDialogs.confirm('Wanna LogOut?', 'BeeHRM', ['Yes', 'Cancel'])
            .then(function(buttonIndex) {
              if (buttonIndex == 1) {
                $ionicLoading.show({
                  template: 'Loading...'
                });
                Auth.logout({}).success(function(res) {
                  delete $localStorage.token;
                  delete $localStorage.userInfo;
                  delete $localStorage.notifications;
                  delete $localStorage.payslip;
                  delete $localStorage.bulletinBoard;
                  delete $localStorage.deviceTokenRegistered;
                  $ionicHistory.clearCache();
                  $ionicHistory.clearHistory();
                  $scope.loginShow = true;
                  $state.go('app.login', {}, {
                    reload: true
                  });
                  $ionicLoading.hide();
                }).error(function(e) {
                  $timeout(function() {
                    $ionicLoading.hide();
                    $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
                  }, 1000);
                });
              }
            });
        };

        $scope.checkIn = function(argument) {
          if (typeof $localStorage.checkInOutEvent === 'undefined' || $localStorage.checkInOutEvent === 'CHECKEDIN') {
            $scope.condition = 'Check-In';
          } else {
            $scope.condition = 'Check-Out';
          }
          $cordovaDialogs.confirm('Wanna ' + $scope.condition + '?', 'BeeHRM', ['Yes', 'Cancel'])
            .then(function(buttonIndex) {
              if (buttonIndex == 1) {
                $ionicLoading.show({
                  template: 'Loading...'
                });
                if ($scope.isOnline) {
                  if ($scope.condition === 'Check-In') {
                    All.checkInOutRegister({
                      inOutMode: 0,
                      date: $localStorage.checkInOutDate
                    }).success(function(res) {
                      $ionicLoading.hide();
                      if (res === 'CHECKINOUTDISABLE') {
                        $cordovaDialogs.alert('You are already checked out for today', 'Whoops', 'OK');
                      } else {
                        $localStorage.checkInOutEvent = 'CHECKEDOUT';
                        $scope.checkInOutLabel = 'CHECK OUT';
                        $cordovaDialogs.alert('You are now Checked In', 'Success', 'OK');
                      }
                    }).error(function(e) {
                      $timeout(function() {
                        $ionicLoading.hide();
                        $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
                      }, 1000);
                    });
                  } else {
                    All.checkInOutRegister({
                      inOutMode: 1,
                      date: $localStorage.checkInOutDate
                    }).success(function(res) {
                      $ionicLoading.hide();
                      if (res === 'CHECKINOUTDISABLE') {
                        $cordovaDialogs.alert('You are already checked out for today', 'Whoops', 'OK');
                      } else {
                        $localStorage.checkInOutDate = res;
                        $localStorage.checkInOutEvent = 'CHECKEDIN';
                        $scope.checkInOutLabel = 'CHECK IN';
                        $localStorage.checkInOut = false;
                        $cordovaDialogs.alert('You are now Checked Out', 'Success', 'OK');
                      }

                    }).error(function(e) {
                      $timeout(function() {
                        $ionicLoading.hide();
                        $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
                      }, 1000);
                    });
                  }
                } else {
                  $ionicLoading.hide();
                  $cordovaDialogs.alert('Please check your internet connection', 'Whoops', 'OK');
                }
              }
            });
        };

      }, false);

    }
  ])

.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$ionicLoading', '$cordovaDialogs', '$cordovaNetwork', 'Auth', 'Me', 'All',
  function($scope, $rootScope, $state, $timeout, $localStorage, $ionicLoading, $cordovaDialogs, $cordovaNetwork, Auth, Me, All) {
    $ionicLoading.show({
      template: 'Loading...'
    });

    $scope.isOnline = false;

    document.addEventListener("deviceready", function() {

      $scope.isOnline = $cordovaNetwork.isOnline();

      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        $scope.isOnline = true;
        if (typeof $localStorage.token !== 'undefined') {
          $ionicLoading.show({
            template: 'Please wait...'
          });
          getBulletin();
        }
      });

      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        $scope.isOnline = false;
      });

      $timeout(function() {
        if (typeof $localStorage.token !== 'undefined') {
          $scope.userInfo = $localStorage.userInfo;
          if ($scope.isOnline) {
            getBulletin();
          } else {
            $state.go('app.dashboard');
          }
        } else {
          $scope.loginShow = true;
        }
        $ionicLoading.hide();
      }, 1000);

      function saveDeviceToken() {
        Auth.deviceToken({
          deviceToken: $localStorage.deviceToken._token
        }).success(function(res) {
          $localStorage.deviceTokenRegistered = true;
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      }

      function mobileAttendance() {
        All.checkInOut({}).success(function(res) {
          console.log('checkInOut ' + res);
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      }

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
        if ($scope.isOnline) {
          $ionicLoading.show({
            template: 'Loading...'
          });
          Auth.login({
            email: $scope.loginData.email,
            password: $scope.loginData.password
          }).success(function(res) {
            $scope.loginShow = false;
            $localStorage.token = res.token;
            if (typeof $localStorage.deviceToken._token !== 'undefined') {
              saveDeviceToken();
              mobileAttendance();
            }
            getUserWithLeavesAndPaySlips();
          }).error(function(e) {
            $timeout(function() {
              $ionicLoading.hide();
              $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
            }, 1000);
          });
        } else {
          $cordovaDialogs.alert('Please check your internet connection', 'Whoops', 'OK');
        }
      };

    }, false);
  }
])

.controller('DashboardCtrl', ['$scope', '$rootScope', '$timeout', '$localStorage', '$ionicLoading', '$cordovaDialogs', '$cordovaNetwork', 'All', 'Me',
  function($scope, $rootScope, $timeout, $localStorage, $ionicLoading, $cordovaDialogs, $cordovaNetwork, All, Me) {
    $scope.isOffline = true;
    document.addEventListener("deviceready", function() {
      $scope.isOffline = $cordovaNetwork.isOffline();
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        $scope.isOffline = false;
        if (typeof $localStorage.token !== 'undefined') {
          $ionicLoading.show({
            template: 'Syncing data...'
          });
          getBulletin();
        }
      });

      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        $scope.isOffline = true;
      });

      if (typeof $localStorage.userInfo !== 'undefined') {
        if ($scope.isOffline) {
          $rootScope.bulletinBoard = $localStorage.bulletinBoard;
        } else {
          if (typeof $localStorage.userInfo == 'undefined') {
            Me.include({
              0: 'applications',
              1: 'payslip',
            }).success(function(res) {
              $localStorage.notifications = res.data.notifications;
              delete res.data.notifications;
              $localStorage.userInfo = res.data;
              $rootScope.userInfo = $localStorage.userInfo;
              $rootScope.userInfo.image = ($localStorage.userInfo.image === 'data:image/png;base64,') ? 'img/profile_avatar.png' : $localStorage.userInfo.image;
            }).error(function(e) {
              $timeout(function() {
                $ionicLoading.hide();
                $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
              }, 1000);
            });
          } else {
            $rootScope.userInfo = $localStorage.userInfo;
            $rootScope.userInfo.image = ($localStorage.userInfo.image === 'data:image/png;base64,') ? 'img/profile_avatar.png' : $localStorage.userInfo.image;
          }
          getBulletin();
        }
      }

    }, false);

    function getBulletin() {
      if (typeof $localStorage.accessData !== 'undefined') {
        $ionicLoading.show({
          template: 'Loading...'
        });
        All.bulletinBoard({}).success(function(res) {
          $localStorage.bulletinBoard = res.data;
          $rootScope.bulletinBoard = res.data;
          $ionicLoading.hide();
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      }
    }
  }
])

.controller('NotificationsCtrl', ['$scope', '$state', '$localStorage', 'Me',
  function($scope, $state, $localStorage, Me) {

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
                delete $localStorage.token;
                $state.go('app.login');
              }
            });
        }, 1000);
      });
    };
  }
])

.controller('EventsCtrl', ['$scope', '$timeout', '$localStorage', '$ionicLoading',
  function($scope, $timeout, $localStorage, $ionicLoading) {
    $timeout(function() {
      if (typeof $localStorage.events !== 'undefined') {
        $scope.events = $localStorage.events;
      } else {
        $ionicLoading.hide();
        $state.go('app.dashboard');
      }
      $ionicLoading.hide();
    }, 1000);
  }
])

.controller('CheckEventCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$cordovaNetwork', '$cordovaDialogs', '$localStorage', '$ionicLoading', '$filter', '$state', 'All',
  function($scope, $rootScope, $ionicModal, $timeout, $cordovaNetwork, $cordovaDialogs, $localStorage, $ionicLoading, $filter, $state, All) {
    document.addEventListener("deviceready", function() {
      $scope.isOffline = $cordovaNetwork.isOffline();

      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        $scope.isOffline = false;
      });

      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        $scope.isOffline = true;
      });

      $scope.checkEventData = {};

      // Create the leave modal that we will use later
      $ionicModal.fromTemplateUrl('templates/dist/events.check.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the leave modal to close it
      $scope.closeCheckEvent = function() {
        $scope.modal.hide();
      };

      // Open the leave modal
      $scope.openCheckEvent = function() {
        // $cordovaDialogs.alert('This section will be activated soon', 'Sorry :(', 'OK');
        $scope.modal.show();
      };

      // Perform the leave action when the user submits the leave form
      $scope.checkEvents = function() {
        if ($scope.isOffline === false) {
          $ionicLoading.show({
            template: 'Loading...'
          });
          All.checkLeaveApplication({
            0: 'from=' + $scope.checkEventData.startDate + '&to=' + $scope.checkEventData.endDate
          }).success(function(res) {
            $timeout(function() {
              $ionicLoading.hide();
              if (res.data.length === 0) {
                $cordovaDialogs.alert('No events found in given dates', 'BeeHRM', 'OK')
                  .then(function() {
                    $scope.checkEventData = {
                      'startDate': $scope.checkEventData.startDate,
                      'endDate': $scope.checkEventData.startDate
                    };
                  });
              } else {
                $ionicLoading.show({
                  template: 'Loading...'
                });
                $localStorage.events = res.data;
                $scope.modal.hide();
                $state.go('app.events');
              }

            }, 50);
          }).error(function(e) {
            $timeout(function() {
              $ionicLoading.hide();
              $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
            }, 1000);
          });
        } else {
          $ionicLoading.hide();
          $cordovaDialogs.alert('Please check your internet connection', 'Whoops', 'OK')
            .then(function() {
              $state.go('app.dashboard');
            });
        }
      };

      $scope.startDatepickerObject = {
        titleLabel: 'Select Date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        setButtonType: 'button-accent button-outline', //Optional
        todayButtonType: 'button-accent button-outline', //Optional
        closeButtonType: 'button-accent button-outline', //Optional
        mondayFirst: true, //Optional
        templateType: 'popup', //Optional
        modalHeaderColor: 'bar-primary', //Optional
        modalFooterColor: 'bar-primary', //Optional
        callback: function(val) { //Mandatory
          startDatePickerCallback(val);
        }
      };

      $scope.startDate = new Date();
      $scope.checkEventData.startDate = $filter('date')($scope.startDate, "yyyy-MM-dd", "+0545");

      var startDatePickerCallback = function(val) {
        if (typeof(val) === 'undefined') {
          console.log('No date selected');
        } else {
          $scope.startDate = val;
          $scope.checkEventData.startDate = $filter('date')($scope.startDate, "yyyy-MM-dd", "+0545");
          console.log('Selected date is : ', val);
        }
      };

      $scope.endDatepickerObject = {
        titleLabel: 'Select Date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        setButtonType: 'button-accent button-outline', //Optional
        todayButtonType: 'button-accent button-outline', //Optional
        closeButtonType: 'button-accent button-outline', //Optional
        mondayFirst: true, //Optional
        templateType: 'popup', //Optional
        modalHeaderColor: 'bar-primary', //Optional
        modalFooterColor: 'bar-primary', //Optional
        callback: function(val) { //Mandatory
          endDatePickerCallback(val);
        }
      };

      $scope.endDate = new Date();
      $scope.checkEventData.endDate = $filter('date')($scope.endDate, "yyyy-MM-dd", "+0545");

      var endDatePickerCallback = function(val) {
        if (typeof(val) === 'undefined') {
          console.log('No date selected');
        } else {
          $scope.endDate = val;
          $scope.checkEventData.endDate = $filter('date')($scope.endDate, "yyyy-MM-dd", "+0545");
          console.log('Selected date is : ', val);
        }
      };
    }, false);
  }
])

.controller('LeavesCtrl', ['$scope', '$rootScope', '$state', '$localStorage', '$timeout', '$cordovaNetwork', '$ionicLoading', '$cordovaDialogs', 'All',
  function($scope, $rootScope, $state, $localStorage, $timeout, $cordovaNetwork, $ionicLoading, $cordovaDialogs, All) {
    $scope.leavesShow = false;

    $ionicLoading.show({
      template: 'Loading...'
    });

    $scope.moreDataCanBeLoaded = function() {
      return false;
    };

    $scope.isOffline = $cordovaNetwork.isOffline();
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
      $scope.isOffline = false;
      $ionicLoading.show({
        template: 'Syncing data...'
      });
      leavesIfOnline();
    });

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
      $scope.isOffline = true;
    });

    if ($scope.isOffline) {
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
                delete $localStorage.token;
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
                  delete $localStorage.token;
                  $state.go('app.login');
                }
              });
          }, 1000);
        });
      };
    }
  }
])

.controller('LeaveCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$timeout', '$localStorage', '$stateParams', '$filter', '$cordovaDialogs',
  function($scope, $rootScope, $state, $ionicLoading, $timeout, $localStorage, $stateParams, $filter, $cordovaDialogs) {
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

    $timeout(function() {
      $ionicLoading.hide();
      if (hasDetails == 'NOTFOUND') {
        $cordovaDialogs.alert('Something went wrong', 'Whoops', 'OK')
          .then(function() {
            $state.go('app.leaves');
          });
      } else {
        $scope.leaveDetails = hasDetails;
        $scope.leaveDetails.approver_photo = ($scope.leaveDetails.approver_photo === 'data:image/png;base64,') ? 'img/avatar.jpg' : $scope.leaveDetails.approver_photo;
        $scope.leaveShow = true;
      }
    }, 1000);
  }
])

.controller('LeavesBalanceCtrl', ['$scope', '$rootScope', '$timeout', '$localStorage', '$ionicLoading', '$cordovaDialogs', '$cordovaNetwork', 'All', 'Me',
  function($scope, $rootScope, $timeout, $localStorage, $ionicLoading, $cordovaDialogs, $cordovaNetwork, All, Me) {
    $scope.isOffline = true;
    document.addEventListener("deviceready", function() {
      $scope.isOffline = $cordovaNetwork.isOffline();
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        $scope.isOffline = false;
        if (typeof $localStorage.token !== 'undefined') {
          $ionicLoading.show({
            template: 'Syncing data...'
          });
          getLeavebalance();
        }
      });

      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        $scope.isOffline = true;
      });

      if (typeof $localStorage.token !== 'undefined') {
        if ($scope.isOffline) {
          $scope.leaveBalance = $localStorage.leaveBalance;
        } else {
          getLeavebalance();
        }
      }

    }, false);

    function getLeavebalance() {
      if (typeof $localStorage.accessData !== 'undefined') {
        $ionicLoading.show({
          template: 'Loading...'
        });
        All.leaveBalance({}).success(function(res) {
          $localStorage.leaveBalance = res.data;
          $scope.leaveBalance = res.data;
          $ionicLoading.hide();
        }).error(function(e) {
          $timeout(function() {
            $ionicLoading.hide();
            $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
          }, 1000);
        });
      }
    }
  }
])

.controller('BulletinBoardCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$timeout', '$localStorage', '$stateParams', '$filter', '$cordovaDialogs',
  function($scope, $rootScope, $state, $ionicLoading, $timeout, $localStorage, $stateParams, $filter, $cordovaDialogs) {
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
  }
])

.controller('ApplyLeaveCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$localStorage', '$cordovaNetwork', '$cordovaDialogs', '$ionicLoading', '$filter', 'All',
  function($scope, $rootScope, $ionicModal, $timeout, $localStorage, $cordovaNetwork, $cordovaDialogs, $ionicLoading, $filter, All) {
    document.addEventListener("deviceready", function() {
      $localStorage.disableApplyLeave = true;
      $scope.isOffline = $cordovaNetwork.isOffline();
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        $scope.isOffline = false;
      });

      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        $scope.isOffline = true;
      });

      $scope.leaveDaysType = {
        checked: false
      };
      $scope.endDateHide = false;
      $scope.whichHalfShow = false;

      $scope.expandText = function() {
        var element = document.getElementById("txtnotes");
        element.style.height = element.scrollHeight + "px";
      };
      if (typeof $localStorage.accessData !== 'undefined') {
        if ($scope.isOffline && typeof $localStorage.leaveTypeOptions !== 'undefined') {
          $scope.leaveTypeOptions = $localStorage.leaveTypeOptions;
          setupLeaveApplyForm($scope.leaveTypeOptions);
          $localStorage.disableApplyLeave = false;
        } else {
          $ionicLoading.show({
            template: 'Loading...'
          });
          All.getLeaveTypes({}).success(function(res) {
            $localStorage.leaveTypeOptions = res.data;
            $scope.leaveTypeOptions = res.data;
            if (typeof $scope.leaveTypeOptions !== 'undefined' && $scope.leaveTypeOptions.length > 0) {
              setupLeaveApplyForm($scope.leaveTypeOptions);
              $localStorage.disableApplyLeave = false;
            } else {
              setupLeaveApplyForm([]);
            }
            $ionicLoading.hide();
          }).error(function(e) {
            if (typeof $localStorage.leaveTypeOptions !== 'undefined') {
              $scope.leaveTypeOptions = $localStorage.leaveTypeOptions;
              setupLeaveApplyForm($scope.leaveTypeOptions);
              $localStorage.disableApplyLeave = false;
            } else {
              $timeout(function() {
                $localStorage.disableApplyLeave = true;
                $ionicLoading.hide();
              }, 100);
            }

          });
        }
      }

    }, false);

    function setupLeaveApplyForm(leaveTypeOptions) {
      $scope.halfTypeOptions = [{
        name: "First Half",
        id: 'F'
      }, {
        name: "Second Half",
        id: 'S'
      }];
      $scope.leaveData = {
        'leaveType': leaveTypeOptions[0],
        'halfType': $scope.halfTypeOptions[0],
        'subject': "",
        'description': ""
      };

      $scope.leaveData.leave_days_type = 'F';

      $scope.leaveDaysTypeChange = function() {
        if ($scope.leaveData.leaveDaysType.checked === true) {
          $scope.endDateHide = true;
          $scope.whichHalfShow = true;
          $scope.leaveData.leave_days_type = 'P';
        } else {
          $scope.endDateHide = false;
          $scope.whichHalfShow = false;
          $scope.leaveData.leave_days_type = 'F';
        }
      };

      // Create the leave modal that we will use later
      $ionicModal.fromTemplateUrl('templates/dist/leave.apply.html', {
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
        if ($localStorage.disableApplyLeave === false) {
          $scope.modal.show();
        } else {
          $cordovaDialogs.alert('You cannot apply leave right now. Please contact HR department', 'Whoops', 'OK');
        }
      };

      // Perform the leave action when the user submits the leave form
      $scope.doLeave = function() {
        if ($scope.leaveData.subject.length === 0) {
          $cordovaDialogs.alert("Subject field is required", 'Whoops', 'OK');
        } else if ($scope.leaveData.description.length === 0) {
          $cordovaDialogs.alert("Description field is required", 'Whoops', 'OK');
        } else {
          $cordovaDialogs.confirm('Wanna submit?', 'BeeHRM', ['Yes', 'Cancel'])
            .then(function(buttonIndex) {
              if (buttonIndex == 1) {
                $ionicLoading.show({
                  template: 'Loading...'
                });
                if ($scope.isOffline === false) {
                  All.submitLeaveApplication({
                    leave_days_type: $scope.leaveData.leave_days_type,
                    subject: $scope.leaveData.subject,
                    leave_type: $scope.leaveData.leaveType.id,
                    leave_days_part: $scope.leaveData.halfType.id,
                    startdt: $scope.leaveData.startDate,
                    enddt: $scope.leaveData.endDate,
                    desc: $scope.leaveData.description
                  }).success(function(res) {
                    $timeout(function() {
                      $ionicLoading.hide();
                      $cordovaDialogs.alert(res, 'Success', 'OK')
                        .then(function() {
                          $scope.leaveData.leave_days_type = 'F';
                          $scope.leaveData = {
                            'leaveType': leaveTypeOptions[0],
                            'halfType': $scope.halfTypeOptions[0],
                            'subject': "",
                            'description': "",
                            'startDate': $scope.leaveData.startDate,
                            'endDate': $scope.leaveData.startDate
                          };
                          $scope.modal.hide();
                        });
                    }, 50);
                  }).error(function(e) {
                    $timeout(function() {
                      $ionicLoading.hide();
                      $cordovaDialogs.alert(e.message, 'Whoops', 'OK');
                    }, 1000);
                  });
                } else {
                  $ionicLoading.hide();
                  $cordovaDialogs.alert('Please check your internet connection', 'Whoops', 'OK');
                }
              }
            });
        }

      };

      $scope.startDatepickerObject = {
        titleLabel: 'Select Date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        setButtonType: 'button-accent button-outline', //Optional
        todayButtonType: 'button-accent button-outline', //Optional
        closeButtonType: 'button-accent button-outline', //Optional
        mondayFirst: true, //Optional
        templateType: 'popup', //Optional
        modalHeaderColor: 'bar-primary', //Optional
        modalFooterColor: 'bar-primary', //Optional
        callback: function(val) { //Mandatory
          startDatePickerCallback(val);
        }
      };

      $scope.startDate = new Date();
      $scope.leaveData.startDate = $filter('date')($scope.startDate, "yyyy-MM-dd", "+0545");

      var startDatePickerCallback = function(val) {
        if (typeof(val) === 'undefined') {
          console.log('No date selected');
        } else {
          $scope.startDate = val;
          $scope.leaveData.startDate = $filter('date')($scope.startDate, "yyyy-MM-dd", "+0545");
          console.log('Selected date is : ', val);
        }
      };

      $scope.endDatepickerObject = {
        titleLabel: 'Select Date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        setButtonType: 'button-accent button-outline', //Optional
        todayButtonType: 'button-accent button-outline', //Optional
        closeButtonType: 'button-accent button-outline', //Optional
        mondayFirst: true, //Optional
        templateType: 'popup', //Optional
        modalHeaderColor: 'bar-primary', //Optional
        modalFooterColor: 'bar-primary', //Optional
        callback: function(val) { //Mandatory
          endDatePickerCallback(val);
        }
      };

      $scope.endDate = new Date();
      $scope.leaveData.endDate = $filter('date')($scope.endDate, "yyyy-MM-dd", "+0545");

      var endDatePickerCallback = function(val) {
        if (typeof(val) === 'undefined') {
          console.log('No date selected');
        } else {
          $scope.endDate = val;
          $scope.leaveData.endDate = $filter('date')($scope.endDate, "yyyy-MM-dd", "+0545");
          console.log('Selected date is : ', val);
        }
      };
    }
  }
])

.controller('PayslipsCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$timeout', '$localStorage', '$cordovaNetwork', '$cordovaDialogs', 'Me',
  function($scope, $rootScope, $state, $ionicLoading, $timeout, $localStorage, $cordovaNetwork, $cordovaDialogs, Me) {
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
                delete $localStorage.token;
                $state.go('app.login');
              }
            });
        }, 1000);
      });
    }
  }
])


.controller('PayslipCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$timeout', '$localStorage', '$stateParams', '$filter', '$cordovaDialogs',
  function($scope, $rootScope, $state, $ionicLoading, $timeout, $localStorage, $stateParams, $filter, $cordovaDialogs) {
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
  }
]);
