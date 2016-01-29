'use strict';
angular.module('pricecheck')
.controller('MainCtrl', function($scope, $timeout, $ionicPlatform, $state, $cordovaSplashscreen, serverAddr, $ionicHistory) {
    $scope.isAuthenticated = false;
    $scope.passcode = "";
    $ionicPlatform.ready(function() {
    //CHECK IF PIUI Is AVAILABLE (https://github.com/dps/piui)
    //serverAddr
      $timeout(function(){
        $scope.isConnected = true;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.transitionTo('passcode');
        $state.go('passcode');
      }, 3000);
    });
})