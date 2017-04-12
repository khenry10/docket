"use strict";

(function(){
  angular
  .module("app")
  .directive("regularList", [
    "Todo",
    "DateService",
    regularList
  ])

  function regularList(Todo, DateService){
    return {
      templateUrl: "/assets/html/calendar/directives/regular-list.html",
      scope: {
        data: "=data",
        newMaster: "&",
        saved: "=saved",
        newCal: "=newCal",
        dateTracker: "=dateTracker"
      },
      link: function($scope){
        console.log("regularList")

      }
    }
  }
})();
