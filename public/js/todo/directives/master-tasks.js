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
      link: function(scope){

        console.log("You in da MASTA Todo")

        scope.lists = []
        Todo.all.$promise.then(function(){
          Todo.all.forEach(function(todo){
              console.log(todo)
              scope.lists.push({name: todo.list_name, master_tasks: todo.master_tasks, lists: todo.lists})

          })
        })


        scope.addNewMaster = function (master, list){
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
