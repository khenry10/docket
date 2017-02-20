"use strict";

(function(){
  angular
  .module("app")
  .directive("todoMaster", [
    "Todo",
    masterTasks
  ])

  function masterTasks(Todo){
    return {
      templateUrl: "/assets/html/todo/directives/master-tasks.html",
      link: function($scope){

        console.log($scope)

        console.log("You in da MASTA Todo")

        $scope.lists = []

        $scope.getMasters = function(newMaster){
          $scope.lists = []
          console.log(newMaster)
          if(newMaster){
            var name = newMaster.list_name
            var lists = newMaster.lists
            $scope.lists.push({name: name, master_tasks: [], lists: lists})
          }
          console.log("$scope.getMasters called")
          // Todo.all.$promise.then(function(){
            Todo.all.forEach(function(todo){
                console.log(todo)
                console.log(todo.master_tasks)
                $scope.lists.push({name: todo.list_name, master_tasks: todo.master_tasks, lists: todo.lists})

            })
            console.log($scope.lists)
          // })
        }



        $scope.addNewMaster = function (master, list){
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

      }
    }
  }
})();
