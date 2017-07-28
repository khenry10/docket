'use strict';

angular.module("app").controller("modalController", [
  "Todo",
  "$scope",
  "data",
  "times",
  "date",
  "allTasks",
  "parseAllTasks",
  "pullTodos",
  "close",
  "ModalService",
  modalController
])

function modalController(Todo, $scope, data, times, date, allTasks, parseAllTasks, pullTodos, close, ModalService){
  console.log("modal controller modalController")
  $scope.allTasks = allTasks;
  $scope.list_type = data.list_type;
  $scope.listType = $scope.list_type;
  $scope.data = data;
  console.log($scope.data)
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
    $scope.showEdit = !$scope.showEdit;
    if(newTitle){
      $scope.editalbeTitle = newTitle;
        var newList = $scope.data;
        newList.list_name = newTitle;
        Todo.update({list_name: $scope.originalListName}, {todo: newList}, function(res){
        })
    }
  }

  $scope.editList = function(){
    console.log("editList")
    $('.modal-backdrop').remove();
    close(false)

    var data = $scope.data
    data.date = $scope.date
    data.editView = true;
    data.dateList = times;
    console.log(times)

    ModalService.showModal({
      templateUrl: "/assets/html/calendar/modals/add-new-modal.html",
      controller: "newCalItemModalController",
      inputs: {
        data: data
      }
    }).then(function(modal) {
      //it's a bootstrap element, use 'modal' to show it
      modal.element.modal();
      modal.close.then(function(result) {
      });
    });

  };

  $scope.deleteList = function(){
    for(var i = 0; i < $scope.data.lists.length; i++){
      var dateList = $scope.data.lists[i];
      if(dateList.date === $scope.date && dateList.start_time === times.start_time){
        $scope.data.lists.splice(i, 1)
        i = $scope.data.lists.length
      }
    }

    Todo.update({list_name: $scope.data.list_name}, {todo: $scope.data}, function(res){
      pullTodos('ajax')
      $('.modal-backdrop').remove();
      console.log(close)
      close(false)
    })

  };
}
