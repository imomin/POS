'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray:false,attrkey:'$'});
var builder = new xml2js.Builder();
import Store from '../api/store/store.model';
import Tax from '../api/tax/tax.model';
import MerchandiseCode from '../api/merchandisecode/merchandisecode.model';
import Counter from '../api/counter/counter.model';
import Item from '../api/item/item.model';

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

var data = {'PassportDataMaintenance':{
			'Header':{},
			'TaxMaintenance':{'PSTCaccadedOnGST': 'False','TaxMaintenanceDetail':{}},
			'DiscountMaintenance':{},
			'MerchandiseCodeMaintenance': {'TableAction': {'$': {'type': 'update'}},'RecordAction':{'$':{'type':'addchange'}},'MCTDetail':[]},
			'ItemMaintenance': {'TableAction':{'$':{'type': 'initialize'}},'RecordAction':{'$':{'type':'addchange'}},'ITTDetail':[]}
		}};

	Store.findAsync({},'-_id -__v')
    	.then(storeInfo => {
    		data.PassportDataMaintenance.Header = storeInfo[0];
    		Tax.findAsync({},'-_id -__v')
    			.then(taxInfo => {
    				data.PassportDataMaintenance.TaxMaintenance.TaxMaintenanceDetail = taxInfo;
					MerchandiseCode.findAsync({},'-_id -__v')
						.then(departments => {
							data.PassportDataMaintenance.MerchandiseCodeMaintenance.MCTDetail = departments;
							Item.findAsync({},'-_id -__v -department')
								.then(items => {
									data.PassportDataMaintenance.ItemMaintenance.ITTDetail = items;
									json2xml(data);
								})
								.catch(function(err){
							    	console.log(err);
							    	console.log("Error getting MerchandiseCode data.");
							    });
						})
						.catch(function(err){
					    	console.log(err);
					    	console.log("Error getting MerchandiseCode data.");
					    });
    			})
    			.catch(function(err){
			    	console.log(err);
			    	console.log("Error getting Tax data.");
			    });
    	})
    .catch(function(err){
    	console.log(err);
    	console.log("Error getting Store data.");
    });


function json2xml(data){
	console.log(JSON.stringify(data));
	var temp = JSON.stringify(data).replaceAll('"@":','"$":');
	data = JSON.parse(temp);
	var xml = builder.buildObject(data);
	console.log(xml);
}