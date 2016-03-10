'use strict';

angular.module('pricecheck')
	.factory('DepartmentServ', function($q, $http, $cookies, socket, serverAddr) {
		var departments = [];
		return {
				 set:function(department) {
				 	var defer = $q.defer();
				 	if(department._id){
				 		$http.put(serverAddr + '/api/merchandisecodes/'+department._id, department).then(function(response){
							angular.forEach(departments, function(value, key){
								if(department._id === value._id){
									departments[key] = response.data;
									defer.resolve(departments[key]);
								}
							});
				 		}, function (err) {
							console.log(JSON.stringify(err));
							defer.reject(err);
						});
				 	}
				 	else {
				 		$http.post(serverAddr + '/api/merchandisecodes/', department).then(function(response){
				 			departments.push(response.data);
				 			defer.resolve(department);
				 		}, function (err) {
							console.log(JSON.stringify(err));
							defer.reject(err);
						});
				 	}
				 	return defer.promise;
			   }, 	
			   	get:function(){
			   		var defer = $q.defer();
   					$http.get(serverAddr + '/api/merchandisecodes').then(function(response){
					  departments = response.data;
					  defer.resolve(departments);
					  socket.syncUpdates('department', departments);
					}, function (err) {
						defer.reject(err);
					});
	   				return defer.promise;
	   			},
	   			remove:function(_id){
	   				var defer = $q.defer();
	   				$http.delete(serverAddr + '/api/merchandisecodes/' + _id).then(function(response){
	   					angular.forEach(departments, function(department, key){
							if(_id === department._id){
								departments.splice(key, 1);
								defer.resolve(departments);
							}
						});
	   					defer.resolve(response);
	   				}, function (err) {
						defer.reject(err);
					});
	   				return defer.promise;
	   			},
	   			distroySync:function(){
	   				socket.unsyncUpdates('department');
	   			}
	   	// 		,
	   	// 		validateAccessCode:function(accessCode){
	   	// 			var defer = $q.defer();
   		// 			$http.get(serverAddr + '/api/departments').then(function(response){
					//   debugger;
					// }, function (err) {
					// 	debugger;
					// });
	   	// 			return defer.promise;
	   	// 		}
			};
	});
	// .factory('DepartmentServ', function($q) {
	//    var departments = [	{_id:1,merchandiseCode:101,merchandiseCodeDescription:"Taxable",paymentSystemsProductCode:400,taxStrategyID:1,foodStampableFlg:false,discountableFlg:true,departmentKeyAtPOS:0,activeFlag:true},
	// 						{_id:2,merchandiseCode:102,merchandiseCodeDescription:"Non Taxable",paymentSystemsProductCode:400,taxStrategyID:1,foodStampableFlg:false,discountableFlg:true,departmentKeyAtPOS:0,activeFlag:true},
	// 						{_id:3,merchandiseCode:103,merchandiseCodeDescription:"Cigarette",paymentSystemsProductCode:400,taxStrategyID:1,foodStampableFlg:false,discountableFlg:true,departmentKeyAtPOS:0,activeFlag:true},
	// 						{_id:4,merchandiseCode:104,merchandiseCodeDescription:"Beer",paymentSystemsProductCode:400,taxStrategyID:1,foodStampableFlg:false,discountableFlg:true,departmentKeyAtPOS:0,activeFlag:true},
	// 						{_id:5,merchandiseCode:105,merchandiseCodeDescription:"Money Order",paymentSystemsProductCode:400,taxStrategyID:1,foodStampableFlg:false,discountableFlg:true,departmentKeyAtPOS:0,activeFlag:true},
	// 						{_id:6,merchandiseCode:106,merchandiseCodeDescription:"Wine",paymentSystemsProductCode:400,taxStrategyID:1,foodStampableFlg:false,discountableFlg:true,departmentKeyAtPOS:0,activeFlag:true}];

	// 	var _id = departments.length;
	// 	return {
	// 			 set:function(dept) {
	// 			   	if(dept.id){
	// 					angular.forEach(departments, function(value, key){
	// 						if(dept.id === value.id){
	// 							departments[key] = dept;
	// 						}
	// 					});
	// 				}
	// 				else {
	// 					_id = _id+1;
	// 					dept.id = _id;
	// 					departments.push(dept);
	// 				}
	// 				return departments;
	// 		   }, 	
	// 		   	get:function(){
	//    				return departments;
	//    			},
	//    			remove:function(id){
	//    				var defer = $q.defer();
	//    				angular.forEach(departments, function(department, key){
	// 					if(id === department.id){
	// 						departments.splice(key, 1);
	// 						defer.resolve(departments);
	// 					}
	// 				});
	// 				return defer.promise;
	//    			}
	// 		};	   	

	// });