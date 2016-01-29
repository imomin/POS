'use strict';
angular.module('pricecheck')
.controller('HomeCtrl', function($scope, $timeout, $ionicModal, $ionicPlatform, $state, $cordovaSplashscreen, $cordovaBarcodeScanner, deviceId, $ionicHistory, UserServ) {
    $scope.isAuthenticated = false;
    $scope.isConnected = true;
    $ionicHistory.clearHistory();
    $scope.passcode = "";
    $scope.modal = [];
    $scope.thisUser = {};
    $ionicPlatform.ready(function() {
      $timeout(function(){
        $scope.deviceId = deviceId.getId();
        //$cordovaSplashscreen.hide();
      }, 100);
    });

  $scope.openModal = function(id) {
    $scope.modal[id].show();
  }

  $scope.closeModal = function(id) {
    $scope.modal[id].hide();
  }

  $scope.$on('$destroy', function() {
    for (var i = 0; i < $scope.modal.length; i++) {
      $scope.modal[i].remove();
    };
  })

  $scope.showDepartments = function(){
    $ionicModal.fromTemplateUrl('html/department.html', {
      id:'dept',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    });
  }
  $scope.showUsers = function(){
    $ionicModal.fromTemplateUrl('html/users.html', {
      id:'user',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    }); 
  }
  $scope.showPromotions = function(){
    $ionicModal.fromTemplateUrl('html/promotion.html', {
      id:'promo',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    });
  }

  $scope.showEditForm = function(){
    $ionicModal.fromTemplateUrl('html/userEdit.html', {
      id:'editUser',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    });
  }

  $scope.updateUser = function(){
    //$scope.users = 
    UserServ.set($scope.thisUser);
    $scope.thisUser = {};
    $scope.closeModal('editUser');
  }

  $scope.scan = function(){
      $ionicPlatform.ready(function() {
          $cordovaBarcodeScanner
          .scan()
          .then(function(result) {
              $scope.scanResult = result;
              if(!result.cancelled){
                $ionicModal.fromTemplateUrl('html/items.html', {
                  id:'scan',
                  scope: $scope,
                  animation: 'slide-in-up'
                }).then(function(modal) {
                  $scope.modal = modal;
                  $scope.modal.show();
                })
              }
          }, function(error) {
              // An error occurred
              $scope.scanResult = 'Error: ' + error;
          });
      });
    };
    
    $scope.scanResults = '';
});
