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
    "Events",
    "$state",
    IndexController
  ])
  .controller("NewEventsController", [
    "Events",
    "$state",
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

  function IndexController(Events, scope){
    var vm = this
    vm.events = Events.all;

    vm.nextMonth = function(){
      calendarDirective.makeCalendar(5, 30)
      console.log("I was clicked xoxo")
    }
  };

  function NewEventsController(Events, $state){
    var newVM = this;
    newVM.new_event = new Events();
    newVM.create = function(){
      console.log(newVM.new_event)
      newVM.new_event.$save().then(function(response){
        $state.go("index")
      })
    }

  }


//working on code to change the month
  // $scope.month = {
  //   april: 3
  // }
  //
  // $scope.selectMonth = {
  //   result: $scope.month[0]
  // }

})();
