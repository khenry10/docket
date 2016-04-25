"use strict";

(function(){
  angular
  .module("app", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    "$locationProvider",
    router
  ]);
  // .controller("indexController", [
  //   indexController
  // ]);

  function router($stateProvider, $locationProvider){
    $stateProvider
    .state("index", {
      url: "/",
      templateUrl: "/assets/html/index.html"
    })
  }

})();
