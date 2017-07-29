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
      console.log($('#add-new-modal'))
      console.log($('#add-new-modal')[0])
      close()
      // $('#add-new-modal')[0].modal('hide');
      // $('#add-new-modal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
  })

  $scope.close = function(){
    close()
    // $('#add-new-modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
