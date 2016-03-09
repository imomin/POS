'use strict';
angular.module('pricecheck')
.controller('MainCtrl', function($scope, $ionicPlatform, $ionicModal, $ionicPopup, $state, $cordovaDevice, AuthServ, UserServ) {
    $ionicPlatform.ready(function() {
      try {
        var deviceId = $cordovaDevice.getUUID();
      }
      catch (err){
        var deviceId = "811536972167970e";
      }
      AuthServ.isServerAvailabel().then(function(response){
        console.log('*********');
        console.log(response);
        console.log('*********');
        if(response.data.count === -1){
          var alertPopup = $ionicPopup.alert({
            title: 'Connection Error',
            template: 'Problem Connecting to the server!'
          });
            alertPopup.then(function(res) {
            ionic.Platform.exitApp();
          });
        }
        else if(response.data.count > 0){
            AuthServ.isDeviceAdded(deviceId).then(function(deviceExists){
              if(deviceExists){
                $state.transitionTo('home');
              }
              else {
                $state.transitionTo('passcode');
              }
            });
        }
        else {// if there are no users prompt to add themselves.
          $scope.thisUser = {"name":"",role:"admin","deviceId":deviceId};
          var myPopup = $ionicPopup.show({
              template: '<input type="text" ng-model="thisUser.name">',
              title: 'User Setup',
              subTitle: 'No user found. Enter your name.',
              scope: $scope,
              buttons: [
                {
                  text: '<b>OK</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$scope.thisUser.name) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $scope.thisUser.name;
                    }
                  }
                }
              ]
            });
            myPopup.then(function(res) {
              $scope.thisUser.name = res;
              UserServ.set($scope.thisUser).then(function(response){
                $state.transitionTo('home');
              });
            });
        }
      },
      function(err){
        console.log('##########');
        console.log(err);
        console.log('##########');
        var alertPopup = $ionicPopup.alert({
           title: 'Connection Error',
           template: 'Problem Connecting to the server!'
         });
         alertPopup.then(function(res) {
           ionic.Platform.exitApp();
         });
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