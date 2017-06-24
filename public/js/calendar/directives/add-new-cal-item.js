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
        dateTracker: "=dateTracker"
      },
      link: function($scope){
        console.log("this is addNewCalItem directive")
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

        $scope.changeEndTimeArray = function(){
          console.log("changeEndTimeArray envoked")
          if($scope.startTime){
            var start = $scope.times.indexOf($scope.startTime)
          } else {
            var start = $scope.times.indexOf($scope.data.date.startTime);
          }
          $scope.endTime = $scope.times[start+1]
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
            var startTime = $scope.startTime.split(":")
            var startTimeAmOrPm = startTime[1].substr(2,4)
            var startTime = startTime[0]

            var endTime = $scope.endTime.split(":")
            var endTimeAmOrPm = endTime[1].substr(2,4)
            var endTime = endTime[0]

            var timeDifference = endTime - startTime
            // below is to account for when something starts in the am and ends in the pm
            if(timeDifference < 0){
              var time = 12 - startTime
              var timeDifference = time + endTime
            }
            $scope.newTodoList.duration = timeDifference
          }

        var createListOfLists = []

        $scope.newEntry = {}

        var repeatAdditionalDays = function(count, incrementor, lastDay, year, month, list, startTime, endTime){
          while(count+incrementor <= lastDay){
            count = count + 7
            var list = year+"-"+month+"-"+count;
            console.log("list = "  + list)
            createListOfLists.push( {
              date: list,
              duration: $scope.newTodoList.duration,
              start_time: $scope.newTodoList.start_time,
              end_time: $scope.newTodoList.end_time,
              tasks: [] } )
            //  var date = $scope.firstDay
          }
        };

        $scope.create = function(){
          console.log("create")
          $scope.newTodoList = new Todo();

          if($scope.data){
            $scope.firstDay = new Date($scope.data.date.year, $scope.data.date.month-1, $scope.data.date.date)
          }

          var year = $scope.firstDay.getFullYear();
          var month = $scope.firstDay.getMonth()+1;
          var date = $scope.firstDay.getDate();
          var numberOfDaysInMonth = new Date(year, month, 0).getDate()

            if($scope.name && $scope.firstDay || $scope.view === 'modal'){
                $scope.newTodoList.list_name = $scope.name
                $scope.newTodoList.list_type = $scope.listType
                if($scope.listType === 'shopping'){
                  $scope.newTodoList.budget = $scope.newEntry.budget;
                }
                $scope.newTodoList.list_created_on = new Date()

                $scope.newTodoList.first_day = $scope.firstDay;
                $scope.newTodoList.category = $scope.category;

                $scope.newTodoList.start_time =  $scope.startTime
                if($scope.data && $scope.data.date.startTime){
                  $scope.newTodoList.start_time = $scope.data.date.startTime
                }
                $scope.newTodoList.routine = $scope.routine;
                $scope.newTodoList.repeatDays = $scope.daysInRepeatWeekly;
                $scope.newTodoList.end_time = $scope.endTime;
                if($scope.firstDay && $scope.endTime){
                  getHours()
                }

                if($scope.repeatInterval){
                    $scope.newTodoList.list_reocurring = $scope.repeatInterval
                    $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
                }

                var date = $scope.firstDay;
                var newDate = date.getFullYear()+"-"+month+"-"+date.getDate()
                if($scope.repeatInterval !== 'Weekly'){
                  createListOfLists.push( {
                    date: newDate,
                    duration: $scope.newTodoList.duration,
                    start_time: $scope.newTodoList.start_time,
                    end_time: $scope.newTodoList.end_time,
                    tasks: []
                  } )
                }
                var count = date.getDate();

                var lastDay = numberOfDaysInMonth

                if($scope.reoccurEnds){
                  if($scope.reoccurEnds === "SelectDate"){

                    var calendar = $scope.dateTracker? $scope.dateTracker : $scope.data.dateTracker

                    var endDateMonth = $scope.reoccurEndsDate.getMonth()+1
                    var endDateYear = $scope.reoccurEndsDate.getFullYear()

                    if(calendar.year === endDateYear){
                      if(calendar.monthCount === endDateMonth){
                        var lastDay = $scope.reoccurEndsDate.getDate()
                      }
                    }

                  }
                }

                if($scope.repeatInterval === 'Daily'){
                  // createRepeater(year, month, count, lastDay, 1)

                  while(count < lastDay){
                    count = count + 1
                    var list = year+"-"+month+"-"+count
                    createListOfLists.push(
                      { date: list,
                        duration: $scope.newTodoList.duration,
                        start_time: $scope.newTodoList.start_time,
                        end_time: $scope.newTodoList.end_time,
                        tasks: []
                      })
                     var date = $scope.firstDay
                  }
                }

                if($scope.repeatInterval === 'Weekly'){
                  var dayOfFirstDay = $scope.firstDay.getDay();
                  var index = 0;
                  var additionalDays = [];
                  for(var property in $scope.daysInRepeatWeekly) {
                    if ($scope.daysInRepeatWeekly.hasOwnProperty(property)) {
                        if($scope.daysInRepeatWeekly[property]){
                          additionalDays.push(index)
                        }
                        index = index +1;
                    }
                  }
                  console.log(additionalDays)
                  console.log("additionalDays.length = " + additionalDays.length)
                  if(additionalDays.length){
                    additionalDays.forEach(function(day){
                      var count = date.getDate();
                      var adjuster = day - dayOfFirstDay;
                      count = count + adjuster;
                      var list = year+"-"+month+"-"+count;
                      // pushed a date list here because repeats in the first week weren't being added
                      createListOfLists.push( {
                        date: list,
                        duration: $scope.newTodoList.duration,
                        start_time: $scope.newTodoList.start_time,
                        end_time: $scope.newTodoList.end_time,
                        tasks: []
                      })
                      repeatAdditionalDays(count, 7, lastDay, year, month, list, $scope.newTodoList.start_time, $scope.newTodoList.end_time)
                    })
                  } else {
                    console.log("else statement of additionalDays.length ")
                    // while(count < lastDay){
                      console.log("count = " + count)
                      var list = year+"-"+month+"-"+count;
                      console.log("list = " + list)
                      createListOfLists.push( {
                        date: list,
                        duration: $scope.newTodoList.duration,
                        start_time: $scope.newTodoList.start_time,
                        end_time: $scope.newTodoList.end_time,
                        tasks: []
                      })
                      repeatAdditionalDays(count, 7, lastDay, year, month, list, $scope.newTodoList.start_time, $scope.newTodoList.end_time)
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
                      duration: $scope.newTodoList.duration,
                      start_time: $scope.newTodoList.start_time,
                      end_time: $scope.newTodoList.end_time,
                      tasks: [] } )
                  }
                }
                // I recreated the new object to get rid of new Todo() junk which I thought was causing issues
                // $scope.newCalTodoLists is a dependency that gets injected into the calendar directive

                $scope.newCalTodoLists = [{list_name: $scope.name, lists: createListOfLists}]
                $scope.newCalTodoLists[0].first_day = $scope.firstDay;
                $scope.newCalTodoLists[0].list_reocurring = $scope.newTodoList.list_reocurring;
                $scope.newCalTodoLists[0].list_recur_end = $scope.newTodoList.list_recur_end;
                $scope.newCalTodoLists[0].list_type = $scope.newTodoList.list_type;
                $scope.newCalTodoLists[0].budget = $scope.newTodoList.budget;
                $scope.newCalTodoLists[0].category = $scope.newTodoList.category;
                $scope.newCalTodoLists[0].routine = $scope.routine;
                $scope.newCalTodoLists[0].repeatDays = $scope.daysInRepeatWeekly;

                $scope.newCalTodoLists[0].listsInMonths = [];
                var monthNames = DateService.monthNames;

                if($scope.newTodoList.list_reocurring === "Daily"){
                  var expectedNumOfList = 30;
                } else if ($scope.newTodoList.list_reocurring === "Monthly"){
                  var expectedNumOfList = 1;
                } else if($scope.newTodoList.list_reocurring === "Weekly"){
                  var expectedNumOfList = 4;
                }

                for(var m = 1; m < monthNames.length; m++){
                  if(m === month){
                    $scope.newCalTodoLists[0].listsInMonths.push(
                      { month: monthNames[m],
                        monthNumber: m,
                        year: year,
                        numberOfLists: createListOfLists.length,
                        expectedNumOfList: expectedNumOfList
                      })
                  } else if (m > month) {
                    $scope.newCalTodoLists[0].listsInMonths.push(
                      { monthName: monthNames[m],
                        monthNumber: m,
                        year: year,
                        numberOfLists: 0,
                        expectedNumOfList: expectedNumOfList
                      })
                  } else if (m < month){
                    $scope.newCalTodoLists[0].listsInMonths.push(
                      { monthName: monthNames[m],
                        monthNumber: m,
                        year: year,
                        numberOfLists: 0,
                        expectedNumOfList: 0
                      })
                  }
                }

                // $scope.newTodoList instantiates todo above (aka $scope.newTodoList = new Todo() )
                $scope.newTodoList.listsInMonths = $scope.newCalTodoLists[0].listsInMonths;
                $scope.newTodoList.lists = createListOfLists;

                $scope.newCalTodoLists[0].start_time =  $scope.newTodoList.start_time
                $scope.newCalTodoLists[0].end_time =  $scope.endTime
                // newCal is scoped to newCalTodoLists, which is $watched in calendar directive.  Has to be sent in array because that is what is expected in calednar directive

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
                $scope.name = ""
                $scope.repeatInterval = ""
                $scope.firstDay = ""
                $scope.entryType = ""
                $scope.startTime = ""
                $scope.endTime = ""
                $scope.newEntry.budget = ""
                $scope.routine = ""
              // } this is needed when the conditional is in place to see if it's a List or Event (event deprecated on 3/19)
            }
          }
          // end of create()
      }
    }
  }
})();
