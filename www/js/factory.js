angular.module('beehrm.factories', [])
    .factory('Auth', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getClaimsFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var tokenClaims = getClaimsFromToken();

        return {
            login: function(input) {
                return $http({
                    url: urls.BASE_API + '/login',
                    method: 'POST',
                    dataType: 'json',
                    data: input,
                    headers: {
                         "Content-Type": "application/json"
                    }
                });
            },
            logout: function(success) {
                tokenClaims = {};
                delete $localStorage.token;
                success();
            },
            getTokenClaims: function() {
                return tokenClaims;
            }
        };
    }]);
