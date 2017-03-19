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
  $scope.times = ["1:00am", "2:00am", "3:00am", "4:00am", "5:00am", "6:00am", "7:00am",
  "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm",
  "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm", "11:00pm", "12:00am"]

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
  $scope.monthPercent = $scope.yearStats.months[$scope.calendarMonth].percent_of_year
  $scope.cumulativeComp = $scope.yearStats.months[$scope.calendarMonth].cumulative_percent_of_year

  var verifyCloneList = function(){
    console.log("verifyCloneList called")
    // console.log("$scope.allTodoLists in increment below:")
    // console.log($scope.allTodoLists)
    $scope.allTodoLists.forEach(function(list){
      console.log("Todo.all.$promise in $scope.changeDate.increment below: ")
      console.log(list)
      var lastDateList = list.lists[list.lists.length-1]
      var monthOfLastDateList = DateService.stringToDate(lastDateList.date, 'regMonth').getMonth()
      var appsCurrentMonth = $scope.changeDate.monthCount

      var firstDateofAppsCurrentMonth = new Date($scope.changeYear.year, appsCurrentMonth, 1)
      var recurEnd = list.list_recur_end

      if(recurEnd === "Never"){
        var recurEnd = "Never"
      } else if (!recurEnd) {
        var recurEnd = 0;
      } else {
        DateService.stringToDate(recurEnd, 'regMonth')
      }

      if(recurEnd > firstDateofAppsCurrentMonth || recurEnd === "Never"){
        if(monthOfLastDateList < appsCurrentMonth){
          console.log("CLONE ME BISH!!!")
          $scope.listClone(list)
        }
      }
    })
  }

  var weeklyMove = function(move){
    if(move === "increment"){
      $scope.changeDate.weekCount++
    } else {
      $scope.changeDate.weekCount--
    }
    var date = $scope.changeDate.dayCount[$scope.changeDate.dayCount.length-1]
    var newMonth = $scope.date.getMonth()
    var lastDayOfMonth = new Date($scope.calendarYear, $scope.calendarMonth+1, 0).getDate()
    var lastDayPlusOfMonth = new Date($scope.calendarYear, newMonth+1, 0).getDate()
    var lastDayMinusOfMonth = new Date($scope.calendarYear, newMonth, 0).getDate()
    $scope.changeDate.twoMonthsWeekly = false
    var dateArrayLength = $scope.changeDate.dayCount.length
    dateArrayLength = dateArrayLength-1
    var actionDate = $scope.changeDate.dayCount[dateArrayLength]

    if(move === "increment"){
      if($scope.changeDate.lastMove === "decrement"){
        // when we go from increment to decrement we need to adjust the date count in order to synchronize correctly
        var date = actionDate+6
      } else {
        date = actionDate
      }
      var thisMonthsLastDay = new Date($scope.calendarYear, $scope.changeDate.monthCount, 0).getDate()
      for(var d = 1; d <= 7; d++ ){
        $scope.changeDate.lastMove = "increment"
        var date = date + 1
        if(date > thisMonthsLastDay){
          $scope.changeDate.monthCount++
          date = 1
          $scope.changeDate.twoMonthsWeekly = true
        }
        $scope.changeDate.dayCount.push(date)
      }
    } else {

      if($scope.changeDate.lastMove === "increment"){
        if(date - 6 < 0){
          // this is needed to account for when the date is less than 6 to move to the previous month and not generate negative dates
          var lastDayOfEarlierMonth = new Date($scope.calendarYear, $scope.changeDate.monthCount-1, 0)
          var lastDayOfEarlierMonth = lastDayOfEarlierMonth.getDate()
          var date = lastDayOfEarlierMonth + (date - 6)
        } else {
          var date = actionDate-6
        }
      } else {
        date = actionDate
      }

      for(var e = 1; e <= 7; e++){
        $scope.changeDate.lastMove = "decrement"
        var date = date - 1
        if(date <= 0){
          $scope.changeDate.monthCount--
          var date = lastDayMinusOfMonth
          if(date > lastDayMinusOfMonth-7 || date < 7) {
            $scope.changeDate.twoMonthsWeekly = true
          }
        }
        $scope.changeDate.dayCount.push(date)
      }
    }
  }

  $scope.changeDate = {
    monthCount: $scope.date.getMonth()+1,
    weekCount: 0,
    dayCount: [],
    twoMonthsWeekly: false,
    increment: function(){
      console.log($scope.viewType)
      verifyCloneList()
      if($scope.viewType === 'week'){
        if(!$scope.changeDate.dayCount.length){
          intializeDayCount()
        }
        weeklyMove("increment")
      } else {
        if(this.monthCount > 11){
          this.monthCount = 1
          // once the count (which is the month) is greater than December, we reset the count to 1 (which is january).  We also invoke changeYear.increment() function, which is used in the index.html to see if the year of the event matches the current year
          $scope.changeYear.increment()
        } else {
          this.monthCount++
        }
        $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
      }
    },
    decrement: function(){
      if($scope.viewType === 'week'){
        weeklyMove('decrement')
      } else {
        $scope.allTodoLists.forEach(function(list){
          $scope.listClone(list)
        })
        if(this.monthCount <= 1) {
          this.monthCount = 12
          $scope.changeYear.decrement()
        } else {
          this.monthCount--
        }
        $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
      }
    },
    current_month: function(){
      console.log("current_month called")
    this.monthCount = $scope.date.getMonth()+1
    console.log($scope.changeDate.monthCount)
    console.log($scope.calendarMonth+1)
    console.log($scope.changeDate.monthCount != $scope.calendarMonth+1)
    $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
    },
    thisWeek: function(){
      this.weekCount = 0
    }
  }
  $scope.currentMonth = {
    count: function(){
      console.log("$scope.currentMonth.count")
      $scope.count = $scope.date
      $scope.changeDate.current_month()
    }
  }

  var intializeDayCount = function(){
    var date = $scope.date.getDate()
    var day = $scope.date.getDay()
    date = date-day
    date = date-1
    console.log(date)
    $scope.changeDate.lastMove = "increment"
    console.log($scope.changeDate)
    for(var d = 1; d <= 7; d++ ){
      var date = date + 1
      $scope.changeDate.dayCount.push(date)
    }
  }
  intializeDayCount()

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
    var appsCurrentMonth = $scope.changeDate.monthCount+1
    var appsCurrentYear = $scope.changeYear.year
    var firstListDay = DateService.stringToDate(masterList.first_day, 'regMonth').getDay()
    var firstDateOfMonth = new Date(appsCurrentYear, $scope.changeDate.monthCount, 1)
    var firstDayOfMonth = firstDateOfMonth.getDay()

    var repeatInterval = masterList.list_reocurring;
    var firstListDate = new Date()
    var reoccurEnds = masterList.list_recur_end;

    var lastDayOfAppsCurrentMonth = new Date(appsCurrentYear, appsCurrentMonth, 0).getDate()
    var last = reoccurEnds === 'Never'? lastDayOfAppsCurrentMonth:DateService.stringDaysInAMonth(reoccurEnds)
    var listsInMasterList = masterList.lists

    var count = 1

    if(reoccurEnds != 'Never'){
      console.log(reoccurEnds)
      reoccurEnds = DateService.stringToDate(reoccurEnds, "regMonth")
      console.log(reoccurEnds)
      var last = lastDayOfAppsCurrentMonth
      var endDateMonth = reoccurEnds.getMonth()
      var endDateYear = reoccurEnds.getFullYear()
      // var last = reoccurEnds.getDate()
      console.log("endDateMonth = " + endDateMonth)
      console.log("endDateYear = " + endDateYear)
      console.log($scope.changeDate.monthCount)
      if($scope.changeYear.year === endDateYear){
        console.log($scope.changeDate.monthCount === endDateMonth)
        if($scope.changeDate.monthCount === endDateMonth){
          console.log("THIS IS GOING THROUGH FROM SOME REASON")
           var last = reoccurEnds.getDate()
        }
      }
    }

    // last = last? last: lastDayOfAppsCurrentMonth
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

  $scope.newMasterLists = []

// not being used yet, ran into too many other bugs
  var createRepeater = function(year, month, count, lastDay, increment){
    console.log(year)
    console.log(month)
    console.log(count)
    console.log(lastDay)
    console.log(increment)
    while(count < lastDay){
      count = count + increment
      var list = year+"-"+month+"-"+count
      $scope.newMasterLists.push( { date: list, tasks: [] } )
       var date = $scope.firstDay
    }
  }

  $scope.create = function(){
    var year = $scope.firstDay.getFullYear();
    var month = $scope.firstDay.getMonth()+1;
    var date = $scope.firstDay.getDate();
    var numberOfDaysInMonth = new Date(year, month, 0).getDate()
      console.log($scope.firstDay)

      // conditional checker to ensure sufficient info has been filled out
      if($scope.name && $scope.firstDay){
        // can probably get rid of the below since I decided today that Event will be deprecated
        if($scope.entryType === 'Event') {
          $scope.newEvent.name = $scope.name
          $scope.newEvent.first_day = $scope.firstDay
          $scope.newEvent.$save().then(function(response){
          })
        }


        if($scope.entryType === 'List'){
          console.log($scope.repeatInterval)

          $scope.newTodoList.list_name = $scope.name
          $scope.newTodoList.list_created_on = new Date()
          $scope.newTodoList.first_day = $scope.firstDay
          $scope.newTodoList.start_time =  $scope.startTime
          $scope.newTodoList.end_time = $scope.endTime
          console.log($scope.newTodoList)

          if($scope.repeatInterval){
              $scope.newTodoList.list_reocurring = $scope.repeatInterval
              $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
          }

          // moving to a new, outside function
          // $scope.newMasterLists = []

          var date = $scope.firstDay
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
            // createRepeater(year, month, count, lastDay, 1)

            while(count < lastDay){
              console.log(lastDay)
              count = count + 1
              var list = year+"-"+month+"-"+count
              $scope.newMasterLists.push( { date: list, tasks: [] } )
               var date = $scope.firstDay
            }
          }

          if($scope.repeatInterval === 'Weekly'){
            // count = count+7
            // createRepeater(year, month, count, lastDay, 7)
            while(count+7 <= lastDay){
              count = count + 7
              var list = year+"-"+month+"-"+count
              $scope.newMasterLists.push( { date: list, tasks: [] } )
               var date = $scope.firstDay
            }
          }

          if($scope.repeatInterval === 'Monthly'){
            console.log("Monthly")
            // createRepeater(year, count, month, lastDay, 1)
            while(month < 12){
              month = month+1
              var list = year+"-"+month+"-"+count
              $scope.newMasterLists.push( { date: list, tasks: [] } )
              console.log($scope.newMasterLists)
            }
          }
          // I recreated the new object to get rid of new Todo() junk which I thought was causing issues
          // $scope.newCalTodoLists is a dependency that gets injected into the calendar directive
          $scope.newCalTodoLists = [{list_name: $scope.name, lists: $scope.newMasterLists}]
          $scope.newCalTodoLists[0].first_day = $scope.firstDay
          $scope.newCalTodoLists[0].list_reocurring = $scope.newTodoList.list_reocurring
          $scope.newCalTodoLists[0].list_recur_end =$scope.newTodoList.list_recur_end

          console.log("$scope.newCalTodoLists below: ")
          console.log($scope.newCalTodoLists)

          // $scope.newTodoList instantiates todo above (aka $scope.newTodoList = new Todo() )
          $scope.newTodoList.lists = $scope.newMasterLists

          $scope.newTodoList.$save().then(function(res){
            console.log("$scope.newTodoList.$save success")
          })

          // below function is in master-tasks.js, which may be causing the scoping issue with clearing input fields
          $scope.newMasterListAddition($scope.newCalTodoLists[0])

          // verifyCloneList function works off of $scope.allTodoLists,
          $scope.newCalTodoLists[0].start_time =  $scope.startTime
          $scope.newCalTodoLists[0].end_time =  $scope.endTime

          console.log($scope.newCalTodoLists[0])
          $scope.allTodoLists.push($scope.newCalTodoLists[0])

          // clears the input fields for new additions
          $scope.name = ""
          $scope.repeatInterval = ""
          $scope.firstDay = ""
          $scope.entryType = ""
          $scope.startTime = ""
          $scope.endTime = ""
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
      var newEvent = {name: vm.event.newName, first_day: vm.event.newStartTime}
      console.log(newEvent)
      Events.update({name: vm.event.name}, {event: newEvent}, function(event){

        $window.location.replace('/')
      })
    }

};
