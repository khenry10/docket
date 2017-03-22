'use strict';

angular.module("app").controller("newCalItemModalController", [
  "$scope",
  "data",
  "DateService",
  newCalItemModalController
])

function newCalItemModalController($scope, data, DateService){
  console.log("modal controller")
  console.log($scope)
  console.log($scope.data)
  $scope.data = data;
  console.log($scope.data)
  var date = new Date(data.date.year, data.date.month-1, data.date.date)
  $scope.date = DateService.getNiceDate(date)

}
