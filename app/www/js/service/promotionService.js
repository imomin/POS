'use strict';

angular.module('pricecheck')
	.factory('PromotionServ', function($q) {
	   var promos = [{"id":1,"name":"Monster 3 for $5"},
					{"id":2,"name":"3 Marboro $1 off"}];
		var _id = 3;
		return {
				 set:function(promo) {
				   	if(promo.id){
						angular.forEach(promos, function(value, key){
							if(promo.id === value.id){
								promos[key] = promo;
							}
						});
					}
					else {
						_id = _id+1;
						promo.id = _id;
						promos.push(promo);
					}
					return promos;
			   }, 	
			   	get:function(){
	   				return promos;
	   			},
	   			remove:function(id){
	   				var defer = $q.defer();
	   				angular.forEach(promos, function(promo, key){
						if(id === promo.id){
							items.splice(key, 1);
							defer.resolve(items);
						}
					});
					return defer.promise;
	   			}
			};	   	

	});