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
  .controller("IndexController", [
    "$scope",
    "Events",
    "$state",
    IndexController
  ])
  .controller("NewEventsController", [
    "Events",
    "$state",
    "$window",
    NewEventsController
  ])

  function router($stateProvider, $locationProvider){
    $stateProvider
    .state("index", {
      url: "/",
      templateUrl: "/assets/html/index.html",
      controller: "IndexController",
      controllerAs: "indexVM"
    })
    .state("new", {
      url:"/new",
      templateUrl: "/assets/html/new.html",
      controller: "NewEventsController",
      controllerAs: "newVM"
    })
  }

  function Events($resource){
    var Events = $resource("/api", {}, {
      update: {method: "PUT"}
    })
    // var Events = $resource("/api")
    Events.all = Events.query();
    return Events
  };

  function IndexController($scope, Events){
    var vm = this
    vm.events = Events.all;

    var date = new Date()
    // working on code to change the month
    $scope.changeMonth = {
      count: 3,
      increment: function(){
        this.count++
      }
    }
    console.log($scope)

    // vm.countIncrement = function(){
    //   vm.changeMonth.count++
    //   console.log(vm.changeMonth.count)
    //
    // }
  };

  function NewEventsController(Events, $state, $window){
    var newVM = this;
    newVM.new_event = new Events();
    newVM.create = function(){
      console.log(newVM.new_event)
      newVM.new_event.$save().then(function(response){
        $window.location.replace("/#/")
      })
    }

  }





})();
