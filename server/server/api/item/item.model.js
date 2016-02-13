'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var counter = require('./../counter/counter.model');
var Promise = require('promise');
var fs = require('fs');

var ItemSchema = new mongoose.Schema({
  itemID: {type:Number, unique: true, require: true}, // PLU implement this on Create {$inc: { itemID: 1} }
  items:[{posCode:{type:Number},posCodeFormat:{type:String},posCodeModifier:{type:Number,default: 0}}], //[{ posCode: String, posCodeFormat: String,  posCodeModifier: Number,}]
  activeFlag: {type:Boolean, default: true},
  merchandiseCode: {type:Number, require: true},
  regularSellPrice: {type:Number, require: true},
  description: {type:String, require: true},
  paymentSystemsProductCode: {type:Number, default: 400},
  sellingUnits: {type:Number, default: 1},
  pricingGroup: {type:Number, default: 0},
  quantityAllowedFlg: {type:Boolean, default: true},
  quantityRequiredFlg:  {type:Boolean, default: false},
  discountableFlg: {type:Boolean, default: true},
  foodStampableFlg: {type:Boolean, default: false},
  priceRequiredFlg: {type:Boolean, default: false},
  minimumCustomerAge: {type: Number, enum: [0, 1001, 1002]}, // none, 18+ = 1001, 21+ = 1002
  taxStrategyID: {type: Number, enum: [101, 99]}, //101=taxable, 99=non-taxable
  department: {type:Schema.Types.ObjectId, ref: 'Department', required:true}
});

ItemSchema.methods = {
  getNextId(callback) {
    counter.findByIdAndUpdate({_id: 'itemID'}, {$inc: { seq: 1} }, function(error, counter)   {
      callback(error,counter);
  });
  },
  generateXMLFile(action, entity) {
    var template = '<?xml version="1.0" encoding="UTF-8"?>'+
                  '<NAXML-MaintenanceRequest>'+
                       '<ItemMaintenance>'+
                          '<TableAction type="update"/>' + 
                          '<RecordAction type="addchange" />';
        
        for (var i = 0; i < entity.items.length; i++) {
              template = template + '<ITTDetail>'+
                           '<RecordAction type="'+ action +'" />'+
                           '<ItemCode>'+
                              '<POSCodeFormat format="upcA" />'+
                              '<POSCode>'+ entity.items[i].posCode +'</POSCode>'+
                              '<POSCodeModifier>0</POSCodeModifier>'+
                              '<InventoryItemID />'+
                           '</ItemCode>'+
                           '<ITTData>'+
                              '<ActiveFlag value="yes" />'+
                              '<MerchandiseCode>'+ entity.department.merchandiseCode +'</MerchandiseCode>'+
                              '<RegularSellPrice>'+ entity.regularSellPrice +'</RegularSellPrice>'+
                              '<Description>'+ entity.description +'</Description>'+
                              '<ItemID>'+ entity.itemID +'</ItemID>'+
                              '<PaymentSystemsProductCode>400</PaymentSystemsProductCode>'+
                              '<SellingUnits>'+ entity.sellingUnits +'</SellingUnits>'+
                              '<PriceRequiredFlg value="no" />'+
                              '<PricingGroup>0</PricingGroup>'+
                              '<FoodStampableFlg value="'+ entity.foodStampableFlg +'" />'+
                              '<DiscountableFlg value="yes" />'+
                              '<QuantityAllowedFlg value="yes" />'+
                              '<QuantityRequiredFlg value="no" />'+
                           '</ITTData>'+
                        '</ITTDetail>';
            };
        template = template + '</ItemMaintenance>'+
                    '</NAXML-MaintenanceRequest>';
      return new Promise(function (resolve, reject) {
          fs.writeFile(__dirname + '/../../../inBox/'+Math.floor(Math.random()*100000000)+'.xml', template, 'utf8', function(err) {
            console.log("done writing");
            if (err) {
              console.log(err);
              reject(err);
            }
            else {
              resolve(entity);
            }
          });
      });
    }
}
export default mongoose.model('Item', ItemSchema);
//{'id':1,'name':'20oz Soda','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''},{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''},{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''}]}

// { items: 
//    [ { posCodeModifier: 0,
//        _id: 56be76f4a7c562d01a8471c3,
//        posCodeFormat: 'upcA',
//        posCode: 67948152 } ],
//   activeFlag: true,
//   paymentSystemsProductCode: 400,
//   sellingUnits: 1,
//   pricingGroup: 0,
//   quantityAllowedFlg: true,
//   quantityRequiredFlg: false,
//   discountableFlg: true,
//   foodStampableFlg: false,
//   priceRequiredFlg: false,
//   __v: 2,
//   itemID: 1020,
//   minimumCustomerAge: 0,
//   taxStrategyID: 101,
//   department: 56b7e054ce4e78370741db22,
//   description: 'Blah',
//   regularSellPrice: 1.99,
//   _id: 56be76f4a7c562d01a8471c2 }

// <ItemMaintenance>
//     <RecordAction type="addchange"/>
//     <ITTDetail>
//       <RecordAction type="addchange"/>
//       <ItemCode>
//         <POSCodeFormat format="upcA"/>
//         <POSCode>012300197410</POSCode>
//         <POSCodeModifier>0</POSCodeModifier>
//         <InventoryItemID/>
//       </ItemCode>
//       <ITTData>
//         <ActiveFlag value="yes"/>
//         <MerchandiseCode>6</MerchandiseCode>
//         <RegularSellPrice>6.59</RegularSellPrice>
//         <Description>Camel</Description>
//         <ItemID>0</ItemID>
//         <ItemType>
//           <ItemTypeCode>mdse</ItemTypeCode>
//           <ItemTypeSubCode>mdse</ItemTypeSubCode>
//         </ItemType>
//         <PaymentSystemsProductCode>400</PaymentSystemsProductCode>
//         <SalesRestriction>
//           <ProhibitDiscountFlag value="no"/>
//           <MinimumCustomerAge>1001</MinimumCustomerAge>
//         </SalesRestriction>
//         <SellingUnits>1</SellingUnits>
//         <TaxStrategyID>101</TaxStrategyID>
//         <PriceRequiredFlg value="no"/>
//         <PricingGroup>0</PricingGroup>
//         <FoodStampableFlg value="no"/>
//         <DiscountableFlg value="no"/>
//         <QuantityAllowedFlg value="yes"/>
//         <QuantityRequiredFlg value="no"/>
//       </ITTData>
//     </ITTDetail>
// </ItemMaintenance>
