'use strict';
angular.module('pricecheck')
.controller('MainCtrl', function($scope, $timeout, $ionicPlatform, $state, $cordovaSplashscreen, serverAddr, $ionicHistory, $cordovaDevice, AuthServ) {
    $ionicPlatform.ready(function() {
      var deviceId = $cordovaDevice.getUUID();
      AuthServ.isDeviceAdded(deviceId).then(function(deviceExists){
        if(deviceExists){
          $state.transitionTo('home');
        }
        else {
          $state.transitionTo('passcode');
        }
      });
    //CHECK IF PIUI Is AVAILABLE (https://github.com/dps/piui)
    //serverAddr
      // $timeout(function(){
      //   $scope.isConnected = true;
      //   $ionicHistory.nextViewOptions({
      //     disableBack: true
      //   });
      //   $state.transitionTo('passcode');
      //   $state.go('passcode');
      // }, 3000);
    });
})