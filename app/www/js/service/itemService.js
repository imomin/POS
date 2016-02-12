'use strict';

angular.module('pricecheck')
	.factory('ItemServ', function($q, $http, $cookies, socket, serverAddr) {
		var items = [];
		return {
			 set:function(item) {
			 	var defer = $q.defer();
			 	if(item._id){
			 		$http.put(serverAddr + '/api/items/'+item._id, item).then(function(response){
			 			defer.resolve(response);
			 		});
			 	}
			 	else {
			 		$http.post(serverAddr + '/api/items/', item).then(function(response){
			 			defer.resolve(response);
			 		});
			 	}
			 	return defer.promise;
		   }, 	
		   	get:function(){
		   		var defer = $q.defer();
					$http.get(serverAddr + '/api/items').then(function(response){
				  items = response.data;
				  defer.resolve(items);
				  socket.syncUpdates('item', items);
				}, function (err) {

				});
   				return defer.promise;
   			},
			getById:function(id){
		   		var defer = $q.defer();
					$http.get(serverAddr + '/api/items/' + id).then(function(response){
					  var item = response.data;
					  defer.resolve(item);
				}, function (err) {

				});
   				return defer.promise;
   			},
			getByBarcode:function(barcode){
		   		var defer = $q.defer();
					$http.get(serverAddr + '/api/items/').then(function(response){
					  var item = response.data;
					  defer.resolve(item);
				}, function (err) {

				});
   				return defer.promise;
   			},
   			remove:function(_id){
   				$http.delete(serverAddr + '/api/items/' + _id);
   			},
   			distroySync:function(){
   				socket.unsyncUpdates('item');
   			},
   			validateAccessCode:function(accessCode){
   				var defer = $q.defer();
					$http.get(serverAddr + '/api/items').then(function(response){
				  debugger;
				}, function (err) {
					debugger;
				});
   				return defer.promise;
   			}
		};
		// var items = [{'id':1,'name':'20oz Soda','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''},{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''},{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''}]},
		// 			{'id':2,'name':'Candy Small','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':3,'name':'Candy Medium','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':4,'name':'Candy Large','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':5,'name':'Chips Small','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':6,'name':'Chips Large','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':8,'name':'Starbucks Small','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':9,'name':'Starbucks Large','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':10,'name':'Single Pack Medicine','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':11,'name':'1 Liter Soda','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':12,'name':'6 pack Miller','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]},
		// 			{'id':13,'name':'Single Miller','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''},{'barcode':'','barcodeFormat':''}]}
		// 		];
		// var _id = 4;
		// return {
		// 		set:function(item) {
		// 		   	if(item.id){
		// 				angular.forEach(items, function(value, key){
		// 					if(item.id === value.id){
		// 						items[key] = item;
		// 						return false;
		// 					}
		// 				});
		// 			}
		// 			else {
		// 				_id = _id+1;
		// 				item.id = _id;
		// 				items.push(item);
		// 			}
		// 			return items;
		// 	   }, 	
		// 	   	get:function(posCode){
		// 	   		var defer = $q.defer();
	 //   				angular.forEach(items, function(item, key){
		// 				if(posCode === item.POSCode){
		// 					defer.resolve(item);
		// 				}
		// 			});
		// 			return defer.promise;
	 //   			},
	 //   			remove:function(POSCode){
	 //   				var defer = $q.defer();
	 //   				angular.forEach(items, function(item, key){
		// 				if(POSCode === item.POSCode){
		// 					items.splice(key, 1);
		// 					defer.resolve(items);
		// 				}
		// 			});
		// 			return defer.promise;
	 //   			}
		// 	};
	});

// <?xml version="1.0" encoding="UTF-8"?>
// <NAXML-MaintenanceRequest>
//    <ItemMaintenance>
//       <RecordAction type="addchange" />
//       <ITTDetail>
//          <RecordAction type="create" />
//          <ItemCode>
//             <POSCodeFormat format="upcA" />
//             <POSCode>858176002003</POSCode>
//             <POSCodeModifier>0</POSCodeModifier>
//             <InventoryItemID />
//          </ItemCode>
//          <ITTData>
//             <ActiveFlag value="yes" />
//             <MerchandiseCode>1</MerchandiseCode>
//             <RegularSellPrice>1.79</RegularSellPrice>
//             <Description>Body Armor</Description>
// 	     		<!-- PLU GROUP CODE, must increment -->
// 	    		<ItemID>001</ItemID>
//             <PaymentSystemsProductCode>400</PaymentSystemsProductCode>
//             <SellingUnits>1</SellingUnits>
//             <PriceRequiredFlg value="no" />
//             <PricingGroup>0</PricingGroup>
//             <FoodStampableFlg value="no" />
//             <DiscountableFlg value="yes" />
//             <QuantityAllowedFlg value="yes" />
//             <QuantityRequiredFlg value="no" />
//          </ITTData>
//       </ITTDetail>
//    </ItemMaintenance>
// </NAXML-MaintenanceRequest>