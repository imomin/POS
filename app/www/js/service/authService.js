'use strict';

angular.module('pricecheck')
	.factory('AuthServ', function($q, $http, $timeout, serverAddr, deviceInfo) {
		return {
			isServerAvailabel: function(){
				var defer = $q.defer();
				$http.get(serverAddr + '/api/employees/count',{timeout:defer.promise}).then(function(count){
					defer.resolve(count);
				}, function (err) {
					defer.resolve(err);
				});
				  $timeout(function() {
				    defer.resolve({"data":{"count":-1}}); // this aborts the request!
				  }, 10000);
				return defer.promise;
			},
			isDeviceAdded: function(deviceId){
				var defer = $q.defer();
				$http.get(serverAddr + '/api/employees/devicelookup/'+deviceId).then(function(response){
					//check status, if 204 then exists else 401
					defer.resolve(true);
				}, function (err) {
					defer.resolve(false);
				});
				return defer.promise;
			},
   			validateAccessCode: function(accessCode, deviceId) {
   				var defer = $q.defer();
					$http.get(serverAddr + '/api/employees/accesscode/'+accessCode+'?deviceId='+deviceId).then(function(response){
				  		defer.resolve(true);
					}, function (err) {
						defer.resolve(false);
					});
   				return defer.promise;
   			}
		};
	});