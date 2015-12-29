angular.module('beehrm.factories', [])
  .factory('Auth', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
    return {
      access: function(input) {
        return $http({
          url: urls.BASE_API,
          method: 'POST',
          dataType: 'json',
          data: input,
          headers: {
            "Content-Type": "application/json"
          }
        });
      },
      login: function(input) {
        var apiUrl = $localStorage.accessData.org_app_url;
        return $http({
          url: apiUrl + '/login',
          method: 'POST',
          dataType: 'json',
          data: input,
          headers: {
            "Content-Type": "application/x.vdn.v1+json"
          }
        });
      },
      logout: function(success) {
        delete $localStorage.accessData;
        delete $localStorage.token;
        delete $localStorage.userInfo;
        delete $localStorage.notifications;
        delete $localStorage.payslip;
        delete $localStorage.bulletinBoard;
        success();
      }
    };
  }])

.factory('Me', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
  return {
    basic: function(input) {
      var apiUrl = $localStorage.accessData.org_app_url;
      return $http({
        url: apiUrl + '/me',
        method: 'GET',
        dataType: 'json',
        headers: {
          "Content-Type": "application/x.vdn.v1+json",
          "Authorization": "bearer " + $localStorage.token
        }
      });
    },
    include: function(input) {
      var apiUrl = $localStorage.accessData.org_app_url;
      var include = '';
      angular.forEach(input, function(value, key) {
        include += value + ",";
      });
      include = include.substring(0, (include.length - 1));
      return $http({
        url: apiUrl + '/me?include=' + include,
        method: 'GET',
        dataType: 'json',
        headers: {
          "Content-Type": "application/x.vdn.v1+json",
          "Authorization": "bearer " + $localStorage.token
        }
      });
    }
  };
}])

.factory('All', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
  return {
    leaveApplication: function(input) {
      var apiUrl = $localStorage.accessData.org_app_url;
      var include = input[0];
      return $http({
        url: apiUrl + '/leave-application/?'+include,
        method: 'GET',
        dataType: 'json',
        headers: {
          "Content-Type": "application/x.vdn.v1+json",
          "Authorization": "bearer " + $localStorage.token
        }
      });
    },
    bulletinBoard: function(input) {
      var apiUrl = $localStorage.accessData.org_app_url;
      return $http({
        url: apiUrl + '/bulletin-board',
        method: 'GET',
        dataType: 'json',
        headers: {
          "Content-Type": "application/x.vdn.v1+json",
          "Authorization": "bearer " + $localStorage.token
        }
      });
    }
  };
}])

;
