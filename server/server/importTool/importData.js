'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray:false,attrkey:'$'});
var builder = new xml2js.Builder();
var fileDir = __dirname + '/../../../PassportDataMaintenance.xml';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import Store from '../api/store/store.model';
import Tax from '../api/tax/tax.model';
import MerchandiseCode from '../api/merchandisecode/merchandisecode.model';
import Counter from '../api/counter/counter.model';
import Item from '../api/item/item.model';

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};
console.log("###############Start############");
fs.readFile(fileDir, function(err, data) {
    parser.parseString(data, function (err, data) {
    	if(err) {
    		console.log(err);
    		process.exit(-1);
    	}

		Store.find({}).removeAsync()
			.then(() => {
				Store.createAsync(data.PassportDataMaintenance.Header)
					.then(() => {
					  console.log('finished populating Store');
					})
					.catch(err => {
						console.log('ERROR populating Store Info');
					});
			});

    	var taxDetails = data.PassportDataMaintenance.TaxMaintenance.TaxMaintenanceDetail;
		Tax.find({}).removeAsync()
		.then(() => {
			Tax.createAsync(taxDetails)
				.then(() => {
				  console.log('finished populating tax information');
				})
				.catch(err => {
					console.log('ERROR populating Tax info');
				});
		});

    	var discountDetails = data.PassportDataMaintenance.DiscountMaintenance;
    	/* load existing discount details. */

    	var trackMerchandiseCode = {};
    	var departmentCode = {}
		var merchandiseDetails = data.PassportDataMaintenance.MerchandiseCodeMaintenance.MCTDetail;
		MerchandiseCode.find({}).removeAsync().then(() => {});
		_.forEach(merchandiseDetails,function(departmentCode, index){
				trackMerchandiseCode[departmentCode.MerchandiseCode] = {'seqId':null, 'id':null};
				Counter.findByIdAndUpdateAsync({_id: 'departmentMerchandiseCode'}, {$inc: { seq: 1} })
			    .then(function (result) {
			    	console.log('>>>>>' + departmentCode.MerchandiseCode);
			    	trackMerchandiseCode[departmentCode.MerchandiseCode].seqId = result.seq;
					departmentCode.MerchandiseCode = result.seq;
					var temp = JSON.stringify(departmentCode).replaceAll('"$":','"@":');
					departmentCode = JSON.parse(temp);
			    	MerchandiseCode.createAsync(departmentCode)
					.then((entity) => {
						_.forEach(trackMerchandiseCode,function(value, key){
							if(value.seqId === entity.MerchandiseCode){
								trackMerchandiseCode[key].id = entity._id;
							}
						});
						console.log(trackMerchandiseCode);
					  	console.log('finished populating merchandiseDetails information');
					})
					.catch(err => {
						console.log('ERROR populating merchandiseDetails info');
						console.log(err);
					});
			    })
			    .catch(function (err) {
			    	console.log(err);
			    });
		});

    	var itemDetails = data.PassportDataMaintenance.ItemMaintenance.ITTDetail;
    	var trackGroups={};
    	Item.find({}).removeAsync().then(() => {
    		_.forEach(itemDetails,function(itemMaintenance, index){
				if(!trackGroups[itemMaintenance.ITTData.ItemID]){
					Counter.findByIdAndUpdateAsync({_id: 'itemID'}, {$inc: { seq: 1} })
					.then(function(result) {
						trackGroups[itemMaintenance.ITTData.ItemID] = {
							'MerchandiseCode':trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].seqId,
							'RegularSellPrice':itemMaintenance.ITTData.RegularSellPrice,
							'Description':itemMaintenance.ITTData.Description,
							'ItemID':result.seq,
							'departmentId':trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].id
						};
						itemMaintenance.department = mongoose.Types.ObjectId(trackGroups[itemMaintenance.ITTData.ItemID].departmentId);
						itemMaintenance.ITTData.MerchandiseCode = trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].seqId;
						itemMaintenance.ITTData.RegularSellPrice = trackGroups[itemMaintenance.ITTData.ItemID].RegularSellPrice;
						itemMaintenance.ITTData.Description = trackGroups[itemMaintenance.ITTData.ItemID].Description;
						itemMaintenance.ITTData.ItemID = trackGroups[itemMaintenance.ITTData.ItemID].ItemID;
						var temp = JSON.stringify(itemMaintenance).replaceAll('"$":','"@":');
						itemMaintenance = JSON.parse(temp);
				    	Item.createAsync(itemMaintenance)
						.then(() => {
						  console.log('finished populating itemMaintenance information');
						})
						.catch(err => {
							console.log('ERROR populating itemMaintenance info');
							console.log("***************$$**************");
							console.log(JSON.stringify(itemMaintenance));
							console.log("***************$$**************");
							console.log(err);
							setTimeout(function(){process.exit(-1)},100);
						});
					})
					.catch(function(err){
						console.log(err);
					});
				}
				else {
					itemMaintenance.department = mongoose.Types.ObjectId(trackGroups[itemMaintenance.ITTData.ItemID].departmentId);
					itemMaintenance.ITTData.MerchandiseCode = trackGroups[itemMaintenance.ITTData.ItemID].MerchandiseCode;
					itemMaintenance.ITTData.RegularSellPrice = trackGroups[itemMaintenance.ITTData.ItemID].RegularSellPrice;
					itemMaintenance.ITTData.Description = trackGroups[itemMaintenance.ITTData.ItemID].Description;
					itemMaintenance.ITTData.ItemID = trackGroups[itemMaintenance.ITTData.ItemID].ItemID;
					var temp = JSON.stringify(itemMaintenance).replaceAll('"$":','"@":');
					itemMaintenance = JSON.parse(temp);
			    	Item.createAsync(itemMaintenance)
					.then(() => {
					  console.log('finished populating itemMaintenance information');
					})
					.catch(err => {
						console.log('ERROR populating itemMaintenance info');
						console.log("***************$$**************");
						console.log(JSON.stringify(itemMaintenance));
						console.log("***************$$**************");
						console.log(err);
						setTimeout(function(){process.exit(-1)},100);
					});
				}
			});
    	});
		// var xml = builder.buildObject(data);
		// console.log(xml);
        console.log('Done');
    });
});