"use strict";

(function(){
  angular.module("app").directive("todoMaster", ["Todo", "DateService", masterTasks])

  function masterTasks(Todo, DateService){
    return {
      templateUrl: "/assets/html/todo/directives/master-tasks.html",
      link: function($scope){
        console.log($scope)
        console.log("You in da MASTA Todo")

        $scope.lists = []

        $scope.$watch("viewType", function(newV, oldV){
          console.log("viewType watched called")
          console.log(newV)
          $scope.lists = [];
          $scope.getMasters()
        })

        $scope.$watch("changeDate.monthCount", function(newDate, oldDate){
          console.log("changeDate watched called")
          console.log(newDate)
          $scope.lists = [];
          $scope.getMasters()
        })

        // below is was the first attempt at aggregrating all Tasks in a given period, but think I need put Drag and Drop list in a directive first
        // $scope.aggWeeklyTasks = []
        // $scope.realAggTasks = []
        // var loopThroughWeekAggs = function(){
        //   $scope.aggWeeklyTasks.forEach(function(list){
        //     console.log(list)
        //     list.tasks.forEach(function(tasks){
        //       console.log(tasks)
        //       $scope.realAggTasks.push(tasks)
        //     })
        //   })
        //   console.log($scope.realAggTasks)
        // }

        // retrieves all todo lists from database
        $scope.getMasters = function(){
          console.log("$scope.getMasters called")
          console.log($scope.lists)

            Todo.all.forEach(function(todo, index){
              if(todo != undefined){
                  var masters = {
                    index: index,
                    name: todo.list_name,
                    master_tasks: todo.master_tasks,
                    lists: todo.lists,
                    duration: todo.duration
                  }
              console.log($scope.changeDate)

              // need to loop through every date list in every larger list to see if it's on the calendar
              for(var t = 0; t < todo.lists.length; t++) {
                var list = todo.lists[t]
                var listDate = DateService.stringDateSplit(list.date)
                console.log(listDate)
                console.log(listDate.month)
                console.log($scope.changeDate.monthCount)

                  if(listDate.month == $scope.changeDate.monthCount){
                    console.log("made it past listDate.month")

                    if($scope.viewType === "month"){
                      console.log("made it past viewType === month")
                      $scope.lists.push(masters)
                      console.log($scope.lists)
                      t = todo.lists.length
                      // if the condition is met than we stop the loop since we'll duplicate entries
                    } else if($scope.viewType === "week"){
                      // similar to what happens in calendar_directive, need to check by day
                      var weekDays = $scope.changeDate.dayCount
                      var weekDaysLength = $scope.changeDate.dayCount.length-7

                      // need to add the twoMonthsWeekly logic so that lists from the beginning of the month, don't sneak in at the end of the month (example: last of week of March has a list from 3/1 sneaking through)
                      for(var w = weekDaysLength; w < weekDaysLength+7; w++){
                        if($scope.changeDate.dayCount[w] == listDate.date){
                          console.log(listDate.date)
                          console.log($scope.changeDate.dayCount[w])
                          console.log("made it into daily masters")
                          console.log(todo.lists.length)
                          console.log(masters)
                          $scope.lists.push(masters)
                          // $scope.aggWeeklyTasks.push(list)
                          t = todo.lists.length
                        }
                      }
                      // loopThroughWeekAggs()
                      console.log($scope.lists.length)
                    }
                  }
              }
              console.log($scope.lists)
            }
            })
        }
        console.log($scope.newMasterInDirective)

        $scope.newMasterListAddition = function(newMaster){
          console.log(newMaster)
          if(newMaster){
            var name = newMaster.list_name
            var lists = newMaster.lists
            $scope.lists.push({name: name, master_tasks: [], lists: lists})
          }
        }
        $scope.show = true;
        $scope.addNewMasterTask = function (master, list){
          $scope.show = false;
          console.log($scope.newMaster)
          console.log($scope.keith)
          console.log(master)
          console.log(list)
          var today = new Date()
          var saveMe = {
            name: master,
            task_completed: false
          }
          list.master_tasks.push({name: master, created_on: today})
          list.lists.forEach(function(recurring){
            console.log(recurring)
            recurring.tasks.push(saveMe)
          })
          list.list_name = list.name
          console.log(list)
          Todo.update({list_name: list.list_name}, {todo: list}, function(task){
            console.log(task)
          })
        }

        $scope.getMasters()

      }
    }
  }
})();
