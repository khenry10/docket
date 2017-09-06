'use strict';

angular.module("app").controller("budgetController", [
  "Budget",
  "$window",
  "Employment",
  "$scope",
  "DateService",
  budgetController
])

function budgetController(Budget, $window, Employment, $scope, DateService){
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
  vm.revenue = 0;
  vm.grossRevenue = new Array();
  vm.totalGrossRev = 0;
  vm.totalDeductions = 0;
  vm.taxedTotal = 0;
  vm.netRevenue = 0;

  function round(num){
    return parseFloat(Math.round(num * 100) / 100).toFixed(2)
  }

  const aggregatePaychecks = () => {
    console.log(vm.positions)
  }

  const runExpenses = () => {
    Budget.all.$promise.then(function(){
      Budget.all.forEach(function(budget){
        console.log(budget)
        console.log("~~~~~~~")
        console.log(vm.netRevenue)
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
        vm.revenueMinusExpenses = vm.netRevenue - vm.expensesTotal;
      })
    });

  }

  Employment.all.$promise.then(function(){
    console.log(Employment.all)
    vm.positions = Employment.all.map(function(position){
      let grossRevenue = 0;
      let healthcarePremium = 0;
      let dentalPremium = 0;
      let total401k = 0;
      let totalDeductions = 0;
      let taxedTotal = 0;
      let netRevenue = 0;
      console.log(position)

      if(position.hourly_rate){
        const weekly = position.hourly_rate * 40;
        position.paycheckAmount = round(position.hourly_rate * 80);
        const annual = weekly * 52;
        position.salary = round(annual);
      } else {
        position.paycheckAmount = round(position.salary/12)
      }
      $scope.totalComp += parseInt(position.salary);
      if(position.paycheck_frequency === 'bi-weekly'){
        position.paychecks = DateService.paychecks.biWeeklyFridays;
      } else if (position.paycheck_frequency === 'Monthly') {
        position.paychecks = DateService.paychecks.monthly();
      }
        let paychecks = []
        console.log(position.paychecks)
        position.paychecks.forEach(function(paycheck, $index){

          if(paycheck.getMonth()+1 == currentMonth){

            const totaledDeductions = round(
                                      parseFloat(position.healthcare_premium)
                                      + parseFloat(position.dental_premium)
                                      + parseFloat(position.paycheckAmount * position.contribution_401k)
                                    );

            const salaryMinusDeductions = position.paycheckAmount - totaledDeductions;
            const taxedAmount = parseFloat(round(salaryMinusDeductions * position.tax_rate));
            const netRev = round(salaryMinusDeductions - (salaryMinusDeductions * position.tax_rate));

            grossRevenue += parseFloat(position.paycheckAmount);
            healthcarePremium += parseFloat(position.healthcare_premium)
            dentalPremium += parseFloat(position.dental_premium)
            total401k += parseFloat(position.paycheckAmount * position.contribution_401k);
            console.log("taxedAmount = " + taxedAmount)
            taxedTotal += parseFloat(taxedAmount);
            console.log("taxedTotal = " + taxedTotal)
            netRevenue += parseFloat(netRev);

            paychecks.push({
              name: position.name,
              salary: position.paycheckAmount,
              healthcare_premium: position.healthcare_premium,
              dental_premium: position.dental_premium,
              contribution_401k: position.paycheckAmount * position.contribution_401k,
              totaledDeductions: totaledDeductions,
              salaryMinusDeductions: salaryMinusDeductions,
              taxedAmount: taxedAmount,
              netRevenue: netRev
            })
            totalDeductions += (healthcarePremium + dentalPremium + total401k)
            console.log("$index = " + $index)
            console.log("totalDeductions = " + totalDeductions)
            vm.grossRevenue.push({name: position.name, gross: grossRevenue});

            position.grossRevenue = round(grossRevenue);
            position.healthcarePremium = round(healthcarePremium);
            position.dentalPremium = round(dentalPremium);
            position.total401k = round(total401k);
            position.taxedTotal = round(taxedTotal);
            console.log("position.taxedTotal = " + position.taxedTotal)
            position.netRevenue = netRevenue;
          }
        })

      console.log("*******")
      position.paystubs = paychecks;
      vm.totalGrossRev += parseFloat(position.grossRevenue);
      vm.taxedTotal += parseFloat(position.taxedTotal);
      console.log("vm.taxedTotal = " + vm.taxedTotal)
      vm.netRevenue += position.netRevenue;

      console.log(vm.totalGrossRev)

      position.totalDeductions = paychecks.reduce(function(sum, value){
        return parseFloat(sum) + parseFloat(value.totaledDeductions)
      }, 0)
      vm.totalDeductions += parseFloat(position.totalDeductions);

      return position
    })
    aggregatePaychecks()
    runExpenses()
    console.log(vm.positions)
  })


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
