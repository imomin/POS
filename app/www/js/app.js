// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('pricecheck', ['ionic','ngCordova','ngCookies','btford.socket-io'])
.constant('serverAddr','http://pibox:8080')
.factory('deviceInfo', function () {
    var _uuid = "";
    return {
        getId: function () { return _uuid; },
        setId: function(value) { _uuid = value;}
    };
})
.config(function($stateProvider, $urlRouterProvider, $httpProvider, serverAddr) {
    "use strict";
    $stateProvider           
        .state('connect', {name: 'connect', url: '/', templateUrl: 'html/connect.html', controller: 'MainCtrl'})
        .state('passcode', {name: 'passcode', url: '/passcode', templateUrl: 'html/passcode.html', controller: 'AuthCtrl'})
        .state('home', {name: 'home', url: '/home', templateUrl: 'html/home.html', controller: 'HomeCtrl'})
        .state('user', {name: 'user', url: '/user', templateUrl: 'html/users.html', controller: 'UserCtrl'})
        .state('error', {name: 'error', url: '/error', templateUrl: 'html/error.html'})
    ;
    $urlRouterProvider.otherwise('/');
})

.run(function($rootScope,$ionicPlatform,$cordovaDevice,$cordovaSplashscreen,$cordovaNetwork,$ionicPopup,deviceInfo) {
  $ionicPlatform.ready(function() {

    $cordovaSplashscreen.hide();

    // if ($cordovaNetwork.isOffline()) {
    //     $ionicPopup.confirm({
    //         title: "Connection Error",
    //         content: "Cannot find the server."
    //     })
    //     .then(function(result) {
    //         if(!result) {
    //             ionic.Platform.exitApp();
    //         }
    //     });
    // }

    try {
      deviceInfo.setId($cordovaDevice.getUUID());
    }
    catch (err){
      deviceInfo.setId("811536972167970e");
    }

    //$cordovaSplashscreen.hide();
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});