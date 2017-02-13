'use strict';

angular.module('app')
.controller("IndexController", [
  "$scope",
  "Events",
  "Todo",
  "$window",
  "ModalService",
  IndexController
])
.controller("ShowEventsController", [
  "Events",
  "$stateParams",
  "$window",
  ShowEventsController
])

function IndexController($scope, Events, Todo, $window, ModalService){
  $scope.events = []
  $scope.events = Events.all;

  $scope.originalTodoLists = []

  $scope.testModal = function (){
    ModalService.showModal({
      templateUrl: "/assets/html/todo/todo-show.html",
      controller: "todoController"
    }).then(function(modal) {
      console.log(modal)
      //it's a bootstrap element, use 'modal' to show it
      modal.element.modal();
      modal.close.then(function(result) {
        console.log(result);
      });
    });
  }


  Todo.all.$promise.then(function(todo){
    console.log("*~*~*~*~ Todo.all call/data in calendarFunction is below: *~*~*~*~")
    console.log(todo)
    console.log("*~*~*~ end *~*~*~")
    $scope.todoLists = todo
  })

  $scope.reoccurs = ['None','Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']

  $scope.date = new Date()
  $scope.calendarMonth = $scope.date.getMonth()
  $scope.calendarYear = $scope.date.getFullYear()

  $scope.changeMonth = {
    count: $scope.date.getMonth()+1,
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
    this.count = $scope.date.getMonth()+1
    // console.log(date)
    }
  }
  $scope.currentMonth = {
    count: function($state){
      this.count = $scope.date
      $scope.changeMonth.current_month()
    }
  }

  // changeYear is only used to compare against the events stored in the database, to see if they match.  This function has nothing to do with building the calendar or displaying on the calendar.  All calendar logic for year is within the calendar_directive and above changeMonth function.
  $scope.changeYear = {
    year: $scope.date.getFullYear(),
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
  $scope.reoccurEnds = 'Never'
  $scope.reoccurEndsDate = new Date()

    $scope.create = function(){

      var year = $scope.start_time.getFullYear();
      var month = $scope.start_time.getMonth()+1;
      var date = $scope.start_time.getDate();
      var numberOfDaysInMonth = new Date(year, month, 0).getDate()

      if($scope.name && $scope.start_time){
        if($scope.entryType === 'Event') {
          $scope.newEvent.name = $scope.name
          $scope.newEvent.start_time = $scope.start_time
          $scope.newEvent.$save().then(function(response){
          })
        }
        if($scope.entryType === 'List'){
          console.log($scope.repeatInterval)

          $scope.newTodoList.list_name = $scope.name
          $scope.newTodoList.list_created_on = $scope.start_time
          if($scope.repeatInterval){
              $scope.newTodoList.list_reocurring = $scope.repeatInterval
              $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
          }

          $scope.newTodoList.lists = []

          var date = $scope.start_time
          var newDate = date.getFullYear()+"-"+month+"-"+date.getDate()
          $scope.newTodoList.lists.push( {date: newDate, tasks: []} )
          var count = date.getDate();

          var lastDay = numberOfDaysInMonth

          if($scope.reoccurEnds){
            console.log($scope.reoccurEnds)
            if($scope.reoccurEnds === "SelectDate"){
              console.log($scope.date)
              var endDateMonth = $scope.reoccurEndsDate.getMonth()
              var endDateYear = $scope.reoccurEndsDate.getFullYear()
              if($scope.calendarYear === endDateYear){
                if($scope.calendarMonth === endDateMonth){
                  var lastDay = $scope.reoccurEndsDate.getDate()
                }
              }
            }
          }
          console.log(lastDay)

          if($scope.repeatInterval === 'Daily'){
            while(count < lastDay){
              console.log(lastDay)
              count = count + 1
              var list = year+"-"+month+"-"+count
              $scope.newTodoList.lists.push( { date: list, tasks: [] } )
               var date = $scope.start_time
            }
          }

          if($scope.repeatInterval === 'Weekly'){
            while(count+7 <= lastDay){
              count = count + 7
              var list = year+"-"+month+"-"+count
              $scope.newTodoList.lists.push( { date: list, tasks: [] } )
               var date = $scope.start_time
            }
          }

          if($scope.repeatInterval === 'Monthly'){
            console.log("Monthly")
            while(month < 12){
              month = month+1
              var list = year+"-"+month+"-"+count
              $scope.newTodoList.lists.push( { date: list, tasks: [] } )
              console.log($scope.newTodoList.lists)
            }
          }
          // $scope.todoLists is scoped to calendar_directive, when a new item is added here, it gets passed to the calendar
          $scope.newCalTodoLists = [{list_name: $scope.newTodoList.list_name, lists: $scope.newTodoList.lists}]
          console.log($scope.newCalTodoLists)
          console.log($scope.newTodoList)
          $scope.newTodoList.$save()
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
