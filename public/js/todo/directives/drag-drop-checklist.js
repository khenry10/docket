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
        element: "=element"
      },
      link: function($scope){

        console.log("ddChecklist")
        // the data from the list that gets clicked gets passed through to hear via $scope.data
        console.log($scope.data)
        console.log($scope.date)
        console.log($scope.element)
        if($scope.element == undefined){
          var initialized = true
        } else {
          var initialized = false;
        }

        $scope.$watch("data", function(newD, oldD){
          console.log("$watch data envoked")
          console.log(newD)
          console.log(oldD)
          console.log($scope.element)
          console.log($scope)
          // below condition fixes the problem where clicking on a list on the calendar doesn't show tasks, but it also doesn't update the left rail to have to driven off what is on the calendar
          if($scope.element === "rail" && newD != undefined){
            console.log("calling allTaskRailDataFunction")
            allTaskRailDataFunction()
            var initialized = true;
          } else {
            var initialized = false;
          }
        })

        var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        if($scope.element != "rail"){
          var splitDate = $scope.date.split("-")
          var newDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2])
          $scope.niceDate = daysOfWeek[newDate.getDay()] + " " + monthName[splitDate[1]-1] +" "+ splitDate[2] + ", " + splitDate[0]
        }

        $scope.models = {
          selected: null,
          toDoList: [],
          completedList: []
        };

        if($scope.data){
          $scope.listName = $scope.data.list_name
        }
        $scope.showClearCompleted = false;
        $scope.nonBindedList = []

        var processTasksForList = function(list, index){
          $scope.models.toDoList = [];
          $scope.listIndex = index
          $scope.list = list
          console.log($scope.list)
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
            console.log($scope.nonBindedTask)
            $scope.models.toDoList.push($scope.nonBindedTask)
          })
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
          $scope.models.toDoList = [];
          $scope.data.forEach(function(list, index){
            console.log(list)
            // processTasksForList(list, index)
            $scope.nonBindedTask = {
              name: list.tasks.name,
              list_date: list.list,
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
          for(var z = 0; z < $scope.models.toDoList.length; z++){
            $scope.models.toDoList[z].rank = z;
            console.log($scope.models.toDoList[z])
            console.log($scope.models.toDoList)
          }
            console.log($scope.listName)
            console.log($scope.models.toDoList)
            console.log($scope.date)

            var saveMe = {list_name: $scope.listName, lists: $scope.data.lists}
            saveMe.lists[$scope.listIndex] = {date: $scope.date, tasks: $scope.models.toDoList, clearedTasks: $scope.models.completedList}
            console.log(saveMe)
            Todo.update({list_name: $scope.listName},   {todo: saveMe}, function(task){
            })

        }

        $scope.update = function(task, index){
          console.log($scope.data)
          console.log($scope.data.lists)
          console.log(task)
          console.log($scope.models)
          console.log($scope.models.toDoList)
          console.log($scope.nonBindedList)
          console.log(task.length)

          if(task.task_completed){
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
              console.log(updateTask.lists[$scope.listIndex].tasks[index])
              updateTask.lists[$scope.listIndex].tasks[index] = {
                name: task.name,
                task_completed: task.task_completed,
                time_completed: completedTime
              }
            }
            console.log(updateTask)

            Todo.update({list_name: updateTask.name}, {todo: updateTask}, function(task){
            })

          }
        }

        $scope.addNewTodo = function (index){
          console.log("NEW")
          console.log($scope.newTodo)
          if($scope.newTodo){

            var timeCreated = new Date();

            var saveMe = {list_name: $scope.listName, lists: $scope.data.lists}
            saveMe.lists[$scope.listIndex].tasks.push({name: $scope.newTodo, task_completed: false})
            console.log(saveMe)
            $scope.models.toDoList.push({name: $scope.newTodo, task_completed: false})

            Todo.update({list_name: $scope.listName}, {todo: saveMe}, function(task){})
            $scope.newTodo = ""
            console.log($scope.newTodo)
          }
        }

        $scope.completedButton = "Show Completed"
        $scope.clearComplete = function(){
          $scope.showClearCompleted = false;
          var newTodoList = [];
          var saveMe = {list_name: $scope.listName, lists: $scope.data.lists}
          console.log(saveMe)
          saveMe.lists[$scope.listIndex].clearedTasks = []
          saveMe.lists[$scope.listIndex].clearedTasks = $scope.list.clearedTasks
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
        }

        $scope.showHideButton = false;

        $scope.showCompletedList = function(){
          $scope.showHideButton = true;
          $scope.models.completedList = $scope.list.clearedTasks
        }

        $scope.hideCompletedList = function(){
          $scope.showHideButton = false;
          $scope.models.completedList = []
        }


      }
    }
  }
})();
