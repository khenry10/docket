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



        $scope.getMasters = function(){
          console.log("$scope.getMasters called")
          console.log($scope.lists)
          $scope.intializeDayCount()

            Todo.all.forEach(function(todo, index){
              console.log(index)
              console.log(todo)
              if(todo != undefined){
                  var masters = {
                    index: index,
                    name: todo.list_name,
                    master_tasks: todo.master_tasks,
                    lists: todo.lists,
                    duration: todo.lists.length * todo.duration
                  }

              console.log($scope.changeDate)
              var todoIndex = index

              var added = false;

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
                    } else if($scope.viewType === "week"){
                      var weekDays = $scope.changeDate.dayCount
                      var weekDaysLength = $scope.changeDate.dayCount.length-7
                      console.log($scope.changeDate)
                      console.log($scope.changeDate.dayCount.length)
                      console.log($scope.changeDate.dayCount.length-7)

                      for(var w = weekDaysLength; w < weekDaysLength+7; w++){
                        if($scope.changeDate.dayCount[w] == listDate.date){
                          console.log(w)
                          console.log(listDate.date)
                          console.log($scope.changeDate.dayCount[w])
                          console.log("made it into daily masters")
                          console.log(t)
                          console.log(todo.lists.length)
                          console.log(masters)
                          $scope.lists.push(masters)
                          t = todo.lists.length
                        }
                      }

                    }
                  }
              }
              console.log($scope.lists)
            }
            })
        }

        console.log($scope.lists)

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
