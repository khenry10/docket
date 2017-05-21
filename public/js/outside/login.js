'use strict';

angular.module("app").controller("loginReg", ["$scope", "$http", "DateService", loginReg])

function loginReg($scope, $http, DateService){
  console.log("loginReg")

  $scope.users = {};

  var successCallback = function(res){
    console.log(res)
  };

  var errorCallback = function(res){
    console.log(res)
  };

  $scope.addUser = function(user){
    console.log(user)
    $http.post('/register', user).then(successCallback, errorCallback)
  };

  var successLogin = function(response){
    console.log(response)
    if(response.data.status === 'success'){
      window.location.href = "/";
    }
  };

  var failedLogin = function(response){
    console.log(response)
  };

  $scope.auth = function(user){
    console.log(user)
    $http.post('/login', user).then(successLogin, failedLogin)
  };

  $scope.redStreakCity = 'red-streak-city.png'

};
