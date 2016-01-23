// var OutBoxWatcher = require('./OutBoxWatcher');
// var outBoxWatcher = new OutBoxWatcher({
// 	storeId:'client1234',
//   	serverURL:'http://localhost:3005',
//   	boOutBoxPath:'./outBox'
// });
// outBoxWatcher.start();



var InBoxListener = require('./InBoxListener');
InBoxListener.start();
