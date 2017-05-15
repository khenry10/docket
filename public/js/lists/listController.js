'use strict';

angular.module("app").controller("listController", [
  "Lists",
  "Todo",
  "$scope",
  "$http",
  "DateService",
  listController
])

function listController(Lists, Todo, $scope, $http, DateService){
  console.log("listController")
  console.log($scope)
  console.log(Todo)

  $scope.lists = [];
  Todo.all.$promise.then(function(todo){
    var todo = todo;
    todo.forEach(function(eachTodo, index){
      var eachTodo = eachTodo;
      var index = index;
      eachTodo.lists.forEach(function(list){
        var list = list;
        var fullDate = DateService.stringDateSplit(list.date)
        console.log(fullDate)
        list.tasks.forEach(function(task){
          var flatTodo = {
            list_name: eachTodo.list_name,
            list_type: eachTodo.list_type,
            list_reocurring: eachTodo.list_reocurring,
            list_recur_end: eachTodo.list_recur_end,
            dateList: list.date,
            fullDate: fullDate.fullDate,
            task_name: task.name,
            task_completed: task.task_completed,
            todo_index: index
          }
          $scope.lists.push(flatTodo)
        }) //end of list.tasks forEach
      }) //end of eachTodo.lists
    }) // end of todo
    console.log($scope.lists)
  }) //end of Todo.all.$promise

  $scope.update = function(list){
    console.log(list)

    // db call to retrieve the list getting updated
    // var thisList = Todo.get({list_name: list.list_name })
    // console.log(thisList)

    Todo.get({list_name: list.list_name }).$promise.then(function(thisList){
      console.log(thisList)
      //looping through the datelists to find the correct one
      for(var i = 0; i < thisList.lists.length; i++){
        console.log(thisList.lists[i])
        var dbListDateList = thisList.lists[i]
        console.log(dbListDateList.date)
        console.log(list.dateList)
        if(dbListDateList.date == list.dateList){
          console.log("datelist match")
          // looping through the tasks to find the correct one
          for(var j = 0; j < dbListDateList.tasks.length; j++ ){
            console.log(dbListDateList.tasks[j].name)
            if(dbListDateList.tasks[j].name === list.task_name){
              console.log("task name matchhhhhhhhh")
              dbListDateList.tasks[j].task_completed = list.task_completed;
              dbListDateList.tasks[j].time_completed = new Date();
              j = dbListDateList.length;
              i = thisList.lists.length;
              console.log(dbListDateList.tasks[j])
            }
          }
          console.log(dbListDateList)
        }
      }
      console.log(thisList)
      Todo.update({list_name: thisList.list_name}, {todo: thisList})
    })


    //ajax call, don't need it here but don't want to delete it
    // $http.get('/api/todo/').success(function(response){
    //   console.log(response)
    // })

  };


};
