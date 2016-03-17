'use strict';

angular.module('pricecheck')
.controller('GroupCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, $ionicPlatform, $cordovaBarcodeScanner, $ionicListDelegate, $ionicTabsDelegate, GroupServ) {
	$scope.groups = [];
	$scope.defaultValues = {};
	GroupServ.get().then(function(data){
		$scope.groups = data;
	});

	$scope.showDetails = function(group){
		GroupServ.getById(group._id).then(function(res){
			$scope.thisGroup = res;
			$ionicModal.fromTemplateUrl('html/groupEdit.html', {
			  id:'editGroup',
			  scope: $scope,
			  animation: 'slide-in-right'
			}).then(function(modal) {
				$scope.modal[modal.id] = modal;
	    		$scope.modal[modal.id].show();
				if($scope.scanData){
					$ionicTabsDelegate.select(1);
				}
			});
		});
	}

	$scope.selectDepartment = function(){
		$ionicModal.fromTemplateUrl('html/departmentOption.html', {
		  id:'deptOption',
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(modal) {
		    $scope.modal[modal.id] = modal;
		    $scope.modal[modal.id].show();
		  });
	};

	$scope.selectedDepartment = function(department){
		$scope.thisGroup.MerchandiseCodeDetails = department;
		$scope.defaultValues.MerchandiseCodeDetails = department;
		$scope.closeModal('deptOption');
	}

	$scope.setItemInfo = function(){ 
		//append new item to the group's item array.
		if($scope.itemScanned && !$scope.itemFound) {
			var newItems = GroupServ.getScannedItems();
			for (var i = 0; i < newItems.length; i++) {
				var itemData = {"ITTData":$scope.thisGroup.ITTData,"ItemCode":{"POSCode":newItems[i],"InventoryItemID":null,"posCodeModifier":0,"POSCodeFormat":{"@":{"format":"upcA"}}},"RecordAction":{"@":{"type":"addchange"}}};
				$scope.thisGroup.items.push(itemData);
			};
		}
		GroupServ.set($scope.thisGroup).then(function(){
			GroupServ.clearScannedItem();
			$scope.scanData = null;
			$scope.itemScanned = false;
			$scope.itemFound = false;
			$scope.closeModal('editGroup');
		});
	}

	$scope.addItemToGroup = function(){
		try {
		  $ionicPlatform.ready(function() {
		    $cordovaBarcodeScanner
		    .scan()
		    .then(function(result) {
		        $scope.scanData = result;
		        if(!result.cancelled){
		          	$scope.checkIfItemIsAlreadyAdded();
		        }
		    }, function(error) {
		        // An error occurred
		        $scope.scanResult = 'Error: ' + error;
		    });
		  });
		}
		catch(err) {
			$scope.scanData = {};
			$scope.scanData.text = Math.floor(Math.random()*100000000);
			$scope.checkIfItemIsAlreadyAdded();
		}
	}
})