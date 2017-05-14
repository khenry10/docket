"use strict";

(function(){
  angular
  .module("app", ["ngResource", "ui.router", "ngMaterial", "xeditable", "dndLists", "angularModalService"])
  .factory("Lists", ["$resource",Lists])
  .factory("Todo", ["$resource", Todo])

  function Todo($resource){
    console.log("Todo factory envoked")
    // below was commented out as the 2nd params in $resource function
    // { query:  {method:"GET", isArray: true}
    var Todo = $resource("api/todo/:name",
      { query:  {method:"GET", params: {list_name: '@name'}} },
      { update: {method: "PUT"} },
      { find:  {method:"GET", params: {list_name: '@name'}} },
      { get: {method: "GET", isArray: false} }
    )
    Todo.all = Todo.query();
    // Todo.find = Todo.find();
    Todo.findWithGet = Todo.query()


    // Todo.find = Todo.get();

    // Todo.find = function(param){
    //   console.log(param)
    //   Todo.get()
    // };

    console.log(Todo)
    return Todo
  };

  function Lists($resource){
    console.log("Lists factory envoked")
    var Lists = $resource("/expenses", {}, {
      update: {method: "PUT"}
    })
    Lists.all = Lists.query();
    return Lists
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
