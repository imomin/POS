'use strict';

angular.module('pricecheck')
	.factory('GroupServ', function($q) {
		// var groups = 	[	{'id':1,'name':'20oz Soda','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'First','barcode':'123123','barcodeFormat':''},{'name':'pepsi','barcode':'123123123','barcodeFormat':''},{'name':'Dr. peper','barcode':'32342342','barcodeFormat':''},{'name':'coke','barcode':'123123','barcodeFormat':''},{'name':'pepsi','barcode':'123123123','barcodeFormat':''},{'name':'Dr. peper','barcode':'32342342','barcodeFormat':''},{'name':'coke','barcode':'123123','barcodeFormat':''},{'name':'pepsi','barcode':'123123123','barcodeFormat':''},{'name':'Last','barcode':'32342342','barcodeFormat':''}]},
		// 					{'id':2,'name':'Candy Small','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':3,'name':'Candy Medium','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':4,'name':'Candy Large','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':5,'name':'Chips Small','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':6,'name':'Chips Large','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':8,'name':'Starbucks Small','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':9,'name':'Starbucks Large','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':10,'name':'Single Pack Medicine','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':11,'name':'1 Liter Soda','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':12,'name':'6 pack Miller','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]},
		// 					{'id':13,'name':'Single Miller','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''},{'name':'','barcode':'','barcodeFormat':''}]}
		// 				];
		// var _id = groups.length;
		// return {
		// 		 set:function(dept) {
		// 		   	if(dept.id){
		// 				angular.forEach(groups, function(value, key){
		// 					if(dept.id === value.id){
		// 						groups[key] = dept;
		// 					}
		// 				});
		// 			}
		// 			else {
		// 				_id = _id+1;
		// 				dept.id = _id;
		// 				groups.push(dept);
		// 			}
		// 			return groups;
		// 	   }, 	
		// 	   	get:function(){
	 //   				return groups;
	 //   			},
	 //   			remove:function(id){
	 //   				var defer = $q.defer();
	 //   				angular.forEach(groups, function(group, key){
		// 				if(id === group.id){
		// 					groups.splice(key, 1);
		// 					defer.resolve(groups);
		// 				}
		// 			});
		// 			return defer.promise;
	 //   			}
		// 	};	   	

	});