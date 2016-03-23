'use strict';

angular.module('pricecheck')
.controller('GroupCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, $ionicPlatform, $cordovaBarcodeScanner, $ionicListDelegate, $ionicTabsDelegate, GroupServ, ItemServ) {
	$scope.groups = [];
	$scope.defaultValues = {};
	GroupServ.get().then(function(data){
		$scope.groups = data;
	});

	$scope.addNewGroup = function(){
	  $scope.thisGroup = {"items":[],"MerchandiseCode":null,"RegularSellPrice":null,"Description":"","TaxStrategyID":null,"DepartmentKeyAtPOS":1,"DiscountableFlg":{"@":{"value":"yes"}},"FoodStampableFlg":{"@":{"value":"no"}},"PaymentSystemsProductCode":400,"ActiveFlag":{"@":{"value":"yes"}},"QuantityRequiredFlg":{"@":{"value":"no"}},"QuantityAllowedFlg":{"@":{"value":"yes"}},"PriceRequiredFlg":{"@":{"value":"no"}},"ItemType":{"ItemTypeSubCode":"mdse","ItemTypeCode":"mdse"},"SalesRestriction":{"MinimumCustomerAge":0},"SellingUnits":1,"PricingGroup":0};
	  $ionicModal.fromTemplateUrl('html/groupEdit.html', {
	    id:'editGroup',
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal[modal.id] = modal;
	    $scope.modal[modal.id].show();
	  });   
	}
	
	$scope.deleteGroup = function(id){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Delete Group',
		    template: 'Are you sure you want to delete this group? \n  there are ' + $scope.thisGroup.items.length + ' items in this group.'
		});

		confirmPopup.then(function(res) {
		  if(res) {
		    GroupServ.remove(id);
		    $scope.closeModal('editGroup');
		  }
		});
	}

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
		$scope.thisGroup.MerchandiseCode = department.MerchandiseCode;
		$scope.thisGroup.MerchandiseCodeDetails = department;
		$scope.defaultValues.MerchandiseCodeDetails = department;
		$scope.closeModal('deptOption');
	}

	$scope.save = function(){
		//append new item to the group's item array.
		GroupServ.set($scope.thisGroup).then(function(response){
			// debugger;
			// var groupId = response.data._id;
			// if($scope.itemScanned && !$scope.itemFound) {
			// 	var newItems = GroupServ.getScannedItems();
			// 	for (var i = 0; i < newItems.length; i++) {
			// 		var itemData = {"ITTData":groupId,"ItemCode":{"POSCode":newItems[i],"InventoryItemID":null,"posCodeModifier":0,"POSCodeFormat":{"@":{"format":"upcA"}}},"RecordAction":{"@":{"type":"addchange"}}};
			// 		$scope.thisGroup.items.push(itemData);
			// 	};
			// }
			GroupServ.clearScannedItem();
			$scope.scanData = null;
			$scope.itemScanned = false;
			$scope.itemFound = false;
			$scope.closeModal('editGroup');
		});
	}

	$scope.removeItem = function(index){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Remove Item',
		    template: 'Are you sure you want to delete this item?'
		});

		confirmPopup.then(function(res) {
		  if(res) {
		  	$scope.thisGroup.items[index].RecordAction["@"].type = "delete";
		  	if($scope.thisGroup.removeItems === undefined)
		  		$scope.thisGroup.removeItems = [];
		  	$scope.thisGroup.removeItems.push($scope.thisGroup.items[index]);
			$scope.thisGroup.items.splice(index, 1);
		  }
		  $ionicListDelegate.$getByHandle('barcodeList').closeOptionButtons();
		});
	}

	$scope.scan = function(){
		try {
		  $ionicPlatform.ready(function() {
		    $cordovaBarcodeScanner
		    .scan()
		    .then(function(result) {
		        $scope.scanData = result;
		        if(!result.cancelled){
		        	console.log($scope.scanData);
		        	$scope.itemScanned = true;
		          	$scope.itemLookup();
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
				$scope.thisGroup.items.push({"ITTData":$scope.thisGroup.ITTData,"ItemCode":{"POSCode":$scope.scanData.text,"InventoryItemID":null,"posCodeModifier":0,"POSCodeFormat":{"@":{"format":"upcA"}}},"RecordAction":{"@":{"type":"addchange"}}});
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
			$scope.thisGroup.items.push({"ItemCode":{"POSCode":$scope.scanData.text,"InventoryItemID":null,"posCodeModifier":0,"POSCodeFormat":{"@":{"format":"upcA"}}},"RecordAction":{"@":{"type":"addchange"}}});
		});
	}
})