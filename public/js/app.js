"use strict";

(function(){
  angular
  .module("app", ["ngResource", "ui.router", "ngMaterial", "xeditable", "dndLists", "angularModalService"])
  .factory("Budget", ["$resource",Budget])
  .factory("Todo", ["$resource", Todo])

  function Todo($resource){
    console.log("Todo factory envoked")
    // below was commented out as the 2nd params in $resource function
    // { query:  {method:"GET", isArray: true}
    var Todo = $resource("api/todo/:name", {list_name: '@name'},
      // { query:  {method:"GET", params: {list_name: '@name'}} },
      { update: {method: "PUT"} },
      // { find:  {method:"GET", params: {list_name: '@name'}} },
      // { get: {method: "GET", isArray: false} },
      { delete: {method: "DELETE"}, params: {list_name: '@name'}},

    )

    Todo.all = Todo.query();
    Todo.findWithGet = Todo.query();

    return Todo
  };



  function User($resource){
    var User = $resource("/userAuth", {}, {})
  };

  function Budget($resource){
    console.log("Budget factory envoked")
    console.log($resource)
    var Budget = $resource("/api/budget", {}, {update: {method: "PUT"}}, {save: {method: 'POST'}})
    Budget.all = Budget.query();
    return Budget
  };

  // function Events($resource){
  //   console.log("events factory envoked")
  //   var Events = $resource("/api/event/:name",
  //   { query:  {method:'GET', isArray: true} },
  //   { update: {method: "PUT"} })
  //
  //   Events.all = Events.query();
  //   // Events.find = function(property, value, callback){
  //   //   // console.log("property = "+property)
  //   //   // console.log("value = " + value)
  //   //   // Events.all.$promise.then(function(){
  //   //   //   Events.all.forEach(function(event){
  //   //   //     if(event[property] == value) callback(event);
  //   //   //   });
  //   //   // });
  //   // };
  //   return Events
  // };

})();
