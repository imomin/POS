'use strict';

angular.module('pricecheck')
	.factory('GroupServ', function($q, $http, $cookies, socket, serverAddr) {
		var groups = [];
		var _tempScannedItems = [];
		return {
			 set:function(group) {
			 	var defer = $q.defer();
			 	if(group._id){
			 		$http.put(serverAddr + '/api/ittdata/'+group._id, group).then(function(response){
			 			defer.resolve(response);
			 		});
			 	}
			 	else {
			 		$http.post(serverAddr + '/api/ittdata/', group).then(function(response){
			 			defer.resolve(response);
			 		});
			 	}
			 	return defer.promise;
		   }, 	
		   	get:function(){
		   		var defer = $q.defer();
					$http.get(serverAddr + '/api/ittdata/').then(function(response){
					  groups = response.data;
					  defer.resolve(groups);
					  socket.syncUpdates('group', groups);
				}, function (err) {

				});
   				return defer.promise;
   			},
			getById:function(id){
		   		var defer = $q.defer();
					$http.get(serverAddr + '/api/ittdata/' + id).then(function(response){
					  var item = response.data;
					  defer.resolve(item);
				}, function (err) {

				});
   				return defer.promise;
   			},
   			remove:function(_id){
   				$http.delete(serverAddr + '/api/items/' + _id);
   			},
   			addScannedItem:function(item){
   				return _tempScannedItems.push(item);
   			},
   			getScannedItems:function(){
   				return _tempScannedItems;
   			},
   			clearScannedItem:function(){
   				return _tempScannedItems = [];
   			}
		};
	});