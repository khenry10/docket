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
        scope.newMaster = ""
        console.log("You in da MASTA Todo")
        scope.lists = []
        Todo.all.$promise.then(function(){
          Todo.all.forEach(function(todo){
              console.log(todo)
              scope.lists.push({name: todo.list_name, master_tasks: todo.master_tasks})
            
          })
        })

        scope.addNewMaster = function (){
          console.log(scope.newMaster)
        }

      }
    }
  }
})();
