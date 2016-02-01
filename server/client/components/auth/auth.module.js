'use strict';

angular.module('serverApp.auth', [
  'serverApp.constants',
  'serverApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
