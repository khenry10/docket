'use strict';

angular.module("app").controller("calEntries", [
  "Todo",
  "$scope",
  "$http",
  "DateService",
  calEntries
])

function calEntries(Todo, $scope, $http, DateService){
  console.log("calEntries")
  console.log($scope)

  $scope.lists = [];
  $scope.todos = [];

  Todo.all.$promise.then(function(todo){
    console.log(todo)
    var todo = todo;
    todo.forEach(function(eachTodo, index){

      var eachTodo = eachTodo;
      var index = index;
      todo.newEntry = new Object();
      todo.addNew = false;
      eachTodo.lists.forEach(function(list){
        console.log(list)
        var list = list;
        var fullDate = DateService.stringDateSplit(list.date)
        list.niceDate = fullDate.monthName + " " + fullDate.date + ", " + fullDate.year
        console.log(fullDate)

      }) //end of eachTodo.lists
      console.log(eachTodo)
      $scope.todos.push(eachTodo)
    }) // end of todo
    console.log($scope.lists)
  }) //end of Todo.all.$promise

  $scope.addNew = function(list){
    var date = list.newEntry.date;
    var month = parseInt(date.getMonth()) + 1;
    var saveMe = {
      date: date.getFullYear() + "-" + month + "-" + date.getDate(),
      name: list.newEntry.name,
      duration: list.duration,
      start_time: list.start_time,
      end_time: list.end_time,
      tasks: list.master_tasks,
      niceDate: DateService.monthNames[month] + " " + date.getDate() + ", " + date.getFullYear()
    }
    list.lists.push(saveMe)
    console.log(list)
    Todo.update({list_name: list.list_name}, {todo: list})

    list.newEntry.name = "";
    list.newEntry.date = "";

  }

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
