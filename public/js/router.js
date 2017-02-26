'use strict';

angular.module("app").config(["$stateProvider","$locationProvider",router])

function router($stateProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  console.log("router function")
  $stateProvider
  .state("index", {
    url: "/",
    templateUrl: "/assets/html/index.html",
    controller: "IndexController",
    controllerAs: "indexVM"
  })
  .state("new", {
    url: "/new",
    templateUrl: "/assets/html/new.html",
    controller: "NewEventsController",
    controllerAs: "newVM"
  })
  .state("list", {
    url: "/list",
    templateUrl: "/assets/html/list.html",
    controller: "listController",
    controllerAs: "listsVM"
  })
  .state("new-list", {
    url: "/list/new",
    templateUrl: "/assets/html/newList.html",
    controller: "newListsController",
    controllerAs: "newLists"
  })
  .state("show", {
    url: "/event/:name",
    templateUrl: "/assets/html/show.html",
    controller: "ShowEventsController",
    controllerAs: "showVM"
  })
  .state("todo", {
    url: "/tasks",
    templateUrl: "/assets/html/todo/todo-index.html",
    controller: "todoController",
    controllerAs: "todoVM"
  })
  .state("todo-show", {
    url: "/tasks/:list_name",
    templateUrl: "/assets/html/todo/todo-show.html",
    controller: "todoController",
    controllerAs: "todoVM"
  })
  .state("catch", {
    url: "/collapse1",
    templateUrl: "/assets/html/index.html",
    controller: "IndexController",
    controllerAs: "indexVM"
  })
}
