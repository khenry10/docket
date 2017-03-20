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
      $scope: {
        source: "=view"
      },
      link: function($scope){
        console.log($scope.source)
        console.log("this is addNewCalItem directive")

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

        $scope.create = function(){
          $scope.newTodoList = new Todo();
          var year = $scope.firstDay.getFullYear();
          var month = $scope.firstDay.getMonth()+1;
          var date = $scope.firstDay.getDate();
          var numberOfDaysInMonth = new Date(year, month, 0).getDate()
            console.log($scope.firstDay)

            // conditional checker to ensure sufficient info has been filled out
            if($scope.name && $scope.firstDay){
            //   // can probably get rid of the below since I decided today that Event will be deprecated
            //   if($scope.entryType === 'Event') {
            //     $scope.newEvent.name = $scope.name
            //     $scope.newEvent.first_day = $scope.firstDay
            //     $scope.newEvent.$save().then(function(response){
            //     })
            //   }

              // if($scope.entryType === 'List'){
                console.log($scope.repeatInterval)

                $scope.newTodoList.list_name = $scope.name
                $scope.newTodoList.list_created_on = new Date()
                $scope.newTodoList.first_day = $scope.firstDay
                $scope.newTodoList.start_time =  $scope.startTime
                $scope.newTodoList.end_time = $scope.endTime
                console.log($scope.newTodoList)

                if($scope.repeatInterval){
                    $scope.newTodoList.list_reocurring = $scope.repeatInterval
                    $scope.newTodoList.list_recur_end = $scope.reoccurEnds === 'Never'? 'Never':$scope.reoccurEndsDate;
                }

                // moving to a new, outside function
                // $scope.newMasterLists = []

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

                $scope.newTodoList.$save().then(function(res){
                  console.log("$scope.newTodoList.$save success")
                })

                // below function is in master-tasks.js, which may be causing the scoping issue with clearing input fields
                $scope.newMasterListAddition($scope.newCalTodoLists[0])

                // verifyCloneList function works off of $scope.allTodoLists,
                $scope.newCalTodoLists[0].start_time =  $scope.startTime
                $scope.newCalTodoLists[0].end_time =  $scope.endTime

                console.log($scope.newCalTodoLists[0])
                $scope.allTodoLists.push($scope.newCalTodoLists[0])

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
