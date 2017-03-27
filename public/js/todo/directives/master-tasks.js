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
          $scope.listss = [];
          $scope.getMasters()
        })

        $scope.$watch("changeDate.monthCount", function(newDate, oldDate){
          console.log("changeDate.monthCount watched called")
          console.log(newDate)
          $scope.lists = [];
          $scope.listss = [];
          $scope.getMasters()
        })

        // $scope.$watch("changeDate.weekCount", function(newDate, oldDate){
        //   console.log("changeDate weekCount called")
        //   console.log(newDate)
        //   $scope.lists = [];
        //   $scope.getMasters()
        // })

        // below is was the first attempt at aggregrating all Tasks in a given period, but think I need put Drag and Drop list in a directive first
        $scope.aggWeeklyTasks = []
        $scope.realAggTasks = []
        var loopThroughWeekAggs = function(){
          console.log("loopThroughWeekAggs envoked ")
          console.log($scope.lists)
          console.log($scope.aggWeeklyTasks)
          $scope.aggWeeklyTasks.forEach(function(list){
            console.log(list)
            list.tasks.forEach(function(tasks){
              console.log(tasks)
              $scope.realAggTasks.push(tasks)
            })
          })
          console.log($scope.realAggTasks)
        }

        // looks to see if there are any lists embedded in each Todo, if yes, put it on calendar
        var checkLists = function(){
          var newList = [];
          var newList = $scope.lists
          console.log(newList)
          console.log($scope.lists.length)
          for(var e = 0; e < $scope.lists.length; e++){
            console.log($scope.lists.length)
            console.log($scope.lists[e])
            console.log($scope.lists[e].lists.length)
            if(!$scope.lists[e].lists.length){
              console.log("TRUE. e = " + e)
              console.log($scope.lists[e].name)
              newList.splice(e, 1)
              console.log(newList)
            }
          }
          console.log(newList)
          $scope.listss = newList
          console.log($scope.listss)
        }

        // retrieves all todo lists from database
        $scope.getMasters = function(){
          console.log("$scope.getMasters called")
          $scope.lists= [];
          console.log($scope.lists)

            Todo.all.forEach(function(todo, index){
              if(todo != undefined){
                  var masters = {
                    name: todo.list_name,
                    master_tasks: todo.master_tasks,
                    lists: todo.lists,
                    duration: todo.duration
                  }
              console.log($scope.changeDate)
              $scope.lists.push(masters)

              // need to loop through every date list in every larger list to see if it's on the calendar
              var listsToAdd = []
              for(var t = 0; t < todo.lists.length; t++) {
                var list = todo.lists[t]
                console.log(list)
                var listDate = DateService.stringDateSplit(list.date)

                  if(listDate.month == $scope.changeDate.monthCount){
                    console.log("made it past listDate.month")
                    if($scope.viewType === "month"){
                      console.log("made it past viewType === month")

                      listsToAdd.push(list)
                      console.log($scope.lists)

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
              $scope.lists[index].lists = listsToAdd
            }
          }) // end of Todo.all.forEach
          checkLists()
        } //end of checkMasters


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

        // $scope.getMasters()

      }
    }
  }
})();
