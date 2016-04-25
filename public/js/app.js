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
  ])
  .factory("Events", [
    "$resource",
    Events
  ])
  .controller("indexController", [
    "Events",
    indexController
  ]);

  function router($stateProvider, $locationProvider){
    $stateProvider
    .state("index", {
      url: "/",
      templateUrl: "/assets/html/index.html",
      controller: "indexController",
      controllerAs: "indexVM"
    })
  }

  function Events($resource){
    var Events = $resource("/api", {}, {
      update: {method: "PUT"}
    })
    Events.all = Events.query();
    return Events
  };


  function indexController(Events){
    var indexVM = this
    indexVM.events = Events.all
  };

})();
