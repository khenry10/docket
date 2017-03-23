"use strict";

(function(){
  angular
  .module("app")
  .directive("addNewCalItem", [
    "Todo",
    createNewCalItem
  ])

  function createNewCalItem(Todo){
    return {
      templateUrl: "/assets/html/calendar/directives/add-new-cal-item.html",
      scope: {
        data: "=data",
        newMaster: "&",
        saved: "=saved",
        newCal: "=newCal"
      },
      link: function($scope){
        console.log($scope)
        console.log($scope.data)

        console.log("this is addNewCalItem directive")
        $scope.times = ["1:00am", "2:00am", "3:00am", "4:00am", "5:00am", "6:00am", "7:00am",
        "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm",
        "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm", "11:00pm", "12:00am"]

        $scope.reoccurs = ['None','Daily', 'Weekly', 'Monthly', 'Yearly']

        // not being used yet, ran into too many other bugs 3/18/2017
          var createRepeater = function(year, month, count, lastDay, increment){
            console.log(year)
            console.log(month)
            console.log(count)
            console.log(lastDay)
            console.log(increment)
            while(count < lastDay){
              count = count + increment
              var list = year+"-"+month+"-"+count
              $scope.newMasterLists.push( { date: list, tasks: [] } )
               var date = $scope.firstDay
            }
          }

        $scope.newMasterLists = []

        $scope.create = function(){
          console.log($scope)
          $scope.newTodoList = new Todo();

          console.log($scope.firstDay)
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

                console.log($scope.newTodoList)

                if($scope.repeatInterval){
                    $scope.newTodoList.list_reocurring = $scope.repeatInterval
                    $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
                }

                var date = $scope.firstDay
                var newDate = date.getFullYear()+"-"+month+"-"+date.getDate()
                $scope.newMasterLists.push( {date: newDate, tasks: []} )
                var count = date.getDate();

                var lastDay = numberOfDaysInMonth

                if($scope.reoccurEnds){
                  console.log($scope.reoccurEnds)

                  if($scope.reoccurEnds === "SelectDate"){
                    console.log($scope.date)

                    var endDateMonth = $scope.reoccurEndsDate.getMonth()
                    var endDateYear = $scope.reoccurEndsDate.getFullYear()
                    if($scope.calendarYear === endDateYear){
                      if($scope.calendarMonth === endDateMonth){
                        var lastDay = $scope.reoccurEndsDate.getDate()
                      }
                    }

                  }
                }
                console.log(lastDay)

                if($scope.repeatInterval === 'Daily'){
                  // createRepeater(year, month, count, lastDay, 1)

                  while(count < lastDay){
                    console.log(lastDay)
                    count = count + 1
                    var list = year+"-"+month+"-"+count
                    $scope.newMasterLists.push( { date: list, tasks: [] } )
                     var date = $scope.firstDay
                  }
                }

                if($scope.repeatInterval === 'Weekly'){
                  // count = count+7
                  // createRepeater(year, month, count, lastDay, 7)
                  while(count+7 <= lastDay){
                    count = count + 7
                    var list = year+"-"+month+"-"+count
                    $scope.newMasterLists.push( { date: list, tasks: [] } )
                     var date = $scope.firstDay
                  }
                }

                if($scope.repeatInterval === 'Monthly'){
                  console.log("Monthly")
                  // createRepeater(year, count, month, lastDay, 1)
                  while(month < 12){
                    month = month+1
                    var list = year+"-"+month+"-"+count
                    $scope.newMasterLists.push( { date: list, tasks: [] } )
                    console.log($scope.newMasterLists)
                  }
                }
                // I recreated the new object to get rid of new Todo() junk which I thought was causing issues
                // $scope.newCalTodoLists is a dependency that gets injected into the calendar directive
                $scope.newCalTodoLists = [{list_name: $scope.name, lists: $scope.newMasterLists}]
                $scope.newCalTodoLists[0].first_day = $scope.firstDay
                $scope.newCalTodoLists[0].list_reocurring = $scope.newTodoList.list_reocurring
                $scope.newCalTodoLists[0].list_recur_end =$scope.newTodoList.list_recur_end

                console.log("$scope.newCalTodoLists below: ")
                console.log($scope.newCalTodoLists)

                // $scope.newTodoList instantiates todo above (aka $scope.newTodoList = new Todo() )
                $scope.newTodoList.lists = $scope.newMasterLists

                $scope.newCalTodoLists[0].start_time =  $scope.newTodoList.start_time
                $scope.newCalTodoLists[0].end_time =  $scope.endTime
                // newCal is scoped to newCalTodoLists, which is $watched in calendar directive.  Has to be sent in array because that is what is expected in calednar directive

                console.log($scope.data)
                if($scope.data){
                  // new events trough the modal all go use methods provided by $scope.data
                  $scope.data.checkLists("from add-new-cal-item",[$scope.newCalTodoLists[0]])
                  $scope.data.newMaster($scope.newCalTodoLists[0])
                } else {
                  // new events from side rail use isolated directive scope
                  $scope.newCal = [$scope.newCalTodoLists[0]]
                  // below function is in master-tasks.js, which may be causing the scoping issue with clearing input fields
                  // since below function is from an external controller, we have to pass the parameter as an object literal, they key must match the parameter name in index.html
                  $scope.newMaster({newMaster: $scope.newCalTodoLists[0]})
                }

                // got an error that this was defined when adding by modal
                // $scope.newCal = [$scope.newCalTodoLists[0]]

                $scope.newTodoList.$save().then(function(res){
                  console.log("$scope.newTodoList.$save success")
                  if($scope.data){
                    $scope.saved = true
                  }
                })

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
