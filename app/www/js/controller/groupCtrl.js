'use strict';

angular.module('pricecheck')
.controller('GroupCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, $ionicListDelegate, $ionicTabsDelegate, ItemServ) {
	$scope.groups = [];
	ItemServ.get().then(function(data){
		$scope.groups = data;
	});
	$scope.defaultValues = {'sellingUnits': 1,'minimumCustomerAge': 0,'foodStampableFlg':false,'taxStrategyID':101,'department':null, 'items':[]};
	$scope.thisGroup = $scope.defaultValues

	$scope.openModal = function() {
		$scope.modal.show();
	}

	$scope.closeModal = function(id) {
		if(id==='editGroup'){
			$scope.thisGroup = $scope.defaultValues;
		}
		$scope.modal[id].hide();
	}

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	// $scope.updateGroup = function() {
	// 	ItemServ.set($scope.thisGroup);
	// 	$scope.closeModal('editGroup');
	// }

	$scope.deleteGroup = function(id){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Delete Group',
		    template: 'Are you sure you want to delete this group? \n  there are X items in this group.'
		});

		confirmPopup.then(function(res) {
		  if(res) {
		    ItemServ.remove(id);
		    $scope.closeModal('editGroup');
		  }
		});
	}

	$scope.setItemInfo = function(){ 
		//append new item to the group's item array.
		if($scope.itemScanned && !$scope.itemFound) {
			var newItems = ItemServ.getScannedItems();
			for (var i = 0; i < newItems.length; i++) {
				$scope.thisGroup.items.push({'posCode':newItems[i],'posCodeFormat':'upcA','posCodeModifier':0});
			};
		}
		ItemServ.set($scope.thisGroup).then(function(){
			ItemServ.clearScannedItem();
			$scope.scanData = null;
			$scope.itemScanned = false;
			$scope.itemFound = false;
			$scope.closeModal('editGroup');
		});
	}

	$scope.addNewGroup = function(){
	  $scope.thisGroup = $scope.defaultValues;
	  $ionicModal.fromTemplateUrl('html/groupEdit.html', {
	    id:'editGroup',
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal[modal.id] = modal;
	    $scope.modal[modal.id].show();
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
		$scope.thisGroup.department = department;
		$scope.defaultValues.department = department;
		$scope.closeModal('deptOption');
	}

	$scope.showDetails = function(department){
		//angular.copy(department, $scope.thisGroup );
		ItemServ.getById(department._id).then(function(res){
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

	$scope.itemLookup = function(){
	    ItemServ.getByBarcode($scope.scanData.text).then(function(item){
	      $scope.thisGroup = item;
	      $ionicModal.fromTemplateUrl('html/groupEdit.html', {
	        id:'editGroup',
	        scope: $scope,
	        animation: 'slide-in-right'
	      }).then(function(modal) {
			$scope.itemFound = true;
	        $scope.modal[modal.id] = modal;
	          $scope.modal[modal.id].show();
	      });
	    }, function(err){
	    	if(err.status === 404) {
				$scope.itemFound = false;
				ItemServ.addScannedItem($scope.scanData.text);
    		 	$ionicModal.fromTemplateUrl('html/group.html', {
			      id:'group',
			      scope: $scope,
			      animation: 'slide-in-up'
			    }).then(function(modal) {
			      $scope.modal[modal.id] = modal;
			      $scope.modal[modal.id].show();
			    });
	    	};
		})
	}

	$scope.checkIfItemIsAlreadyAdded = function(){
		ItemServ.getByBarcode($scope.scanData.text).then(function(item){
		var alertPopup = $ionicPopup.alert({
		     title: 'Duplicate Item!',
		     template: 'Scanned item already exists in ' + item.description + ' group.'
		   });
		   alertPopup.then(function(res) {
		     
		   });
		},
		function(err){
			$scope.thisGroup.items.push({'posCode':$scope.scanData.text,'posCodeFormat':'upcA','posCodeModifier':0});
		});
	}

	// $scope.getItemInfo = function(){
	// 	$scope.thisItem = {};
	// }

	$scope.removeItem = function(index){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Remove Item',
		    template: 'Are you sure you want to delete this item?'
		});

		confirmPopup.then(function(res) {
		  if(res) {
			$scope.thisGroup.items.splice(index, 1);
		  }
		  $ionicListDelegate.$getByHandle('barcodeList').closeOptionButtons();
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

	$scope.scan = function(){
		try {
		  $ionicPlatform.ready(function() {
		    $cordovaBarcodeScanner
		    .scan()
		    .then(function(result) {
		        $scope.scanData = result;
		        if(!result.cancelled){
		        	$scope.itemScanned = true;
		          	$scope.getItemInfo();
		        }
		        else {
		        	$scope.itemScanned = false;
		        }
		    }, function(error) {
		        // An error occurred
		        $scope.scanResult = 'Error: ' + error;
		    });
		  });
		}
		catch(err) {
			$scope.itemScanned = true;
			$scope.scanData = {};
			$scope.scanData.text = Math.floor(Math.random()*100000000);
			$scope.itemLookup();
		}
	};

});