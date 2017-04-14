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
  console.log("IndexController slash calendarController below")
  console.log($scope)

  $scope.showTodayButton = false;
  $scope.originalTodoLists = [];
  $scope.viewType = 'month';
  $scope.newCalTodoLists = [];
  $scope.date = new Date();
  $scope.calendarMonth = $scope.date.getMonth();
  $scope.calendarYear = $scope.date.getFullYear();
  $scope.lastDateOfCurrentMonth = new Date($scope.calendarYear, $scope.calendarMonth, 0).getDate();
  $scope.niceDate = DateService.getNiceDate($scope.date);
  $scope.niceMonth = DateService.monthName($scope.date);
  $scope.yearStats = DateService.percentageOfYearPassed();
  $scope.monthPercent = $scope.yearStats.months[$scope.calendarMonth].percent_of_year;
  $scope.cumulativeComp = $scope.yearStats.months[$scope.calendarMonth].cumulative_percent_of_year;
  $scope.allTodoLists = [];
  $scope.entryType = 'Event';
  $scope.reoccurEnds = 'Never';
  $scope.reoccurEndsDate = new Date();
  var listForCal = [];

  // testing this for add-new-call directive, but not working yet
  $scope.$watch("allTodoLists", function(newValue, oldValue){
    console.log(newValue)
    // $scope.verifyCloneList()
  });

  Todo.all.$promise.then(function(todos){
    console.log("*~*~*~*~ Todo.all call/data in calendarFunction is below: *~*~*~*~")
    console.log(todos)
    console.log("*~*~*~ end *~*~*~")
    $scope.todoLists = todos
    todos.forEach(function(todo){
      console.log(JSON.stringify(todo))
      $scope.allTodoLists.push(todo)
    })
    console.log($scope.allTodoLists.length)
    if($scope.allTodoLists.length){
      $scope.verifyCloneList();
    }
  });

  $scope.changeView = function(view){
    if(view === 'week'){
      $scope.viewType = 'week'
    } else if(view === 'month'){
      $scope.viewType = 'month'
    }
  };

  $scope.testModal = function (){
    ModalService.showModal({
      templateUrl: "/assets/html/todo/cal-entry-modal.html",
      controller: "modalController"

    }).then(function(modal) {
      console.log(modal)
      //it's a bootstrap element, use 'modal' to show it
      modal.element.modal();
      modal.close.then(function(result) {
        console.log(result);
      });
    });
  };

  var evaluateDateListsForCal = function(list, evaluate){
    //evaluate = true when the date list doesn't go through checkLastList or $scope.cloneList
    // still need to loop through ALL lists date-lists in order to overright and ONLY send the datelists that go on the calendar
    if(evaulate){

    }else{
      // still need to check dates if it's weekly view
    }
  }

  var checkLastList = function(lastDateList, list, index){
    var monthOfLastDateList = DateService.stringToDate(lastDateList.date, 'regMonth').getMonth();
    console.log(monthOfLastDateList)
    var appsCurrentMonth = $scope.changeDate.monthCount;
    console.log(appsCurrentMonth)
    var firstDateofAppsCurrentMonth = new Date($scope.changeYear.year, appsCurrentMonth-1, 1);
    console.log(firstDateofAppsCurrentMonth)
    var recurEnd = list.list_recur_end;
    console.log(recurEnd)

    if(recurEnd === "Never"){
      var recurEnd = "Never"
    } else if (!recurEnd) {
      var recurEnd = 0;
    } else {
      DateService.stringToDate(recurEnd, 'regMonth')
    }

    console.log(recurEnd > firstDateofAppsCurrentMonth)

    if(recurEnd > firstDateofAppsCurrentMonth || recurEnd === "Never"){
      if(monthOfLastDateList < appsCurrentMonth){
        console.log("CLONE ME BISH!!!")
        $scope.listClone(list, index)
      }
    }
  };

  $scope.verifyCloneList = function(){
    console.log("verifyCloneList called")
    console.log($scope.changeDate)
    console.log($scope.allTodoLists.length)
    console.log(listForCal)

    $scope.allTodoLists.forEach(function(list, index){
      console.log(list)
      console.log(index)
      var lastDateList = list.lists[list.lists.length-1]
      var dateListsInCurrentMonth = [];
      // loop checks to see if the date already exists within the list, in which case, we don't send to checkLastList which doesn't send to listClone
      console.log(list.lists.length)
      for(var l = 0 ; l < list.lists.length; l++){
        var fullListDate = DateService.stringDateSplit(list.lists[l].date)
        console.log(fullListDate)
        console.log($scope.changeDate)

        if($scope.changeDate.lastMove === 'increment' && fullListDate.month == $scope.changeDate.monthCount
            && fullListDate.year == $scope.changeDate.year){
              dateListsInCurrentMonth.push(list.lists[l])
              var exists = true;
        } else if(fullListDate.month == $scope.changeDate.monthCount && fullListDate.year == $scope.changeDate.year){

          dateListsInCurrentMonth.push(list.lists[l])
          // listForCal.push(list)
          // evaluateDateListsForCal(list)
          // console.log($scope.listForCal)

          console.log("date-list ALREADY EXISTS so we don't need to clone")
          var exists = true;
          // l = list.lists.length
        }
      }; //end of for loop

      if(!exists){
        console.log("sending to checkLastList")
        checkLastList(lastDateList, list, index)
      } else {
        // list.lists = dateListsInCurrentMonth;
        console.log(list)
        listForCal.push({origin: 'database' , todo: list, modifiedDateList: dateListsInCurrentMonth})
      }
    }) // end of $scope.allTodoLists forEach

    console.log(JSON.stringify(listForCal))
    // this won't stay here when complete, we'll only want to assign to $scope.listForCal after ALL lists have been processed through all different logic routes
    $scope.listForCal = listForCal
    console.log($scope.listForCal)

  };

  // logic for weekly calendar view days when user is "flipping" through calendar view, invoked in $scope.changeDate.increment and decrement
  var weeklyMove = function(move){
    console.log($scope.changeDate)
    if(move === "increment"){
      $scope.changeDate.weekCount++
      if($scope.changeDate.twoMonthsWeekly){
        // commented out since this was incrementing monthCount in the beginning of the month
        // $scope.changeDate.monthCount++
        $scope.changeDate.twoMonthsWeekly = false;
      }
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
    console.log(actionDate)

    if(move === "increment"){
      var thisMonthsLastDay = new Date($scope.calendarYear, $scope.changeDate.monthCount, 0).getDate()
      if($scope.changeDate.lastMove === "decrement"){
        // when we go from increment to decrement we need to adjust the date count in order to synchronize correctly
        console.log(date)
        var date = actionDate+6
        console.log(date)
        console.log(date > thisMonthsLastDay)
        if(date > thisMonthsLastDay){
          date = date - thisMonthsLastDay
          $scope.changeDate.monthCount++
        }
        console.log(date)
      } else {
        date = actionDate
      }
      console.log(date)
      console.log(JSON.stringify($scope.changeDate.monthCount))

      console.log(thisMonthsLastDay)
      for(var d = 1; d <= 7; d++ ){
        $scope.changeDate.lastMove = "increment"
        var date = date + 1
        if(date > thisMonthsLastDay){
          console.log("WE INCREMENTING THE MONTH!!!!")
          $scope.changeDate.monthCount++
          date = 1
          $scope.changeDate.twoMonthsWeekly = true
        }
        $scope.changeDate.dayCount.push(date)
      }
      console.log($scope.changeDate)
      console.log(date)
    } else {
      // beginggin of weekly decrement code
      console.log(date)
      console.log($scope.changeDate)
      if($scope.changeDate.lastMove === "increment"){
        if(date - 6 <= 0){
          $scope.changeDate.monthCount--
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
      console.log(date)
      for(var e = 1; e <= 7; e++){
        $scope.changeDate.lastMove = "decrement"
        var date = date - 1
        console.log(date)
        if(date <= 0){
          $scope.changeDate.monthCount--
          console.log(JSON.stringify($scope.changeDate.months))
          var date = $scope.changeDate.months.previousMonth.days
          console.log(date)
          console.log($scope.changeDate)
          if(date > $scope.changeDate.months.thisMonth.count-7 || date < 7) {
            $scope.changeDate.twoMonthsWeekly = true
          }
        }
        console.log(date)
        console.log($scope.changeDate.twoMonthsWeekly)
        $scope.changeDate.dayCount.push(date)
      }
    }
    // end of weekly decrement, beginning of code to put dates in two differenet arrarys if twoMonthsWeekly
      console.log("new stuff here")
      if($scope.changeDate.twoMonthsWeekly){
        console.log("new stuff here")
        if($scope.changeDate.lastMove === 'increment'){
          var lastDayOfOldMonth = new Date ($scope.changeDate.year, $scope.changeDate.monthCount-1, 0).getDate()
          var oldMonth = $scope.changeDate.monthCount-1
          var newMonth = $scope.changeDate.monthCount
        } else {
          var lastDayOfOldMonth = new Date ($scope.changeDate.year, $scope.date.monthCount, 0).getDate()
          var oldMonth = $scope.changeDate.monthCount
          var newMonth = $scope.changeDate.monthCount+1
        }
        console.log(lastDayOfOldMonth)

        var dateArrayLength = $scope.changeDate.dayCount.length
        var firstWeeklyDate = $scope.changeDate.dayCount[dateArrayLength-7]
        console.log(firstWeeklyDate)

        var oldMonthDate = {month: oldMonth, date: []};
        var newMonthDate = {month: newMonth, date: []};

        for(var t = dateArrayLength-7; t <= dateArrayLength-1; t++){
          console.log($scope.changeDate.dayCount[t])
          if(firstWeeklyDate === 1){
            if($scope.changeDate.dayCount[t] < 7){

              newMonthDate.date.push($scope.changeDate.dayCount[t])
            } else {
              oldMonthDate.date.push($scope.changeDate.dayCount[t])
            }
          } else {
            if($scope.changeDate.lastMove === 'increment'){
              if($scope.changeDate.dayCount[t] >= firstWeeklyDate){
                oldMonthDate.date.push($scope.changeDate.dayCount[t])
              } else {
                newMonthDate.date.push($scope.changeDate.dayCount[t])
              }
            } else {
              if($scope.changeDate.dayCount[t] > firstWeeklyDate){
                oldMonthDate.date.push($scope.changeDate.dayCount[t])
              } else {
                newMonthDate.date.push($scope.changeDate.dayCount[t])
              }
            }
          }
        }
        $scope.changeDate.twoMonthsWeeklyDate = {
          oldMonthDate: oldMonthDate,
          newMonthDate: newMonthDate
        }
      }
    $scope.verifyCloneList();
  }; //end of weeklyMove function

  var monthContext = function(){
    var month = $scope.changeDate.monthCount
    $scope.changeDate.months = {
      thisMonth: {
        count: month,
        days: new Date($scope.changeDate.year, month, 0).getDate()
      },
      previousMonth: {
        count: month-1 < 1? 12 : month-1,
        days: new Date($scope.changeDate.year, month-1, 0).getDate()
      },
      nextMonth: {
        count: month+1 > 12? 1 : month+1,
        days: new Date($scope.changeDate.year, month+1, 0).getDate()
      }
    }
  };

  $scope.changeDate = {
    year: $scope.calendarYear,
    monthCount: $scope.date.getMonth()+1,
    weekCount: 0,
    dayCount: [],
    twoMonthsWeekly: false,
    increment: function(){
      $scope.listForCal = [];
      listForCal = [];
      console.log($scope.listForCal)
      console.log(listForCal)
      if($scope.viewType === 'week'){
        if(!$scope.changeDate.dayCount.length){
          $scope.intializeDayCount()
        }
        weeklyMove("increment")
      } else {
        if(this.monthCount > 11){
          this.monthCount = 1
          // once the count (which is the month) is greater than December, we reset the count to 1 (which is january).  We also invoke changeYear.increment() function, which is used in the index.html to see if the year of the event matches the current year
          $scope.changeYear.increment()
        } else {
          if(!$scope.changeDate.dayCount.length){
            console.log("INIATILIZING $scope.intializeDayCount()")
            $scope.intializeDayCount()
          }
          console.log("I've been incremented")
        }
        this.monthCount++
        $scope.verifyCloneList();
      }
      monthContext()
      $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
    },
    decrement: function(){
      // $scope.verifyCloneList()
      if($scope.viewType === 'week'){
        weeklyMove('decrement')
      } else {
        // $scope.allTodoLists.forEach(function(list){
        //   $scope.listClone(list)
        // })
        if(this.monthCount <= 1) {
          this.monthCount = 12
          $scope.changeYear.decrement()
        } else {
          this.monthCount--
        }
        $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
      }
      monthContext()
      $scope.verifyCloneList()
    },
    current_month: function(){
      console.log("current_month called")
      this.monthCount = $scope.date.getMonth()+1;
      $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
    }
  };

  $scope.currentMonth = {
    count: function(){
      console.log("$scope.currentMonth.count")
      $scope.count = $scope.date
      $scope.changeDate.current_month()
    }
  }

  // adds the dates of the current week to $scope.changeDate.dayCount array upon page load
  $scope.intializeDayCount = function(){
    var date = $scope.date.getDate()
    var day = $scope.date.getDay()

    if(date == 1){
      var lastMonth = new Date ($scope.changeDate.year, $scope.changeDate.monthCount-1, 0)
      console.log(lastMonth)
      var lastDay = lastMonth.getDate();
      console.log(lastDay)
      var date = lastDay-day

    } else {
      date = date-day
      date = date-1
      var lastDay = new Date($scope.changeDate.year, $scope.changeDate.monthCount+2, 0).getDate()
      console.log(lastDay)
    }
    console.log(date)
    $scope.changeDate.lastMove = "increment"
    console.log($scope.changeDate)
    $scope.changeDate.twoMonthsWeekly = false;
    $scope.changeDate.monthCount = $scope.calendarMonth+1;

    for(var d = 1; d <= 7; d++ ){
      var date = date + 1
      console.log(lastDay)
      if(date > lastDay){
        date = 1
        $scope.changeDate.twoMonthsWeekly = true;
      }
      $scope.changeDate.dayCount.push(date)
    }
    monthContext()
  }; // end of $scope.intializeDayCount()

  $scope.intializeDayCount()

  // changeYear is only used to compare against the events stored in the database, to see if they match.  This function has nothing to do with building the calendar or displaying on the calendar.  All calendar logic for year is within the calendar_directive and above changeMonth function.
  $scope.changeYear = {
    year: $scope.date.getFullYear(),
    increment: function(){
      this.year++
    },
    decrement: function(){
      this.year--
    }
  };

  $scope.listClone = function(masterList, index){
    console.log(masterList)
    console.log(index)
    console.log($scope.allTodoLists.length)
    var appsCurrentMonth = $scope.changeDate.monthCount-1
    var appsCurrentYear = $scope.changeYear.year
    var firstListDay = DateService.stringToDate(masterList.first_day, 'regMonth').getDay()
    var firstDateEver = DateService.stringDateSplit(masterList.first_day)
    var firstDateOfMonth = new Date(appsCurrentYear, $scope.changeDate.monthCount-1, 1)
    var firstDayOfMonth = firstDateOfMonth.getDay()
    var repeatInterval = masterList.list_reocurring;
    var firstListDate = new Date()
    var reoccurEnds = masterList.list_recur_end;
    var lastDayOfAppsCurrentMonth = new Date(appsCurrentYear, $scope.changeDate.monthCount, 0).getDate()
    var last = reoccurEnds === 'Never'? lastDayOfAppsCurrentMonth:DateService.stringDaysInAMonth(reoccurEnds)
    var listsInMasterList = masterList.lists
    var count = 1

    if(reoccurEnds != 'Never'){
      reoccurEnds = DateService.stringToDate(reoccurEnds, "regMonth")
      var last = lastDayOfAppsCurrentMonth
      var endDateMonth = reoccurEnds.getMonth()
      var endDateYear = reoccurEnds.getFullYear()
      if($scope.changeYear.year === endDateYear){
        if($scope.changeDate.monthCount === endDateMonth){
           var last = reoccurEnds.getDate()
        }
      }
    }

    if(repeatInterval === 'Daily'){
      var repeater = 1
    }

    if(repeatInterval === 'Weekly'){
      var repeater = 7
    }

    if(firstDayOfMonth == 6){
      // when the first day of the month is a saturday, we have to adjust the count to date plus 2 to make it work
      var count = firstListDay+2
      if(count - 7 >= 1){
        count = 1
      }
    } else {
      count = firstListDay - firstDayOfMonth + 1
    }

    console.log(last)

    var newlyCreatedDateLists = [];
    while(count <= last){
      if(count > 0){
        if(count <= last){
          count = count.length === 1? "0"+count: count
          var listDate = $scope.changeYear.year+"-"+$scope.changeDate.monthCount+"-"+count
          var masterTasksToAdd = [];

          if(masterList.master_tasks){
            masterList.master_tasks.forEach(function(task, index){
              masterTasksToAdd.push({
                name: task.name,
                rank: index,
                task_completed: false
              })
            })
          }
          listsInMasterList.push( { date: listDate, tasks: masterTasksToAdd } );
          newlyCreatedDateLists.push( { date: listDate, tasks: masterTasksToAdd } );
        }
      }
      count = count + repeater
    }
      console.log(newlyCreatedDateLists)
      console.log(listsInMasterList)
      console.log(masterList)
      console.log(JSON.stringify(masterList))

      Todo.update({list_name: masterList.list_name}, {todo: masterList}, function(task){
        console.log("------- Todo/List UPDATED!!! -----")
        console.log(task)
      })

      console.log($scope.listForCal)
      listForCal.push({origin: 'newClone', todo: masterList, modifiedDateList: newlyCreatedDateLists})
      // listForCal = [{origin: 'newClone', todo: masterList, modifiedDateList: newlyCreatedDateLists}]
      $scope.listForCal = [listForCal];
      console.log($scope.listForCal)

  }; // end of $scope.listClone


  // this can almost assuredly be deleted, going to save until I get to delete/update for lists -- 4/12
    // $scope.delete = function(eventName){
    //   console.log("vm.event.name = " + eventName)
    //
    //   Events.remove({name: eventName}, function(event){
    //       $window.location.replace('/')
    //   })
    // };

};

function ShowEventsController(Events, $stateParams, $window){
  console.log("show event")
    var vm = this;
    console.log($stateParams.name)

    vm.event = Events.get({name: $stateParams.name})

    vm.update = function(){
      console.log("update = " +vm.event.name)
      // console.log("event = "+ JSON.stringify(event))
      var newEvent = {name: vm.event.newName, first_day: vm.event.newStartTime}
      console.log(newEvent)
      Events.update({name: vm.event.name}, {event: newEvent}, function(event){

        $window.location.replace('/')
      })
    }

};
