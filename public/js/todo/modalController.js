'use strict';

angular.module("app").controller("modalController", [
  "Todo",
  "$scope",
  "data",
  "times",
  "date",
  "allTasks",
  "parseAllTasks",
  "pullTodos",
  "close",
  modalController
])

function modalController(Todo, $scope, data, times, date, allTasks, parseAllTasks, close, pullTodos){
  console.log("modal controller")
  $scope.allTasks = allTasks;
  $scope.list_type = data.list_type;
  $scope.listType = $scope.list_type;
  $scope.data = data;
  $scope.date = date;
  $scope.parseAllTasks = parseAllTasks;
  var splitDate = date.split("-");
  $scope.$parent.updatedTasks = [];
  $scope.updatesFromAllTasks = [];
  var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var newDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2])
  $scope.niceDate = daysOfWeek[newDate.getDay()] + " " + monthName[splitDate[1]-1] +" "+ splitDate[2] + ", " + splitDate[0];
  $scope.originalListName = $scope.data.list_name;
  $scope.editalbeTitle = $scope.data.list_name;
  $scope.showEdit = false;

  $scope.edit = function(newTitle){
    $scope.showEdit = !$scope.showEdit;
    if(newTitle){
      $scope.editalbeTitle = newTitle;
        var newList = $scope.data;
        newList.list_name = newTitle;
        Todo.update({list_name: $scope.originalListName}, {todo: newList}, function(res){
        })
    }
  }
  $scope.deleteList = function(){
    for(var i = 0; i < $scope.data.lists.length; i++){
      var dateList = $scope.data.lists[i];
      console.log(dateList)
      console.log(times)
      if(dateList.date === $scope.date && dateList.start_time === times.start_time){
        $scope.data.lists.splice(i, 1)
        i = $scope.data.lists.length
      }
    }

    Todo.update({list_name: $scope.data.list_name}, {todo: $scope.data}, function(res){
      pullTodos('ajax')
      $('.modal-backdrop').remove();
    })

  };
}
