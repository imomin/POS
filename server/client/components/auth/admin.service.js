'use strict';

(function() {

function AdminResource($location, $http, $cookies, $q, appConfig, Util, Auth) {
  var Admin = {
    importData(data, callback) {
      return $http.get('/admin/example', {})
        .then(res => {
          return $q.resolve(res);
        })
        .catch(err => {
          return $q.reject(err.data);
        });
    },
    exportData(data, callback) {
      return $http.get('/admin/export', {})
        .then(res => {
          return $q.resolve(res);
        })
        .catch(err => {
          return $q.reject(err.data);
        });
    }
  }
  return Admin;
}

angular.module('serverApp.auth')
  .factory('Admin', AdminResource);

})();
