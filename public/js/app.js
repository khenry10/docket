"use strict";

(function(){
  angular
  .module("app", ["ngResource", "ui.router", "ngMaterial"])
  .factory("Events", ["$resource",Events])
  .factory("Lists", ["$resource",Lists])

  function Lists($resource){
    console.log("Lists factory envoked")
    var Lists = $resource("/expenses", {}, {
      update: {method: "PUT"}
    })
    Lists.all = Lists.query();
    return Lists
  };

  function Events($resource){
    console.log("events factory envoked")
    var Events = $resource("/api/:name", {}, {
      update: {method: "PUT"}
    })
    Events.all = Events.query();
    Events.find = function(property, value, callback){
      console.log("property = "+property)
      console.log("value = " + value)
      Events.all.$promise.then(function(){
        Events.all.forEach(function(event){
          if(event[property] == value) callback(event);
        });
      });
    };
    return Events
  };

})();
