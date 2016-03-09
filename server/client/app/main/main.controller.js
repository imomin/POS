'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket) {
    this.$http = $http;
    this.awesomeThings = [];
  }
}

angular.module('serverApp')
  .controller('MainController', MainController);

})();