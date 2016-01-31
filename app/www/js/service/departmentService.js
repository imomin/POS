'use strict';

angular.module('pricecheck')
	.factory('DepartmentServ', function($q) {
	   var departments = [{"id":1,"name":"Taxable","items":[123132,123,12,12313,123,123,123132,456,67,5786,8786,865,45,46464]},
					{"id":2,"name":"Non Taxable","items":[]},
					{"id":3,"name":"20oz Soda","items":[]},
					{"id":4,"name":"Candy Small","items":[]},
					{"id":5,"name":"Candy Medium","items":[]},
					{"id":6,"name":"Candy Large","items":[]},
					{"id":7,"name":"Non Taxable","items":[]},
					{"id":8,"name":"20oz Soda","items":[]},
					{"id":9,"name":"Candy Small","items":[]},
					{"id":10,"name":"Candy Medium","items":[]},
					{"id":11,"name":"Candy Large","items":[]},
					{"id":12,"name":"Candy Small","items":[]},
					{"id":13,"name":"Candy Medium","items":[]},
					{"id":14,"name":"Candy Large123","items":[]}];
		var _id = departments.length;
		return {
				 set:function(dept) {
				   	if(dept.id){
						angular.forEach(departments, function(value, key){
							if(dept.id === value.id){
								departments[key] = dept;
							}
						});
					}
					else {
						_id = _id+1;
						dept.id = _id;
						departments.push(dept);
					}
					return departments;
			   }, 	
			   	get:function(){
	   				return departments;
	   			},
	   			remove:function(id){
	   				var defer = $q.defer();
	   				angular.forEach(departments, function(department, key){
						if(id === department.id){
							departments.splice(key, 1);
							defer.resolve(departments);
						}
					});
					return defer.promise;
	   			}
			};	   	

	});