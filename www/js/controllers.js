angular.module('beehrm.controllers', [])
    .controller('AppCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$localStorage', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPopup', 'Auth', 'Me',
        function($rootScope, $scope, $state, $timeout, $localStorage, $ionicSideMenuDelegate, $ionicLoading, $ionicPopup, Auth, Me) {
            $scope.$on('$ionicView.enter', function() {
                $ionicSideMenuDelegate.canDragContent(false);
            });
            $scope.$on('$ionicView.leave', function() {
                $ionicSideMenuDelegate.canDragContent(true);
            });

            function getUserBasicInfo(token) {
                if (typeof token !== 'undefined') {
                    Me.include({
                        0: 'applications',
                        1: 'payslip',
                    }).success(function(res) {
                        // Save To LocalStorage
                        $localStorage.notifications = res.data.notifications;
                        delete res.data.notifications;
                        $localStorage.userInfo = res.data;

                        $state.go('app.dashboard');

                        $ionicLoading.hide();
                    }).error(function(e) {
                        $timeout(function() {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Crappola',
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

            $scope.loginData = {};

            $scope.login = function() {
                $ionicLoading.show({
                    template: 'Loading...'
                });

                Auth.login({
                    email: $scope.loginData.email,
                    password: $scope.loginData.password
                }).success(function(res) {
                    $localStorage.token = res.token;
                    getUserBasicInfo($localStorage.token);
                }).error(function(e) {
                    $timeout(function() {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Crappola',
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
                Auth.logout(function() {
                    $state.go('app.login');
                });
            };
        }
    ])

.controller('DashboardCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, $ionicLoading, $ionicPopup, $localStorage, Me) {

    var token = $localStorage.token;
    if (typeof token !== 'undefined') {
        $scope.userInfo = $localStorage.userInfo;
    }

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
            }, j * 800);
        })();
    }

    // Api.checkIn({
    //     movie_name: $scope.movie.movieName,
    //     movie_review: $scope.movie.movieReview,
    //     movie_rating: $scope.movie.movieRating,
    //     user_id: results[0].user_id
    // }).success(function(data) {
    //     // do something
    // }).error(function(e) {
    //     // do something
    // });
})


.controller('NotificationsCtrl', function($scope, $rootScope) {

    $scope.items = [{
        title: 'Your leave has been approved.',
        id: 1
    }, {
        title: 'New poll has been opened.',
        id: 2
    }, {
        title: 'Your leave has been approved.',
        id: 3
    }, {
        title: 'Your salary has been released.',
        id: 4
    }, {
        title: 'Your salary has been released.',
        id: 5
    }, {
        title: 'Your leave has been approved.',
        id: 6
    }];

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


.controller('LeavesCtrl', function($scope) {

    $scope.expandText = function() {
        var element = document.getElementById("txtnotes");
        element.style.height = element.scrollHeight + "px";
    };

    $scope.items = [{
        title: 'Personal Issue',
        status: 'P',
        day: '22',
        month: 'Jan',
        id: 1
    }, {
        title: 'Sick Leave',
        status: 'P',
        day: '15',
        month: 'Jan',
        id: 2
    }, {
        title: 'Brother\'s Marriage',
        status: 'A',
        day: '06',
        month: 'Dec',
        id: 3
    }, {
        title: 'Sick Leave',
        status: 'A',
        day: '06',
        month: 'Oct',
        id: 4
    }, {
        title: 'Sick Leave',
        status: 'A',
        day: '08',
        month: 'Sep',
        id: 5
    }, {
        title: 'Personal Work',
        status: 'R',
        day: '14',
        month: 'Jul',
        id: 6
    }, {
        title: 'Sick Leave',
        status: 'A',
        day: '11',
        month: 'Jun',
        id: 7
    }, {
        title: 'Brother\'s Marriage',
        status: 'R',
        day: '09',
        month: 'Apr',
        id: 8
    }, {
        title: 'Sick Leave',
        status: 'A',
        day: '18',
        month: 'Mar',
        id: 9
    }, {
        title: 'Sick Leave',
        status: 'A',
        day: '11',
        month: 'Mar',
        id: 10
    }];


})

.controller('LeaveCtrl', function($scope, $ionicLoading, $timeout) {
    $scope.show = false;
    $ionicLoading.show({
        template: 'Loading...'
    });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
        $ionicLoading.hide();
        $scope.show = true;
    }, 1000);
})

.controller('ApplyLeaveCtrl', function($scope, $ionicModal, $timeout) {

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
