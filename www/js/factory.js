angular.module('beehrm.factories', [])
  .factory('Auth', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
    return {
      login: function(input) {
        return $http({
          url: urls.BASE_API + '/login',
          method: 'POST',
          dataType: 'json',
          data: input,
          headers: {
            "Content-Type": "application/x.vdn.v1+json"
          }
        });
      },
      logout: function(success) {
        delete $localStorage.token;
        delete $localStorage.userInfo;
        delete $localStorage.notifications;
        success();
      }
    };
  }])

.factory('Me', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
  return {
    basic: function(input) {
      return $http({
        url: urls.BASE_API + '/me',
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
      include = include.substring(0, (include.length - 1));
      return $http({
        url: urls.BASE_API + '/me?include=' + include,
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
      var include = input[0];
      return $http({
        url: urls.BASE_API + '/leave-application/?'+include,
        method: 'GET',
        dataType: 'json',
        headers: {
          "Content-Type": "application/x.vdn.v1+json",
          "Authorization": "bearer " + $localStorage.token
        }
      });
    },

  };
}])

;
