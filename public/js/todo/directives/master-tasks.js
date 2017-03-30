"use strict";

(function(){
  angular.module("app").directive("todoMaster", ["Todo", "DateService", masterTasks])

  function masterTasks(Todo, DateService){
    return {
      templateUrl: "/assets/html/todo/directives/master-tasks.html",
      link: function($scope){
        console.log($scope)
        console.log("You in da MASTA Todo")

        var lists = []

        $scope.$watch("viewType", function(newV, oldV){
          console.log("viewType watched called")
          console.log(newV)
          var listsToAdd = []
          lists = [];
          $scope.listss = [];
          $scope.getMasters("viewType")
        })

        $scope.$watch("changeDate.monthCount", function(newDate, oldDate){
          console.log("changeDate.monthCount watched called")
          console.log(newDate)
          console.log($scope.changeDate)
          var listsToAdd = []
          lists = [];
          $scope.listss = [];
          // below is to help prevent getMasters() called multiple times in a single page load
          if($scope.viewType === 'month')
          $scope.getMasters("monthCount")
        })

        $scope.$watch("changeDate.weekCount", function(newDate, oldDate){
          console.log("changeDate weekCount called")
          console.log($scope.changeDate)
          console.log(newDate)
          $scope.lists = [];
          // below is to help prevent getMasters() called multiple times in a single page load
          if($scope.viewType === 'week' && !$scope.viewTypeCalledMasters){
            $scope.getMasters("weekCount")
          }
        })

        // below is was the first attempt at aggregrating all Tasks in a given period, but think I need put Drag and Drop list in a directive first

        var pullOutAllTasks = function(visibleLists){
          $scope.allTasks = []
          console.log("loopThroughWeekAggs envoked ")
          console.log(visibleLists)

          visibleLists.forEach(function(visible){
            console.log(visible)
            var name = visible.name
            visible.lists.forEach(function(list){
              console.log(list)
              var listName = list.date
              list.tasks.forEach(function(task){
                console.log(task)
                $scope.allTasks.push({name: name, list: listName, tasks: task})
              })
            })
          })

        }

        // looks to see if there are any lists embedded in each Todo, if yes, put it on calendar
        var checkLists = function(){
          var reallyNewList = []
          console.log(lists.length)
          // console.log(JSON.stringify(lists))
          for(var e = 0; e < lists.length; e++){
            if(lists[e].lists.length){
              console.log("TRUE. e = " + e)
              console.log(lists[e].name)
              reallyNewList.push(lists[e])
              // console.log(JSON.stringify(reallyNewList))
            }
          }
          pullOutAllTasks(reallyNewList)
          $scope.listss = reallyNewList
          console.log($scope.listss)
        }

        // retrieves all todo lists from database
        $scope.getMasters = function(origin){
          console.log("$scope.getMasters called from " + origin)
          lists= [];
          console.log(lists)
          // console.log(JSON.stringify(lists))

            Todo.all.forEach(function(todo, index){
              if(todo != undefined){
                console.log(todo)
                  var masters = {
                    name: todo.list_name,
                    master_tasks: todo.master_tasks,
                    lists: todo.lists,
                    duration: todo.duration
                  }
              console.log($scope.changeDate)
              lists.push(masters)

              // need to loop through every date list in every larger list to see if it's on the calendar
              var listsToAdd = []
              for(var t = 0; t < todo.lists.length; t++) {
                var list = todo.lists[t]
                console.log(todo.list_name)
                console.log(list)
                var listDate = DateService.stringDateSplit(list.date)
                  console.log($scope.changeDate.twoMonthsWeekly && listDate.month == $scope.changeDate.monthCount+1)
                  console.log(listDate.month)
                  console.log($scope.changeDate.monthCount+1)
                  console.log($scope.changeDate.twoMonthsWeekly)
                  if(listDate.month == $scope.changeDate.monthCount ||
                    ($scope.changeDate.twoMonthsWeekly && listDate.month == $scope.changeDate.monthCount+1)){
                    console.log("made it past listDate.month")
                    if($scope.viewType === "month"){
                      console.log("made it past viewType === month")

                      listsToAdd.push(list)
                      console.log(lists)

                    } else if($scope.viewType === "week"){
                      // similar to what happens in calendar_directive, need to check by day
                      console.log("made it into daily masters")
                      var weekDays = $scope.changeDate.dayCount
                      var weekDaysLength = $scope.changeDate.dayCount.length-7

                      // need to add the twoMonthsWeekly logic so that lists from the beginning of the month, don't sneak in at the end of the month (example: last of week of March has a list from 3/1 sneaking through)
                      for(var w = weekDaysLength; w < weekDaysLength+7; w++){
                        if($scope.changeDate.dayCount[w] == listDate.date){
                          if($scope.changeDate.twoMonthsWeekly){
                            if(listDate.date < $scope.changeDate.dayCount[weekDaysLength]){
                              if(listDate.month === $scope.changeDate.monthCount+1){
                                console.log(index + " here1 KP")

                                listsToAdd.push(list)
                                console.log(list)

                              }
                            } else {
                              console.log(index + " here2 KP. " +list.date)
                              console.log(masters)
                              listsToAdd.push(list)
                              console.log(list)

                            }
                          } else {
                            console.log(index + " here3 KP")

                            listsToAdd.push(list)
                            console.log(list)

                          }
                        }
                      }
                    }
                  }
              }
              lists[index].lists = listsToAdd
            }
          }) // end of Todo.all.forEach
          checkLists()
        } //end of checkMasters


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
        $scope.addNewMasterTask = function (master, list){
          $scope.show = false;
          // console.log($scope.newMaster)
          // console.log($scope.keith)
          console.log(master)
          console.log(list)
          var today = new Date()
          var saveMe = {
            name: master,
            task_completed: false
          }
          list.master_tasks.push({name: master, created_on: today})
          console.log(list)
          list.lists.forEach(function(list){
            console.log(list)
            list.tasks.push(saveMe)
          })
          // not sure when the below was added... but it was adding a master task to EVERY list.  Assuming I put it in for something with ALL tasks, keeping for now 3/20/17
          // Todo.all.forEach(function(todo){
          //   console.log(todo)
          //   if(todo != undefined){
          //     todo.lists.forEach(function(list){
          //       console.log(list)
          //       list.tasks.push(saveMe)
          //     })
          //   }
          // })

          list.list_name = list.name
          console.log(list)
          Todo.update({list_name: list.list_name}, {todo: list}, function(task){
            console.log(task)
          })
        }

        // $scope.getMasters()

      }
    }
  }
})();
