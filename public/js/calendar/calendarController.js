'use strict';

angular.module('app')
.controller("IndexController", [
  "$scope",
  "Events",
  "Todo",
  "$window",
  IndexController
])
.controller("ShowEventsController", [
  "Events",
  "$stateParams",
  "$window",
  ShowEventsController
])

function IndexController($scope, Events, Todo, $window){
  $scope.events = []
  $scope.events = Events.all;

  $scope.originalTodoLists = []

  Todo.all.$promise.then(function(todo){
    console.log(todo)
    $scope.todoLists = todo
  })

  $scope.reoccurs = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']

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
      console.log("current_month called")
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

  $scope.newEvent = new Events();
  $scope.newTodoList = new Todo();
  $scope.entryType = 'Event'

    $scope.create = function(){

      var year = $scope.start_time.getFullYear();
      var month = $scope.start_time.getMonth();
      var date = $scope.start_time.getDate();
      var numberOfDays = new Date(year, month, 0).getDate()

      if($scope.name && $scope.start_time){
        if($scope.entryType === 'Event') {
          $scope.newEvent.name = $scope.name
          $scope.newEvent.start_time = $scope.start_time
          $scope.newEvent.$save().then(function(response){
          })
        }
        if($scope.entryType === 'List'){
          $scope.newTodoList.list_name = $scope.name
          $scope.newTodoList.list_created_on = $scope.start_time

          if($scope.repeatInterval === 'Weekly'){
            $scope.newTodoList.dates = [];
            $scope.newTodoList.list_reocurring = $scope.repeatInterval

            var date = $scope.start_time
            var newDate = date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate()
            $scope.newTodoList.dates.push( newDate )
            var count = date.getDate();

            while(count+7 <= numberOfDays){
              count = count + 7
              // var date = $scope.start_time
              // var newDate = date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate()})
              $scope.newTodoList.dates.push( year+"-"+month+1+"-"+count)

               var date = $scope.start_time
              //  $scope.todoLists.push({list_name: $scope.name, dates: date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate()})
            }
            $scope.todoLists = [{list_name: $scope.newTodoList.list_name, dates: $scope.newTodoList.dates}]

            $scope.newTodoList.$save()
          }
        }
      }
    }


    $scope.delete = function(eventName){
      console.log("vm.event.name = " + eventName)

      Events.remove({name: eventName}, function(event){
          $window.location.replace('/')
      })
    }

};


function ShowEventsController(Events, $stateParams, $window){
  console.log("show event")
    var vm = this;
    console.log($stateParams.name)

    vm.event = Events.get({name: $stateParams.name})

    vm.update = function(){
      console.log("update = " +vm.event.name)
      console.log("event = "+ JSON.stringify(event))
      var newEvent = {name: vm.event.newName, start_time: vm.event.newStartTime}
      console.log(newEvent)
      Events.update({name: vm.event.name}, {event: newEvent}, function(event){

        $window.location.replace('/')
      })
    }

};
