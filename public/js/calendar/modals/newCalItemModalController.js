'use strict';

angular.module("app").controller("newCalItemModalController", [
  "$scope",
  "data",
  newCalItemModalController
])

function newCalItemModalController($scope, data){
  console.log("modal controller")
  console.log($scope)
  console.log($scope.data)
  $scope.data = data;
  $scope.date = data.date;

}
