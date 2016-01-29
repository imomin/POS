'use strict';

angular.module('pricecheck')
	.factory('UserServ', function() {
	   var users = [{"id":1,"name":"Alex","admin":true,"code":""},
					{"id":2,"name":"Mike","admin":false,"code":""},
					{"id":3,"name":"Rick","admin":false,"code":""},
					{"id":4,"name":"Sam","admin":true,"code":"8678"}];
		var _id = 4;
		return {
				 set:function(user) {
				   	if(user.id){
						angular.forEach(users, function(value, key){
							if(user.id === value.id){
								users[key] = user;
							}
						});
					}
					else {
						_id = _id+1;
						user.id = _id;
						users.push(user);
					}
					return users;
			   }, 	
			   	get:function(){
	   				return users;
	   			}
			};	   	

	});