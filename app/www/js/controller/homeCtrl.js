'use strict';
angular.module('pricecheck')
.controller('HomeCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, $ionicPlatform, $state, $cordovaSplashscreen, $cordovaBarcodeScanner, deviceInfo, $ionicHistory, UserServ, DepartmentServ, PromotionServ, ItemServ) {
    $scope.isAuthenticated = false;
    $scope.isConnected = true;
    $ionicHistory.clearHistory();
    $scope.passcode = "";
    $scope.scanResults = '';
    $scope.modal = [];
    $scope.thisUser = {};
    $scope.thisDept = {};
    $scope.thisPromo = {};
    $scope.thisItem = {};
    $scope.thisGroup = {'sellingUnits': 1,'minimumCustomerAge': 0,'foodStampableFlg':false};
    $scope.departments = [];

    DepartmentServ.get().then(function(data){
      $scope.departments = data;
    });
    // $ionicPlatform.ready(function() {
    //   $timeout(function(){
    //     $scope.deviceId = deviceInfo.getId();
    //     //$cordovaSplashscreen.hide();
    //   }, 100);
    // });

  $scope.openModal = function(id) {
    $scope.modal[id].show();
  }

  $scope.closeModal = function(id) {
    $scope.modal[id].hide();
    console.log($scope.thisGroup);
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

  $scope.showGroups = function(){
    $ionicModal.fromTemplateUrl('html/group.html', {
      id:'group',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    });
  }

  $scope.addNewUser = function(){
    $scope.thisUser = {};
    $ionicModal.fromTemplateUrl('html/userEdit.html', {
      id:'editUser',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    });
  }

  $scope.addNewDepartment = function(){
    $scope.thisDept = {};
    $ionicModal.fromTemplateUrl('html/departmentEdit.html', {
      id:'editDept',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    });
  }

  $scope.addNewPromotion = function(){
    $scope.thisPromo = {};
    $ionicModal.fromTemplateUrl('html/promotionEdit.html', {
      id:'editPromo',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal[modal.id] = modal;
      $scope.modal[modal.id].show();
    });   
  }

  // $scope.addNewGroup = function(){
  //   $scope.thisPromo = {};
  //   $ionicModal.fromTemplateUrl('html/groupEdit.html', {
  //     id:'editGroup',
  //     scope: $scope,
  //     animation: 'slide-in-up'
  //   }).then(function(modal) {
  //     $scope.modal[modal.id] = modal;
  //     $scope.modal[modal.id].show();
  //   });   
  // }

  $scope.updateUser = function(){
    //$scope.users = 
    UserServ.set($scope.thisUser);
    $scope.thisUser = {};
    $scope.closeModal('editUser');
  }

  $scope.updateDept = function(){
    DepartmentServ.set($scope.thisDept);
    $scope.thisDept = {};
    $scope.closeModal('editDept');
  }

  $scope.updatePromo = function(){
    PromotionServ.set($scope.thisPromo);
    $scope.closeModal('editPromo');
  }

  // $scope.updateGroup = function(){
  //   GroupServ.set($scope.thisGroup);
  //   $scope.closeModal('editGroup');
  // }

  $scope.getItemInfo = function(){
    $scope.thisItem = {};
    ItemServ.get($scope.scanData.text).then(function(item){
      $scope.thisItem = item;
      $ionicModal.fromTemplateUrl('html/item.html', {
        id:'item',
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal[modal.id] = modal;
        $scope.modal[modal.id].show();
      });
    });
  }

  // $scope.setItemInfo = function(){
  //   ItemServ.set($scope.thisGroup);
  //   $scope.closeModal('editGroup');
  // }

  $scope.deleteItem = function(POSCode){
    var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Item',
        template: 'Are you sure you want to delete this item?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        ItemServ.remove(POSCode);
        $scope.closeModal('item');
      }
    });
  };

  $scope.scan = function(){
    try {
      $ionicPlatform.ready(function() {
        $cordovaBarcodeScanner
        .scan()
        .then(function(result) {
            $scope.scanData = result;
            if(!result.cancelled){
              $scope.getItemInfo();
            }
        }, function(error) {
            // An error occurred
            $scope.scanResult = 'Error: ' + error;
        });
      });
    }
    catch(err) {
      $scope.scanData = {}
      $scope.scanData.text = "4902430496247";
      $scope.getItemInfo();
    }
  };

  window.addEventListener('native.keyboardshow', function(){
    document.body.classList.add('keyboard-open');
  });
});
