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
    todo.forEach(function(todo){
      console.log(todo)
      if(todo.list_created_on){
        $scope.originalTodoLists.push({list_name: todo.list_name, list_createdOn: todo.list_created_on})
        console.log($scope.originalTodoLists)
      }
    })

    var removeDuplicateLists = function(removeList){
      $scope.wipTodoLists = []
      var lookupObject = {}
      for(var ii = 0; ii < removeList.length; ii++){
        lookupObject[removeList[ii]['list_name']] = removeList[ii]
        console.log(lookupObject)
      }
      for(var prop in lookupObject){
        console.log(lookupObject[prop])
        $scope.wipTodoLists.push(lookupObject[prop])
      }
      console.log($scope.wipTodoLists)
      $scope.todoLists = $scope.wipTodoLists
      return $scope.todoLists
    }
    removeDuplicateLists($scope.originalTodoLists)
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
      if(thiscount <= 1) {
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

  $scope.newEvent = new Events();
  $scope.newTodoList = new Todo();
  $scope.entryType = 'Event'

    $scope.create = function(){
      console.log($scope.newEvent.name)
      console.log($scope.entryType)
      if($scope.name && $scope.start_time){
        if($scope.entryType === 'Event') {
          $scope.newEvent.name = $scope.name
          $scope.newEvent.start_time = $scope.start_time
          $scope.newEvent.$save().then(function(response){
            console.log($scope.events)
          })
        }
        if($scope.entryType === 'List'){
          $scope.newTodoList.list_name = $scope.name
          $scope.newTodoList.list_created_on = $scope.start_time
          $scope.newTodoList.$save()
          var date = $scope.start_time
          $scope.todoLists.push({list_name: $scope.name, list_createdOn: date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate()})

          console.log($scope.todoLists)
          // "2017-01-20T05:00:00.000Z"
          //   console.log(response)
          // })
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
