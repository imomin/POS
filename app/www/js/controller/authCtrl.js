'use strict';

angular.module('pricecheck')
.controller('AuthCtrl', function($scope, $location, $timeout, $state, $ionicHistory) {
    $scope.init = function() {
 		$scope.passcode = "";
    }
	$scope.add = function(value) {
	    if($scope.passcode.length < 4) {
	        $scope.passcode = $scope.passcode + value;
	        if($scope.passcode.length == 4) {
	            $timeout(function() {
	                console.log("The four digit code was entered");
	                $ionicHistory.nextViewOptions({
					  disableBack: true,
					  historyRoot:true
					});
	                $state.transitionTo('home');
	                //$state.go('home');
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