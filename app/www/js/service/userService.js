'use strict';
angular.module('pricecheck')
	.factory('UserServ', function($q, $http, $cookies, socket, serverAddr) {
		var users = [];
		return {
				 set:function(user) {
				 	//$http.defaults.headers.post['X-XSRF-TOKEN'] = $cookies.get("XSRF-TOKEN");
				 	if(user._id){
				 		$http.put(serverAddr + '/api/things/'+user._id, user);
				 	}
				 	else {
				 		$http.post(serverAddr + '/api/things/', user);
				 	}
			   }, 	
			   	get:function(){
			   		var defer = $q.defer();
   					$http.get(serverAddr + '/api/things').then(function(response){
					  users = response.data;
					  defer.resolve(users);
					  socket.syncUpdates('thing', users);
					}, function (err) {

					});
	   				return defer.promise;;
	   			},
	   			remove:function(_id){
	   				$http.delete(serverAddr + '/api/things/' + _id);
	   			},
	   			distroySync:function(){
	   				socket.unsyncUpdates('thing');
	   			}
			};	   	

	});