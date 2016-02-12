'use strict';

angular.module('pricecheck')
.controller('DeptCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, DepartmentServ) {
	DepartmentServ.get().then(function(data){
		$scope.departments = data;
	});
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
		DepartmentServ.distroySync();
	});

	$scope.updateDept = function(){
		DepartmentServ.set($scope.thisDept);
		$scope.thisDept = {};
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