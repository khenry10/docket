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
  ])
  .controller("calendarDirectiveController",[
    calendarDirectiveController
  ])
  .directive("calendarDirective", [
    calendarDirective
  ])

  function calendarDirective(){
    return {
        templateUrl: "/assets/html/_calendar.html",
        link: function(){
          var date = new Date()
        }
      }
  }

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

  function indexController(Events, calendarDirectiveController){
    var indexVM = this
    indexVM.events = Events.all
  };

  function calendarDirectiveController(){
    var date = new Date()
  }

})();
