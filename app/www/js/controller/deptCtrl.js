'use strict';

angular.module('pricecheck')
.controller('DeptCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, DepartmentServ) {
	DepartmentServ.get().then(function(data){
		$scope.departments = data;
	});
	$scope.thisDept = {'taxStrategyID':101};
	$scope.openModal = function() {
		$scope.modal.show();
	}

	$scope.closeModal = function(id) {
		$scope.thisDept = {'taxStrategyID':101};
		$scope.modal[id].hide();
	}

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
		DepartmentServ.distroySync();
	});

	$scope.updateDept = function(){
		DepartmentServ.set($scope.thisDept).then(function(res){
			$scope.thisDept = {'taxStrategyID':101};
			$scope.closeModal('editDept');
		},function(err){
			console.log(err);
			if(err.data.code === "ENOENT"){
				var alertPopup = $ionicPopup.alert({
				     title: 'Data Push Failed!',
				     template: 'Unable to communicate to POS system. Changes not pushed.'
				   });
				   alertPopup.then(function(res) {
				     
				   });
			}
		});
	}

	$scope.deleteDept = function(id){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Delete Department',
		    template: 'Are you sure you want to delete this department?'
		});

		confirmPopup.then(function(res) {
		  if(res) {
		    DepartmentServ.remove(id).then(function(res){
		    	$scope.closeModal('editDept');
		    },function(err){
		    	var alertPopup = $ionicPopup.alert({
				     title: 'Remove Data Failed!',
				     template: 'Department not removed.'
				   });
				   alertPopup.then(function(res) {
						$scope.closeModal('editDept');
				   });
		    });
		  }
		});
	}

	$scope.addNewDepartment = function(){
		$scope.thisDept = {'MerchandiseCodeDescription':'','TaxStrategyID':101,'NegativeFlag':{'@':{'value':'no'}},'ActiveFlag':{'@':{'value':'yes'}},'DepartmentKeyAtPOS':1,'DiscountableFlg':false,'FoodStampableFlg':false,'PaymentSystemsProductCode':400};
		$ionicModal.fromTemplateUrl('html/departmentEdit.html', {
		  id:'editDept',
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(modal) {
		  $scope.modal[modal.id] = modal;
		  $scope.modal[modal.id].show();
		});
	}

	$scope.showDetails = function(department){
		angular.copy(department, $scope.thisDept);
		$ionicModal.fromTemplateUrl('html/departmentEdit.html', {
		  id:'editDept',
		  scope: $scope,
		  animation: 'slide-in-right'
		}).then(function(modal) {
		  $scope.modal[modal.id] = modal;
		  $scope.modal[modal.id].show();
		});
	}
});