'use strict';

angular.module("app").controller("budgetController", [
  "Budget",
  "$window",
  "$scope",
  budgetController
])

function budgetController(Budget, $window){
  console.log("budgetController")
  var finances = [];
  var variableExpenses = [];
  var fixedExpenses = [];
  var revenue = [];
  var vm = this;
  var month_name = ["no month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var date = new Date();
  var currentMonth = date.getMonth()+1
  vm.year = date.getFullYear();
  vm.months = [];
  vm.budget = Budget.all;

  Budget.all.$promise.then(function(){
    Budget.all.forEach(function(budget){
      console.log(budget)
      finances.push(budget)

      if(budget.type === 'expense' && budget.category === "variable"){
        variableExpenses.push(budget.amount)
      }
      if(budget.type === 'expense' && budget.category === "fixed"){
        fixedExpenses.push(budget.amount)
      }
      if(budget.type === 'revenue'){
        revenue.push(budget.amount)
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

  vm.getRemainingMonths = function(){
    console.log("getRemainingMonths")
    vm.months = []
    for(var i = currentMonth; i < month_name.length; i++){
      vm.months.push(month_name[i])
    }
    console.log(vm.months)
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

  vm.create = () => {
    console.log("create")
    console.log(vm.newBudgetItem)
    // Budget.save({vm.newBudgetItem})
    const newBudgetItem = new Budget(vm.newBudgetItem)
    const successFunction = (res) => {
      console.log("successFunction")
      console.log(res)
    }

    const errorFunction = (res) => {
      console.log("errorFunction")
      console.log(res)
    }
    newBudgetItem.$save().then(successFunction, errorFunction);
  }


};
