'use strict';

class NavbarController {
  //start-non-standard
  menu = [];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('serverApp')
  .controller('NavbarController', NavbarController);
