'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var counter = require('./../counter/counter.model');
var Promise = require('promise');
var fs = require('fs');
import config from '../../config/environment';

var DepartmentSchema = new mongoose.Schema({
	merchandiseCode:{type:Number, unique: true, require: true}, //implement this on Create {$inc: { merchandiseCode: 1} }
	merchandiseCodeDescription:{type:String, require: true},
	paymentSystemsProductCode: {type:Number, default: 400},
	taxStrategyID: {type: Number, enum: [101, 99]}, //101=taxable, 99=non-taxable
	foodStampableFlg: {type:Boolean, default: false},
	discountableFlg: {type:Boolean, default: true},
	departmentKeyAtPOS:{type:Number, default: 0}, 
	activeFlag: {type:Boolean, default: true}
});

DepartmentSchema.methods = {
  getNextId(callback) {
   	counter.findByIdAndUpdate({_id: 'departmentMerchandiseCode'}, {$inc: { seq: 1} }, function(error, counter)   {
    	callback(error,counter);
	});
  },
  generateXMLFile(action, entity) {
    var template = '<?xml version="1.0" encoding="UTF-8"?>' + 
      '<NAXML-MaintenanceRequest>' + 
         '<MerchandiseCodeMaintenance>' + 
            '<RecordAction type="addchange" />' + 
            '<MCTDetail>' + 
               '<RecordAction type="'+ action +'" />' + 
               '<MerchandiseCode>'+ entity.merchandiseCode +'</MerchandiseCode>' + 
               '<ActiveFlag value="yes" />' + 
               '<MerchandiseCodeDescription>'+ entity.merchandiseCodeDescription +'</MerchandiseCodeDescription>' + 
               '<PaymentSystemsProductCode>400</PaymentSystemsProductCode>' + 
               '<TaxStrategyID>'+ entity.taxStrategyID +'</TaxStrategyID>' + 
               '<NegativeFlag value="no" />' + 
               '<FoodstampableFlg>'+ entity.foodStampableFlg +'</FoodstampableFlg>' + 
               '<DiscountableFlg>1</DiscountableFlg>' + 
               '<DepartmentKeyAtPOS>0</DepartmentKeyAtPOS>' + 
            '</MCTDetail>' + 
         '</MerchandiseCodeMaintenance>' + 
      '</NAXML-MaintenanceRequest>';
      return new Promise(function (resolve, reject) {
        console.log(config.xmlDistPath);
          fs.writeFile(config.xmlDistPath+Math.floor(Math.random()*100000000)+'.xml', template, 'utf8', function(err) {
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
export default mongoose.model('Department', DepartmentSchema);

// <?xml version="1.0" encoding="UTF-8"?>
// <NAXML-MaintenanceRequest>
//    <MerchandiseCodeMaintenance>
//       <RecordAction type="addchange" />
//       <MCTDetail>
//          <RecordAction type="create" />
//          <MerchandiseCode>13</MerchandiseCode>
//          <ActiveFlag value="yes" />
//          <MerchandiseCodeDescription>Test</MerchandiseCodeDescription>
//          <PaymentSystemsProductCode>400</PaymentSystemsProductCode>
//          <TaxStrategyID>101</TaxStrategyID>
//          <NegativeFlag value="no" />
//          <FoodstampableFlg>0</FoodstampableFlg>
//          <DiscountableFlg>1</DiscountableFlg>
//          <DepartmentKeyAtPOS>0</DepartmentKeyAtPOS>
//       </MCTDetail>
//    </MerchandiseCodeMaintenance>
// </NAXML-MaintenanceRequest>