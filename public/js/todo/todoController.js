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

  console.log("Todo Controller")
  console.log($stateParams.list_name)

  vm.models = {
    selected: null,
    toDoList: [],
    completedList: []
  };

  vm.taskLists = []
  vm.addNewListCategory = function(){
    vm.taskLists.push(vm.newTodoList)
    console.log(vm.taskLists)
  }

// 1st operations - fetching the data from the db and creatings a completed and non-completed list, stored in vm.models
  vm.fetchData = function (){
    Todo.all.$promise.then(function(){
      Todo.all.forEach(function(todo){

        if(todo.list_name === $stateParams.list_name){
          console.log(todo)
          todo.task_completed? vm.models.completedList.push(
            {
              id: todo._id,
              task_name: todo.task_name,
              task_completed:todo.task_completed,
              task_rank: todo.rank
            })
          : vm.models.toDoList.push(
            {
              id: todo._id,
              task_name: todo.task_name,
              task_completed: todo.task_completed,
              task_rank: todo.task_rank,
              task_category: todo.task_category
            })
        }
      })
      vm.models.toDoList.sort(function(a, b){
        return a.task_rank - b.task_rank;
      })
      console.log("KEITH fetchData toDoList = " + JSON.stringify(vm.models.toDoList))
    });
  }

  vm.clearComplete = function(){
    var newTodoList = [];
    for(var i = 0; i < vm.models.toDoList.length; i++){
      if(vm.models.toDoList[i].completed == false){
          newTodoList.push(vm.models.toDoList[i])
      }
    }
    vm.models.toDoList = newTodoList;
  }

  vm.newTodo = new Todo();

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
    if(task.length){
      console.log(task.length)
      updateAll(task);
    } else {
      var completedTime = new Date();
      console.log(completedTime)
      var updateTask = {task_name: task.name, task_completed: task.completed}
      Todo.update({task_name: updateTask.name}, {todo: updateTask}, function(task){
      })
    }
  }

};
