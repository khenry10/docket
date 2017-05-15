angular.module('app').service('Clone', ["DateService", "Todo", function (DateService, Todo) {

  this.cloneTest = function(){
    console.log("clone service operational...")
  };

  this.listClone = function(masterList, index, changeDate, viewType){
    console.log("listClone")
    console.log(changeDate)
    var parseAllTasks = {};
    var listForCal = [];
    var appsCurrentMonth = changeDate.monthCount-1;
    var appsCurrentYear = changeDate.year;
    var firstListDay = DateService.stringToDate(masterList.first_day, 'regMonth').getDay();
    var firstDateOfMonth = new Date(appsCurrentYear, changeDate.monthCount-1, 1)
    var firstDayOfMonth = firstDateOfMonth.getDay();
    var repeatInterval = masterList.list_reocurring;
    var reoccurEnds = masterList.list_recur_end;
    var lastDayOfAppsCurrentMonth = new Date(appsCurrentYear, changeDate.monthCount, 0).getDate();
    var last = reoccurEnds === 'Never'? lastDayOfAppsCurrentMonth:DateService.stringDaysInAMonth(reoccurEnds)
    var listsInMasterList = masterList.lists;
    var count = 1;

    if(reoccurEnds != 'Never'){
      reoccurEnds = DateService.stringToDate(reoccurEnds, "regMonth")
      var last = lastDayOfAppsCurrentMonth
      var endDateMonth = reoccurEnds.getMonth()
      var endDateYear = reoccurEnds.getFullYear()
      if(changeDate.year === endDateYear){
        if(changeDate.monthCount === endDateMonth){
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

    var newlyCreatedDateLists = [];
    while(count <= last){
      if(count > 0){
        if(count <= last){
          count = count.length === 1? "0"+count: count
          var listDate = changeDate.year+"-"+changeDate.monthCount+"-"+count
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
          listsInMasterList.push( {
            date: listDate,
            start_time: masterList.start_time,
            end_time: masterList.end_time,
            tasks: masterTasksToAdd
          } );

          if (viewType === 'week'){
            var correctDateFormat = DateService.stringDateSplit(listDate);
            var newlyCreatedDateListsForWeekly = evaluateDateListsForWeekCal(correctDateFormat, { date: listDate, tasks: masterTasksToAdd })

            if(newlyCreatedDateListsForWeekly){
              // what the function is expecting ---> $scope.parseAllTasks(dateList, list)
              parseAllTasks = { date: listDate, tasks: masterTasksToAdd, masterList: masterList }
              newlyCreatedDateLists.push(newlyCreatedDateListsForWeekly)
            };
          } else if (viewType === 'month'){
            parseAllTasks = { date: listDate, tasks: masterTasksToAdd, masterList: masterList }
            newlyCreatedDateLists.push( { date: listDate, tasks: masterTasksToAdd } );
          }
        }
      }
      count = count + repeater
    }

      Todo.update({list_name: masterList.list_name}, {todo: masterList}, function(task){
        console.log("--- Todo/List UPDATED!!! ---");
      })
      listForCal = {origin: 'newClone', todo: masterList, modifiedDateList: newlyCreatedDateLists};
      console.log(listForCal)

      return {listForCal: listForCal, parseAllTasks: parseAllTasks};
  }; // end of $scope.listClone

}]);
