angular.module('beehrm.services', [])
  .service('Navigation', ['$state', '$ionicPlatform', function($state, $ionicPlatform) {
    //directly binding events to this context
    this.goNative = function(direction, transitiontype) {
      $ionicPlatform.ready(function() {
        switch (transitiontype) {
          case "slide":
            window.plugins.nativepagetransitions.slide({
                "direction": direction
              },
              function(msg) {
                console.log("success: " + msg);
              },
              function(msg) {
                // alert("error: " + msg);
              }
            );
            break;
          case "flip":
            window.plugins.nativepagetransitions.flip({
                "direction": direction
              },
              function(msg) {
                console.log("success: " + msg);
              },
              function(msg) {
                // alert("error: " + msg);
              }
            );
            break;

          case "fade":
            window.plugins.nativepagetransitions.fade({

              },
              function(msg) {
                console.log("success: " + msg);
              },
              function(msg) {
                // alert("error: " + msg);
              }
            );
            break;

          case "drawer":
            window.plugins.nativepagetransitions.drawer({
                "origin": direction,
                "action": "open"
              },
              function(msg) {
                console.log("success: " + msg);
              },
              function(msg) {
                // alert("error: " + msg);
              }
            );
            break;

          case "curl":
            window.plugins.nativepagetransitions.curl({
                "direction": direction
              },
              function(msg) {
                console.log("success: " + msg);
              },
              function(msg) {
                // alert("error: " + msg);
              }
            );
            break;

          default:
            window.plugins.nativepagetransitions.slide({
                "direction": direction
              },
              function(msg) {
                console.log("success: " + msg);
              },
              function(msg) {
                // alert("error: " + msg);
              }
            );
        }
      });
    };
  }]);
