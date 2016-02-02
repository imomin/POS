'use strict';
angular.module('pricecheck')
	.factory('UserServ', function($q, $http, $cookies, socket, serverAddr) {
		var users = [];
		return {
				 set:function(user) {
				 	//$http.defaults.headers.post['X-XSRF-TOKEN'] = $cookies.get("XSRF-TOKEN");
				 	if(user._id){
				 		$http.put(serverAddr + '/api/employees/'+user._id, user);
				 	}
				 	else {
				 		$http.post(serverAddr + '/api/employees/', user);
				 	}
			   }, 	
			   	get:function(){
			   		var defer = $q.defer();
   					$http.get(serverAddr + '/api/employees').then(function(response){
					  users = response.data;
					  defer.resolve(users);
					  socket.syncUpdates('employee', users);
					}, function (err) {

					});
	   				return defer.promise;
	   			},
	   			remove:function(_id){
	   				$http.delete(serverAddr + '/api/employees/' + _id);
	   			},
	   			distroySync:function(){
	   				socket.unsyncUpdates('employee');
	   			},
	   			validateAccessCode:function(accessCode){
	   				var defer = $q.defer();
   					$http.get(serverAddr + '/api/employees').then(function(response){
					  debugger;
					}, function (err) {
						debugger;
					});
	   				return defer.promise;
	   			}
			};	   	

	});