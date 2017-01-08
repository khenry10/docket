'use strict';

angular.module("app").controller("todoController", [
  "Todo",
  "$window",
  todoController
])

function todoController(Todo, $window, $scope){
  var vm = this
  vm.todo = Todo.all

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
        console.log(todo)
        // console.log(todo._id + " - " + todo.name)
        todo.completed? vm.models.completedList.push({id: todo._id, label: todo.name, completed: todo.completed, rank: todo.rank})
        : vm.models.toDoList.push({id: todo._id, label: todo.name, completed: todo.completed, rank: todo.rank, category: todo.category})
      })
      vm.models.toDoList.sort(function(a, b){
        return a.rank - b.rank;
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
      var timeCreated = new Date();
      vm.newTodo.rank = vm.models.toDoList.length+1;
      vm.newTodo.completed = false;
      vm.newTodo.created_at = timeCreated;
      vm.models.toDoList.push({label: vm.newTodo.name,rank: vm.newTodo.rank, completed: false})
      console.log(vm.newTodo)
      vm.newTodo.$save().then(function(response){
      })
    }
  }

  var updateAll = function(task){
    for(var z = 0; z < vm.models.toDoList.length; z++){
      vm.models.toDoList[z].rank = z;
      Todo.update({name: vm.models.toDoList[z].label}, {todo: vm.models.toDoList[z]}, function(task){
      })
    }
  }

  vm.update = function(task){
    console.log(task)
    if(task.length){
      updateAll(task);
    } else {
      var completedTime = new Date();
      console.log(completedTime)
      var updateTask = {name: task.label, completed: task.completed}
      Todo.update({name: updateTask.name}, {todo: updateTask}, function(task){
      })
    }
  }

};
