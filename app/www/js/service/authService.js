'use strict';

angular.module('pricecheck')
	.factory('AuthServ', function($q, $http, serverAddr, deviceInfo) {
		return {
			isServerAvailabel: function(){

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