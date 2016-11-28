'use strict';

angular.module("app").controller("todoController", [
  "Todo",
  "$window",
  todoController
])

function todoController(Todo, $window, $scope){
  // console.log(Todo.all)
  var vm = this
  vm.todo = Todo.all

  vm.models = {
    selected: null,
    list: []
  };

  vm.list = []

  vm.change = function(item, index){
    console.log(item)
    console.log(index)
  };

  vm.todo = ''

  vm.fetchData = function (){
    Todo.all.$promise.then(function(){
      Todo.all.forEach(function(todo){
        console.log(todo)
        vm.models.list.push({label: todo.name, completed: todo.completed})
      })
    });
  }

  vm.newTodo = new Todo();

  vm.addNewTodo = function (){
    console.log("NEW")

    console.log(vm.newTodo)

    vm.newTodo.$save().then(function(response){
      vm.models.list = []
      Todo.query( function(todo){
        for(var i = 0; i < todo.length; i++){
          vm.models.list.push({label: todo[i].name, completed: todo[i].completed})
        }
      })

    })
  }

  vm.update = function(){
    console.log("update = " + vm.newTodo)
    // var newEvent = {name: vm.event.newName, start_time: vm.event.newStartTime}
    // console.log(newEvent)
    // Todo.update({name: vm.event.name}, {event: newEvent}, function(event){
    //   $window.location.replace('/')
    // })
  }

};
