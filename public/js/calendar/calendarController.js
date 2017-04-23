'use strict';

angular.module('app')
.controller("IndexController", [
  "$scope",
  "Todo",
  "$window",
  "ModalService",
  "DateService",
  "$window",
  IndexController
])
.controller("ShowEventsController", [
  "$stateParams",
  "$window",
  ShowEventsController
])

function IndexController($scope, Todo, $window, ModalService, DateService){
  console.log("IndexController / calendarController below");
  console.log($scope);

  $scope.showTodayButton = false;
  $scope.viewType = 'month';
  $scope.date = new Date();
  $scope.calendarMonth = $scope.date.getMonth();
  $scope.calendarYear = $scope.date.getFullYear();
  $scope.niceDate = DateService.getNiceDate($scope.date);
  $scope.niceMonth = DateService.monthName($scope.date);
  $scope.yearStats = DateService.percentageOfYearPassed();
  $scope.monthPercent = $scope.yearStats.months[$scope.calendarMonth].percent_of_year;
  $scope.cumulativeComp = $scope.yearStats.months[$scope.calendarMonth].cumulative_percent_of_year;
  $scope.allTodoLists = [];
  var listForCal = [];
  $scope.allTasks = [];

  // $scope.$watch("allTasks", function(newThing, oldThink){
  //   console.log(newThing)
  //   $scope.allTasks = newThing;
  // }, true)

  Todo.all.$promise.then(function(todos){
    console.log(todos)
    $scope.todoLists = todos
    todos.forEach(function(todo){
      $scope.allTodoLists.push(todo)
    })
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
    $scope.listForCal = [];
    listForCal = [];
    $scope.verifyCloneList()
  };

  var parseAllTasks = function(dateList, list){
    if(list.list_type === 'todo'){
      dateList.tasks.forEach(function(task){
        $scope.allTasks.push({
          taskName: task.name,
          listName: list.list_name,
          listDate: dateList.date,
          listType: list.list_type,
          taskCompleted: task.task_completed
        })
      })
    }
  };

  var evaluateDateListsForWeekCal = function(fullListDate, dateList, list){
    console.log("evaluateDateListsForWeekCal invoked. dateList is below & date === " + dateList.date)
    var dateArrayLength = $scope.changeDate.dayCount.length;
    var firstWeeklyDate = $scope.changeDate.dayCount[dateArrayLength-7];
    var lastWeeklyDate = $scope.changeDate.dayCount[dateArrayLength-1];
    if($scope.changeDate.twoMonthsWeekly){
      if(fullListDate.month == $scope.changeDate.twoMonthsWeeklyDate.newMonthDate.month){
        $scope.changeDate.twoMonthsWeeklyDate.newMonthDate.date.forEach(function(newMD){
          if(newMD == fullListDate.date){
            parseAllTasks(dateList, list)
            $scope.exists = true;
            dateListsInCurrentMonth = dateList;
          }
        })
      } else if(fullListDate.month == $scope.changeDate.twoMonthsWeeklyDate.oldMonthDate.month){
        $scope.changeDate.twoMonthsWeeklyDate.oldMonthDate.date.forEach(function(oldMD){
          if(oldMD == fullListDate.date){
            parseAllTasks(dateList, list)
            $scope.exists = true;
            dateListsInCurrentMonth = dateList;
          }
        })
      }
    } else {
      if(fullListDate.date >= firstWeeklyDate && fullListDate.date <= lastWeeklyDate){
        if(fullListDate.month == $scope.changeDate.monthCount && fullListDate.year == $scope.changeDate.year){
          parseAllTasks(dateList, list)
          $scope.exists = true;
          var dateListsInCurrentMonth = dateList;
        }
      }
    } // end of NOT $scope.changeDate.twoMonthsWeekly

    console.log(dateListsInCurrentMonth)
    if(typeof dateListsInCurrentMonth == 'object'){
      console.log("I am returning you ")
      return dateListsInCurrentMonth;
    }
  }; // end of evaluateDateListsForWeekCal()

  var checkLastList = function(lastDateList, list, index){
    console.log("checkLastList invoked")
    var monthOfLastDateList = DateService.stringToDate(lastDateList.date, 'regMonth').getMonth();
    var appsCurrentMonth = $scope.changeDate.monthCount;
    var firstDateofAppsCurrentMonth = new Date($scope.changeYear.year, appsCurrentMonth-1, 1);
    var recurEnd = list.list_recur_end;
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
        $scope.listClone(list, index)
      }
    }
  };

  $scope.verifyCloneList = function(addNew){
    console.log("verifyCloneList called")
    $scope.allTasks = [];
    $scope.exists = false;
    if(addNew){
      $scope.allTodoLists = [];
      $scope.allTodoLists.push(addNew)
    }
    $scope.allTodoLists.forEach(function(list, index){
      console.log(list.list_name)
      var lastDateList = list.lists[list.lists.length-1];
      var dateListsInCurrentMonth = [];
      // loop checks to see if the date already exists within the list, in which case, we don't send to checkLastList which doesn't send to listClone
      console.log($scope.changeDate)
      for(var l = 0 ; l < list.lists.length; l++){
        var fullListDate = DateService.stringDateSplit(list.lists[l].date)
        console.log(fullListDate)
        if($scope.viewType === 'week'){
          var weeklyDate = evaluateDateListsForWeekCal(fullListDate, list.lists[l], list)
          if(weeklyDate){
            dateListsInCurrentMonth.push(weeklyDate)
          }
          if(fullListDate.year == $scope.changeDate.year && fullListDate.month > $scope.changeDate.monthCount || fullListDate.month > $scope.changeDate.monthCount+1){
            var l = list.lists.length;
          }
        } else if($scope.viewType === 'month'){
          if(fullListDate.month == $scope.changeDate.monthCount && fullListDate.year == $scope.changeDate.year){
            dateListsInCurrentMonth.push(list.lists[l])
            if(list.lists[l].tasks.length && list.list_type == 'todo'){
              parseAllTasks(list.lists[l], list)
            }
            console.log("date-list ALREADY EXISTS so we don't need to clone")
            $scope.exists = true;
          }
          if(fullListDate.year == $scope.changeDate.year && fullListDate.month > $scope.changeDate.monthCount){
            var l = list.lists.length;
          };
        } // end of month else if
      }; //end of for loop
      if(!$scope.exists){
        console.log("sending to checkLastList")
        checkLastList(lastDateList, list, index)
      } else {
        listForCal.push({origin: 'database' , todo: list, modifiedDateList: dateListsInCurrentMonth})
      }
    }) // end of $scope.allTodoLists forEach
    if(!listForCal.length){
      listForCal.push({origin: 'no-lists', todo: '', modifiedDateList: []})
    }
    $scope.listForCal = listForCal
    console.log($scope.listForCal)
  }; //end of $scope.verifyCloneList()

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

  var resetDataForVerifyClone = function(){
    console.log("resetDataForVerifyClone")
    $scope.listForCal = [];
    listForCal = [];
    $scope.exists = false;
    $scope.verifyCloneList();
    monthContext();
  };

  var splitTwoMonthsWeeklyIntoOldAndNew = function(){
    console.log("splitTwoMonthsWeeklyIntoOldAndNew")
    var dateArrayLength = $scope.changeDate.dayCount.length
    var firstWeeklyDate = $scope.changeDate.dayCount[dateArrayLength-7]

    if($scope.changeDate.lastMove === 'increment'){
      var lastDayOfOldMonth = new Date ($scope.changeDate.year, $scope.changeDate.monthCount-1, 0).getDate()
      var oldMonth = $scope.changeDate.monthCount-1
      var newMonth = $scope.changeDate.monthCount
    } else if($scope.changeDate.lastMove === 'decrement') {
      console.log($scope.changeDate.months)
      var lastDayOfOldMonth = $scope.changeDate.months.previousMonth.days;
      console.log(lastDayOfOldMonth)
      var oldMonth = $scope.changeDate.monthCount
      var newMonth = $scope.changeDate.monthCount+1
    }
    var oldMonthDate = {month: oldMonth, date: []};
    var newMonthDate = {month: newMonth, date: []};

    for(var t = dateArrayLength-7; t <= dateArrayLength-1; t++){
      console.log($scope.changeDate.dayCount[t])
      console.log(firstWeeklyDate)
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
        } else if($scope.changeDate.lastMove === 'decrement') {
          console.log($scope.changeDate.dayCount[t] > firstWeeklyDate)
          if($scope.changeDate.dayCount[t] >= firstWeeklyDate){
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
  };

  // logic for weekly calendar view days when user is "flipping" through calendar view, invoked in $scope.changeDate.increment and decrement
  var weeklyMove = function(move){
    console.log("weeklyMove")
    $scope.changeDate.twoMonthsWeekly = false;
    var date = $scope.changeDate.dayCount[$scope.changeDate.dayCount.length-1];
    var dateArrayLength = $scope.changeDate.dayCount.length;
    dateArrayLength = dateArrayLength-1;
    var actionDate = $scope.changeDate.dayCount[dateArrayLength];

    if(move === "increment"){
      $scope.changeDate.weekCount++
    } else {
      $scope.changeDate.weekCount--
    }

    if(move === "increment"){
      var thisMonthsLastDay = new Date($scope.calendarYear, $scope.changeDate.monthCount, 0).getDate()

      if($scope.changeDate.lastMove === "decrement"){
        // when we go from increment to decrement we need to adjust the date count in order to synchronize correctly
        console.log(date)
        var date = actionDate+6

        if(date > thisMonthsLastDay){
          date = date - thisMonthsLastDay
          $scope.changeDate.monthCount++
        }
        console.log(date)
      } else if($scope.changeDate.lastMove === "increment") {
        date = actionDate
      }

      console.log(date)
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

    } else if(move === "decrement") {
      console.log("date = " + date)
      console.log($scope.changeDate)
      console.log($scope.changeDate.lastMove)
      if($scope.changeDate.lastMove === "increment"){
        if(date - 6 <= 0){
          $scope.changeDate.monthCount--
          // this is needed to account for when the date is less than 6 to move to the previous month and not generate negative dates
          var lastDayOfEarlierMonth = new Date($scope.calendarYear, $scope.changeDate.monthCount-1, 0)
          var lastDayOfEarlierMonth = lastDayOfEarlierMonth.getDate()
          var date = lastDayOfEarlierMonth + (date - 6)
        } else {
          console.log("date - 6 > 0.  date = " + date)
          var date = actionDate-6
        }
      } else if($scope.changeDate.lastMove === "decrement"){
        console.log("actionDate = " + actionDate)
        date = actionDate
      }
      console.log("date = " + date)
      if($scope.changeDate.weekCount == -1){
        date = date-8
      } else {
        date = date-14
      }
      console.log("date = " + date)

      if(date <= 0){
        $scope.changeDate.monthCount--;
        date = $scope.changeDate.months.thisMonth.days + date +1;
        $scope.changeDate.twoMonthsWeekly = true;
      }
      console.log("date = " + date)

      for(var e = 7; e >= 1; e--){
        $scope.changeDate.lastMove = "decrement";
        var date = date + 1;
        console.log("******* beginning of loop.....")
        console.log("date = " + date)
        console.log($scope.changeDate)
        console.log($scope.changeDate.months.thisMonth.days)
        if(date <= 0){
          $scope.changeDate.monthCount--
          var date = $scope.changeDate.months.previousMonth.days
          console.log($scope.changeDate)
          if(date > $scope.changeDate.months.thisMonth.count-7 || date < 7) {
            $scope.changeDate.twoMonthsWeekly = true;
          }
        } else if (date > $scope.changeDate.months.previousMonth.days){
          date = 1;
        }
        console.log("date that gets pushed = " + date)
        console.log("******* END of loop.....")
        $scope.changeDate.dayCount.push(date)
      } // end of for loop

    } // end of weekly decrement, beginning of code to put dates in two differenet arrarys if twoMonthsWeekly
      console.log("new stuff here")
      if($scope.changeDate.twoMonthsWeekly){
        splitTwoMonthsWeeklyIntoOldAndNew();
      };
    resetDataForVerifyClone();
  }; //end of weeklyMove function

  $scope.changeDate = {
    year: $scope.calendarYear,
    monthCount: $scope.date.getMonth()+1,
    weekCount: 0,
    dayCount: [],
    twoMonthsWeekly: false,
    currentMonth: function(){
      var today = new Date()
      this.monthCount = today.getMonth()+1
      resetDataForVerifyClone()
      $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
    },
    thisWeek: function(){
      this.weekCount = 0;
      $scope.changeDate.dayCount = [];
      $scope.intializeDayCount()
      resetDataForVerifyClone()
    },
    increment: function(){
      if(!$scope.changeDate.dayCount.length){
        $scope.intializeDayCount()
      }
      if($scope.viewType === 'week'){
        weeklyMove("increment")
      } else if($scope.viewType === 'month') {
        if(this.monthCount > 11){
          this.monthCount = 1;
          $scope.changeYear.increment();
        } else {
          this.monthCount++
        }
        resetDataForVerifyClone();
      }
      $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
    },
    decrement: function(){
      if(!$scope.changeDate.dayCount.length){
        $scope.intializeDayCount()
      }
      if($scope.viewType === 'week'){
        weeklyMove('decrement')
      } else if($scope.viewType === 'month') {
        if(this.monthCount <= 1) {
          this.monthCount = 12
          $scope.changeYear.decrement()
        } else {
          this.monthCount--
        }
        resetDataForVerifyClone();
      }
      $scope.showTodayButton = $scope.changeDate.monthCount != $scope.calendarMonth+1
    }
  };

  // adds the dates of the current week to $scope.changeDate.dayCount array upon page load
  $scope.intializeDayCount = function(){
    console.log("intializeDayCount envoked")
    $scope.changeDate.lastMove = "increment";
    $scope.changeDate.twoMonthsWeekly = false;
    $scope.changeDate.monthCount = $scope.calendarMonth+1;
    var date = $scope.date.getDate()
    var day = $scope.date.getDay()

    if(date == 1){
      var lastMonth = new Date ($scope.changeDate.year, $scope.changeDate.monthCount-1, 0)
      var lastDay = lastMonth.getDate();
      var date = lastDay-day
    } else {
      date = date-day
      date = date-1
      var lastDay = new Date($scope.changeDate.year, $scope.changeDate.monthCount+2, 0).getDate()
    };

    for(var d = 1; d <= 7; d++ ){
      var date = date + 1
      if(date > lastDay){
        date = 1
        $scope.changeDate.twoMonthsWeekly = true;
      }
      $scope.changeDate.dayCount.push(date)
    };
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
    console.log("$scope.listClone")
    var appsCurrentMonth = $scope.changeDate.monthCount-1;
    var appsCurrentYear = $scope.changeYear.year;
    var firstListDay = DateService.stringToDate(masterList.first_day, 'regMonth').getDay();
    var firstDateOfMonth = new Date(appsCurrentYear, $scope.changeDate.monthCount-1, 1)
    var firstDayOfMonth = firstDateOfMonth.getDay();
    var repeatInterval = masterList.list_reocurring;
    var reoccurEnds = masterList.list_recur_end;
    var lastDayOfAppsCurrentMonth = new Date(appsCurrentYear, $scope.changeDate.monthCount, 0).getDate();
    var last = reoccurEnds === 'Never'? lastDayOfAppsCurrentMonth:DateService.stringDaysInAMonth(reoccurEnds)
    var listsInMasterList = masterList.lists;
    var count = 1;

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

          if ($scope.viewType === 'week'){
            console.log("we're in $scope.view === week in ListClone")
            var correctDateFormat = DateService.stringDateSplit(listDate);
            var newlyCreatedDateListsForWeekly = evaluateDateListsForWeekCal(correctDateFormat, { date: listDate, tasks: masterTasksToAdd })

            if(newlyCreatedDateListsForWeekly){
              // what the function is expecting ---> parseAllTasks(dateList, list)
              parseAllTasks({ date: listDate, tasks: masterTasksToAdd }, masterList)
              newlyCreatedDateLists.push(newlyCreatedDateListsForWeekly)
            };
          } else if ($scope.viewType === 'month'){
            parseAllTasks({ date: listDate, tasks: masterTasksToAdd }, masterList)
            newlyCreatedDateLists.push( { date: listDate, tasks: masterTasksToAdd } );
          }
        }
      }
      count = count + repeater
    }
      console.log(newlyCreatedDateLists);

      Todo.update({list_name: masterList.list_name}, {todo: masterList}, function(task){
        console.log("------- Todo/List UPDATED!!! -----");
        console.log(task);
      })
      listForCal.push({origin: 'newClone', todo: masterList, modifiedDateList: newlyCreatedDateLists});
      $scope.listForCal = [listForCal];
      console.log($scope.listForCal);
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
