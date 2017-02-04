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

var addMasterToList = function (todo) {
  var count = 0
  var newArray = []
  todo.master_tasks.forEach(function(masterTask){
    console.log(count)
    console.log(masterTask)
    var task = {
      task_name: masterTask.name,
      task_completed: false,
      task_rank: count
    }
    console.log(task)
    newArray.push(task)
    count = count +1
  })
  console.log(newArray)

  todo.lists.forEach(function(lists){
      lists.tasks = newArray
      console.log(lists)
  })
  console.log(todo)
  // Todo.update({list_name: todo.list_name}, {todo: todo}, function(task){
  //   console.log(task)
  // })
}

// 1st operations - fetching the data from the db and creatings a completed and non-completed list, stored in vm.models
  vm.fetchData = function (){
    // returns all documents in the Todo collection
    Todo.all.$promise.then(function(){
      // loops through all collections
      Todo.all.forEach(function(todo){
        console.log(todo)
        vm.allMasterTasks = todo.master_tasks
        // console.log(vm.allMasterTasks)

        // looks for the list that matches the url state params
        if(todo.list_name === $stateParams.list_name){
          // loops through the recurring lists to see if they have any tasks
          todo.lists.forEach(function(list){
            console.log(list.tasks.length)
            console.log(todo.master_tasks.length)
            // if they have no tasks, they get sent to addMasterToList to add ALL master_tasks
            if(list.tasks.length < todo.master_tasks.length){
              addMasterToList(todo)
            } else {
              console.log("Logic needed to search list.tasks to see which master tasks are already there and add the ones that aren't")
              // list.tasks.forEach(function(tasks){
              //   todo.master_tasks.forEach(function(master){
              //     console.log(tasks.task_name)
              //     console.log(master.name)
              //   })
              // })
            }
          })
        }
        // todo.task_completed? vm.models.completedList.push(
        //   {
        //     id: todo._id,
        //     task_name: todo.task_name,
        //     task_completed:todo.task_completed,
        //     task_rank: todo.task_rank
        //   })
        //   : vm.models.toDoList.push(
        //     {
        //       id: todo._id,
        //       task_name: todo.task_name,
        //       task_completed: todo.task_completed,
        //       task_rank: todo.task_rank
        //     })
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
    if(vm.newMaster){
      var timeCreated = new Date()
      console.log(vm.allMasterTasks)
      vm.newMaster = {
        name:  vm.newMaster.name,
        created_on: timeCreated
      }
      vm.allMasterTasks.push(vm.newMaster)
      vm.newMaster = {list_name: $stateParams.list_name, master_tasks: vm.allMasterTasks}
      console.log(vm.newMaster)
      // Todo.update({list_name: vm.newMaster.list_name}, {todo: vm.newMaster}, function(task){
      //   console.log(task)
      // })
    }
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
