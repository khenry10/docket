'use strict';

angular.module('app')
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

function IndexController($scope, Events, $window){
  console.log(Events)
  var vm = this
  $scope.events = []
  $scope.events = Events.all;

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

function NewEventsController(Events, $window, $scope){
  var newVM = this;

  newVM.new_event = new Events();

  newVM.create = function(){
    console.log(newVM.new_event)
    newVM.new_event.$save().then(function(response){
      // $window.location.replace('/')
      Events.query( function(data) {
        console.log(data)
        $scope.events = data
      })
    })
  }
};

function ShowEventsController(Events, $stateParams, $window){
  console.log("show event")
    var vm = this;
    console.log($stateParams.name)

    vm.event = Events.query({name: $stateParams.name})

    vm.update = function(){
      console.log("update = " +vm.event.name)
      console.log("event = "+ JSON.stringify(event))
      var newEvent = {name: vm.event.newName, start_time: vm.event.newStartTime}
      console.log(newEvent)
      Events.update({name: vm.event.name}, {event: newEvent}, function(event){

        $window.location.replace('/')
      })
    }

    vm.delete = function(eventName){
      console.log("vm.event.name = " + eventName)

      Events.remove({name: eventName}, function(event){
          $window.location.replace('/')
      })
    }
};
