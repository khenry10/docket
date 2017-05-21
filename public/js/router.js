'use strict';

angular.module("app").config(["$stateProvider","$locationProvider", router])

function router($stateProvider, $locationProvider){

  console.log("router function")

  var hrefSplit = window.location.href.split("/");
  var pathName = hrefSplit[3];
  var regex = /collapse/;

  if(regex.test(pathName)){
    window.location.href = "/";
  }

  $locationProvider.html5Mode(true);

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
  .state("budget", {
    url: "/budget",
    templateUrl: "/assets/html/budget.html",
    controller: "budgetController",
    controllerAs: "listsVM"
  })
  .state("list", {
    url: "/list",
    templateUrl: "/assets/html/list.html",
    controller: "listController"
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
  .state("login-reg", {
    url: "/login",
    templateUrl: "/assets/html/outside/login.html",
    controller: "loginReg",
    controllerAs: "loginVM"
  })
  .state("home", {
    url: "/home",
    templateUrl: "/assets/html/outside/home.html",
    controller: "loginReg",
    controllerAs: "loginVM"
  })
}
