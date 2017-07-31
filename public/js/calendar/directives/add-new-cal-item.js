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
        $scope.times = ["1:00am", "2:00am", "3:00am", "4:00am", "5:00am", "6:00am", "7:00am",
        "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm",
        "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm", "11:00pm", "12:00am"]

        $scope.reoccurs = ['None','Daily', 'Weekly', 'Monthly', 'Yearly'];

        $scope.categories = ["Health", "Work", "Finance", "Household", "Personal Project", "Social" ];

        $scope.daysInRepeatWeekly = {
          sun: false,
          mon: false,
          tues: false,
          wed: false,
          thurs: false,
          fri: false,
          sat: false,
        };

        $scope.event = {};

        $scope.needToModifyDateList = false;

        $scope.changeEndTimeArray = function(){
          console.log("changeEndTimeArray envoked")
          if($scope.event.startTime){
            var start = $scope.times.indexOf($scope.event.startTime)
          } else {
            var start = $scope.times.indexOf($scope.data.date.startTime);
          }
          $scope.event.endTime = $scope.times[start+1]
          $scope.newTimes = []
          for(var t = start+1; t < $scope.times.length; t++){
            $scope.newTimes.push($scope.times[t])
          }
        }

        if($scope.data){
          $scope.changeEndTimeArray()
        }
          var getHours = function(){
            if($scope.newTodoList.start_time){
              $scope.startTime = $scope.newTodoList.start_time
            }
            var startTime = $scope.event.startTime.split(":")
            var startTimeAmOrPm = startTime[1].substr(2,4)
            var startTime = startTime[0]
            var endTime = $scope.event.endTime.split(":")
            var endTimeAmOrPm = endTime[1].substr(2,4)
            var endTime = endTime[0]
            var timeDifference = parseInt(endTime) - parseInt(startTime)
            // below is to account for when something starts in the am and ends in the pm
            if(timeDifference < 0){
              var time = 12 - startTime
              var timeDifference = parseInt(time) + parseInt(endTime)
            }
            $scope.newTodoList.duration = timeDifference
          }

        var createListOfLists = []

        $scope.newEntry = {}

        var repeatAdditionalDays = function(count, incrementor, lastDay, year, month, list, startTime, endTime, tracker){
          while(count+incrementor <= lastDay){
            count = count + 7
            var list = year+"-"+month+"-"+count;
            createListOfLists.push( {
              date: list,
              name: $scope.name,
              duration: $scope.newTodoList.duration,
              start_time: $scope.newTodoList.start_time,
              end_time: $scope.newTodoList.end_time,
              tasks: [],
              tracker: tracker} )
            //  var date = $scope.firstDay
          }
        };

        if($scope.data && $scope.data.editView){
          console.log($scope.data)
          var calendarEntry = $scope.data.todo;
          console.log(calendarEntry.repeatDays)
          $scope.event.daysInRepeatWeekly = calendarEntry.repeatDays;
          $scope.modalTitle = "Edit";
          $scope.event.list_name = calendarEntry.list_name;
          $scope.event.routine = calendarEntry.routine;
          $scope.event.first_day = DateService.fullDateWithTimeSplit(calendarEntry.first_day);
          $scope.event.startTime = calendarEntry.start_time;
          $scope.event.endTime = calendarEntry.end_time;
          $scope.event.list_type = calendarEntry.list_type;
          $scope.event.category = calendarEntry.category;
          $scope.event.repeatInterval = calendarEntry.list_reocurring;
          if(calendarEntry.list_recur_end && calendarEntry.list_recur_end != 'Never'){
            $scope.event.reoccurEnds = 'SelectDate';
            $scope.event.reoccurEndsDate = DateService.fullDateWithTimeSplit(calendarEntry.list_recur_end)
          } else {
            $scope.event.reoccurEnds = 'Never';
          }
          if(calendarEntry.listType === 'shopping'){
            $scope.event.budget = calendarEntry.budget;
          }
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

        $scope.create = function(){
          console.log("create")
          console.log($scope.event)
          $scope.newTodoList = new Todo($scope.event);
          console.log($scope.newTodoList)

          console.log($scope.data)
          if($scope.data){
            console.log($scope.data.date)
            $scope.event.first_day = new Date($scope.data.date.year, $scope.data.date.month-1, $scope.data.date.date)
          }

          var year = $scope.event.first_day.getFullYear();
          var month = $scope.event.first_day.getMonth()+1;
          var date = $scope.event.first_day.getDate();
          var numberOfDaysInMonth = new Date(year, month, 0).getDate()
          var tracker = {tracking: $scope.newEntry.tracker, quantity: ""};
          console.log(tracker)

            if($scope.event.list_name && $scope.event.first_day || $scope.view === 'modal'){
                console.log("is you getting in here?")
                // $scope.newTodoList.list_name = $scope.name
                // $scope.newTodoList.list_type = $scope.listType
                // if($scope.eventlist_type === 'shopping'){
                //   $scope.newTodoList.budget = $scope.newEntry.budget;
                // }
                $scope.newTodoList.list_created_on = new Date()

                // $scope.newTodoList.first_day = $scope.firstDay;
                // $scope.newTodoList.category = $scope.category;

                // $scope.newTodoList.start_time =  $scope.startTime
                if($scope.data && $scope.data.date.startTime){
                  $scope.newTodoList.start_time = $scope.data.date.startTime
                }
                // $scope.newTodoList.routine = $scope.routine;
                // $scope.newTodoList.repeatDays = $scope.daysInRepeatWeekly;
                // $scope.newTodoList.end_time = $scope.endTime;

                if($scope.event.first_day && $scope.event.endTime){
                  getHours()
                }

                if($scope.event.repeatInterval){
                    // $scope.newTodoList.list_reocurring = $scope.repeatInterval
                    $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
                }


                var date = $scope.event.first_day;
                var newDate = date.getFullYear()+"-"+month+"-"+date.getDate()
                if($scope.event.repeatInterval !== 'Weekly'){
                  createListOfLists.push( {
                    date: newDate,
                    name: $scope.event.name,
                    duration: $scope.newTodoList.duration,
                    start_time: $scope.newTodoList.start_time,
                    end_time: $scope.newTodoList.end_time,
                    tasks: [],
                    tracker: tracker
                  } )
                }
                var count = date.getDate();

                var lastDay = numberOfDaysInMonth

                if($scope.event.reoccurEnds){
                  if($scope.event.reoccurEnds === "SelectDate"){

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

                if($scope.event.repeatInterval === 'Daily'){
                  // createRepeater(year, month, count, lastDay, 1)

                  while(count < lastDay){
                    count = count + 1
                    var list = year+"-"+month+"-"+count
                    createListOfLists.push(
                      { date: list,
                        name: $scope.event.name,
                        duration: $scope.newTodoList.duration,
                        start_time: $scope.newTodoList.start_time,
                        end_time: $scope.newTodoList.end_time,
                        tasks: [],
                        tracker: tracker
                      })
                     var date = $scope.event.first_day
                  }
                }

                if($scope.event.repeatInterval === 'Weekly'){
                  var dayOfFirstDay = $scope.event.first_day.getDay();
                  var index = 0;
                  var additionalDays = [];
                  for(var property in $scope.event.daysInRepeatWeekly) {
                    if ($scope.event.daysInRepeatWeekly.hasOwnProperty(property)) {
                        if($scope.event.daysInRepeatWeekly[property]){
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
                      createListOfLists.push( {
                        date: list,
                        name: $scope.event.name,
                        duration: $scope.newTodoList.duration,
                        start_time: $scope.newTodoList.start_time,
                        end_time: $scope.newTodoList.end_time,
                        tasks: [],
                        tracker: tracker
                      })
                      repeatAdditionalDays(count, 7, lastDay, year, month, list, $scope.newTodoList.start_time, $scope.newTodoList.end_time, tracker)
                    })
                  } else {
                      var list = year+"-"+month+"-"+count;
                      createListOfLists.push( {
                        date: list,
                        name: $scope.event.name,
                        duration: $scope.newTodoList.duration,
                        start_time: $scope.newTodoList.start_time,
                        end_time: $scope.newTodoList.end_time,
                        tasks: [],
                        tracker: tracker
                      })
                      repeatAdditionalDays(count, 7, lastDay, year, month, list, $scope.newTodoList.start_time, $scope.newTodoList.end_time, tracker)
                      // count = count + 7;
                    // }
                  }
                }//end of weekly conditional

                if($scope.repeatInterval === 'Monthly'){
                  while(month < 12){
                    month = month+1
                    var list = year+"-"+month+"-"+count
                    createListOfLists.push( {
                      date: list,
                      name: $scope.event.name,
                      duration: $scope.newTodoList.duration,
                      start_time: $scope.newTodoList.start_time,
                      end_time: $scope.newTodoList.end_time,
                      tasks: [],
                      tracker: tracker } )
                  }
                }
                // I recreated the new object to get rid of new Todo() junk which I thought was causing issues
                // $scope.newCalTodoLists is a dependency that gets injected into the calendar directive

                $scope.newCalTodoLists = [{list_name: $scope.name, lists: createListOfLists}]
                $scope.newCalTodoLists[0].first_day = $scope.first_day;
                $scope.newCalTodoLists[0].list_reocurring = $scope.newTodoList.list_reocurring;
                $scope.newCalTodoLists[0].list_recur_end = $scope.newTodoList.list_recur_end;
                $scope.newCalTodoLists[0].list_type = $scope.newTodoList.list_type;
                $scope.newCalTodoLists[0].budget = $scope.newTodoList.budget;
                $scope.newCalTodoLists[0].category = $scope.newTodoList.category;
                $scope.newCalTodoLists[0].routine = $scope.routine;
                $scope.newCalTodoLists[0].repeatDays = $scope.daysInRepeatWeekly;

                // --------> created the below to try and create a more accurate system to inform the FE on how how many lists should be in   each month but it got complicated and wasn't working as desigend so I scrapped it, but don't want to delete forever

                // $scope.newCalTodoLists[0].listsInMonths = [];
                // var monthNames = DateService.monthNames;
                // if($scope.newTodoList.list_reocurring === "Daily"){
                //   var expectedNumOfList = 30;
                // } else if ($scope.newTodoList.list_reocurring === "Monthly"){
                //   var expectedNumOfList = 1;
                // } else if($scope.newTodoList.list_reocurring === "Weekly"){
                //   var expectedNumOfList = 4;
                // }
                //
                // for(var m = 1; m < monthNames.length; m++){
                //   if(m === month){
                //     $scope.newCalTodoLists[0].listsInMonths.push(
                //       { month: monthNames[m],
                //         monthNumber: m,
                //         year: year,
                //         numberOfLists: createListOfLists.length,
                //         expectedNumOfList: expectedNumOfList
                //       })
                //   } else if (m > month) {
                //     $scope.newCalTodoLists[0].listsInMonths.push(
                //       { monthName: monthNames[m],
                //         monthNumber: m,
                //         year: year,
                //         numberOfLists: 0,
                //         expectedNumOfList: expectedNumOfList
                //       })
                //   } else if (m < month){
                //     $scope.newCalTodoLists[0].listsInMonths.push(
                //       { monthName: monthNames[m],
                //         monthNumber: m,
                //         year: year,
                //         numberOfLists: 0,
                //         expectedNumOfList: 0
                //       })
                //   }
                // }
                // --------> created the above to try and create a more accurate system to inform the FE on how how many lists should be in   each month but it got complicated and wasn't working as desigend so I scrapped it, but don't want to delete forever


                // $scope.newTodoList instantiates todo above (aka $scope.newTodoList = new Todo() )

                $scope.newTodoList.lists = createListOfLists;
                $scope.newCalTodoLists[0].start_time =  $scope.newTodoList.start_time
                $scope.newCalTodoLists[0].end_time =  $scope.endTime
                // newCal is scoped to newCalTodoLists, which is $watched in calendar directive.  Has to be sent in array because that is what is expected in calednar directive

                console.log($scope.newTodoList)
                $scope.newTodoList.$save().then(function(res){
                  console.log("$scope.newTodoList.$save success")
                  if($scope.data){
                    $scope.saved = true
                  }
                })

                var pushNew = {
                  origin: 'add-new-call-item-directive',
                  todo: $scope.newCalTodoLists[0],
                  modifiedDateList: $scope.newCalTodoLists[0].lists
                };

                // $scope.data is only passed in when the add new MODAL is being used, comes from the calendar directive
                if($scope.data){
                  // in the calendar directive I pass the entire scope into the data object, which inherits it's scope from the IndexController
                    // decided to it this way because scope.pickCorrectDateForCal puts EVERYTING you send it on the calendar and I didn't want to duplicate logic already in IndexController
                    // console.log($scope.newCalTodoLists)
                  $scope.data.scope.$parent.verifyCloneList($scope.newCalTodoLists[0]);

                } else {
                  // new events from side rail use isolated directive scope
                  $scope.newCal = [$scope.newCalTodoLists[0]]
                  $scope.$parent.listForCal.push(pushNew)

                }

                // clears the input fields for new additions
                  $scope.event = {}
                // $scope.event.name = ""
                // $scope.repeatInterval = ""
                // $scope.firstDay = ""
                // $scope.entryType = ""
                // $scope.startTime = ""
                // $scope.endTime = ""
                // $scope.newEntry.budget = ""
                // $scope.routine = ""
                // $scope.newEntry.tracker = ""

              // } this is needed when the conditional is in place to see if it's a List or Event (event deprecated on 3/19)
            }
          }
          // end of create()
      }
    }
  }
})();
