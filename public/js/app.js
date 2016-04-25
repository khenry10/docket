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
    IndexController
  ])

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

  function IndexController(Events, calendarDirectiveController){
    var vm = this
    vm.events = Events.all;
    vm.date = new Date()
  };

})();
