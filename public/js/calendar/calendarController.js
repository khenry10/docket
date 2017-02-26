'use strict';

angular.module('app')
.controller("IndexController", [
  "$scope",
  "Events",
  "Todo",
  "$window",
  "ModalService",
  "DateService",
  "$window",
  IndexController
])
.controller("ShowEventsController", [
  "Events",
  "$stateParams",
  "$window",
  ShowEventsController
])

function IndexController($scope, Events, Todo, $window, ModalService, DateService){
  $scope.events = []
  $scope.events = Events.all;
  $scope.showTodayButton = false;
  $scope.originalTodoLists = []
  $scope.viewType = 'month'

  $scope.changeView = function(view){
    console.log("view = " + view)
    if(view === 'week'){
      $scope.viewType = 'week'
    } else if(view === 'month'){
      $scope.viewType = 'month'
    }
  }

  $scope.testModal = function (){
    ModalService.showModal({
      templateUrl: "/assets/html/todo/modal-test.html",
      controller: "modalController"

    }).then(function(modal) {
      console.log(modal)
      //it's a bootstrap element, use 'modal' to show it
      modal.element.modal();
      modal.close.then(function(result) {
        console.log(result);
      });
    });
  }

  $scope.allTodoLists = []

  Todo.all.$promise.then(function(todos){
    console.log("*~*~*~*~ Todo.all call/data in calendarFunction is below: *~*~*~*~")
    console.log(todos)
    console.log("*~*~*~ end *~*~*~")
    $scope.todoLists = todos
    todos.forEach(function(todo){
      $scope.allTodoLists.push(todo)
    })
  })

  $scope.reoccurs = ['None','Daily', 'Weekly', 'Monthly', 'Yearly']

  $scope.date = new Date()
  $scope.calendarMonth = $scope.date.getMonth()
  $scope.calendarYear = $scope.date.getFullYear()
  $scope.niceDate = DateService.getNiceDate($scope.date)
  $scope.niceMonth = DateService.monthName($scope.date)
  $scope.yearStats = DateService.percentageOfYearPassed()
  $scope.cumulativeComp = $scope.yearStats.months[$scope.calendarMonth].cumulative_percent_of_year

  $scope.changeMonth = {
    count: $scope.date.getMonth()+1,
    increment: function(){
      console.log("$scope.allTodoLists in increment below:")
      console.log($scope.allTodoLists)
      $scope.allTodoLists.forEach(function(list){
        console.log("Todo.all.$promise in $scope.changeMonth.increment below: ")
        console.log(list)
        // todos.forEach(function(list){
          console.log("individual list below: ")
          console.log(list)
          console.log(list.lists)
          var lastDateList = list.lists[list.lists.length-1]
          var monthOfLastDateList = DateService.stringToDate(lastDateList.date, 'regMonth').getMonth()
          var appsCurrentMonth = $scope.changeMonth.count
          console.log("monthOfLastDateList = " + monthOfLastDateList)
          console.log("appsCurrentMonth = " + appsCurrentMonth)
          console.log("monthOfLastDateList < appsCurrentMonth below: ")
          console.log(monthOfLastDateList < appsCurrentMonth)
          var firstDateofAppsCurrentMonth = new Date($scope.changeYear.year, appsCurrentMonth, 1)
          console.log("firstDateofAppsCurrentMonth = " + firstDateofAppsCurrentMonth)
          var recurEnd = DateService.stringToDate(list.list_recur_end)
          console.log("recurEnd = " + recurEnd)
          console.log(recurEnd > firstDateofAppsCurrentMonth)
          if(list.list_recur_end > firstDateofAppsCurrentMonth){
            if(monthOfLastDateList < appsCurrentMonth){
              console.log("CLONE ME BISH!!!")
              $scope.listClone(list)
            }
          }
        // })
      })
      if(this.count > 11){
        this.count = 1
        // once the count (which is the month) is greater than December, we reset the count to 1 (which is january).  We also invoke changeYear.increment() function, which is used in the index.html to see if the year of the event matches the current year
        $scope.changeYear.increment()
      } else {
        this.count++
      }
      $scope.showTodayButton = $scope.changeMonth.count != $scope.calendarMonth+1
    },
    decrement: function(){
      $scope.allTodoLists.forEach(function(list){
        $scope.listClone(list)
      })
      if(this.count <= 1) {
        this.count = 12
        $scope.changeYear.decrement()
      } else {
        this.count--
      }

      $scope.showTodayButton = $scope.changeMonth.count != $scope.calendarMonth+1

    },
    current_month: function(){
      console.log("current_month called")
    this.count = $scope.date.getMonth()+1
    console.log($scope.changeMonth.count)
    console.log($scope.calendarMonth+1)
    console.log($scope.changeMonth.count != $scope.calendarMonth+1)
    $scope.showTodayButton = $scope.changeMonth.count != $scope.calendarMonth+1
    }
  }
  $scope.currentMonth = {
    count: function(){
      console.log("$scope.currentMonth.count")
      $scope.count = $scope.date
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

  $scope.listClone = function(masterList){
    console.log(masterList)
    var appsCurrentMonth = $scope.changeMonth.count+1
    var appsCurrentYear = $scope.changeYear.year
    var firstListDay = DateService.stringToDate(masterList.first_day, 'regMonth').getDay()
    var firstDateOfMonth = new Date(appsCurrentYear, $scope.changeMonth.count, 1)
    var firstDayOfMonth = firstDateOfMonth.getDay()
    // console.log(firstListDay)
    // console.log(firstDayOfMonth)
    // console.log(firstDateOfMonth)
    // console.log($scope.changeMonth.count)
    // console.log($scope.changeYear.year)
    var repeatInterval = masterList.list_reocurring;
    var firstListDate = new Date()
    var reoccurEnds = masterList.list_recur_end;

    var lastDayOfAppsCurrentMonth = new Date(appsCurrentYear, appsCurrentMonth, 0).getDate()
    // var lastDay = reoccurEnds === 'Never'? lastDayOfAppsCurrentMonth:DateService.stringDaysInAMonth(reoccurEnds)
    var listsInMasterList = masterList.lists

    var count = 1

    console.log("reoccurEnds = " + reoccurEnds)
    // console.log(reoccurEnds =! 'Never')
    if(reoccurEnds != 'Never'){
      console.log(reoccurEnds)
      reoccurEnds = DateService.stringToDate(reoccurEnds, "regMonth")
      console.log(reoccurEnds)
      // var last = lastDayOfAppsCurrentMonth
      var endDateMonth = reoccurEnds.getMonth()
      var endDateYear = reoccurEnds.getFullYear()
      var last = reoccurEnds.getDate()
      console.log("endDateMonth = " + endDateMonth)
      console.log("endDateYear = " + endDateYear)
      console.log($scope.changeMonth.count)
      if($scope.changeYear.year === endDateYear){
        if($scope.changeMonth.count === endDateMonth-1){
          console.log(endDate)
           last = endDate
        }
      }
    }

    last = last? last: lastDayOfAppsCurrentMonth
    console.log(last)
    console.log("repeatInterval = " + repeatInterval)
    if(repeatInterval === 'Daily'){
      var repeater = 1
    }

    if(repeatInterval === 'Weekly'){
      var repeater = 7
    }

    if(firstListDay === firstDayOfMonth){
      var count = 1
    } else {
      console.log("firstListDay - firstDayOfMonth = " + firstListDay - firstDayOfMonth)
      console.log(firstListDay - firstDayOfMonth)
      count = firstListDay - firstDayOfMonth + 1
    }

    console.log(last)
    while(count <= last){
      console.log("count = "+count)
      console.log(count <= last)
      if(count > 0){
        if(count <= last){
          count = count.length === 1? "0"+count: count
          console.log("appsCurrentMonth = " + appsCurrentMonth)
          var listDate = $scope.changeYear.year+"-"+appsCurrentMonth+"-"+count
          var masterTasksToAdd = []

          console.log("masterList below: ")
          console.log(masterList)
          if(masterList.master_tasks){
            masterList.master_tasks.forEach(function(task, index){
              console.log(task)
              masterTasksToAdd.push({
                name: task.name,
                rank: index,
                task_completed: false
              })
            })
          }
          console.log("listDate = " + listDate)
          listsInMasterList.push( { date: listDate, tasks: masterTasksToAdd } )
          console.log("listsInMasterList below: ")
          console.log(listsInMasterList)
        }
      }
      count = count + repeater
      console.log("last count in while function "+ count)
    }
    console.log(masterList)
    Todo.update({list_name: masterList.list_name}, {todo: masterList}, function(task){
      console.log(task)
    })

    }

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
          $scope.newTodoList.list_created_on = new Date()
          $scope.newTodoList.first_day = $scope.start_time
          console.log($scope.newTodoList)
          if($scope.repeatInterval){
              $scope.newTodoList.list_reocurring = $scope.repeatInterval
              $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
          }

          $scope.newMasterLists = []

          var date = $scope.start_time
          var newDate = date.getFullYear()+"-"+month+"-"+date.getDate()
          $scope.newMasterLists.push( {date: newDate, tasks: []} )
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
              $scope.newMasterLists.push( { date: list, tasks: [] } )
               var date = $scope.start_time
            }
          }

          if($scope.repeatInterval === 'Weekly'){
            while(count+7 <= lastDay){
              count = count + 7
              var list = year+"-"+month+"-"+count
              $scope.newMasterLists.push( { date: list, tasks: [] } )
               var date = $scope.start_time
            }
          }

          if($scope.repeatInterval === 'Monthly'){
            console.log("Monthly")
            while(month < 12){
              month = month+1
              var list = year+"-"+month+"-"+count
              $scope.newMasterLists.push( { date: list, tasks: [] } )
              console.log($scope.newMasterLists)
            }
          }
          // $scope.todoLists is scoped to calendar_directive, when a new item is added here, it gets passed to the calendar
          $scope.newCalTodoLists = [{list_name: $scope.name, lists: $scope.newMasterLists}]
          $scope.newCalTodoLists[0].first_day = $scope.start_time
          $scope.newCalTodoLists[0].list_reocurring = $scope.newTodoList.list_reocurring
          $scope.newCalTodoLists[0].list_recur_end =$scope.newTodoList.list_recur_end
          console.log("console.log($scope.newCalTodoLists) below: ")
          console.log($scope.newCalTodoLists)

          $scope.newTodoList.lists = $scope.newMasterLists
          console.log("$scope.newTodoList below: ")
          console.log($scope.newTodoList)
          console.log($scope.newTodoList.first_day)

          $scope.newTodoList.$save().then(function(res){
            console.log("$scope.newTodoList.$save")
            console.log($scope.todoLists)
          })
          $scope.allTodoLists.push($scope.newCalTodoLists[0])
          console.log("$scope.todoLists below ")
          console.log($scope.todoLists)
          console.log($scope.newCalTodoLists[0])
          $scope.newMasterListAddition($scope.newCalTodoLists[0])
          $scope.name = ""
          $scope.repeatInterval = ""
          $scope.start_time = ""
          $scope.entryType = ""
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
