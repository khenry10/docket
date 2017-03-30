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
        newMaster: "&",
        saved: "=saved",
        newCal: "=newCal",
        dateTracker: "=dateTracker"
      },
      link: function($scope){
        console.log($scope)
        console.log($scope.data)

        console.log("this is addNewCalItem directive")
        $scope.times = ["1:00am", "2:00am", "3:00am", "4:00am", "5:00am", "6:00am", "7:00am",
        "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm",
        "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm", "11:00pm", "12:00am"]

        $scope.reoccurs = ['None','Daily', 'Weekly', 'Monthly', 'Yearly']

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

        // not being used yet, ran into too many other bugs 3/18/2017
          // var createRepeater = function(year, month, count, lastDay, increment){
          //   console.log(year)
          //   console.log(month)
          //   console.log(count)
          //   console.log(lastDay)
          //   console.log(increment)
          //   while(count < lastDay){
          //     count = count + increment
          //     var list = year+"-"+month+"-"+count
          //     $scope.newMasterLists.push( { date: list, tasks: [] } )
          //      var date = $scope.firstDay
          //   }
          // }

          var getHours = function(){
            console.log("$scope.startTime = " + $scope.startTime)
            console.log("$scope.endTime = " + $scope.endTime)

            if($scope.newTodoList.start_time){
              $scope.startTime = $scope.newTodoList.start_time
            }
            console.log($scope.startTime)
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
            console.log("timeDifference = " + timeDifference)
            $scope.newTodoList.duration = timeDifference
            // if(startTimeAmOrPm === endTimeAmOrPm ){
            //   $scope.newTodoList.duration = timeDifference
            // } else if(startTimeAmOrPm != endTimeAmOrPm){
            //
            // }
          }

        var createListOfLists = []

        $scope.create = function(){
          console.log($scope)
          $scope.newTodoList = new Todo();

          console.log("name = "+ $scope.name)
          if($scope.data){
            console.log($scope.data)
            $scope.firstDay = new Date($scope.data.date.year, $scope.data.date.month-1, $scope.data.date.date)
          }
          console.log($scope.firstDay)
          var year = $scope.firstDay.getFullYear();
          var month = $scope.firstDay.getMonth()+1;
          var date = $scope.firstDay.getDate();
          var numberOfDaysInMonth = new Date(year, month, 0).getDate()
            console.log($scope.firstDay)

            if($scope.name && $scope.firstDay || $scope.view === 'modal'){

                console.log($scope.repeatInterval)

                $scope.newTodoList.list_name = $scope.name
                $scope.newTodoList.list_created_on = new Date()

                $scope.newTodoList.first_day = $scope.firstDay

                $scope.newTodoList.start_time =  $scope.startTime
                if($scope.data && $scope.data.date.startTime){
                  $scope.newTodoList.start_time = $scope.data.date.startTime
                }
                console.log($scope.newTodoList.start_time)

                $scope.newTodoList.end_time = $scope.endTime
                if($scope.firstDay && $scope.endTime){
                  getHours()
                }

                console.log($scope.newTodoList)
                console.log($scope.newTodoList.duration)

                if($scope.repeatInterval){
                    $scope.newTodoList.list_reocurring = $scope.repeatInterval
                    $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
                }

                var date = $scope.firstDay
                var newDate = date.getFullYear()+"-"+month+"-"+date.getDate()
                console.log($scope)
                console.log(createListOfLists)
                createListOfLists.push( {date: newDate, tasks: []} )
                console.log(createListOfLists)
                var count = date.getDate();

                var lastDay = numberOfDaysInMonth

                if($scope.reoccurEnds){
                  if($scope.reoccurEnds === "SelectDate"){

                    var calendar = $scope.dateTracker? $scope.dateTracker : $scope.data.dateTracker
                    console.log(calendar)

                    var endDateMonth = $scope.reoccurEndsDate.getMonth()+1
                    var endDateYear = $scope.reoccurEndsDate.getFullYear()

                    if(calendar.year === endDateYear){
                      if(calendar.monthCount === endDateMonth){
                        var lastDay = $scope.reoccurEndsDate.getDate()
                      }
                    }

                  }
                }
                console.log("lastDay = " + lastDay)

                if($scope.repeatInterval === 'Daily'){
                  // createRepeater(year, month, count, lastDay, 1)

                  while(count < lastDay){
                    console.log(lastDay)
                    count = count + 1
                    var list = year+"-"+month+"-"+count
                    createListOfLists.push( { date: list, tasks: [] } )
                     var date = $scope.firstDay
                  }
                }

                if($scope.repeatInterval === 'Weekly'){
                  // count = count+7
                  // createRepeater(year, month, count, lastDay, 7)
                  console.log(JSON.stringify(createListOfLists))
                  while(count+7 <= lastDay){
                    count = count + 7
                    var list = year+"-"+month+"-"+count
                    createListOfLists.push( { date: list, tasks: [] } )
                     var date = $scope.firstDay
                  }
                  console.log(JSON.stringify(createListOfLists))
                }

                if($scope.repeatInterval === 'Monthly'){
                  console.log("Monthly")
                  // createRepeater(year, count, month, lastDay, 1)
                  while(month < 12){
                    month = month+1
                    var list = year+"-"+month+"-"+count
                    createListOfLists.push( { date: list, tasks: [] } )
                    console.log(createListOfLists)
                  }
                }
                // I recreated the new object to get rid of new Todo() junk which I thought was causing issues
                // $scope.newCalTodoLists is a dependency that gets injected into the calendar directive
                console.log(JSON.stringify(createListOfLists))
                $scope.newCalTodoLists = [{list_name: $scope.name, lists: createListOfLists}]
                $scope.newCalTodoLists[0].first_day = $scope.firstDay
                $scope.newCalTodoLists[0].list_reocurring = $scope.newTodoList.list_reocurring
                $scope.newCalTodoLists[0].list_recur_end =$scope.newTodoList.list_recur_end

                console.log("$scope.newCalTodoLists below: ")
                console.log($scope.newCalTodoLists)
                console.log(JSON.stringify(createListOfLists))

                // $scope.newTodoList instantiates todo above (aka $scope.newTodoList = new Todo() )
                $scope.newTodoList.lists = createListOfLists

                $scope.newCalTodoLists[0].start_time =  $scope.newTodoList.start_time
                $scope.newCalTodoLists[0].end_time =  $scope.endTime
                // newCal is scoped to newCalTodoLists, which is $watched in calendar directive.  Has to be sent in array because that is what is expected in calednar directive

                // got an error that this wasn't defined when adding by modal
                // $scope.newCal = [$scope.newCalTodoLists[0]]

                console.log($scope.newTodoList)
                console.log($scope.newTodoList.lists[5])
                $scope.newTodoList.$save().then(function(res){
                  console.log("$scope.newTodoList.$save success")
                  if($scope.data){
                    $scope.saved = true
                  }
                })

                console.log($scope.data)
                // $scope.data is only passed in when the modal is being used
                if($scope.data){
                  // new events through the modal all use methods provided by $scope.data
                  $scope.data.checkLists("from add-new-cal-item",[$scope.newCalTodoLists[0]])
                  $scope.data.newMaster($scope.newCalTodoLists[0])
                } else {
                  // new events from side rail use isolated directive scope
                  $scope.newCal = [$scope.newCalTodoLists[0]]
                  // below function is in master-tasks.js, which may be causing the scoping issue with clearing input fields
                  // since below function is from an external controller, we have to pass the parameter as an object literal, they key must match the parameter name in index.html
                  $scope.newMaster({newMaster: $scope.newCalTodoLists[0]})
                }

                // clears the input fields for new additions
                $scope.name = ""
                $scope.repeatInterval = ""
                $scope.firstDay = ""
                $scope.entryType = ""
                $scope.startTime = ""
                $scope.endTime = ""
              // } this is needed when the conditional is in place to see if it's a List or Event (event deprecated on 3/19)
            }
          }
          // end of create()
      }
    }
  }
})();
