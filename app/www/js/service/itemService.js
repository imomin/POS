'use strict';

angular.module('pricecheck')
	.factory('ItemServ', function($q, $http, $cookies, socket, serverAddr) {
		var items = [];
		var _tempScannedItems = [];
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
					$http.get(serverAddr + '/api/items/group/').then(function(response){
				  items = response.data;
				  defer.resolve(items);
				  socket.syncUpdates('item', items);
				}, function (err) {

				});
   				return defer.promise;
   			},
			getByItemId:function(itemId){
		   		var defer = $q.defer();
					$http.get(serverAddr + '/api/items/group/' + itemId).then(function(response){
					  var item = response.data;
					  defer.resolve(item);
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
					$http.get(serverAddr + '/api/items/lookup/' + barcode).then(function(response){
					  var item = response.data;
					  defer.resolve(item);
				}, function (err) {
					defer.reject(err);
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