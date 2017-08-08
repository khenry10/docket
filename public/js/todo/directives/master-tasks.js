"use strict";

(function(){
  angular.module("app").directive("todoMaster", ["Todo", "DateService", "$mdDialog", "ModalService", masterTasks])

  function masterTasks(Todo, DateService, $mdDialog, ModalService){
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
              if(todoForLeftRail.todo){
                if(todoForLeftRail.todo.list_type === $scope.listType && todoForLeftRail.modifiedDateList.length){
                  if($scope.listType === 'appointment'){
                    todoForLeftRail.modifiedDateList.forEach(function(dateList){
                      var niceDate = dateList.date.split("-")
                      var month = parseInt(niceDate[1]) - 1
                      var fullDate = new Date(niceDate[0], month, niceDate[2])
                      var day = DateService.daysOfWeek[fullDate.getDay()]
                      var monthName = DateService.monthNames[parseInt(niceDate[1])]
                      $scope.listss.push({
                        name: dateList.name,
                        date: day + " " + monthName + " " + niceDate[2] + " at " + dateList.start_time,
                        start_time: dateList.start_time,
                        listType: todoForLeftRail.todo.list_type
                      })
                    })
                  } else {
                    $scope.listss.push({
                      name: todoForLeftRail.todo.list_name,
                      master_tasks: todoForLeftRail.todo.master_tasks,
                      listType: todoForLeftRail.todo.list_type,
                      todo: todoForLeftRail.todo
                    })
                  }
                }
              }
            })
          }
        }, false);

        $scope.addNewMasterTask = function (list){
          $scope.show = false;
          var master = $scope.newMasterInDirective.name;

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

        $scope.deleteList = function(list){
          Todo.remove({name: list.name}, function(res){
            $scope.$parent.pullTodos('ajax')
          })

        }

        $scope.edit = function(list, event){
          var data = list;
          data.date = new Date()
          data.editView = true;

          ModalService.showModal({
            templateUrl: "/assets/html/calendar/modals/add-new-modal.html",
            controller: "newCalItemModalController",
            inputs: {
              data: data
            }
          }).then(function(modal) {
            //it's a bootstrap element, use 'modal' to show it
            modal.element.modal();
            modal.close.then(function(result) {
              close()
              // $('#add-new-modal').modal('hide');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
            });
          });

        };

        var originatorEv;
        $scope.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };


      }
    }
  }
})();
