'use strict';

angular.module('pricecheck')
.controller('DeptCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, DepartmentServ) {
	$scope.departments = DepartmentServ.get();
	$scope.thisDept = {};

	$scope.openModal = function() {
		$scope.modal.show();
	}

	$scope.closeModal = function() {
		$scope.thisDept = {};
		$scope.modal.hide();
	}

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.updateDept = function(){
		DepartmentServ.set($scope.thisDept);
		$scope.closeModal('editDept');
	}

	$scope.deleteDept = function(id){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Delete Department',
		    template: 'Are you sure you want to delete this department?'
		});

		confirmPopup.then(function(res) {
		  if(res) {
		    DepartmentServ.remove(id);
		    $scope.closeModal('editDept');
		  }
		});
	}

	$scope.showDetails = function(department){
		angular.copy(department, $scope.thisDept );
		$ionicModal.fromTemplateUrl('html/departmentEdit.html', {
		  id:'editDept',
		  scope: $scope,
		  animation: 'slide-in-right'
		}).then(function(modal) {
		  $scope.modal = modal;
		  $scope.modal.show();
		});
	}
});