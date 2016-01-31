'use strict';

angular.module('pricecheck')
.controller('PromoCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, PromotionServ) {
	$scope.promotions = PromotionServ.get();
	$scope.thisPromo = {};

	$scope.openModal = function() {
		$scope.modal.show();
	}

	$scope.closeModal = function() {
		$scope.thisPromo = {};
		$scope.modal.hide();
	}

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.updatePromo = function(){
		PromotionServ.set($scope.thisPromo);
		$scope.closeModal('editPromo');
	}

	$scope.deletePromo = function(id){
		var confirmPopup = $ionicPopup.confirm({
		    title: 'Delete Item',
		    template: 'Are you sure you want to delete this promotion?'
		});

		confirmPopup.then(function(res) {
		  if(res) {
		    PromotionServ.remove(id);
		    $scope.closeModal('editPromo');
		  }
		});
	}

	$scope.showDetails = function(promotion){
		angular.copy(promotion, $scope.thisPromo );
		$ionicModal.fromTemplateUrl('html/promotionEdit.html', {
		  id:'editPromo',
		  scope: $scope,
		  animation: 'slide-in-right'
		}).then(function(modal) {
		  $scope.modal = modal;
		  $scope.modal.show();
		});
	}
});