"use strict";
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
//var io = require('socket.io')(server);
var fs = require('fs');


var _options = {};
var InBoxListener = function() {}
//NOTE IF THIS PI IS ACCESSED FOR THE FIRST TIME PROMPT TO CREATE A PASSWORD.
//PASSWORD WILL BE STORED ON PI AND MUST BE USED BY OTHER MOBILE DEVICE TO CONNECT WITH THIS PI.
//THIS IS TO PREVENT "OUTSIDERS" TO DOWNLOAD THE APP AND ANONYMOUSLY ACCESS THE PI WITHOUT AUTHORIZATION.
//**OPTIONAL PASSWORD SHOULD BE RESETABLE TO PREVENT EX-EMPLOYEE TO COME BACK AND CHANGE IT.
InBoxListener.prototype.start = function(){
	console.log("waiting for data");
	app.get('/', function(req, res){
		res.send({'localServer':'running'});
		res.end();
	});
	app.get('/getInfo', function(req, res){
		res.send({'localServer':'running'});
		res.end();
	});
	app.post('/getInfo', function(req, res){
		res.send({'localServer':'running'});
		res.end();
	});

	server.listen(3006, function(){
		console.log('Magic happens on port 3006');
	});
}

function createFile(fileName,content){
	fs.writeFile('./inBox/'+fileName, content, 'utf8', function(err){
		if(err) {console.log(err)}
	});
}

//Pricing
function addPrice(){
	var xmlTemplate = '';
}

function updatePrice(POSCode,Description){
	var xmlTemplate = '<NAXML-MaintenanceRequest version="3.4">' +
'	<TransmissionHeader>' +
'		<StoreLocationID>1</StoreLocationID>' +
'		<VendorName>test</VendorName>' +
'		<VendorModelVersion>test</VendorModelVersion>' +
'	</TransmissionHeader>' +
'	<ItemMaintenance>' +
'		<TableAction type="update"/>' +
'		<RecordAction type="addchange"/>' +
'		<ITTDetail>' +
'			<RecordAction type="addchange"></RecordAction>' +
'			<ItemCode>' +
'				<POSCodeFormat format="plu"></POSCodeFormat>' +
'				<POSCode>99999</POSCode>' +
'				<POSCodeModifier>0</POSCodeModifier>' +
'			</ItemCode>' +
'			<ITTData>' +
'				<ActiveFlag value="Yes"></ActiveFlag>' +
'				<InventoryValuePrice>0.10</InventoryValuePrice>' +
'				<MerchandiseCode>2</MerchandiseCode>' +
'				<RegularSellPrice>0.10</RegularSellPrice>' +
'				<Description>bottle charge</Description>' +
'				<PaymentSystemsProductCode>400</PaymentSystemsProductCode>' +
'				<SellingUnits>1</SellingUnits>' +
'			</ITTData>' +
'		</ITTDetail>' +
'	</ItemMaintenance>' +
'</NAXML-MaintenanceRequest>';
}

function removeItem(){
	var xmlTemplate = '';
}

//Deals
function addDeal(){
	//<!-- The following xml file is the minimum of tags required to create an Combo Promotion -->
	//<!-- The corresponding ILT file is required -->
	var xmlTemplate = '<?xml version="1.0"?>' +
'<NAXML-MaintenanceRequest>' +
'	<ComboMaintenance>' +
'		<RecordAction type="addchange"/>' +
'		<CBTDetail>' +
'			<Promotion>' +
'				<PromotionID>101</PromotionID>' +
'				<PromotionReason>combinationOffer</PromotionReason>' +
'			</Promotion>' +
'			<ComboDescription>Beer and Coke Combo</ComboDescription>' +
'			<ComboPrice>2</ComboPrice>' +
'			<ComboList>' +
'				<ComboItemList>' +
'					<ItemListID>1000001</ItemListID>' +
'					<ComboItemQuantity>1</ComboItemQuantity>' +
'					<ComboItemUnitPrice>1</ComboItemUnitPrice>' +
'				</ComboItemList>' +
'				<ComboItemList>' +
'					<ItemListID>1000002</ItemListID>' +
'					<ComboItemQuantity>1</ComboItemQuantity>' +
'					<ComboItemUnitPrice>1</ComboItemUnitPrice>' +
'				</ComboItemList>' +
'			</ComboList>' +
'			<StartDate>2009-01-01</StartDate>' +
'			<StartTime>00:00:01</StartTime>' +
'			<StopDate>2009-12-31</StopDate>' +
'			<StopTime>23:59:59</StopTime>' +
'		</CBTDetail>' +
'	</ComboMaintenance>' +
'</NAXML-MaintenanceRequest>';
}

function removeDeal(){
	var xmlTemplate = '';
}

function mixMatchDeal(desc,item){
	//<!-- The following xml file is the minimum of tags required to create an Mix & Match Promotion -->
	//<!-- The corresponding ILT file is required -->
	var xmlTemplate = '<?xml version="1.0"?>' +
'<NAXML-MaintenanceRequest>' +
'	<MixMatchMaintenance>' +
'		<RecordAction type="addchange"/>' +
'		<MMTDetail>' +
'			<Promotion>' +
'				<PromotionID>102</PromotionID>' +
'				<PromotionReason>MixAndMatchOffer</PromotionReason>' +
'			</Promotion>' +
'			<MixMatchDescription>Any 2 Beers for $3 </MixMatchDescription>' +
'			<ItemListID>1000001</ItemListID>' +
'			<StartDate>2009-01-01</StartDate>' +
'			<StartTime>00:00:01</StartTime>' +
'			<StopDate>2009-12-31</StopDate>' +
'			<StopTime>23:59:59</StopTime>' +
'			<MixMatchEntry>' +
'				<MixMatchUnits>2.000</MixMatchUnits>' +
'				<MixMatchPrice>3</MixMatchPrice>' +
'			</MixMatchEntry>' +
'		</MMTDetail>' +
'	</MixMatchMaintenance>' +
'</NAXML-MaintenanceRequest>';
}


//Category
function addCategory() {
	var xmlTemplate = '';
}

function updateCategory(code, desc ) {
	var xmlTemplate = '<?xml version="1.0" encoding="utf-8"?>' +
	'<NAXML-MaintenanceRequest>' +
	'<MerchandiseCodeMaintenance>' +
	'	<RecordAction type="addchange" />' +
	'	<MCTDetail>' +
	'		<RecordAction type="addchange"/>' +
	'		<MerchandiseCode>11</MerchandiseCode>' +
	'		<ActiveFlag value="yes"/>' +
	'		<MerchandiseCodeDescription>ICEE</MerchandiseCodeDescription>' +
	'		<PaymentSystemsProductCode>400</PaymentSystemsProductCode>' +
	'		<TaxStrategyID>101</TaxStrategyID>' +
	'		<NegativeFlag value="no"/>' +
	'		<FoodstampableFlg>0</FoodstampableFlg>' +
	'		<DiscountableFlg>1</DiscountableFlg>' +
	'		<DepartmentKeyAtPOS>1</DepartmentKeyAtPOS>' +
	'	</MCTDetail>' +
	'</MerchandiseCodeMaintenance>' +
	'</NAXML-MaintenanceRequest>';

}

function removeCategory() {
	var xmlTemplate = '';
}


module.exports = new InBoxListener();