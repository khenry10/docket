"use strict";

(function(){
  angular
  .module("app")
  .directive("ddChecklist", [
    "Todo",
    "DateService",
    ddChecklist
  ])

  function ddChecklist(Todo, DateService){
    return {
      templateUrl: "/assets/html/todo/directives/drag-drop-checklist.html",
      scope: {
        data: "=data",
        date: "=date",
        element: "=element",
        listType: "=",
        allTasks: "=",
        parseAllTasks: "="
      },
      link: function($scope){
        $scope.shopping = {};
        var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.showClearCompleted = false;
        $scope.nonBindedList = [];
        $scope.totalShoppingList = 0;
        $scope.completedText = $scope.listType === 'shopping'? "Clear Purchased" : "Clear Completed";
        $scope.shoppingPurchased = 0;
        $scope.allHaveBeenUpdated = false;

        $scope.models = {
          selected: null,
          toDoList: [],
          completedList: []
        };

        if($scope.element != 'rail'){
          var initialized = true;
        } else {
          var initialized = false;
        }

        $scope.$watch("data", function(newD, oldD){
          console.log("$watch data envoked")

          // below condition fixes the problem where clicking on a list on the calendar doesn't show tasks, but it also doesn't update the left rail to have to driven off what is on the calendar
          if(newD != oldD){
            if($scope.element === "rail" && newD != undefined){
              allTaskRailDataFunction()
              var initialized = true;
            } else {
              // modalDataFunction()
              // var initialized = false;
            }
          }
        }, true)

        $scope.$watch("allTasks", function(newAllTasks,OldAllTask){
        }, true)

        if($scope.element != "rail"){
          var splitDate = $scope.date.split("-")
          var newDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2])
          $scope.niceDate = daysOfWeek[newDate.getDay()] + " " + monthName[splitDate[1]-1] +" "+ splitDate[2] + ", " + splitDate[0]
        }

        if($scope.data){
          $scope.listName = $scope.data.list_name
        }

        var round = function(value, decimals) {
          return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        };

        var budgetProgressBar = function(){
          $scope.shoppingPurchased = !$scope.shoppingPurchased? 0:$scope.shoppingPurchased;
          $scope.totalShoppingListPercent = round($scope.totalShoppingList-$scope.shoppingPurchased/$scope.data.budget*100, 2);
          $scope.shoppingPurchasedPercent = round($scope.shoppingPurchased/$scope.data.budget*100,2);
          var numerator = $scope.totalShoppingList-$scope.shoppingPurchased;
          $scope.totalShoppingListPercent = round(numerator/$scope.data.budget*100, 2)
          $scope.remainingBudgetPercent = round(100 - $scope.totalShoppingListPercent - $scope.shoppingPurchasedPercent, 2);
        }

        var processTasksForList = function(list, index){
          $scope.models.toDoList = [];
          $scope.listIndex = index
          $scope.list = list

          // need to loop through cleared lists to correctly tabulate budget
          if(list.clearedTasks){
            list.clearedTasks.forEach(function(cleared){
              $scope.shoppingPurchased = $scope.shoppingPurchased+(cleared.quantity * cleared.price);
            })
          }

          list.tasks.forEach(function(task, index){
            task.rank = index

            if(task.task_completed){
              $scope.showClearCompleted = true;
            }

            $scope.nonBindedTask = {
                list_date: list.date,
                name: task.name,
                rank: task.rank,
                task_completed: task.task_completed
            }
            if($scope.listType === 'shopping' ){

              $scope.nonBindedTask.name = task.name;
              $scope.nonBindedTask.quantity = task.quantity;
              $scope.nonBindedTask.price = task.price;
              $scope.totalShoppingList = $scope.totalShoppingList+(task.quantity * task.price);
              if(task.task_completed){
                $scope.shoppingPurchased = $scope.shoppingPurchased+(task.quantity * task.price);
              }
            }
            $scope.models.toDoList.push($scope.nonBindedTask)
          })
          budgetProgressBar()
          $scope.nonBindedList = list.tasks
        }

        var modalDataFunction = function(){
          var allTodos = Todo.all
          var checkDateService = DateService.saveUpdatesFromLeftRail();
          var mostRecentObjFromDateService = checkDateService[checkDateService.length-1]
          if(checkDateService.length && mostRecentObjFromDateService.wholeDateList.list_name == $scope.data.list_name){
              mostRecentObjFromDateService.wholeDateList.lists.forEach(function(list){
                if(list.date == $scope.date){
                  processTasksForList(list, 0)
                }
            })
          } else {
            $scope.data.lists.forEach(function(list, index){
              if(list.date === $scope.date){
                processTasksForList(list, index)
              }
            })
          }
        }

        var allTaskRailDataFunction = function(){
          console.log("allTaskRailDataFunction")
          $scope.models.toDoList = [];
          // $scope.data is depenedency that gets injected in from master_tasks, comes through the allTasks parameter in master_tasks
          $scope.data.forEach(function(list, index){
            $scope.nonBindedTask = {
              name: list.taskName,
              listName: list.listName,
              list_date: list.listDate,
              listType: list.listType,
              rank: index,
              task_completed: list.taskCompleted
            };
            $scope.models.toDoList.push($scope.nonBindedTask)
          })
        };

        if(initialized){
          if($scope.element === "rail"){
            allTaskRailDataFunction()
          } else {
            modalDataFunction()
          }
        }

        var updateAll = function(task){
          $scope.allHaveBeenUpdated = true;
          // $scope.listName isn't available when updating from the left rail, which is why eash task has it's list name included
          console.log("update all.  $scope.element = " + $scope.element)
          for(var z = 0; z < $scope.models.toDoList.length; z++){
            $scope.models.toDoList[z].rank = z;
          }
            var saveAllOfUs = {list_name: $scope.listName, lists: $scope.data.lists}
            saveAllOfUs.lists[$scope.listIndex] = {date: $scope.date, tasks: $scope.models.toDoList, clearedTasks: $scope.models.completedList}
            Todo.update({list_name: $scope.listName},   {todo: saveAllOfUs}, function(task){
            })

        }

        $scope.update = function(task, index, listOrigin){
          console.log("$scope.update")
          if(task.task_completed){
            $scope.completedText = $scope.listType === 'shopping'? "Clear Purchased" : "Clear Completed"
            $scope.showClearCompleted = true;
          }
          console.log(task)
          if(task.length){
            updateAll(task);
          } else {
            var completedTime = new Date();

            if($scope.element === 'rail'){
              var onlyChangeListUpdated = []

              // we need to pull and loop through all thes lists within the todo and than only update this task
              if(!allTodos){
                var allTodos = Todo.all
              }

              var listName = ""
              var dateList = ""

              var newTaskLists = []
              allTodos.forEach(function(todo){
                if(todo && todo.list_name == task.listName){
                  listName = todo.listName;
                  todo.lists.forEach(function(list){
                    if(list.date === task.list_date){
                      var updatingListTasks = {date: task.list_date, tasks: []}

                      list.tasks.forEach(function(originTask, index){
                        if(originTask.name === task.name ){
                          updatingListTasks.tasks.push({name: task.name, task_completed: task.task_completed})
                        } else {
                          updatingListTasks.tasks.push(originTask)
                        }
                      })
                      dateList = updatingListTasks;
                      newTaskLists.push(updatingListTasks)
                    } else {
                      newTaskLists.push(list)
                    }
                  }) //end of todo.lists.forEach
                }
              })

              var updateTask = {
                list_name: task.listName,
                name: task.name,
                task_completed: task.task_completed,
                lists: newTaskLists
              }

              // DateService.saveUpdatesFromLeftRail(updateTask)

              var listData = {list_name: listName, list_type: 'todo'};
              var dataServiceObj = { updatedTask: taskDataForParseAllTasks, wholeDateList: updateTask, dateList: dateList }
              DateService.saveUpdatesFromLeftRail(dataServiceObj)
            } else if($scope.element === 'cal-entry-modal') {
              console.log($scope.data)
              var updateTask = {list_name: $scope.listName, _id: $scope.data, lists: $scope.data.lists}

              if(listOrigin === 'clearedTasks'){
                updateTask.lists[$scope.listIndex].clearedTasks[index] = {
                  name: task.name,
                  task_completed: task.task_completed,
                  time_completed: completedTime
                }
              } else {
                updateTask.lists[$scope.listIndex].tasks[index] = {
                  name: task.name,
                  task_completed: task.task_completed,
                  time_completed: completedTime
                }
              }

              var taskDataForParseAllTasks = updateTask.lists[$scope.listIndex].tasks[index];
              var dateList = updateTask.lists[$scope.listIndex]

              taskDataForParseAllTasks.date = task.list_date;
              var listData = {list_name: $scope.listName, list_type: 'todo'};

              var dataServiceObj = { updatedTask: taskDataForParseAllTasks, wholeDateList: updateTask, dateList: dateList }
              DateService.saveUpdatesFromLeftRail(dataServiceObj)
              $scope.parseAllTasks(taskDataForParseAllTasks,listData , $scope.element)

              if($scope.listType === 'shopping'){
                updateTask.lists[$scope.listIndex].tasks[index].price = task.price;
                updateTask.lists[$scope.listIndex].tasks[index].quantity = task.quantity;
                if(updateTask.lists[$scope.listIndex].tasks[index].task_completed){
                  $scope.shoppingPurchased = $scope.shoppingPurchased+(task.quantity * task.price);
                } else if(updateTask.lists[$scope.listIndex].clearedTasks && updateTask.lists[$scope.listIndex].clearedTasks[index].task_completed){
                  $scope.shoppingPurchased = $scope.shoppingPurchased+(task.quantity * task.price);
                } else {
                  $scope.shoppingPurchased = $scope.shoppingPurchased-(task.quantity * task.price);
                }
                budgetProgressBar()
              }

            }
            Todo.update({list_name: updateTask.name}, {todo: updateTask}, function(task){
            });
          }
        };

        $scope.newTask = {};
        $scope.addNewTodo = function (index){
          console.log("NEW")
          console.log($scope.data)
          if($scope.newTask.name || $scope.shopping.productName){
            var timeCreated = new Date();
            var saveMe = {_id: $scope.data._id ,list_name: $scope.listName, lists: $scope.data.lists}

            if(!$scope.data.list_type){
              saveMe.list_type = $scope.listType
            }

            if($scope.data.list_type === 'todo' || $scope.listType === 'todo'){
              if(!$scope.allHaveBeenUpdated){
                // adding a new task after updateAll invoked was causing the new item to be saved 2 to the db, this prevents that
                $scope.models.toDoList.push({name: $scope.newTask.name, task_completed: false, listType: 'todo'})
              }
              // below finds the correct date list and pushes the new Task into it
              saveMe.lists[$scope.listIndex].tasks.push({
                name: $scope.newTask.name, task_completed: false})
              // faking ajax like functionality

              var taskForAllTasks = {
                taskName: $scope.newTask.name,
                listName: $scope.listName,
                listDate: $scope.data.lists[$scope.listIndex].date,
                listType: $scope.data.list_type,
                taskCompleted: false
              };
              $scope.allTasks.push(taskForAllTasks)
            }

            if($scope.data.list_type === 'shopping' || $scope.listType === 'shopping'){
              $scope.totalShoppingList = $scope.totalShoppingList+($scope.shopping.productQuantity * $scope.shopping.productPrice)

              var shoppingListItem = {
                name: $scope.shopping.productName,
                quantity: $scope.shopping.productQuantity,
                price: $scope.shopping.productPrice,
                total_cost: $scope.shopping.productQuantity * $scope.shopping.productPrice,
                task_completed: false
              }

              saveMe.lists[$scope.listIndex].tasks.push(shoppingListItem)
              $scope.models.toDoList.push(
                {
                  name: $scope.shopping.productName,
                  quantity: $scope.shopping.productQuantity,
                  price: $scope.shopping.productPrice,
                  totalCost: $scope.shopping.productQuantity * $scope.shopping.productPrice,
                  listType: 'shopping',
                  task_completed: false
                })
              budgetProgressBar()
            }

            Todo.update({list_name: $scope.listName}, {todo: saveMe}, function(task){})
            $scope.newTask.name = ""
            $scope.shopping.productName = ""
            $scope.shopping.productQuantity = ""
            $scope.shopping.productPrice = ""
          }
        }

        $scope.completedButton = "Show Completed"

        $scope.clearComplete = function(){
          $scope.showClearCompleted = false;
          var newTodoList = [];
          var saveMe = {list_name: $scope.listName, lists: $scope.data.lists}
          saveMe.lists[$scope.listIndex].clearedTasks = $scope.list.clearedTasks? $scope.list.clearedTasks : [];

          // saveMe.lists[$scope.listIndex].clearedTasks = []
          for(var i = 0; i < $scope.models.toDoList.length; i++){
            if($scope.models.toDoList[i].task_completed === false){
                newTodoList.push($scope.models.toDoList[i])
            } else {
              saveMe.lists[$scope.listIndex].clearedTasks.push($scope.models.toDoList[i])
            }
          }
          saveMe.lists[$scope.listIndex].tasks = newTodoList
          Todo.update({list_name: $scope.listName}, {todo: saveMe}, function(task){})
          $scope.models.toDoList = newTodoList;
        };

        $scope.showCompletedList = function(){
          $scope.showHideButton = true;
          $scope.models.completedList = $scope.list.clearedTasks
        };

        $scope.hideCompletedList = function(){
          $scope.showHideButton = !$scope.showHideButton;
          // $scope.models.completedList = []
        };

      }
    }
  }
})();
