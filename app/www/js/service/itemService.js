'use strict';

angular.module('pricecheck')
	.factory('ItemServ', function($q) {
	   var items = [{"id":1,"POSCode":"858176002003","Description":"Body Armor","SellingUnits":1,"RegularSellPrice":1.79,"ItemId":"001"},
	   				{"id":2,"POSCode":"4902430496247","Description":"Vicks VapoRub","SellingUnits":1,"RegularSellPrice":1.79,"ItemId":"001"},
	   				{"id":3,"POSCode":"","Description":"","SellingUnits":1,"RegularSellPrice":1.99,"ItemId":"001"},
	   				{"id":4,"POSCode":"","Description":"","SellingUnits":1,"RegularSellPrice":2.49,"ItemId":"001"},
	   				];
		var _id = 4;
		return {
				set:function(item) {
				   	if(item.id){
						angular.forEach(items, function(value, key){
							if(item.id === value.id){
								items[key] = item;
								return false;
							}
						});
					}
					else {
						_id = _id+1;
						item.id = _id;
						items.push(item);
					}
					return items;
			   }, 	
			   	get:function(posCode){
			   		var defer = $q.defer();
	   				angular.forEach(items, function(item, key){
						if(posCode === item.POSCode){
							defer.resolve(item);
						}
					});
					return defer.promise;
	   			},
	   			remove:function(POSCode){
	   				var defer = $q.defer();
	   				angular.forEach(items, function(item, key){
						if(POSCode === item.POSCode){
							items.splice(key, 1);
							defer.resolve(items);
						}
					});
					return defer.promise;
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