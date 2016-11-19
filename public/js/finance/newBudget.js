'use strict';

angular.module('app').controller("newListsController", [
  "Lists",
  "$scope",
  "$window",
  "$state",
  newListsController
])

function newListsController(Lists, $state, $window){
  var newVM = this;
  newVM.recurring = ["Monthly", "Yearly", "Daily", "Quarterly"]
  
  console.log(newVM.newList)
  newVM.newLists = new Lists();
  newVM.create = function(){
    console.log(newVM.newLists)
    newVM.newLists.$save().then(function(response){
      console.log("newList $save callback")
    $window.location.replace('/list')
    })
  }
};
