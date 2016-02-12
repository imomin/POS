'use strict';

angular.module('pricecheck')
.controller('GroupCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, $ionicListDelegate, ItemServ) {
	$scope.groups = [];
	ItemServ.get().then(function(data){
		$scope.groups = data;
	});
	$scope.defaultValues = {'sellingUnits': 1,'minimumCustomerAge': 0,'foodStampableFlg':false,'taxStrategyID':101,'department':null};
	$scope.thisGroup = $scope.defaultValues

	$scope.openModal = function() {
		$scope.modal.show();
	}

	$scope.closeModal = function(id) {
		if(id==='editGroup'){
			$scope.thisGroup = $scope.defaultValues;
		}
		console.log($scope.thisGroup.department);
		$scope.modal[id].hide();
	}

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.updateGroup = function(){
		ItemServ.set($scope.thisGroup);
		$scope.closeModal('editGroup');
	}

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
		ItemServ.set($scope.thisGroup);
		$scope.closeModal('editGroup');
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
			});
		});
	}

	$scope.getItemInfo = function(){
		$scope.thisItem = {};
		ItemServ.get($scope.scanData.text).then(function(item){
		  if(!item){

		  }
		  else {
		  	var message = "Item already exists " + " in Beer Group " + "."
		  }
		});
	}

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

});