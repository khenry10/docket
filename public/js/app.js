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

    var date = new Date()

    $scope.changeMonth = {
      count: date.getMonth()+1,
      increment: function(){
        if(this.count > 11){
          this.count = 1
          // once the count (which is the month) is greater than December, we reset the count to 1 (which is january).  We also invoke changeYear.increment() function, which is used in the index.html to see if the year of the event matches the current year
          $scope.changeYear.increment()
        } else
          this.count++
      },
      decrement: function(){
        if(this.count <= 1) {
          this.count = 12
          $scope.changeYear.decrement()
        }
        else
          this.count--
      },
      current_month: function(){
      this.count = date.getMonth()+1

      // console.log(date)
      }
    }

    $scope.currentMonth = {
      count: function(){
        this.count = date
        $scope.changeMonth.current_month()
      }
    }

    // changeYear is only used to compare against the events stored in the database, to see if they match.  This function has nothing to do with building the calendar or displaying on the calendar.  All calendar logic for year is within the calendar_directive and above changeMonth function.
    $scope.changeYear = {
      year: date.getFullYear(),
      increment: function(){
        this.year++
      },
      decrement: function(){
        this.year--
      }
    }

  };


  function NewEventsController(Events, $state, $window){
    var newVM = this;
    newVM.new_event = new Events();
    newVM.create = function(){
      newVM.new_event.$save().then(function(response){
        $state.go("index",{})
      })
    }
  }

  function ShowEventsController(Events, $stateParams){
      var vm = this;
      Events.find("name", $stateParams)

      deleteVM.event = this.Events
      deleteVM.delete = function(){

      }
  }

})();
