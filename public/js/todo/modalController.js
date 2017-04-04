'use strict';

angular.module("app").controller("modalController", [
  "Todo",
  "$scope",
  "data",
  "date",
  modalController
])

function modalController(Todo, $scope, data, date){
  console.log("modal controller")
  console.log(data)
  $scope.list_type = data.list_type
  $scope.listType = $scope.list_type
  console.log($scope.list_type)
  console.log(date)
  $scope.data = data
  $scope.date = date
  var splitDate = date.split("-")
  $scope.$parent.updatedTasks = [];

  var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  var newDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2])
  $scope.niceDate = daysOfWeek[newDate.getDay()] + " " + monthName[splitDate[1]-1] +" "+ splitDate[2] + ", " + splitDate[0]

  $scope.pickListType = function(type){
    console.log(type)
    $scope.listType = type;

  }

}
