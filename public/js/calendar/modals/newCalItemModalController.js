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
  console.log("modal controller")
  console.log($scope)
  console.log($scope.data)
  $scope.data = data;
  console.log($scope.data)
  var date = new Date(data.date.year, data.date.month-1, data.date.date)
  if($scope.data.date.startTime){
    $scope.startTime = $scope.data.date.startTime
  }
  $scope.date = DateService.getNiceDate(date)
  console.log($scope.saved)
  $scope.$watch("saved", function(newV, oldV){
    console.log("saved triggered")
    if($scope.saved){
      console.log($element)

      close()
      $('#add-new-modal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
  })

  $scope.close = function(){
    close()
    $('#add-new-modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
