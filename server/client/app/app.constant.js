(function(angular, undefined) {
'use strict';

angular.module('serverApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin']})

;
})(angular);