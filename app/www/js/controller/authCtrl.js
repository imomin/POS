'use strict';

angular.module('pricecheck')
.controller('AuthCtrl', function($scope, $location, $timeout, $state, $ionicHistory, $ionicPopup, AuthServ, deviceInfo) {
    $scope.init = function() {
 		$scope.passcode = "";
    }
	$scope.add = function(value) {
	    if($scope.passcode.length < 4) {
	        $scope.passcode = $scope.passcode + value;
	        if($scope.passcode.length == 4) {
	            $timeout(function() {
	                $ionicHistory.nextViewOptions({
					  disableBack: true,
					  historyRoot:true
					});
	                AuthServ.validateAccessCode($scope.passcode,deviceInfo.getId()).then(function(data){
	                	if(data){
	                		//load and cache data.
	                		$state.transitionTo('home');
	                	}
	                	else {
						   var alertPopup = $ionicPopup.alert({
						     title: 'Access Denyed',
						     template: 'Invalid passcode or you are not added to the system.'
						   });
						   alertPopup.then(function(res) {
						     //take come action on click of "OK"
						   });
	                	}
	                });
	            }, 500);
	        }
	    }
	}
	$scope.delete = function() {
	    if($scope.passcode.length > 0) {
	        $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
	    }
	}
});