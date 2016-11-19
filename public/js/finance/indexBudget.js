'use strict';

angular.module("app").controller("listController", [
  "Lists",
  "$window",
  "$scope",
  listController
])

function listController(Lists, $window){
  var finances = [];
  var variableExpenses = [];
  var fixedExpenses = [];
  var revenue = [];
  Lists.all.$promise.then(function(){
    Lists.all.forEach(function(list){

      finances.push(list)

      if(list.type === 'expense' && list.category === "variable"){
        variableExpenses.push(list.amount)
      }
      if(list.type === 'expense' && list.category === "fixed"){
        fixedExpenses.push(list.amount)
      }
      if(list.type === 'revenue'){
        revenue.push(list.amount)
      }

      vm.variableExpensesTotal = 0;
      for(var i in variableExpenses){vm.variableExpensesTotal += variableExpenses[i];}

      vm.fixedExpensesTotal = 0;
      for(var i in fixedExpenses){vm.fixedExpensesTotal += fixedExpenses[i];}

      vm.revenue = 0;
      for(var i in revenue){vm.revenue += revenue[i];}

      vm.expensesTotal = vm.fixedExpensesTotal + vm.variableExpensesTotal;
      vm.revenueMinusExpenses = vm.revenue - vm.expensesTotal;
    })
  });

  var vm = this
  vm.lists = Lists.all

  var month_name = ["no month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var date = new Date()
  var currentMonth = date.getMonth()+1

  vm.months = []
  vm.getRemainingMonths = function(){
    console.log("getRemainingMonths")
    vm.months = []
    for(var i = currentMonth; i < month_name.length; i++){
      vm.months.push(month_name[i])
    }
    console.log(vm.months)
    // $window.location.replace('/list')
  };

  vm.fullYear = function(){
    vm.months = [];
    for(var i = 1; i < month_name.length; i++){
      vm.months.push(month_name[i])
    }
  };

  vm.thisMonth = function(){
    vm.months.push(month_name[currentMonth])
  }
  vm.thisMonth()

  function click(){
    console.log("click")
  }
  vm.year = date.getFullYear()
};
