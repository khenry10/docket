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
    "$timeout",
    NewEventsController
  ])
  .controller("ShowEventsController", [
    "Events",
    "$stateParams",
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
      url: "/new",
      templateUrl: "/assets/html/new.html",
      controller: "NewEventsController",
      controllerAs: "newVM"
    })
    .state("show", {
      url: "/:name",
      templateUrl: "/assets/html/show.html",
      controller: "ShowEventsController",
      controllerAs: "showVM"
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

  function IndexController($scope, Events, $timeout){
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
        if(this.count > 11){
          this.count = 1
        } else if (this.count === -1){
          this.count = 11
        }
        else
          this.count++
      },
      decrement: function(){
        if(this.count < 0) {
          this.count = 10
        } else if (this.count === -1) {
          this.count = 10
        }
        else
          this.count--
      },
      current_month: function(){
      this.count = date.getMonth()
      }
    }

    $scope.changeYear = {
      year: date.getFullYear()
    }

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

  function ShowEventsController(Events, $stateParams){
      var vm = this;
      Events.find("name", $statePar)

      deleteVM.event = this.Events
      deleteVM.delete = function(){

      }
  }

})();
