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
        listType: "="
      },
      link: function($scope){

        console.log("ddChecklist")
        console.log($scope.listType)

        // the data from the list that gets clicked gets passed through to hear via $scope.data
        console.log($scope.data)
        console.log($scope)
        console.log($scope.element)

        $scope.models = {
          selected: null,
          toDoList: [],
          completedList: []
        };
        $scope.shopping = {};
        var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.showClearCompleted = false;
        $scope.nonBindedList = [];
        $scope.totalShoppingList = 0;
        $scope.completedText = $scope.listType === 'shopping'? "Clear Purchased" : "Clear Completed";
        $scope.shoppingPurchased = 0;

        if($scope.element == undefined){
          var initialized = true;
        } else {
          var initialized = false;
        }

        console.log("initialized = " + initialized)

        $scope.$watch("data", function(newD, oldD){
          console.log("$watch data envoked")
          console.log(newD)
          console.log(oldD)
          // below condition fixes the problem where clicking on a list on the calendar doesn't show tasks, but it also doesn't update the left rail to have to driven off what is on the calendar
          if($scope.element === "rail" && newD != undefined){
            console.log("calling allTaskRailDataFunction")
            allTaskRailDataFunction()
            var initialized = true;
          } else {
            var initialized = false;
          }
        })

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
          console.log($scope.totalShoppingList)
          console.log($scope.data.budget)
          console.log($scope.shoppingPurchased)
          $scope.shoppingPurchased = !$scope.shoppingPurchased? 0:$scope.shoppingPurchased;
          console.log($scope.shoppingPurchased)
          $scope.totalShoppingListPercent = round($scope.totalShoppingList-$scope.shoppingPurchased/$scope.data.budget*100, 2);
          console.log($scope.totalShoppingListPercent)
          console.log($scope.remainingBudgetPercent)
          $scope.shoppingPurchasedPercent = round($scope.shoppingPurchased/$scope.data.budget*100,2)
          $scope.remainingBudgetPercent = round(100 - $scope.totalShoppingListPercent - $scope.shoppingPurchasedPercent, 2);

        }

        var processTasksForList = function(list, index){
          $scope.models.toDoList = [];
          $scope.listIndex = index
          $scope.list = list
          console.log($scope.list)
          // need to loop through cleared lists to correctly tabulate budget

          if(list.clearedTasks){
            list.clearedTasks.forEach(function(cleared){
              console.log(cleared)
              $scope.shoppingPurchased = $scope.shoppingPurchased+(cleared.quantity * cleared.price);
            })
          }

          list.tasks.forEach(function(task, index){
            console.log(task)
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
                console.log(task.quantity * task.price)
                $scope.shoppingPurchased = $scope.shoppingPurchased+(task.quantity * task.price);
              }
            }
            console.log($scope.nonBindedTask)
            $scope.models.toDoList.push($scope.nonBindedTask)
          })
          budgetProgressBar()
          console.log(list.tasks)

          console.log($scope.models.toDoList)
          $scope.nonBindedList = list.tasks
        }

        var modalDataFunction = function(){

          // thought this would update the modal data after making a change in the left rail, wouldn't work though
          // var allTodos  = Todo.all
          // if(allTodos && allTodos.length){
          //   allTodos.forEach(function(todo){
          //     if(todo){
          //       console.log(todo)
          //       if(todo.list_name === $scope.data.list_name){
          //         console.log("locked it in")
          //         $scope.data.lists = todo.lists;
          //       }
          //     }
          //   })
          // }
          console.log($scope.data.lists)
          $scope.data.lists.forEach(function(list, index){
            console.log(list.date)
            // console.log(date)
            console.log(index)
            console.log(list.date === $scope.date)
            if(list.date === $scope.date){
              processTasksForList(list, index)
            }
          })
        }

        var allTaskRailDataFunction = function(){
          console.log("allTaskRailDataFunction")
          console.log($scope.models.toDoList)
          $scope.models.toDoList = [];
          console.log($scope.models.toDoList)
          console.log($scope.data)
          console.log($scope.data.length)
          // $scope.data is depenedency that gets injected in from master_tasks, comes through the allTasks parameter in master_tasks
          $scope.data.forEach(function(list, index){
            console.log(list)

            $scope.nonBindedTask = {
              name: list.tasks.name,
              list_date: list.list,
              listType: list.listType,
              rank: index,
              task_completed: list.tasks.task_completed
            }
            console.log($scope.nonBindedTask)
            $scope.models.toDoList.push($scope.nonBindedTask)
          })
        }

        if(initialized){
          if($scope.element === "rail"){
            allTaskRailDataFunction()
          } else {
            modalDataFunction()
          }
        }

        var updateAll = function(task){
          // $scope.listName isn't available when updating from the left rail, which is why eash task has it's list name included
          console.log("$scope.element = " + $scope.element)
          for(var z = 0; z < $scope.models.toDoList.length; z++){
            $scope.models.toDoList[z].rank = z;
            console.log($scope.models.toDoList[z])
            console.log($scope.models.toDoList)
          }
            console.log($scope.listName)
            console.log($scope.models.toDoList)
            console.log($scope.date)
            console.log(task)
            var saveMe = {list_name: $scope.listName, lists: $scope.data.lists}
            saveMe.lists[$scope.listIndex] = {date: $scope.date, tasks: $scope.models.toDoList, clearedTasks: $scope.models.completedList}
            console.log(saveMe)
            Todo.update({list_name: $scope.listName},   {todo: saveMe}, function(task){
            })

        }

        $scope.update = function(task, index, listOrigin){
          console.log($scope.data)
          console.log(task)
          console.log($scope.models)

          if(task.task_completed){
            $scope.completedText = $scope.listType === 'shopping'? "Clear Purchased" : "Clear Completed"
            $scope.showClearCompleted = true;
          }

          if(task.length){
            updateAll(task);
          } else {
            var completedTime = new Date();
            console.log(index)
            if($scope.element === 'rail'){
              console.log($scope.data[0])
              var onlyChangeListUpdated = []
              // we need to pull and loop through all thes lists within the todo and than only update this task

              var allTodos = Todo.all
              console.log(allTodos)

              var newTaskLists = []

              allTodos.forEach(function(todo){
                console.log(todo)
                if(todo && todo.list_name === $scope.data[0].name){
                  console.log("namematch")

                  todo.lists.forEach(function(list){
                    console.log(list)
                    if(list.date === task.list_date){
                      var updatingListTasks = {date: task.list_date, tasks: []}

                      list.tasks.forEach(function(originTask){
                        console.log(originTask)
                        if(originTask.name === task.name ){
                          updatingListTasks.tasks.push({name: task.name, task_completed: task.task_completed})
                        } else {
                          updatingListTasks.tasks.push(originTask)
                        }
                        console.log("end of list.tasks forEach")
                        console.log(updatingListTasks)
                      })

                      newTaskLists.push(updatingListTasks)
                    } else {
                      newTaskLists.push(list)
                    }
                  }) //end of todo.lists.forEach
                  console.log(newTaskLists)
                }
              })

              var updateTask = {list_name: $scope.data[0].name, lists: newTaskLists}
            } else {
              console.log($scope.listIndex)
              var updateTask = {list_name: $scope.listName, lists: $scope.data.lists}
              console.log(updateTask)

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
              console.log(updateTask.lists[$scope.listIndex].tasks[index])

              console.log($scope.data)

              if($scope.listType === 'shopping'){
                updateTask.lists[$scope.listIndex].tasks[index].price = task.price;
                updateTask.lists[$scope.listIndex].tasks[index].quantity = task.quantity;
                if(updateTask.lists[$scope.listIndex].tasks[index].task_completed){
                  console.log(task.quantity * task.price)
                  $scope.shoppingPurchased = $scope.shoppingPurchased+(task.quantity * task.price);
                } else if(updateTask.lists[$scope.listIndex].clearedTasks && updateTask.lists[$scope.listIndex].clearedTasks[index].task_completed){
                  $scope.shoppingPurchased = $scope.shoppingPurchased+(task.quantity * task.price);
                } else {
                  $scope.shoppingPurchased = $scope.shoppingPurchased-(task.quantity * task.price);
                }
                budgetProgressBar()
              }

            }
            console.log(updateTask.lists[$scope.listIndex].tasks[index])
            console.log(updateTask)
            Todo.update({list_name: updateTask.name}, {todo: updateTask}, function(task){
              console.log(task)
            });

          }
        };


        $scope.newTask = {};
        $scope.addNewTodo = function (index){
          console.log("NEW")
          console.log($scope)
          console.log($scope.shopping.productName)
          console.log($scope.newTask.name)
          console.log($scope.listType)

          if($scope.newTask.name || $scope.shopping.productName){
            var timeCreated = new Date();
            var saveMe = {list_name: $scope.listName, lists: $scope.data.lists}

            if(!$scope.data.list_type){
              saveMe.list_type = $scope.listType
            }
            console.log($scope.data)
            console.log($scope.data.list_type)

            if($scope.data.list_type === 'todo' || $scope.listType === 'todo'){
              // below finds the correct date list and pushes the new Task into it
              saveMe.lists[$scope.listIndex].tasks.push({
                name: $scope.newTask.name, task_completed: false})
              // faking ajax like functionality
              $scope.models.toDoList.push({name: $scope.newTask.name, task_completed: false, listType: 'todo'})
            }
            console.log(saveMe)

            if($scope.data.list_type === 'shopping' || $scope.listType === 'shopping'){
              $scope.totalShoppingList = $scope.totalShoppingList+($scope.shopping.productQuantity * $scope.shopping.productPrice)

              var shoppingListItem = {
                name: $scope.shopping.productName,
                quantity: $scope.shopping.productQuantity,
                price: $scope.shopping.productPrice,
                total_cost: $scope.shopping.productQuantity * $scope.shopping.productPrice,
                task_completed: false
              }
              console.log(shoppingListItem)
              saveMe.lists[$scope.listIndex].tasks.push(shoppingListItem)
              $scope.models.toDoList.push({
                name: $scope.shopping.productName,
                quantity: $scope.shopping.productQuantity,
                price: $scope.shopping.productPrice,
                totalCost: $scope.shopping.productQuantity * $scope.shopping.productPrice,
                listType: 'shopping',
                task_completed: false})
            }
            budgetProgressBar()
            console.log(saveMe)
            Todo.update({list_name: $scope.listName}, {todo: saveMe}, function(task){})
            $scope.newTask.name = ""
            $scope.shopping.productName = ""
            $scope.shopping.productQuantity = ""
            $scope.shopping.productPrice = ""
            console.log($scope.newTask)
          }
        }

        $scope.completedButton = "Show Completed"

        $scope.clearComplete = function(){
          $scope.showClearCompleted = false;
          var newTodoList = [];
          var saveMe = {list_name: $scope.listName, lists: $scope.data.lists}
          console.log(saveMe)
          console.log($scope.listIndex)
          saveMe.lists[$scope.listIndex].clearedTasks = $scope.list.clearedTasks? $scope.list.clearedTasks : [];
          console.log(saveMe.lists[$scope.listIndex].clearedTasks)
          // saveMe.lists[$scope.listIndex].clearedTasks = []
          for(var i = 0; i < $scope.models.toDoList.length; i++){
            if($scope.models.toDoList[i].task_completed === false){
                console.log($scope.models.toDoList[i])
                newTodoList.push($scope.models.toDoList[i])
            } else {
              console.log($scope.models.toDoList[i])
              console.log(saveMe.lists)
              console.log($scope.listIndex)
              saveMe.lists[$scope.listIndex].clearedTasks.push($scope.models.toDoList[i])
            }
          }
          saveMe.lists[$scope.listIndex].tasks = newTodoList
          console.log(saveMe)
          Todo.update({list_name: $scope.listName}, {todo: saveMe}, function(task){})

          console.log(newTodoList)
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
