'use strict';

angular.module("app").controller("newCalItemModalController", [
  "$scope",
  "data",
  "DateService",
  "close",
  "$element",
  newCalItemModalController
])

function newCalItemModalController($scope, data, DateService, close, $element){
  console.log("modal controller (newCalItemModalController)")
  console.log(data)
  $scope.data = data;

  if($scope.data.editView){
    $scope.modalTitle = "Edit"
  } else {
    $scope.modalTitle = "Add New"
    var date = new Date(data.date.year, data.date.month-1, data.date.date)
    $scope.date = DateService.getNiceDate(date)
  }


  if($scope.data.date.startTime){
    $scope.startTime = $scope.data.date.startTime
  }
  $scope.$watch("saved", function(newV, oldV){
    if($scope.saved){
      close()
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
  })

  $scope.close = function(){
    close()
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
