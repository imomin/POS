'use strict';

angular.module('pricecheck')
.controller('UserCtrl', function($scope, $timeout, $ionicModal, $ionicLoading, $ionicPopup, UserServ) {
	UserServ.get().then(function(data){
		$scope.users = data;
		$scope.doneLoading();
	});
	$scope.thisUser = {};

	$scope.openModal = function() {
		$scope.modal.show();
	}

	$scope.closeModal = function() {
		$scope.thisUser = {};
		$scope.modal.hide();
	}

	$scope.loading = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="lines" class="loading"></ion-spinner>'
		});
	};

	$scope.doneLoading = function(){
		$ionicLoading.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
		UserServ.distroySync();
	});

	$scope.updateUser = function(){
		$scope.loading();
		UserServ.set($scope.thisUser).then(user => {
			$scope.doneLoading()
		});
		$scope.thisUser = {};
		$scope.closeModal('editUser');
	}

	$scope.deleteUser = function(id){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Delete User',
		    template: 'Are you sure you want to delete this user?'
		});

		confirmPopup.then(function(res) {
		  if(res) {
		    UserServ.remove(id);
		    $scope.closeModal('editUser');
		  }
		});
	}

	$scope.showDetails = function(user){
		angular.copy(user, $scope.thisUser );
		$ionicModal.fromTemplateUrl('html/userEdit.html', {
		  id:'editUser',
		  scope: $scope,
		  animation: 'slide-in-right'
		}).then(function(modal) {
		  $scope.modal = modal;
		  $scope.modal.show();
		});
	}
});