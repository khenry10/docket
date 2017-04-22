"use strict";

(function(){
  angular.module("app").directive("todoMaster", ["Todo", "DateService", masterTasks])

  function masterTasks(Todo, DateService){
    return {
      templateUrl: "/assets/html/todo/directives/master-tasks.html",
      scope: {
        listType: "@",
        changeDate: "=",
        listForCal: "="
      },
      link: function($scope){
        console.log("masterTask aks todoMaster $scope below")
        console.log($scope)
        console.log("You in da MASTA Todo")
        $scope.taskButton = false;

        var lists = []
        $scope.listss = []

        $scope.$watch('listForCal', function(todosForCal, oldList){
          console.log(todosForCal)
          console.log(oldList)
          console.log($scope.changeDate)
          console.log($scope.changeDate.monthCount)

          console.log(todosForCal)
          if(todosForCal.length){
            $scope.listss = [];
            console.log('Made it in ')
            // todoForCal = [{origin: 'database' , todo: list}, {origin: 'newClone' , todo: list, modifiedDateList: newList}]
            todosForCal.forEach(function(todoForLeftRail){
              console.log('Made it in here too ;) ')
              console.log(todoForLeftRail)
              console.log($scope.listType)
              if(todoForLeftRail.todo.list_type === $scope.listType && todoForLeftRail.modifiedDateList.length){
                console.log('Made it in here 3 ;) ')
                $scope.listss.push({
                  name: todoForLeftRail.todo.list_name,
                  master_tasks: todoForLeftRail.todo.master_tasks,
                  listType: todoForLeftRail.todo.list_type,
                  todo: todoForLeftRail.todo
                 })
              }

              // don't think I need this, but not sure so I'm not deleteing
              // if(todoForCal.todo.lists || todoForCal.modifiedDateList){
              //   todoForCal.modifiedDateList.forEach(function(dateList){
              //
              //     var date = dateList.date;
              //     // scope.pickCorrectDateForCal(date, todoForCal.todo)
              //   })
              // }
            })
            console.log($scope.listss)
          }
        }, true);

        // $scope.$watch("viewType", function(newV, oldV){
        //   console.log("viewType watched called")
        //   console.log(newV)
        //   var listsToAdd = []
        //   lists = [];
        //   $scope.listss = [];
        //   $scope.allTasks = [];
        //
        //   if(newV != oldV){
        //     $scope.getMasters("viewType")
        //   }
        // })

        // $scope.$watch("changeDate.monthCount", function(newDate, oldDate){
        //   console.log("changeDate.monthCount watched called")
        //   console.log(newDate)
        //   console.log($scope.changeDate.monthCount)
        //   var listsToAdd = []
        //   lists = [];
        //   $scope.listss = [];
        //   // below is to help prevent getMasters() called multiple times in a single page load
        //   // if($scope.isAllTasksOpen){
        //     $scope.getMasters("monthCount")
        //   // }
        // })

        // $scope.$watch("changeDate.weekCount", function(newDate, oldDate){
        //   console.log("changeDate weekCount called")
        //   console.log($scope.changeDate.weekCount)
        //   console.log(newDate)
        //   $scope.lists = [];
        //   // below is to help prevent getMasters() called multiple times in a single page load
        //   if($scope.viewType === 'week' && !$scope.viewTypeCalledMasters){
        //     $scope.getMasters("weekCount")
        //   }
        // })

        // below is was the first attempt at aggregrating all Tasks in a given period, but think I need put Drag and Drop list in a directive first

        // var pullOutAllTasks = function(visibleLists){
        //   $scope.allTasks = []
        //   console.log("loopThroughWeekAggs envoked ")
        //   console.log(visibleLists)
        //   console.log(visibleLists.length)
        //   if($scope.listType === 'todo'){
        //     visibleLists.forEach(function(visible){
        //       console.log(visible)
        //       var name = visible.name
        //       visible.lists.forEach(function(list){
        //         console.log(list)
        //         var listName = list.date
        //         list.tasks.forEach(function(task){
        //           console.log(task)
        //           $scope.allTasks.push({name: name, list: listName, tasks: task, listType: visible.list_type})
        //         })
        //       })
        //     })
        //   }
        //   console.log($scope.allTasks)
        // }

        // looks to see if there are any lists embedded in each Todo, if yes, put it on calendar
        // var checkLists = function(){
        //   var reallyNewList = []
        //   console.log(lists.length)
        //   console.log(lists)
        //   for(var e = 0; e < lists.length; e++){
        //     if(lists[e].lists.length){
        //       console.log("TRUE. e = " + e)
        //       console.log(lists[e].name)
        //       reallyNewList.push(lists[e])
        //       // console.log(JSON.stringify(reallyNewList))
        //     }
        //   }
        //   pullOutAllTasks(reallyNewList)
        //   console.log(reallyNewList[0])
        //
        //   console.log($scope.listNumbers)
        //   $scope.listss = reallyNewList
        //   console.log($scope.listss)
        //   console.log($scope)
        // };


        // var listsToAdd = [];
        // var timesLooped = [];

        // var checkWeeklyLists = function(listDate, index, list){
        //
        //   var weekDays = $scope.changeDate.dayCount
        //   var weekDaysLength = $scope.changeDate.dayCount.length-7
        //
        //   for(var w = weekDaysLength; w < weekDaysLength+7; w++){
        //     if($scope.changeDate.dayCount[w] == listDate.date){
        //       if($scope.changeDate.twoMonthsWeekly){
        //
        //         console.log((listDate.date < $scope.changeDate.dayCount[weekDaysLength]))
        //         console.log(listDate.month == $scope.changeDate.monthCount)
        //
        //         if(listDate.date < $scope.changeDate.dayCount[weekDaysLength]){
        //           console.log(listDate.month === $scope.changeDate.monthCount+1)
        //           if(listDate.month == $scope.changeDate.monthCount+1){
        //             console.log(index + " here1 KP.  2 month view ===true list.month === monthCount+1 is in t ")
        //
        //             listsToAdd.push(list)
        //             timesLooped = [w+1]
        //             console.log(list)
        //
        //           } else if(listDate.month == $scope.changeDate.monthCount-1) {
        //             console.log(index + " here2 KP. " +list.date + " twoMonthView and list === list.monthCount")
        //             console.log(masters)
        //             timesLooped = [w+1]
        //             listsToAdd.push(list)
        //             console.log(list)
        //
        //           }
        //         } else if(listDate.month == $scope.changeDate.monthCount) {
        //           console.log(index + " here3 KP. " +list.date + " twoMonthView and list === list.monthCount")
        //           console.log(masters)
        //           timesLooped = [w+1]
        //           listsToAdd.push(list)
        //           console.log(list)
        //
        //         }
        //       } else {
        //         console.log(index + " here4 KP")
        //         timesLooped = [w+1]
        //         listsToAdd.push(list)
        //         console.log(list)
        //
        //       }
        //     }
        //   }
        // }

        // retrieves all todo lists from database
        // $scope.getMasters = function(origin){
        //   console.log("$scope.getMasters called from " + origin)
        //   lists= [];
        //   console.log(lists)
        //
        //     Todo.all.forEach(function(todo, index){
        //
        //       if(todo != undefined && todo.list_type == $scope.listType){
        //         console.log(todo)
        //         console.log($scope.listType)
        //         console.log(todo)
        //           var masters = {
        //             name: todo.list_name,
        //             list_type: todo.list_type,
        //             master_tasks: todo.master_tasks,
        //             lists: todo.lists
        //           }
        //       console.log($scope.changeDate)
        //       // lists.push(masters)
        //
        //       // need to loop through every date list in every larger list to see if it's on the calendar
        //       for(var t = 0; t < todo.lists.length; t++) {
        //         var list = todo.lists[t]
        //         console.log(todo.list_name)
        //         console.log(list)
        //         var listDate = DateService.stringDateSplit(list.date)
        //             if(listDate.month == $scope.changeDate.monthCount ||
        //               ($scope.changeDate.twoMonthsWeekly && listDate.month == $scope.changeDate.monthCount+1)){
        //               console.log("made it past listDate.month")
        //               if($scope.viewType === "month" && listDate.month == $scope.changeDate.monthCount){
        //                 timesLooped = [t+1]
        //                 console.log("made it past viewType === month")
        //
        //                 listsToAdd.push(list)
        //                 console.log(list)
        //                 console.log(listsToAdd)
        //
        //               } else if($scope.viewType === "week"){
        //                 // similar to what happens in calendar_directive, need to check by day
        //                 console.log("made it into daily masters")
        //                 checkWeeklyLists(listDate, index, list)
        //               }
        //             } // end of if statement with a bunch of conditionals
        //       }
        //
        //       console.log(timesLooped)
        //       masters.duration = todo.duration*timesLooped[0]
        //       if($scope.listType === 'shopping'){
        //         masters.budget = todo.budget;
        //       }
        //       console.log(masters)
        //       lists.push(masters)
        //
        //       console.log(index)
        //       // lists[index].lists = listsToAdd
        //       lists[0].lists = listsToAdd
        //       console.log(lists[0].lists)
        //       console.log(lists)
        //     }
        //
        //   }) // end of Todo.all.forEach
        //   checkLists()
        // } //end of checkMasters


        $scope.newMasterListAddition = function(newVariableName){
          // changed parameter to "newVariableName" because it was newMaster and I think something was getting scoped to it and adding the WHOLE list as an onbject in list.list which was creating JSON stringify issue
          console.log(newVariableName)

          if(newVariableName){
            var name = newVariableName.list_name
            var listOfLists = newVariableName.lists
            $scope.listss.push({name: name, master_tasks: [], lists: listOfLists})
          }
        }

        $scope.show = true;
        $scope.newMasterInDirective = {}

        $scope.addNewMasterTask = function (list){
          $scope.show = false;
          console.log($scope)
          console.log($scope.$parent)
          console.log(JSON.stringify($scope.newMasterInDirective))
          var master = $scope.newMasterInDirective.name

          var today = new Date()
          var saveMe = {
            name: master,
            task_completed: false,
            created_on: today
          }

          if($scope.listType === 'shopping'){
            saveMe.price = $scope.newMasterInDirective.price
            saveMe.quantity = $scope.newMasterInDirective.quantity
          }

          console.log(list)

          list.master_tasks.push({name: master, created_on: today})
          console.log(list.todo)
          list.todo.lists.forEach(function(list){
            console.log(list)
            list.tasks.push(saveMe)
          })

          list.list_name = list.name
          console.log(list)
          Todo.update({list_name: list.list_name}, {todo: list.todo}, function(task){
            console.log(task)

          })
          // this works but isn't a great solution. has to process everything just in order to add a new master task to all
          $scope.$parent.verifyCloneList();

          $scope.listForCal[0].origin = 'master-task'

          $scope.newMasterInDirective.name = "";
          $scope.newMasterInDirective.price = "";
          $scope.newMasterInDirective.quantity = "";
        }


      }
    }
  }
})();
