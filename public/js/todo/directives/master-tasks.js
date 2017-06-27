"use strict";

(function(){
  angular.module("app").directive("todoMaster", ["Todo", "DateService", masterTasks])

  function masterTasks(Todo, DateService){
    return {
      templateUrl: "/assets/html/todo/directives/master-tasks.html",
      scope: {
        listType: "@",
        listForCal: "="
      },
      link: function($scope){
        console.log("masterTask aka todoMaster")
        $scope.taskButton = false;
        var lists = [];
        $scope.listss = [];
        $scope.show = true;
        $scope.newMasterInDirective = {};

        var lastTodosForCal = [];
        var called = 0;
        $scope.$watch('listForCal', function(todosForCal, oldList){
          called = called + 1
          lastTodosForCal[0] = todosForCal;
          if(todosForCal && todosForCal.length){
            $scope.listss = [];
            // todoForCal = [{origin: 'database' , todo: list}, {origin: 'newClone' , todo: list, modifiedDateList: newList}]
            todosForCal.forEach(function(todoForLeftRail){
              console.log(todoForLeftRail)
              if(todoForLeftRail.todo){
                if(todoForLeftRail.todo.list_type === $scope.listType && todoForLeftRail.modifiedDateList.length){
                  console.log($scope.listss)
                  // if($scope.listss.length){
                    // $scope.listss.forEach(function(list){
                      // console.log(list.todo._id)
                      console.log(todoForLeftRail.todo._id)
                      // if(list.todo._id !== todoForLeftRail.todo._id){
                        $scope.listss.push({
                          name: todoForLeftRail.todo.list_name,
                          master_tasks: todoForLeftRail.todo.master_tasks,
                          listType: todoForLeftRail.todo.list_type,
                          todo: todoForLeftRail.todo
                        })
                      // }
                    // })
                //   } else {
                //     $scope.listss.push({
                //       name: todoForLeftRail.todo.list_name,
                //       master_tasks: todoForLeftRail.todo.master_tasks,
                //       listType: todoForLeftRail.todo.list_type,
                //       todo: todoForLeftRail.todo
                //     })
                // }


                }
              }
            })
          }
        }, false);

        $scope.addNewMasterTask = function (list){
          $scope.show = false;
          var master = $scope.newMasterInDirective.name;
          $scope.listss = [];
          var today = new Date();
          var saveMe = {
            name: master,
            task_completed: false,
            created_on: today
          };

          if($scope.listType === 'shopping'){
            saveMe.price = $scope.newMasterInDirective.price
            saveMe.quantity = $scope.newMasterInDirective.quantity
          }

          list.master_tasks.push({name: master, created_on: today});
          list.todo.lists.forEach(function(list){
            list.tasks.push(saveMe)
          })
          list.list_name = list.name;
          Todo.update({list_name: list.list_name}, {todo: list.todo}, function(task){
            console.log(task)
          })
          // this works but isn't a great solution. has to process everything just in order to add a new master task to all
          // $scope.$parent.verifyCloneList();
          $scope.listForCal[0].origin = 'master-task';
          $scope.newMasterInDirective.name = "";
          $scope.newMasterInDirective.price = "";
          $scope.newMasterInDirective.quantity = "";
        }; // end of $scope.addNewMasterTask

      }
    }
  }
})();
