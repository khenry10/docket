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
  .controller("ShowEventsController", [
    "Events",
    "$window",
    ShowEventsController
  ])

  function router($stateProvider, $locationProvider){
    $locationProvider.html5Mode(true);
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

    vm.this_months_events = function(){
      for(var i = 0; i < Events.all.length; i++) {
        if(Events.all[i].month === changeMonth.count) {
          return Events.all[i].month
        }
      }
    }

    var date = new Date()

    $scope.changeMonth = {
      count: date.getMonth(),
      increment: function(){
        this.count++
      },
      decrement: function(){
        this.count--
      },
      current_month: function(){
      this.count = date.getMonth()
      },
      month: this.count
    }
      console.log($scope.changeMonth.month)
  };

  function NewEventsController(Events, $state, $window){
    var newVM = this;
    newVM.new_event = new Events();
    newVM.create = function(){
      newVM.new_event.$save().then(function(response){
        $state.go("index")
      })
    }
  }

  function ShowEventsController(Events, $window){
      var deleteVM = this;
      deleteVM.event = this.Events
      deleteVM.delete = function(){

      }
  }

})();
