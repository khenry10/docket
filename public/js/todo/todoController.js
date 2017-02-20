'use strict';

angular.module("app").controller("todoController", [
  "Todo",
  "$window",
  "$stateParams",
  todoController
])

function todoController(Todo, $window, $stateParams, $scope){
  var vm = this
  vm.todo = Todo.all

  console.log("Todo Controller. $stateParams.list_name = " + $stateParams.list_name)

  vm.models = {
    selected: null,
    toDoList: [],
    completedList: []
  };

// 1st operations - fetching the data from the db and creatings a completed and non-completed list, stored in vm.models
  vm.fetchData = function (){
    // returns all documents in the Todo collection
    Todo.all.$promise.then(function(){
      Todo.all.forEach(function(todo){

        vm.allMasterTasks = todo.master_tasks
        // console.log(vm.allMasterTasks)
        // looks for the list that matches the url state params
        if(todo.list_name === $stateParams.list_name){
          // loops through the recurring lists to see if they have any tasks
          console.log(todo)
          vm.list = todo;

          // hard coded the below because I didn't feel like figuring out the routing to do this the right way
          var testTodo = todo.lists[0].tasks;

          testTodo.forEach(function(todo, index){
            console.log(todo)
            console.log(index)
            todo.task_completed? vm.models.completedList.push(
              {
                task_name: name,
                task_completed:todo.task_completed,
                task_rank: count
              })
              : vm.models.toDoList.push(
                {
                  task_name: todo.name,
                  task_completed: todo.task_completed,
                  task_rank: index
                })
          })
        }
      })
      vm.models.toDoList.sort(function(a, b){
        return a.task_rank - b.task_rank;
      })
    });
  }

  vm.clearComplete = function(){
    var newTodoList = [];
    console.log(vm.models.toDoList)
    for(var i = 0; i < vm.models.toDoList.length; i++){
      if(vm.models.toDoList[i].task_completed == false){
          console.log(vm.models.toDoList[i])
          newTodoList.push(vm.models.toDoList[i])
      }
    }
    console.log(vm.models.toDoList)
    vm.models.toDoList = newTodoList;
  }

  vm.addNewMasterTasks = function(){
    console.log("vm.addNewMasterTasks. newMaster.name = " + vm.newMaster.name)
    if(vm.newMaster){
      var timeCreated = new Date()
      console.log("vm.allMasterTasks = " + vm.allMasterTasks)
      console.log(vm.list)

      var saveMe = {
        list_name: $stateParams.list_name,
        master_tasks:  [],
        lists: []
      }

      vm.list.master_tasks.forEach(function(master){
        console.log(master)
        saveMe.master_tasks.push(master)
      })

      saveMe.master_tasks.push({name: vm.newMaster.name, created_on: timeCreated})

      vm.list.lists.forEach(function(list){
        console.log("~*~*~*~~** vm.list.lists.forEach BEGIN ~*~*~~*~~*~")
          console.log(saveMe)
          var newToPush = {
            date: list.date,
            tasks: []
          }

          saveMe.master_tasks.forEach(function(master){
            console.log(master.name)
            var task = {
              name: master.name,
              task_completed: false
            }
            newToPush.tasks.push(task)
          })

          console.log(newToPush)
          saveMe.lists.push(newToPush)

          console.log("~*~*~*~~** vm.list.lists.forEach END ~*~*~~*~~*~")
      })

      // vm.newMaster = {list_name: $stateParams.list_name, master_tasks: vm.allMasterTasks}
      // vm.allMasterTasks.push(vm.newMaster)
      console.log(saveMe)

      Todo.update({list_name: vm.list.list_name}, {todo: saveMe}, function(task){
        console.log(task)
      })
    }
  }

  vm.newTodo = new Todo();

  // this needs to be updated still has old logic.
    // Adding a new todo here creates task_name and task_complete at the list level
  vm.addNewTodo = function (){
    console.log("NEW")
    if(vm.newTodo){
      console.log(vm.newTodo)
      console.log($stateParams.list_name)
      var timeCreated = new Date();
      vm.newTodo.list_name = $stateParams.list_name
      vm.newTodo.task_rank = vm.models.toDoList.length+1;
      vm.newTodo.task_completed = false;
      vm.newTodo.created_at = timeCreated;
      vm.models.toDoList.push({task_name: vm.newTodo.task_name,task_rank: vm.newTodo.task_rank, task_completed: false})
      console.log(vm.newTodo)
      vm.newTodo.$save().then(function(response){
      })
    }
  }

  var updateAll = function(task){
    for(var z = 0; z < vm.models.toDoList.length; z++){
      vm.models.toDoList[z].task_rank = z;
      console.log(vm.models.toDoList[z])
      Todo.update({task_name: vm.models.toDoList[z].task_name}, {todo: vm.models.toDoList[z]}, function(task){
      })
    }
  }

  vm.update = function(task){
    console.log(task)
    console.log(task.task_name)
    if(task.length){
      console.log(task.length)
      updateAll(task);
    } else {
      var completedTime = new Date();
      console.log(completedTime)
      var updateTask = {task_name: task.task_name, task_completed: task.task_completed}
      console.log(updateTask)
      Todo.update({task_name: updateTask.name}, {todo: updateTask}, function(task){
      })
    }
  }

};
