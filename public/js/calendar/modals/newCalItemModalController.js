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
  $scope.data = data;
  var date = new Date(data.date.year, data.date.month-1, data.date.date)

  if($scope.data.date.startTime){
    $scope.startTime = $scope.data.date.startTime
  }
  $scope.date = DateService.getNiceDate(date)
  $scope.$watch("saved", function(newV, oldV){
    if($scope.saved){

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
