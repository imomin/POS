'use strict';


class AdminController {
	//start-non-standard
	errors = {};
	submitted = false;
	//end-non-standard

	constructor(Admin,FileUploader) {
		this.Admin = Admin;
		this.uploader = new FileUploader({
            url:'/admin/upload'
        });
        this.uploader.filters.push({
	        name: 'xmlFilter',
	        fn: function(item /*{File|FileLikeObject}*/, options) {
	        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
	          return '|xml|'.indexOf(type) !== -1;
	        }
	      });
	}

    importData(form) {
	    this.submitted = true;
		this.Admin.importData({})
		.then((res) => {
			debugger;
		})
		.catch(err => {
			debugger;
		this.errors.other = err.message;
		});
	}
    exportData(form) {
	    this.submitted = true;
		this.Admin.exportData({})
		.then((res) => {
			var xmltext = res.data;
			var pom = document.createElement('a');

			var filename = "PassportDataMaintenance.xml";
			var pom = document.createElement('a');
			var bb = new Blob([xmltext], {type: 'text/plain'});

			pom.setAttribute('href', window.URL.createObjectURL(bb));
			pom.setAttribute('download', filename);

			pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
			pom.draggable = true; 
			pom.classList.add('dragout');

			pom.click();
		})
		.catch(err => {
			debugger;
		this.errors.other = err.message;
		});
	}
}

angular.module('serverApp')
  .controller('AdminController', AdminController);
