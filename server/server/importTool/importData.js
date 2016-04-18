'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray:false,attrkey:'$'});
var builder = new xml2js.Builder();
var Promise = require('promise');
var fileDir = __dirname + '/../../../PassportDataMaintenance.xml';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import Store from '../api/store/store.model';
import Tax from '../api/tax/tax.model';
import MerchandiseCode from '../api/merchandisecode/merchandisecode.model';
import Counter from '../api/counter/counter.model';
import ITTGroup from '../api/ittdata/ittdata.model';
import Item from '../api/item/item.model';
var data;
var trackMerchandiseCode = {};
var trackGroups={};

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};


export function init(){
  return new Promise(function (resolve, reject) {
  	console.log("test1");
  	readData(fileDir, function(err, jsonData){
		if(err) {
			console.log("error1");
			reject(err);
		}
		console.log("test2");
		data = jsonData;
		console.log(data);
		loadStoreInfo();
		loadTaxInfo();
		loadDiscountInfo();
		loadMerchandiseCodes(function() {
			console.log("test3");
			console.log("done loading merchandisecode");
			loadGroup(function(){
				console.log("test4");
				resolve({'done':true});
			});
		});
	});
  });
}
// readData(function(err, jsonData){
// 	if(err) {
// 		console.log(err);
// 		process.exit(-1);
// 	}
// 	data = jsonData;
// 	loadStoreInfo();
// 	loadTaxInfo();
// 	loadDiscountInfo();
// 	loadMerchandiseCodes(function(){
// 		console.log("done loading merchandisecode");
// 		loadGroup();
// 	});
// });

function getNextSequence(name) {
   var ret = Counter.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );
   return ret.seq;
}

function readData(file, callback){
	console.log("test1-1");
	fs.readFile(fileDir, function(err, data) {
	    parser.parseString(data, callback);
	})
}

function loadStoreInfo(){
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
}
function loadTaxInfo(){
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
}
function loadDiscountInfo(){
	var discountDetails = data.PassportDataMaintenance.DiscountMaintenance;
    	/* load existing discount details. */
}
function loadMerchandiseCodes(callback){
	var departmentCode = {}
	var counter = 0;
	var merchandiseDetails = data.PassportDataMaintenance.MerchandiseCodeMaintenance.MCTDetail;
	console.log(merchandiseDetails.length);
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
				counter=counter+1;
				console.log(counter);
				if(merchandiseDetails.length === counter){
					callback();
				}
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
}

function loadGroup(callback){
	var itemDetails = data.PassportDataMaintenance.ItemMaintenance.ITTDetail;
	var counter = 0;
	var nextId;
	Counter.findByIdAsync({_id: 'itemID'})
	.then(function(result){
		nextId = result.seq+1;
		_.forEach(itemDetails,function(itemMaintenance, index) {

			if(!trackGroups[itemMaintenance.ITTData.ItemID]){
				itemMaintenance.ITTData.MerchandiseCodeDetails = mongoose.Types.ObjectId(trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].id);
				itemMaintenance.ITTData.MerchandiseCode = trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].seqId;
				trackGroups[itemMaintenance.ITTData.ItemID] = itemMaintenance.ITTData;
				trackGroups[itemMaintenance.ITTData.ItemID].ItemID = nextId;
				nextId = nextId + 1;
			}

			if(index === itemDetails.length -1) {
				Counter.findByIdAndUpdateAsync({_id: 'itemID'}, {'seq': nextId});
				ITTGroup.find({}).removeAsync().then(() => {
					_.forEach(trackGroups,function(group, key){
						//console.log('************GROUP**************');
						//console.log(trackGroups[key]);
				    	ITTGroup.createAsync(group)
						.then((entity) => {
							trackGroups[key].id = entity._id;
							//console.log('************UPDATE GROUP**************');
							//console.log(trackGroups[key]);
							counter=counter+1;
							//console.log(counter +' = '+ _.size(trackGroups));
							if(_.size(trackGroups) === counter){
								loadItems(callback)
							}
						})
						.catch(err => {
							console.log('ERROR populating ITTGroup info');
							console.log(err);
						});
					})
				});
			};
				// loadItems();
		});
	});
}


function loadItems(callback){
	var itemDetails = data.PassportDataMaintenance.ItemMaintenance.ITTDetail;
	var counter = 0;

 	Item.find({}).removeAsync().then(() => {
		_.forEach(itemDetails,function(itemMaintenance, index){
			// itemMaintenance.department = mongoose.Types.ObjectId(trackGroups[itemMaintenance.ITTData.ItemID].departmentId);
			// itemMaintenance.ITTData.MerchandiseCode = trackGroups[itemMaintenance.ITTData.ItemID].MerchandiseCode;
			// itemMaintenance.ITTData.RegularSellPrice = trackGroups[itemMaintenance.ITTData.ItemID].RegularSellPrice;
			// itemMaintenance.ITTData.Description = trackGroups[itemMaintenance.ITTData.ItemID].Description;
			// itemMaintenance.ITTData.ItemID = trackGroups[itemMaintenance.ITTData.ItemID].ItemID;
			counter=counter+1;
			if(trackGroups[itemMaintenance.ITTData.ItemID]){
				itemMaintenance.ITTData = mongoose.Types.ObjectId(trackGroups[itemMaintenance.ITTData.ItemID].id);
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
			if(_.size(itemDetails) === counter){
				callback();
			}
		});
	});
}


// function loadGroupIDs(){
// 	var itemDetails = data.PassportDataMaintenance.ItemMaintenance.ITTDetail;
// 	var counter = 0;
// 	var nextId;
// 	Counter.findByIdAsync({_id: 'itemID'})
// 	.then(function(result){
// 		nextId = result.seq+1;
// 		_.forEach(itemDetails,function(itemMaintenance, index){
// 			if(!trackGroups[itemMaintenance.ITTData.ItemID]){
// 				trackGroups[itemMaintenance.ITTData.ItemID] = {
// 						'MerchandiseCode':trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].seqId,
// 						'RegularSellPrice':itemMaintenance.ITTData.RegularSellPrice,
// 						'Description':itemMaintenance.ITTData.Description,
// 						'ItemID':getNextSequence('itemID'),
// 						'departmentId':trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].id
// 					};
// 				nextId = nextId + 1;
// 			}
// 			if(index === itemDetails.length -1){
// 				Counter.findByIdAndUpdateAsync({_id: 'itemID'}, {'seq': nextId});
// 				loadItems();
// 			}
// 		});
// 	});
// }

// console.log("###############Start############");
// fs.readFile(fileDir, function(err, data) {
//     parser.parseString(data, function (err, data) {
//     	if(err) {
//     		console.log(err);
//     		process.exit(-1);
//     	}

// 		Store.find({}).removeAsync()
// 			.then(() => {
// 				Store.createAsync(data.PassportDataMaintenance.Header)
// 					.then(() => {
// 					  console.log('finished populating Store');
// 					})
// 					.catch(err => {
// 						console.log('ERROR populating Store Info');
// 					});
// 			});

//     	var taxDetails = data.PassportDataMaintenance.TaxMaintenance.TaxMaintenanceDetail;
// 		Tax.find({}).removeAsync()
// 		.then(() => {
// 			Tax.createAsync(taxDetails)
// 				.then(() => {
// 				  console.log('finished populating tax information');
// 				})
// 				.catch(err => {
// 					console.log('ERROR populating Tax info');
// 				});
// 		});

//     	var discountDetails = data.PassportDataMaintenance.DiscountMaintenance;
//     	/* load existing discount details. */

//     	var trackMerchandiseCode = {};
//     	var departmentCode = {}
//     	var counter = 0;
// 		var merchandiseDetails = data.PassportDataMaintenance.MerchandiseCodeMaintenance.MCTDetail;
// 		console.log(merchandiseDetails.length);
// 		MerchandiseCode.find({}).removeAsync().then(() => {});
// 		_.forEach(merchandiseDetails,function(departmentCode, index){
// 				trackMerchandiseCode[departmentCode.MerchandiseCode] = {'seqId':null, 'id':null};
// 				Counter.findByIdAndUpdateAsync({_id: 'departmentMerchandiseCode'}, {$inc: { seq: 1} })
// 			    .then(function (result) {
// 			    	console.log('>>>>>' + departmentCode.MerchandiseCode);
// 			    	trackMerchandiseCode[departmentCode.MerchandiseCode].seqId = result.seq;
// 					departmentCode.MerchandiseCode = result.seq;
// 					var temp = JSON.stringify(departmentCode).replaceAll('"$":','"@":');
// 					departmentCode = JSON.parse(temp);
// 			    	MerchandiseCode.createAsync(departmentCode)
// 					.then((entity) => {
// 						_.forEach(trackMerchandiseCode,function(value, key){
// 							if(value.seqId === entity.MerchandiseCode){
// 								trackMerchandiseCode[key].id = entity._id;
// 							}
// 						});
// 						counter=counter+1;
// 						console.log(counter);
// 						if(merchandiseDetails.length === counter){
// 							console.log("MOVE ON TO NEXT");
// 						}
// 						console.log(trackMerchandiseCode);
// 					  	console.log('finished populating merchandiseDetails information');
// 					})
// 					.catch(err => {
// 						console.log('ERROR populating merchandiseDetails info');
// 						console.log(err);
// 					});

// 			    })
// 			    .catch(function (err) {
// 			    	console.log(err);
// 			    });
// 		});

//     	var itemDetails = data.PassportDataMaintenance.ItemMaintenance.ITTDetail;
//     	var trackGroups={};
//     	var counterItem = 0;

   //  	Item.find({}).removeAsync().then(() => {
   //  		_.forEach(itemDetails,function(itemMaintenance, index){
   //  			console.log("**********************"+ itemMaintenance.ITTData.ItemID +"*********************");
   //  			console.log(!trackGroups[itemMaintenance.ITTData.ItemID]);
   //  			trackGroups[itemMaintenance.ITTData.ItemID] = null;
			// 	if(trackGroups[itemMaintenance.ITTData.ItemID] === null){
			// 		Counter.findByIdAndUpdateAsync({_id: 'itemID'}, {$inc: { seq: 1} })
			// 		.then(function(result) {
			// 			console.log("**********************"+ itemMaintenance.ITTData.ItemID +">>>>>"+ result.seq +"**********");
			// 			trackGroups[itemMaintenance.ITTData.ItemID] = {
			// 				'MerchandiseCode':trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].seqId,
			// 				'RegularSellPrice':itemMaintenance.ITTData.RegularSellPrice,
			// 				'Description':itemMaintenance.ITTData.Description,
			// 				'ItemID':result.seq,
			// 				'departmentId':trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].id
			// 			};
			// 			// itemMaintenance.department = mongoose.Types.ObjectId(trackGroups[itemMaintenance.ITTData.ItemID].departmentId);
			// 			// itemMaintenance.ITTData.MerchandiseCode = trackMerchandiseCode[itemMaintenance.ITTData.MerchandiseCode].seqId;
			// 			// itemMaintenance.ITTData.RegularSellPrice = trackGroups[itemMaintenance.ITTData.ItemID].RegularSellPrice;
			// 			// itemMaintenance.ITTData.Description = trackGroups[itemMaintenance.ITTData.ItemID].Description;
			// 			// itemMaintenance.ITTData.ItemID = trackGroups[itemMaintenance.ITTData.ItemID].ItemID;
			// 			// var temp = JSON.stringify(itemMaintenance).replaceAll('"$":','"@":');
			// 			// itemMaintenance = JSON.parse(temp);
			// 	  //   	Item.createAsync(itemMaintenance)
			// 			// .then(() => {
			// 			//   console.log('finished populating itemMaintenance information');
			// 			// })
			// 			// .catch(err => {
			// 			// 	console.log('ERROR populating itemMaintenance info');
			// 			// 	console.log("***************$$**************");
			// 			// 	console.log(JSON.stringify(itemMaintenance));
			// 			// 	console.log("***************$$**************");
			// 			// 	console.log(err);
			// 			// 	setTimeout(function(){process.exit(-1)},100);
			// 			// });
			// 		})
			// 		.catch(function(err){
			// 			console.log(err);
			// 		});
			// 	}
			// 	else {
			// 		console.log("***********ELSE***********"+ itemMaintenance.ITTData.ItemID +">>>>>"+ trackGroups[itemMaintenance.ITTData.ItemID].ItemID +"**********");
			// 		// itemMaintenance.department = mongoose.Types.ObjectId(trackGroups[itemMaintenance.ITTData.ItemID].departmentId);
			// 		// itemMaintenance.ITTData.MerchandiseCode = trackGroups[itemMaintenance.ITTData.ItemID].MerchandiseCode;
			// 		// itemMaintenance.ITTData.RegularSellPrice = trackGroups[itemMaintenance.ITTData.ItemID].RegularSellPrice;
			// 		// itemMaintenance.ITTData.Description = trackGroups[itemMaintenance.ITTData.ItemID].Description;
			// 		// itemMaintenance.ITTData.ItemID = trackGroups[itemMaintenance.ITTData.ItemID].ItemID;
			// 		// var temp = JSON.stringify(itemMaintenance).replaceAll('"$":','"@":');
			// 		// itemMaintenance = JSON.parse(temp);
			//   //   	Item.createAsync(itemMaintenance)
			// 		// .then(() => {
			// 		//   console.log('finished populating itemMaintenance information');
			// 		// })
			// 		// .catch(err => {
			// 		// 	console.log('ERROR populating itemMaintenance info');
			// 		// 	console.log("***************$$**************");
			// 		// 	console.log(JSON.stringify(itemMaintenance));
			// 		// 	console.log("***************$$**************");
			// 		// 	console.log(err);
			// 		// 	setTimeout(function(){process.exit(-1)},100);
			// 		// });
			// 	}
			// 	console.log("**********************"+ JSON.stringify(trackGroups) +"**********");
			// });
   //  	});
		// var xml = builder.buildObject(data);
		// console.log(xml);
        console.log('Done');
    // });
// });