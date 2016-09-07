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
    "$window",
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
    "$window",
    ShowEventsController
  ])
  .controller("listController", [
    "Events",
    listController
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
    .state("list", {
      url: "/list",
      templateUrl: "/assets/html/list.html",
      controller: "listController",
      controllerAs: "list"
    })
    .state("show", {
      url: "/:name",
      templateUrl: "/assets/html/show.html",
      controller: "ShowEventsController",
      controllerAs: "showVM"
    })
  }

  //factory
  function Events($resource){
    var Events = $resource("/api/:name", {}, {
      update: {method: "PUT"}
    })
    // var Events = $resource("/api")
    Events.all = Events.query();
    Events.find = function(property, value, callback){
      Events.all.$promise.then(function(){
        Events.all.forEach(function(event){
          if(event[property] == value) callback(event);
        });
      });
    };
    return Events
  };

  function listController(){
    var vm = this
  }

  function IndexController($scope, Events, $window){
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
      count: function($state){
        this.count = date,
        $scope.changeMonth.current_month(),
        $window.location.replace('/')
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
        console.log(newVM)
      $window.location.replace('/')
      })
    }
  }

  function ShowEventsController(Events, $stateParams, $window){
      var vm = this;
      console.log("$stateParams.name = " + $stateParams.name)
      Events.find("name", $stateParams.name, function(event){
        // console.log("event in ShowEventsController = " + event.name)
        vm.event = event;
      })

      vm.show = function($stateParams){
        Events.find("name", $stateParams.name, function(event){
        // console.log("event in ShowEventsController = " + event.name)
        vm.event = event;
        })
      }

      vm.update = function(){

        Events.update({name: vm.event.name}, {event: event}, function(event){
          console.log(event)
          console.log("updating...")
          $window.location.replace('/')
        })
      }

      vm.delete = function(){
        console.log("vm.event.name = " + vm.event.name)
        Events.remove({name: vm.event.name}, function(event){
            $window.location.replace('/')
        })
      }
  };

})();
