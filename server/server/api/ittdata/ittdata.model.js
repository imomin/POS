'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var IttdataSchema = new mongoose.Schema({
    MerchandiseCode: {type:Number, require: true},
    MerchandiseCodeDetails: {type:Schema.Types.ObjectId, ref: 'Merchandisecode', required:true},
    RegularSellPrice: {type:Number, require: true},
    Description:{type:String, require: true},
    ItemID: {type:Number, require: true, unique: false},
    PricingGroup: {type:Number, require: false, default:0},
    PaymentSystemsProductCode:{type:Number, default: 400},
    SellingUnits: {type:Number, default: 1},
    TaxStrategyID:  {type: Number, enum: [101, 99]}, //101=taxable, 99=non-taxable
    SalesRestriction: {
      ProhibitDiscountFlag: {
        "@": {
          value: String
        }
      },
      MinimumCustomerAge: Number
    },
    ItemType: {
      ItemTypeCode: {type:String,default:"mdse"},
      ItemTypeSubCode: {type:String,default:"mdse"}
    },
    PriceRequiredFlg: {
      "@": {
        "value": {type:String, default:"no"}
      }
    },
    FoodStampableFlg: {
      "@": {
        "value": {type:String, default:"no"}
      }
    },
    DiscountableFlg: {
      "@": {
        "value": {type:String, default:"yes"}
      }
    },
    QuantityAllowedFlg: {
      "@": {
        "value":{type:String, default:"yes"}
      }
    },
    QuantityRequiredFlg: {
      "@": {
        "value": {type:String, default:"no"}
      }
    },
    ActiveFlag: {
      "@": {
        "value": {type:String, default:"yes"}
      }
    }
});

IttdataSchema.methods = {
  getNextId(callback) {
    counter.findByIdAndUpdate({_id: 'itemID'}, {$inc: { seq: 1} }, function(error, counter)   {
      callback(error,counter);
  });
  }
}

export default mongoose.model('ITTData', IttdataSchema);
