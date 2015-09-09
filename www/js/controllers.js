angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };


})

.controller('DashboardCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate) {

    $scope.items = [];
    for (var i = 0; i < 10; i++) {
        (function() {
            var j = i;
            $timeout(function() {
                $scope.items[j] = {
                    title: 'Office Runs this Sunday 25-Jan-2015',
                    dt: '2015-January-25',
                    id: j
                };
                $ionicScrollDelegate.resize();
            }, j * 800);
        })();
    }
})


.controller('NotificationsCtrl', function($scope, $rootScope) {

    $scope.items = [{
        title: 'Your leave is approved',
        id: 1
    }, {
        title: 'Appraisal submitted by Hari Sadhu',
        id: 2
    }, {
        title: 'Dubstep is done',
        id: 3
    }, {
        title: 'Indie happend',
        id: 4
    }, {
        title: 'Rap from your friend',
        id: 5
    }, {
        title: 'Cowbell is not cowboy',
        id: 6
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
        id: 1
    }, {
        title: 'Sick Leave',
        status: 'P',
        id: 2
    }, {
        title: 'Brother\'s Marriage',
        status: 'A',
        id: 3
    }, {
        title: 'Sick Leave',
        status: 'A',
        id: 4
    }, {
        title: 'Sick Leave',
        status: 'A',
        id: 5
    }, {
        title: 'Personal Work',
        status: 'R',
        id: 6
    }, {
        title: 'Sick Leave',
        status: 'A',
        id: 7
    }, {
        title: 'Brother\'s Marriage',
        status: 'R',
        id: 8
    }, {
        title: 'Sick Leave',
        status: 'A',
        id: 9
    }, {
        title: 'Sick Leave',
        status: 'R',
        id: 10
    }, {
        title: 'Personal Work',
        status: 'A',
        id: 11
    }];


})

.controller('LeaveCtrl', function($scope) {

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
;
