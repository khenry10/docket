'use strict';

angular.module("app").controller("modalController", [
  "Todo",
  "$scope",
  "data",
  "date",
  "allTasks",
  "parseAllTasks",
  "close",
  modalController
])

function modalController(Todo, $scope, data, date, allTasks, parseAllTasks, close){
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
    console.log("edit clicked")
    console.log(newTitle)
    $scope.showEdit = !$scope.showEdit;
    if(newTitle){
      $scope.editalbeTitle = newTitle;
        var newList = $scope.data;
        newList.list_name = newTitle;
        console.log(newList)
        Todo.update({list_name: $scope.originalListName}, {todo: newList}, function(res){
          console.log(res)
        })
    }
  }
  $scope.deleteList = function(){
    console.log("delete")

    // $scope.data.$delete(function(res){
    //   console.log(res)
    //   close()
    //   $('#add-new-modal').modal('hide');
    //   $('body').removeClass('modal-open');
    //   $('.modal-backdrop').remove();
    // })


    Todo.remove({name: $scope.data.list_name}, function(res){
      close()
      $('#add-new-modal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    })
  };
}
