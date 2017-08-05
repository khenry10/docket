"use strict";

(function(){
  angular
  .module("app")
  .directive("addNewCalItem", [
    "Todo",
    "DateService",
    createNewCalItem
  ])

  function createNewCalItem(Todo, DateService){
    return {
      templateUrl: "/assets/html/calendar/directives/add-new-cal-item.html",
      scope: {
        data: "=data",
        saved: "=saved",
        newCal: "=newCal",
        dateTracker: "=dateTracker",
      },
      link: function($scope){
        console.log("this is addNewCalItem directive")
        console.log($scope.data)
        console.log($scope.saved)

        $scope.event = {};
        var createListOfLists = [];
        $scope.needToModifyDateList = false;
        $scope.reoccurs = ['None','Daily', 'Weekly', 'Monthly', 'Yearly'];
        $scope.categories = ["Health", "Work", "Finance", "Household", "Personal Project", "Social" ];
        $scope.times = ["1:00am", "2:00am", "3:00am", "4:00am", "5:00am", "6:00am", "7:00am",
        "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm",
        "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm", "11:00pm", "12:00am"];
        $scope.event.repeatDays = {
          sun: false,
          mon: false,
          tues: false,
          wed: false,
          thurs: false,
          fri: false,
          sat: false,
        };

        $scope.changeEndTimeArray = function(){
          console.log("changeEndTimeArray envoked")
          if($scope.event.start_time){
            var start = $scope.times.indexOf($scope.event.start_time)
          } else {
            var start = $scope.times.indexOf($scope.data.date.start_time);
          }
          $scope.event.end_time = $scope.times[start+1]
          $scope.newTimes = []
          for(var t = start+1; t < $scope.times.length; t++){
            $scope.newTimes.push($scope.times[t])
          }
        }

        if($scope.data){
          $scope.changeEndTimeArray()
        }
         var getHours = function(){
            console.log("getHours")
            console.log($scope.newTodoList)
            console.log($scope.event)
            // if($scope.newTodoList.start_time){
            //   $scope.start_time = $scope.newTodoList.start_time
            // }
            // console.log($scope.newTodoList.start_time)
            var startTime = $scope.event.start_time.split(":")
            var startTimeAmOrPm = startTime[1].substr(2,4)
            var startTime = startTime[0]
            var endTime = $scope.event.end_time.split(":")
            console.log(startTime)
            console.log(endTime)
            var endTimeAmOrPm = endTime[1].substr(2,4)
            var endTime = endTime[0]
            var timeDifference = parseInt(endTime) - parseInt(startTime)
            // below is to account for when something starts in the am and ends in the pm
            if(timeDifference < 0){
              var time = 12 - startTime
              var timeDifference = parseInt(time) + parseInt(endTime)
            }
            $scope.event.duration = timeDifference
            console.log($scope.event.duration)
          }

        var repeatAdditionalDays = function(count, incrementor, lastDay, year, month){
          while(count+incrementor <= lastDay){
            console.log("count = " + count)
            console.log("incrementor = " + incrementor)
            count = count + incrementor
            var list = year+"-"+month+"-"+count;
            createListOfLists.push( new $scope.dateList(list)  )
          }
        };

        if($scope.data && $scope.data.editView){
          console.log($scope.data)
          $scope.modalTitle = "Edit";
          $scope.event = $scope.data.todo;
          console.log($scope.event)
          var calendarEntry = $scope.data.todo;
          console.log(calendarEntry.first_day)
          $scope.event.first_day = DateService.fullDateWithTimeSplit(calendarEntry.first_day);

          if(calendarEntry.list_recur_end && calendarEntry.list_recur_end != 'Never'){
            $scope.event.reoccurEnds = 'SelectDate';
            console.log(calendarEntry.list_recur_end)
            $scope.event.reoccurEndsDate = DateService.fullDateWithTimeSplit(calendarEntry.list_recur_end)
          } else {
            $scope.event.reoccurEnds = 'Never';
          }
          // if(calendarEntry.listType === 'shopping'){
          //   $scope.event.budget = calendarEntry.budget;
          // }
        };

        $scope.updateChangeLog = function(eventValueChanged, isADateMetric){
            if($scope.data && $scope.data.editView){
              if(isADateMetric){
                $scope.needToModifyDateList = isADateMetric;
              }
              console.log("eventValueChanged = " + eventValueChanged + "; isADateMetric = " + isADateMetric)
              console.log($scope.event[eventValueChanged])
              $scope.data.todo[eventValueChanged] = $scope.event[eventValueChanged]
              console.log($scope.data.todo)
            }
        };

        $scope.update = function(updateMethod){
          console.log(updateMethod)
          console.log($scope.data)
          console.log($scope.event)

          if($scope.needToModifyDateList){
              console.log("need to modify the dateLists")
              $scope.create('update')
          } else {
            console.log("dont need to change the dataLists")
            if(updateMethod === 'all'){
              Todo.update({list_name: $scope.data.todo.list_name}, {todo: $scope.data.todo})
            }
            console.log($scope.data.todo)
          }
          // $scope.saved is a dependency injected from newCalItemModalController and is used to close remove the update modal
          $scope.saved = true;
        };

        $scope.create = function(createNewOrUpdate){
          console.log("create")
          console.log(createNewOrUpdate)
          if($scope.data  && createNewOrUpdate != 'update'){
            $scope.event.first_day = new Date($scope.data.date.year, $scope.data.date.month-1, $scope.data.date.date)
          }
          console.log($scope.event.first_day && $scope.event.endTime)
          console.log($scope.event.first_day)
          console.log($scope.event.end_time)
          if($scope.event.first_day && $scope.event.end_time){
            console.log("getHours")
            getHours()
          }
          if(createNewOrUpdate != 'update' ){
            $scope.newTodoList = new Todo($scope.event);
          }
          var year = $scope.event.first_day.getFullYear();
          var month = $scope.event.first_day.getMonth()+1;
          var date = $scope.event.first_day.getDate();
          var numberOfDaysInMonth = new Date(year, month, 0).getDate()
          var tracker = {tracking: $scope.event.tracker, quantity: ""};
          var date = $scope.event.first_day;
          var newDate = date.getFullYear()+"-"+month+"-"+date.getDate()
          var count = date.getDate();
          var lastDay = numberOfDaysInMonth

          console.log($scope.event.duration)
          $scope.dateList = function(newDate){
            console.log(newDate)
            this.date = newDate,
            this.name = $scope.event.name,
            this.duration = $scope.event.duration,
            this.start_time = $scope.event.start_time,
            this.end_time = $scope.event.end_time,
            this.tasks = [],
            this.tracker = tracker
          }

            if($scope.event.list_name && $scope.event.first_day || $scope.view === 'modal'){
                console.log("is you getting in here?")

                if(createNewOrUpdate != 'update'){
                  $scope.newTodoList.list_created_on = new Date()

                  if($scope.data && $scope.data.date.startTime){
                    $scope.newTodoList.start_time = $scope.data.date.startTime
                  }

                  if($scope.event.list_reocurring){
                    $scope.newTodoList.list_recur_end = $scope.event.list_recur_end === 'Never'? 'Never':$scope.reoccurEndsDate;
                  }
                }


                if($scope.event.list_recur_end){
                  if($scope.event.list_recur_end === "SelectDate"){
                    var calendar = $scope.dateTracker? $scope.dateTracker : $scope.data.dateTracker
                    var endDateMonth = $scope.event.reoccurEndsDate.getMonth()+1
                    var endDateYear = $scope.event.reoccurEndsDate.getFullYear()

                    if(calendar.year === endDateYear){
                      if(calendar.monthCount === endDateMonth){
                        var lastDay = $scope.event.reoccurEndsDate.getDate()
                      }
                    }

                  }
                }

                if($scope.event.list_reocurring !== 'Weekly'){
                  var list = year+"-"+month+"-"+count;
                  createListOfLists.push( new $scope.dateList(list) )
                }

                if($scope.event.list_reocurring === 'Daily'){
                  repeatAdditionalDays(count, 1, lastDay, year, month)
                }

                if($scope.list_reocurring === 'Monthly'){
                  while(month < 12){
                    month = month+1
                    var list = year+"-"+month+"-"+count
                    createListOfLists.push( new $scope.dateList(list) )
                  }
                }

                if($scope.event.list_reocurring === 'Weekly'){
                  console.log("WEEKLY!!!!!!!!!!!!!!!!!")
                  var dayOfFirstDay = $scope.event.first_day.getDay();
                  var index = 0;
                  var additionalDays = [];
                  for(var property in $scope.event.repeatDays) {
                    if ($scope.event.repeatDays.hasOwnProperty(property)) {
                        if($scope.event.repeatDays[property]){
                          additionalDays.push(index)
                        }
                        index = index +1;
                    }
                  }
                  if(additionalDays.length){
                    additionalDays.forEach(function(day){
                      var count = date.getDate();
                      var adjuster = day - dayOfFirstDay;
                      count = count + adjuster;
                      var list = year+"-"+month+"-"+count;
                      // pushed a date list here because repeats in the first week weren't being added
                      createListOfLists.push( new $scope.dateList(list) )
                      repeatAdditionalDays(count, 7, lastDay, year, month)
                    })
                  } else {
                      var list = year+"-"+month+"-"+count;
                      createListOfLists.push( new $scope.dateList(list) )
                      repeatAdditionalDays(count, 7, lastDay, year, month)

                  }
                }//end of weekly conditional

                console.log($scope.event)

                if(createNewOrUpdate === 'update'){
                  $scope.event.lists = createListOfLists;
                  Todo.update({list_name: $scope.event.list_name}, {todo: $scope.event})
                } else {
                  $scope.newTodoList.lists = createListOfLists;
                  $scope.newTodoList.$save().then(function(res){
                    console.log("$scope.newTodoList.$save success")
                    if($scope.data){
                      // saved is a dependency which closes the add-new-modal
                      $scope.saved = true
                    }
                  })
                }

                var pushNew = {
                  origin: 'add-new-call-item-directive',
                  todo: $scope.event,
                  modifiedDateList: $scope.event.lists
                };

                // $scope.data is only passed in when the add new MODAL is being used, comes from the calendar directive
                if($scope.data && createNewOrUpdate != 'update'){
                  // in the calendar directive I pass the entire scope into the data object, which inherits it's scope from the IndexController
                    // decided to it this way because scope.pickCorrectDateForCal puts EVERYTING you send it on the calendar and I didn't want to duplicate logic already in IndexController
                    // console.log($scope.newCalTodoLists)
                  $scope.data.scope.$parent.verifyCloneList($scope.event);

                } else {
                  // new events from side rail use isolated directive scope
                  $scope.newCal = [$scope.event]
                  $scope.$parent.listForCal.push(pushNew)

                }

                // clears the input fields for new additions
                  $scope.event = {}

            }
          }
          // end of create()
      }
    }
  }
})();
