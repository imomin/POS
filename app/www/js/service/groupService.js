'use strict';

angular.module('pricecheck')
	.factory('GroupServ', function($q, $http, $cookies, socket, serverAddr) {
		var groups = [];
		var _groupItems = [];
		return {
			 set:function(group) {
			 	var defer = $q.defer();
			 	if(group._id){
			 		$http.put(serverAddr + '/api/ittdata/'+group._id, group).then(function(response){
			 			defer.resolve(response);
						angular.forEach(groups, function(value, key){
							if(group._id === value._id){
								groups[key] = response.data;
								defer.resolve(groups[key]);
							}
						});
			 		});
			 	}
			 	else {
			 		$http.post(serverAddr + '/api/ittdata/', group).then(function(response){
			 			debugger;
			 			groups.push(response.data);
			 			defer.resolve(response);
			 		});
			 	}
			 	return defer.promise;
		   }, 	
		   	get:function(){
		   		var defer = $q.defer();
					$http.get(serverAddr + '/api/ittdata/').then(function(response){
						groups = response.data;
						_groupItems = response.data.Items ? response.data.Items : [];
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
   				var defer = $q.defer();
   				$http.delete(serverAddr + '/api/ittdata/' + _id).then(function(response){
   					angular.forEach(groups, function(group, key){
						if(_id === group._id){
							groups.splice(key, 1);
							defer.resolve(groups);
						}
					});
   					defer.resolve(response);
   				}, function (err) {
					defer.reject(err);
				});
   				return defer.promise;
   			},
   			addScannedItem:function(item){
   				return _groupItems.push(item);
   			},
   			getScannedItems:function(){
   				return _groupItems;
   			},
   			clearScannedItem:function(){
   				return _groupItems = [];
   			}
		};
	});