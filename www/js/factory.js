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
        return $http({
          url: $localStorage.accessData.org_app_url + '/login',
          method: 'POST',
          dataType: 'json',
          data: input,
          headers: {
            "Content-Type": "application/x.vdn.v1+json"
          }
        });
      },
      deviceToken: function(input) {
        return $http({
          url: $localStorage.accessData.org_app_url + '/store-device-token',
          method: 'POST',
          dataType: 'json',
          data: input,
          headers: {
            "Content-Type": "application/x.vdn.v1+json"
          }
        });
      },
      logout: function(input) {
        $http({
          url: $localStorage.accessData.org_app_url + '/delete-device-token',
          method: 'GET',
          dataType: 'json',
          headers: {
            "Content-Type": "application/x.vdn.v1+json",
            "Authorization": "bearer " + $localStorage.token
          }
        });
        return $http({
          url: $localStorage.accessData.org_app_url + '/logout',
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

.factory('Me', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
  return {
    basic: function(input) {
      return $http({
        url: $localStorage.accessData.org_app_url + '/me',
        method: 'GET',
        dataType: 'json',
        headers: {
          "Content-Type": "application/x.vdn.v1+json",
          "Authorization": "bearer " + $localStorage.token
        }
      });
    },
    include: function(input) {
      var include = '';
      angular.forEach(input, function(value, key) {
        include += value + ",";
      });
      included = include.substring(0, (include.length - 1));
      include = (typeof included == 'undefined') ? '' : included;
      return $http({
        url: $localStorage.accessData.org_app_url + '/me?include=' + include,
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
      var include = (typeof input[0] == 'undefined') ? '' : input[0];
      return $http({
        url: $localStorage.accessData.org_app_url + '/leave-application/?'+include,
        method: 'GET',
        dataType: 'json',
        headers: {
          "Content-Type": "application/x.vdn.v1+json",
          "Authorization": "bearer " + $localStorage.token
        }
      });
    },
    bulletinBoard: function(input) {
      return $http({
        url: $localStorage.accessData.org_app_url + '/bulletin-board',
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
