'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var MerchandisecodeSchema = new mongoose.Schema({
	MerchandiseCode: {type:Number, unique: true, require: true},
	MerchandiseCodeDescription:{type:String, require: true},
	PaymentSystemsProductCode: {type:Number, default: 400},
	TaxStrategyID: {type: Number, enum: [101, 99]}, //101=taxable, 99=non-taxable
	FoodStampableFlg: {type:Boolean, default: false},
	DiscountableFlg: {type:Boolean, default: true},
	DepartmentKeyAtPOS:{type:Number, default: 0},
	ActiveFlag:{
		"@": {
			value:String
		}
	},
	NegativeFlag:{
		"@": {
			value:String
		}
	}
});

export default mongoose.model('Merchandisecode', MerchandisecodeSchema);


// {
// 	"RecordAction": {
// 	"$": {
// 	  "type": "addchange"
// 	}
// 	},
// 	"MerchandiseCode": "1",
// 	"ActiveFlag": {
// 	"$": {
// 	  "value": "yes"
// 	}
// 	},
// 	"MerchandiseCodeDescription": "Tax",
// 	"PaymentSystemsProductCode": "400",
// 	"TaxStrategyID": "101",
// 	"NegativeFlag": {
// 	"$": {
// 	  "value": "no"
// 	}
// 	},
// 	"FoodstampableFlg": "0",
// 	"DiscountableFlg": "0",
// 	"DepartmentKeyAtPOS": "1"
// }

// <MCTDetail>
//   <RecordAction type="addchange"/>
//   <MerchandiseCode>1</MerchandiseCode>
//   <ActiveFlag value="yes"/>
//   <MerchandiseCodeDescription>Tax</MerchandiseCodeDescription>
//   <PaymentSystemsProductCode>400</PaymentSystemsProductCode>
//   <TaxStrategyID>101</TaxStrategyID>
//   <NegativeFlag value="no"/>
//   <FoodstampableFlg>0</FoodstampableFlg>
//   <DiscountableFlg>0</DiscountableFlg>
//   <DepartmentKeyAtPOS>1</DepartmentKeyAtPOS>
// </MCTDetail>