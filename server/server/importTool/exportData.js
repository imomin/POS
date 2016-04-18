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

export function init(){
	return new Promise(function (resolve, reject) {
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
								Item.find({},'-_id -__v -department')
								.populate('ITTData','-_id -__v -MerchandiseCodeDetails')
								.execAsync()
								.then(items => {
									data.PassportDataMaintenance.ItemMaintenance.ITTDetail = items;
									var xml = json2xml(data);
									resolve(xml);
								})
								.catch(function(err){
									err.logMessage = "Error getting ItemMaintenance data.";
									reject(err);
								});
							})
							.catch(function(err){
								console.log(err);
								err.logMessage = "Error getting MerchandiseCode data.";
						    	reject(err);
						    });
	    			})
	    			.catch(function(err){
	    				err.logMessage = "Error getting Tax data.";
				    	reject(err);
				    });
	    	})
	    .catch(function(err){
	    	err.logMessage = "Error getting Store data.";
	    	reject(err);
	    });
	});
}

function json2xml(data){
	//console.log(JSON.stringify(data));
	var temp = JSON.stringify(data).replaceAll('"@":','"$":');
	data = JSON.parse(temp);
	return builder.buildObject(data);
}