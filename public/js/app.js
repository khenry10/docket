"use strict";

(function(){
  angular
  .module("app", [
    "ui.router",
    "ngResource"

  ])
  .config([
    "$stateProvider",
    "$locationProvider",
    router
  ])
  .factory("Events", [
    "$resource",
    Events
  ])
  .factory("Lists", [
    "$resource",
    Lists
  ])
  .controller("IndexController", [
    "$scope",
    "Events",
    "$window",
    IndexController
  ])
  .controller("NewEventsController", [
    "Events",
    "$state",
    "$window",
    "$timeout",
    NewEventsController
  ])
  .controller("ShowEventsController", [
    "Events",
    "$stateParams",
    "$window",
    ShowEventsController
  ])
  .controller("listController", [
    "Lists",
    "$scope",
    listController
  ])
  .controller("protocolController", [
    "$scope",
    protocolController
  ])

  function router($stateProvider, $locationProvider){
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
    .state("list", {
      url: "/list",
      templateUrl: "/assets/html/list.html",
      controller: "listController",
      controllerAs: "listsVM"
    })
    .state("protocol", {
      url: "/protocol-planning",
      templateUrl: "/assets/html/protocol-planning.html",
      controller: "protocolController",
      controllerAs: "protocolVM"
    })
    .state("show", {
      url: "/:name",
      templateUrl: "/assets/html/show.html",
      controller: "ShowEventsController",
      controllerAs: "showVM"
    })
  }

  function Lists($resource){
    console.log("Lists factory envoked")
    var Lists = $resource("/expenses", {}, {
      update: {method: "PUT"}
    })
    Lists.all = Lists.query();
    return Lists
  };

  //factory
  function Events($resource){
    console.log("events factory envoked")
    var Events = $resource("/api/:name", {}, {
      update: {method: "PUT"}
    })
    // var Events = $resource("/api")
    Events.all = Events.query();
    Events.find = function(property, value, callback){
      Events.all.$promise.then(function(){
        Events.all.forEach(function(event){
          if(event[property] == value) callback(event);
        });
      });
    };
    return Events
  };

  function protocolController(){
    var vm = this;

    vm.protocols = ["Antagonist", "Lupron Trigger", "Clomid IUI"]

    vm.enter = function (protocol){
      console.log("protocol = " + protocol)
      var protocol = protocol
      vm.datesEntered = true
      var numberOfBCDays = vm.birthControl;
      var firstDayOfBCDate = vm.firstDayOfBC;
      var firstDayofBCMonth = firstDayOfBCDate.getMonth();
      var firstDayofBCYear = firstDayOfBCDate.getFullYear();
      var bcDay = firstDayOfBCDate.getDate();

      vm.dayAfterBC = bcDay + numberOfBCDays;
      vm.dateAfterBC = new Date(firstDayofBCYear,firstDayofBCMonth, vm.dayAfterBC);

      vm.stimDays = []
      for(var i = 3; i < 15; i++){
          vm.stimDays.push(new Date(firstDayofBCYear, firstDayofBCMonth, vm.dayAfterBC + i))
      };
      vm.triggerDay = vm.stimDays[11];
      var triggerDate = vm.triggerDay.getDate();
      var triggerMonth = vm.triggerDay.getMonth();
      var triggerYear = vm.triggerDay.getFullYear();

      if(protocol === "Lupron Trigger"){
        vm.lupronTrigger = new Date(triggerYear, triggerMonth, triggerDate+1);
      }

      vm.eggRetrieval = new Date(triggerYear, triggerMonth, triggerDate+2);
      vm.embryoTransfer = new Date(triggerYear, triggerMonth, triggerDate+7);
      vm.pregnancyTest = new Date(triggerYear, triggerMonth, triggerDate+20);
    }

  };

  function listController(Lists){
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
    var getRemainingMonths = function(){
      for(var i = currentMonth; i < month_name.length; i++){
        vm.months.push(month_name[i])
      }
    };
    getRemainingMonths()

    vm.year = date.getFullYear()
  };

  function IndexController($scope, Events, $window){
    var vm = this
    vm.events = Events.all;
    console.log(vm.events[0])
    for(var i = 0; vm.events.length; i++){
      console.log(vm.events[i])
    }
    var date = new Date()

    $scope.changeMonth = {
      count: date.getMonth()+1,
      increment: function(){
        if(this.count > 11){
          this.count = 1
          // once the count (which is the month) is greater than December, we reset the count to 1 (which is january).  We also invoke changeYear.increment() function, which is used in the index.html to see if the year of the event matches the current year
          $scope.changeYear.increment()
        } else
          this.count++
      },
      decrement: function(){
        if(this.count <= 1) {
          this.count = 12
          $scope.changeYear.decrement()
        }
        else
          this.count--
      },
      current_month: function(){
      this.count = date.getMonth()+1
      // console.log(date)
      }
    }
    $scope.currentMonth = {
      count: function($state){
        this.count = date,
        $scope.changeMonth.current_month(),
        $window.location.replace('/')
      }
    }

    // changeYear is only used to compare against the events stored in the database, to see if they match.  This function has nothing to do with building the calendar or displaying on the calendar.  All calendar logic for year is within the calendar_directive and above changeMonth function.
    $scope.changeYear = {
      year: date.getFullYear(),
      increment: function(){
        this.year++
      },
      decrement: function(){
        this.year--
      }
    }
  };

  function NewEventsController(Events, $state, $window){
    var newVM = this;
    newVM.new_event = new Events();
    newVM.create = function(){
      newVM.new_event.$save().then(function(response){
        console.log(newVM)
      $window.location.replace('/')
      })
    }
  }

  function ShowEventsController(Events, $stateParams, $window){
      var vm = this;
      console.log("$stateParams.name = " + $stateParams.name)
      Events.find("name", $stateParams.name, function(event){
        // console.log("event in ShowEventsController = " + event.name)
        vm.event = event;
      })

      vm.show = function($stateParams){
        Events.find("name", $stateParams.name, function(event){
        // console.log("event in ShowEventsController = " + event.name)
        vm.event = event;
        })
      }

      vm.update = function(){

        Events.update({name: vm.event.name}, {event: event}, function(event){
          console.log(event)
          console.log("updating...")
          $window.location.replace('/')
        })
      }

      vm.delete = function(){
        console.log("vm.event.name = " + vm.event.name)
        Events.remove({name: vm.event.name}, function(event){
            $window.location.replace('/')
        })
      }
  };

})();
