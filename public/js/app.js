"use strict";

(function(){
  angular
  // .module("app", ["ui.router","ngResource"])
  .module("app", ["ngResource", "ui.router", "ngMaterial"])
  .config(["$stateProvider","$locationProvider",router])
  .factory("Events", ["$resource",Events])
  .factory("Lists", ["$resource",Lists])
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
    "$window",
    "$scope",
    listController
  ])
  .controller("newListsController", [
    "Lists",
    "$scope",
    "$window",
    "$state",
    newListsController
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

  function newListsController(Lists, $state, $window){
    var newVM = this;
    newVM.recurring = ["Monthly", "Yearly", "Daily", "Quarterly"]
    // newVM.type = {
    //     name: 'expense'
    // };
    // newVM.expense = {
    //     name: 'fixed'
    // };

    // newVM.create = function(){
    //   console.log("newListsController name & amount = " + newVM.name  + " & " + newVM.amount)
    //   console.log("radio = " + newVM.type.name)
    //   console.log("newVM.recurring = " + newVM.selectedRecurring)
    // }
    console.log(newVM.newList)
    newVM.newLists = new Lists();
    newVM.create = function(){
      console.log(newVM.newLists)
      newVM.newLists.$save().then(function(response){
        console.log("newList $save callback")
      $window.location.replace('/list')
      })
    }
  };

  function IndexController($scope, Events, $window){
    console.log($window.location)
    var vm = this
    vm.events = Events.all;

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
    console.log("newVM = " + JSON.stringify(newVM))
    newVM.new_event = new Events();
    newVM.create = function(){
      console.log(newVM.new_event)
      newVM.new_event.$save().then(function(response){
        console.log(response)
      $window.location.replace('/')
      })
    }
  };

  function ShowEventsController(Events, $stateParams, $window){
    console.log("show event")
      var vm = this;

      Events.find("name", $stateParams.name, function(event){
        vm.event = event;
        vm.event.niceDate = event.start_time.substring(5,7) + " / "+ event.start_time.substring(9,10) + " / " +
        event.start_time.substring(0,4)
      })

      vm.show = function($stateParams){
        Events.find("name", $stateParams.name, function(event){
        vm.event = event;
        })
      }

      vm.update = function(){
        console.log("update = " +vm.event.name)
        console.log("event = "+ JSON.stringify(event))
        var newEvent = {name: vm.event.newName, start_time: vm.event.newStartTime}
        console.log(newEvent)
        Events.update({name: vm.event.name}, {event: newEvent}, function(event){

          $window.location.replace('/')
        })
      }

      vm.delete = function(eventName){
        console.log("vm.event.name = " + eventName)

        Events.remove({name: eventName}, function(event){
            $window.location.replace('/')
        })
      }
  };

})();
