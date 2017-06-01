'use strict';

angular.module("app").controller("modalController", [
  "Todo",
  "$scope",
  "data",
  "date",
  "allTasks",
  "parseAllTasks",
  modalController
])

function modalController(Todo, $scope, data, date, allTasks, parseAllTasks){
  console.log("modal controller")
  console.log($scope)
  console.log(date)
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
  $scope.deleteList = function(){
    console.log("delete")
    console.log($scope.data)
    console.log(Todo)
    console.log(Todo.remove())
    Todo.delete({list_name: $scope.date.list_name}, {todo: $scope.data}, function(res){
      console.log(res)
      $scope.close(false)
    })
  };
}
