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

  vm.change = function(items){
    var newList = []
    if(items){
      for(var i = 0; i < items.length; i++){
        newList.push({lable: items[i].label, completed: items[i].completed, rank: i +1})
      }
    }
    console.log(newList)
  };

  vm.fetchData = function (){
    Todo.all.$promise.then(function(){
      Todo.all.forEach(function(todo){
        console.log(todo._id)
        todo.completed? vm.models.completedList.push({id: todo._id, label: todo.name, completed: todo.completed, rank: todo.rank}):
        vm.models.toDoList.push({id: todo._id, label: todo.name, completed: todo.completed, rank: todo.rank})
      })
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
    var timeCreated = new Date();
    vm.newTodo.rank = vm.models.toDoList.length+1;
    vm.newTodo.completed = false;
    vm.newTodo.created_at = timeCreated;
    vm.models.toDoList.push({label: vm.newTodo.name,rank: vm.newTodo.rank, completed: false})
    console.log(vm.newTodo)
    vm.newTodo.$save().then(function(response){
    })
  }

  var updateAll = function(task){
    console.log(task)
    for(var z = 0; z < vm.models.toDoList.length; z++){
      vm.models.toDoList[z].rank = z;
      console.log(vm.models.toDoList[z].label)
      console.log(vm.models.toDoList[z].rank)
      Todo.update({id: vm.models.toDoList[z].id}, {event: vm.models.toDoList[z]}, function(task){
        console.log(task)
      })
    }
  }

  vm.update = function(task){
    console.log(task.id)
    if(task.length){
      updateAll(task);
    } else {
      var completedTime = new Date();
      console.log(completedTime)
      var updateTask = {name: task.label, completed: task.completed}
      Todo.update({id: updateTask.id}, {event: updateTask}, function(task){
      })
    }
  }

};
