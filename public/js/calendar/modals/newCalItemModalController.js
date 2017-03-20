'use strict';

angular.module("app").controller("newCalItemModalController", [
  "$scope",
  "data",
  "date",
  newCalItemModalController
])

function newCalItemModalController($scope, data, date){
  console.log("modal controller")
  $scope.date = date;

}
