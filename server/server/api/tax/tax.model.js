'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TaxSchema = new mongoose.Schema({
	TaxStrategyID: Number,
	TaxDescription: String,
	TaxReceiptDescription: String,
	TaxPrintGroupCode:Number,
	TaxPrintReceiptIndicator:String,
	TaxPrintReceiptLegend:String,
	TaxLevelDetail:{
		TaxLevelID:Number,
		TaxDescription:String,
		TaxReceiptDescription:String,
		TaxRateType:String,
		TaxTypeCode:String,
		MinimumTaxableAmount:Number,
		TaxRate:Number
	}
});

export default mongoose.model('Tax', TaxSchema);