"use strict";

(function(){
  angular
  .module("app")
  .directive("monthlyCalendar", [
    "Events",
    "Todo",
    "ModalService",
    calendarDirectiveFunction
  ])

  function calendarDirectiveFunction(Events, Todo, ModalService){
    return {
      templateUrl: "/assets/html/_calendar.html",
      scope: {
        date: '=changeDate',
        current: '=currentMonth',
        todoList: '=list',
        newtodoLists: '=new',
        newView: "=view"
      },
      link: function(scope){

      console.log("view = " + scope.newView)

      var pullTodo = function (){
        console.log("pullTodo called")
        console.log(scope.todoList)
        scope.pulledTodoList = Todo.all
        if(scope.todoList && scope.todoList.length === 1){
          scope.pulledTodoList.push(scope.todoList[0])
        }
        console.log(scope.pulledTodoList)
        checkLists('new pullTodo function', scope.pulledTodoList)
      }

      scope.$watch('newView', function(newView, oldView){
        console.log("newView = " + newView)
        console.log(date.getMonth()+1)
        console.log(scope.date)
        var dayCountLength = scope.date.dayCount.length-1;
        if(scope.date.twoMonthsWeekly){
          // looks to see if the month view is made up more of the current or next month to decide which to show on monthly view
          if(scope.date.dayCount[dayCountLength-3] < 7){
            monthSelector(scope.date.monthCount)
            checkLists('newView $watch', scope.pulledTodoList)
          } else {
            monthSelector(scope.date.monthCount-1)
            checkLists('newView $watch', scope.pulledTodoList)
            scope.date.monthCount = scope.date.monthCount-1
          }
        } else {
          monthSelector(date.getMonth()+1)
          checkLists('newView $watch', scope.pulledTodoList)
        }
        if(newView === 'month'){
          console.log("TRIGGERED")
          scope.date.weekCount = 0;
          scope.date.twoMonthsWeekly = false;
          scope.date.dayCount = [];
        }
      }, true)

      scope.$watch('date', function(newDate, oldValue){
        console.log("month $watch called. newDate below: ")
        console.log(newDate)
        var todoList = scope.todolist
        monthSelector(newDate.monthCount)
        pullTodo()
      }, true);

      scope.$watch('current', function(newValue, oldValue){
        console.log("current $watch called")
        // console.log(newValue)
        if(newValue){
          var currentMonth = date.getMonth()+1
          var currentYear = date.getFullYear()
        }
      }, true);

      // I do not think this is neeeded, but I'm scared to delete 3/18/2017
      // scope.$watch('todoList', function(newValue, oldValue){
      //   console.log("todolist $watch called")
      //   console.log(scope.todoList)
      //   console.log(newValue)
      //   console.log(oldValue)
      //
      //   var todoList = scope.todoList
      //   if(scope.todoList){
      //       checkLists('todoList $watch', todoList)
      //   }
      // }, true);

      scope.$watch('newtodoLists', function(newValue, oldValue){
        console.log("newtodoLists $watch called")
        console.log(scope.todoList)
        console.log(newValue)
        scope.todoList = newValue
        if(newValue){
            checkLists('newTodoList $watch', newValue)
        }
      }, false);

      scope.testModal = function (list, date){
        ModalService.showModal({
          templateUrl: "/assets/html/todo/modal-test.html",
          controller: "modalController",
          inputs: {
            data: list,
            date: date
          }
        }).then(function(modal) {
          //it's a bootstrap element, use 'modal' to show it
          modal.element.modal();
          modal.close.then(function(result) {
            console.log(result);
          });
        });
      }

        var monthName = ["no month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var daysOfWeek = ["","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        var date = new Date()
        var year = date.getFullYear()

        var createHourlyCalItem = function(list, time, date, realListDate, timeStructure){
          // console.log("date = ")
          // console.log(date)
          console.log("realListDate = " + realListDate)

          // creates and appends the new calendar items to the calendar
          var bigTdContainer = document.getElementsByClassName(time)
          var pForBigTd = document.createElement('p')
          pForBigTd.setAttribute("id", list._id+date.date)
          if(timeStructure === 'startTime'){
            pForBigTd.innerHTML = list.list_name
          }
          bigTdContainer = bigTdContainer[realListDate.getDay()+1]
          bigTdContainer.addEventListener("click", function() {
            scope.testModal(list, date.date)
          })
          bigTdContainer.setAttribute("id", "time-with-entry")
          pForBigTd.setAttribute("class", timeStructure)
          bigTdContainer.appendChild(pForBigTd)
        }

        var addMiddleTimeCalItems = function(startTime, endTime, amOrpm, list, date, realListDate){
          // addMiddleTimeCalItems function is to determine how many hours between start and end time need to be appended to teh calendar for each item
          for(var t = startTime; t <= endTime; t++){
            var time = t + ":00" + amOrpm
            createHourlyCalItem(list, time, date, realListDate, "middleTime")
          }
        }

        var putHourlyItemsOnWeeklyCalendar = function(list, date, realListDate){
          console.log("list.start_time = " + list.start_time)
          console.log("list.end_time = " + list.end_time)
          // this function processes the calendar item's details, like start and end end time am/pm and how many hours, and calls createHourlyCalItem and addMiddleTimeCalItems functions
          createHourlyCalItem(list, list.start_time, date, realListDate, "startTime")

          var startTime = list.start_time.split(":")
          var startTimeAmOrPm = startTime[1].substr(2,4)
          var startTime = startTime[0]

          var endTime = list.end_time.split(":")
          var endTimeAmOrPm = endTime[1].substr(2,4)
          var endTime = endTime[0]
          var originalEndTime = endTime

          var timeDifference = endTime - startTime
          // below is to account for when something starts in the am and ends in the pm
          if(timeDifference < 0){
            var time = 12 - startTime
            var timeDifference = time + endTime
          }
          console.log("timeDifference = " + timeDifference)

          if(startTimeAmOrPm === endTimeAmOrPm && timeDifference === 2){
            var endTime = endTime -1
            var endTime = endTime + ":00" + endTimeAmOrPm
            createHourlyCalItem(list, endTime, date, realListDate, "middleTime")
          } else if (timeDifference > 1) {
            var startTime = parseInt(startTime)+1
            var startTime = startTime >= 12? 12: startTime
            var endTime = parseInt(endTime)-1
            var endTime = endTime >= 12? 12: endTime

            if(startTimeAmOrPm === endTimeAmOrPm){
              addMiddleTimeCalItems(startTime, endTime, startTimeAmOrPm, list, date, realListDate)
            } else if(startTimeAmOrPm != endTimeAmOrPm && startTimeAmOrPm === "am"){
              addMiddleTimeCalItems(startTime, 11, "am", list, date, realListDate)
              addMiddleTimeCalItems(12, 12, "pm", list, date, realListDate)
              if(originalEndTime != 12 && endTimeAmOrPm === 'pm'){
                addMiddleTimeCalItems(1, endTime, "pm", list, date, realListDate)
              }
            } else if (startTimeAmOrPm != endTimeAmOrPm && startTimeAmOrPm === "pm") {
              addMiddleTimeCalItems(startTime, 12, "pm", list, date, realListDate)
              addMiddleTimeCalItems(1, endTime, "am", list, date, realListDate)
            }
          }
        }

        var appendToCalendar = function(listDay, date, list, realListDate, ul){
          var exists = document.getElementById(list._id+date.date)
          if(!exists){
            var li = document.createElement("li")
            li.setAttribute("class",'a'+listDay)
            li.setAttribute("id", list._id+date.date)
            var url = document.createElement("a")
            url.innerHTML = list.list_name;
            li.addEventListener("click", function() {
              scope.testModal(list, date.date)
            })
            li.append(url)
            if(scope.newView === 'week' && list.start_time){
              putHourlyItemsOnWeeklyCalendar(list, date, realListDate)
            }
            if(scope.newView === 'month'){
              ul[0].appendChild(li)
            }
          } else {
            console.log("EXISTS SO I DIDNT PUT ON THE CALENDAR " + list._id+date.date)
          }
        }

        var dateSplit = function(listDate, date, list){
          var listDay = listDate[2].substring(0,2)
          var listMonth = listDate[1]
          listMonth = listMonth-1
          var listYear = listDate[0]
          var realListDate = new Date(listYear, listMonth, listDay)
          appendToCalendar(listDay, date, list, realListDate)
        }

        var checkDates = function(date, list){
          // console.log("checkDates function envoked. list and then date below:")
          console.log(date)
          console.log(list)
          if(scope.newView === 'month'){
            var listDates = date.date.split("-")
            var listDay = parseInt(listDates[2].substr(0,2))
            var ul = document.getElementsByClassName("u"+listDay)
            appendToCalendar(listDay, date, list, undefined, ul)
          } else if(scope.newView === 'week') {
            // we need to use the actual date, as opposed to list.first_day like below, since it's Daily recurring
            if(list.list_reocurring === 'Daily') {
              var listDate = date.date.split("-")
              dateSplit(listDate, date, list)
            } else {
              if(typeof list.first_day == "object"){
                var realListDate = list.first_day
                var listDay = list.first_day.getDay()
                var ul = document.getElementsByClassName("w"+listDay)
                appendToCalendar(listDay, date, list, realListDate, ul)
              } else {
                  // we use list.first_day so that the calendar items appear on the correct day of the week when is recurrs weekly, monthly, yearly
                  var listDate = list.first_day.split("-")
                  dateSplit(listDate, date, list)
                }
              }
            }
        }

        var loopThroughLastDateArray = function(listDay, date, list){
          console.log("loopThroughLastDateArray FUNCTION")
            for(var v = scope.lastDate.length-1; v > scope.lastDate.length-8; v--){
              console.log(listDay === scope.lastDate[v])
              if(listDay === scope.lastDate[v]){
                console.log("putting on calendar")
                checkDates(date, list)
              }
            }
        }

        var checkWeeklyDate = function(listDay, date, list, listYear, listMonth){
          // console.log("checkWeeklyDate function.  listDay = " + listDay + " date = " + date + " listYear = " + listYear)
          var dateArrayLength = scope.lastDate.length
          var lastWeeklyDate = scope.lastDate[dateArrayLength-1]
          var firstWeeklyDate = scope.lastDate[dateArrayLength-7]
          // conditional to see if the week spans two different months

          if(scope.date.twoMonthsWeekly){
            var lastMonth = listMonth-1
            var lastDayOfOldMonth = new Date (listYear, listMonth, 0).getDate()
            var thisWeekDates = []
            for(var t = scope.lastDate.indexOf(firstWeeklyDate); t < dateArrayLength; t++){
              thisWeekDates.push(scope.lastDate[t])
            }

            if(listDay >= firstWeeklyDate && listDay <= lastDayOfOldMonth){
              if(listMonth === scope.date.monthCount-1){
                // loopThroughLastDateArray(listDay, date, list)
                checkDates(date, list)
              }
            } else if(listDay < firstWeeklyDate){
              console.log("listDay < firstWeeklyDate")
              var lastDayOfOldMonth = new Date (listYear, listMonth-1, 0).getDate()
              var indexOfLastDayOldMonth = thisWeekDates.indexOf(lastDayOfOldMonth)
              if(listMonth === scope.date.monthCount){
                console.log("listMonth = " + listMonth)
                console.log(listDay)
                for(var z = indexOfLastDayOldMonth+1; z <  thisWeekDates.length; z++){
                  if(listDay === thisWeekDates[z]){
                    loopThroughLastDateArray(listDay, date, list)
                    // checkDates(date, list)
                  }
                }
              }
            }
          } else {
            console.log("in the ELSE of checkWeeklyDate")
            console.log(listDay >= firstWeeklyDate && listDay <= lastWeeklyDate)
            console.log(listYear === year && listMonth === scope.date.monthCount)
            if(listDay >= firstWeeklyDate && listDay <= lastWeeklyDate){
              if(listYear === year && listMonth === scope.date.monthCount){
                console.log(date)
                console.log(list)
                checkDates(date, list)
              }
            }
          }
        };

      // checkLists function recieves the full todoList loops the first, and all of the date lists within to determine if it should be displayed on the calendar
        var checkLists = function(message, todoList){
          console.log("checkLists message = " + message)
          console.log(todoList)
          if(todoList){
            if(todoList.length){
              for(var k = 0; k < todoList.length; k++){
                var list = todoList[k]
                // console.log(list)
                console.log("list = " + list.list_name + " index = " + k)
                var reocurringDates = list.lists
                // need to access all of the recurring lists which are nested in reocurringDates, which is done below
                // console.log(scope.date)
                reocurringDates.forEach(function(date, index){
                  // console.log(date)
                  var listDates = date.date.split("-")

                  var listYear = parseInt(listDates[0])
                  var listMonth = parseInt(listDates[1])
                  var listDay = parseInt(listDates[2].substr(0,2))
                  var lastMonth = scope.date.monthCount-1

                  // console.log("scope.newView = " + scope.newView )
                  if(scope.newView === 'week' && scope.date.monthCount === listMonth ||
                    scope.newView === 'week' && listMonth === lastMonth){
                      console.log("sending to checkWeeklyDate()")
                    // console.log("listMonth = " + listMonth)
                    // console.log(scope.date)
                    // we send the full broken out full date date, the list itself and the full date to process further
                    checkWeeklyDate(listDay, date, list, listYear, listMonth)
                  } else {
                    if(listYear === year && listMonth === scope.date.monthCount){
                        console.log("sending to checkDates()")
                        checkDates(date, list)
                    }
                  }

                }) //end of recourringDates forEach
              } // end of todoList loop
            } else if(todoList[0]) {
              list = todoList[0];
              console.log(list)
              if(list.dates){
                list.dates.forEach(function(date){
                  checkDates(date, list)
                })
              }
            }
          }
        };

        // this doesn't work yet
        var addEventsToCalendar = function(){
          for(var i = 0; i < Events.all.length; i++ ){
            console.log(Events.all[i])
            var eventDate = Events.all[i].first_day
            var eventDate = eventDate.split("-")

            var eventYear = parseInt(eventDate[0])
            var eventMonth = parseInt(eventDate[1])
            var eventDay = parseInt(eventDate[2].substr(0,2))

            if(eventYear === year){
              if(eventMonth === month){
                if(eventDay === scope.count){
                  var li = document.createElement("li")
                  var url = document.createElement("a")
                  url.href = "/event/"+Events.all[i].name;
                  url.innerHTML = Events.all[i].name;
                  li.append(url)
                  ul.appendChild(li)
                }
              }
            }
          }
        }

        var buildTimeTable = function(tr, addTimes, index){
          console.log("buildTimeTable")
          var bigTd = tr === td? tr:document.createElement("td");
          index = index

          if(scope.todayDay === index && scope.date.weekCount === 0){
            bigTd.setAttribute("class", "today")
          }
          // bigTd.setAttribute('class', "w"+index)
          for(var y = 0; y <= 1; y++){
            // we create 1 large TD that makes up the column, only the first time creates the big TD
            if(y === 0){
              var tr2 = document.createElement("tr");
              var td = document.createElement("td");
              td.setAttribute("class", "time")
              tr2.appendChild(td)
              bigTd.appendChild(tr2)
              tr.appendChild(bigTd)
            }
            // big TD then get's the times by the below looping twice
            for(var z = 1; z <= 12; z++){
              var tr2 = document.createElement("tr");
              var td = document.createElement("td");
              td.setAttribute("id", "time")
              console.log("addTimes = " +addTimes)
              if(z === 12){
                var amOrpm = y === 0? 'pm':'am'
              } else {
                var amOrpm = y === 0? 'am':'pm'
              }
              td.setAttribute("class", z+":00"+amOrpm)
              if(addTimes){
                td.innerHTML = z + amOrpm
              }
              tr2.appendChild(td)
              bigTd.appendChild(tr2)
              tr.appendChild(bigTd)
            }
          }
          var todayWeekly = document.getElementsByClassName("todayInWeeklyView")
          todayWeekly = todayWeekly.getId
        }

        function createTDsInRows(table, td, p, tr, numberOfDays, month, year, index){
            console.log("*** createTDsInRows called.")

            if(scope.newView === "week"){
              var td = document.createElement("td")
              console.log("calling buildTimeTable from createTDsInRows!!!!!")
              buildTimeTable(tr, false, index)
            } else {

            var td = document.createElement("td");
            td.setAttribute("class", scope.newView)
            var p = document.createElement("p")
            p.setAttribute("class",  "a"+scope.count)
            if(scope.newView === 'month'){
              td.innerHTML = scope.count;
            }
            var ul = document.createElement("ul");
            ul.setAttribute("class", "u"+scope.count)
            p.appendChild(ul)
            td.appendChild(p);
            tr.appendChild(td);
            if(scope.count === date.getDate() && month === date.getMonth()+1 && year === date.getFullYear()){
              td.setAttribute("class", "today")
            }
            // Need to move the below logic into checklists function to make more efficient

              if(Events.all.length > 0){
                for(var i = 0; i < Events.all.length; i++ ){

                  var eventDate = Events.all[i].first_day
                  var eventDate = eventDate.split("-")

                  var eventYear = parseInt(eventDate[0])
                  var eventMonth = parseInt(eventDate[1])
                  var eventDay = parseInt(eventDate[2].substr(0,2))

                  if(eventYear === year){
                    if(eventMonth === month){
                      if(eventDay === scope.count){
                        var li = document.createElement("li")
                        var url = document.createElement("a")
                        url.href = "/event/"+Events.all[i].name;
                        url.innerHTML = Events.all[i].name;
                        li.append(url)
                        ul.appendChild(li)
                      }
                    }
                  }
                }
              }

              scope.count++
            }
        };

        var dyanmicRowCreator = function(rows, table, td, p, tr, numberOfDays, month, year){
          console.log("dyanmicRowCreator td = " + td)
          // we pass the number of rows to create through rows parameter to distinguish between month and weekly view. And months with 5 or 6 rows
          for(var t = 0; t < rows; t++){
            var tr = document.createElement("tr")
            if(scope.newView === 'week'){
              console.log("calling buildTimeTable from dynamicRowCreator")
              buildTimeTable(tr, true)
            }
            tr.setAttribute("class", "date-row-"+t)

            for(var i = 0; i < 7; i++){
              createTDsInRows(table, td, p, tr, numberOfDays, month, year, i);
              // scope.count++
            }
          table.appendChild(tr)
          }
        }

        var monthViewFirstDateRow = function(firstDayOfMonth, tr, table, p, numberOfDays, month, year){
          for(var i = 0; i < 7; i++){
            if(i >= firstDayOfMonth){
              break;
            }
            // this section creates a td and puts a blank string in until the loop reaches the first day of the month
              var td = document.createElement("td");
              td.setAttribute("class", "month")
              td.innerHTML = "";
              tr.appendChild(td)
          }
            scope.count = 1;
            for(; i < 7; i++){
              createTDsInRows(table, td, p, tr, numberOfDays, month, year)
              // scope.count++
            }
            table.appendChild(tr)
        }

        scope.lastDate = []

        var createWeeklyDates = function(){
          scope.todayFullDate = new Date()

          scope.todayFullDate = new Date(
            scope.todayFullDate.getFullYear(),
            scope.todayFullDate.getMonth(),
            scope.todayFullDate.getDate()+(7 * scope.date.weekCount))

          scope.todayDay = scope.todayFullDate.getDay()
          scope.TodayDate = scope.todayFullDate.getDate()
          scope.TodaysMonth = scope.todayFullDate.getMonth()
          scope.TodaysYear = scope.todayFullDate.getFullYear()
          scope.daysInMonth = new Date(scope.todayFullDate.getFullYear(), scope.todayFullDate.getMonth()+1, 0).getDate()
          document.getElementById("calendar-month-year").innerHTML = monthName[scope.TodaysMonth+1] + " " + scope.TodaysYear
        }

        var weeklyTableHeadingRow = function(th, i){
          var daysAwayFromDate = i - scope.todayDay
          daysAwayFromDate = daysAwayFromDate -1
          var daysAwayMinusTodayDate = daysAwayFromDate + scope.TodayDate
          var date = daysAwayMinusTodayDate
          // console.log("date = " + date)
          // console.log(daysAwayMinusTodayDate <= scope.daysInMonth)
          // console.log("daysAwayMinusTodayDate = " + daysAwayMinusTodayDate)
          // console.log("scope.daysInMonth = " + scope.daysInMonth)
          if(daysAwayMinusTodayDate < 0 ){
            scope.lastDate.push(date)
            if(date < 0){
              var lastMonth = new Date (scope.TodaysYear, scope.TodaysMonth, 0)
              var lastDayOfLastMonth = lastMonth.getDate()
              var date = lastDayOfLastMonth + date
              scope.lastDate.push(date)
            }
            // when scope.date.weekCount doesn't equal 0, we are increment/decrementing from the current week

          } else if (daysAwayMinusTodayDate > 0 && (daysAwayMinusTodayDate < scope.daysInMonth)){
            // console.log("here 1")
              scope.lastDate.push(date)
          } else if(daysAwayMinusTodayDate > scope.daysInMonth){
            // console.log("here 2")
            date = daysAwayMinusTodayDate - scope.daysInMonth
            scope.lastDate.push(date)
          } else {
            // console.log("here 3")
            // console.log("date = " + date)
            var date = scope.lastDate[scope.lastDate.length-1];
            date = parseInt(date) + 1
            scope.lastDate.push(date)
          }
          th.innerHTML = daysOfWeek[i] + "  " + date
          if(daysAwayFromDate === 0){
            th.setAttribute("class", "todayInWeeklyView")
            th.setAttribute("id", i)
            scope.daysAwayFromDate = i
          }
        }

        function createTableHeadingRow(table, tr, count){
          console.log("createTableHeadingRow called. count = " + count)
          // week gets a start of 0, becuase we need an extra column to add the times of the day
          if(scope.newView === 'month'){
            var start = 1
          } else if(scope.newView === 'week'){
            var start = 0
            createWeeklyDates()
          }
          for(var i = start; i < 8 ; i++){
            var th = document.createElement("th")
            // i > 0 is because the first column is for the time and we want the first date columns
              // start === 0 tells us that we want a weekly view that should dispaly the week of the current date
            if(i > 0 && start === 0){
              weeklyTableHeadingRow(th, i)
            } else {
              th.innerHTML = daysOfWeek[i]
            }
            tr.appendChild(th)
          }
          table.appendChild(tr)
        };

        var makeCalendar = function(firstDayOfMonth, numberOfDays, month, year){
          console.log("makeCalendar function envoked. firstDayOfMonth = " + firstDayOfMonth + ", numberOfDays = "+ numberOfDays + ", month = " + month + ", year = " + year)
          document.getElementById("calendar-month-year").innerHTML = monthName[month] + " " + year
          var table = document.createElement("table");
          table.className = 'calendar';
          table.setAttribute("id", "calendar-table");
          var tr    = document.createElement("tr");
          tr.setAttribute("class", "row-headings")
          // Table Heading row with names of days
          scope.count = 1;
          var count = scope.count
          createTableHeadingRow(table, tr, count)
          // create 1st row of dates.  First loop looks to see which day (sunday -friday) is the first of the month and then puts a '1'in that td.
          tr = document.createElement("tr");
          tr.setAttribute("class", "first-row")
          if(scope.newView === 'month'){
            monthViewFirstDateRow(firstDayOfMonth, tr, table, p, numberOfDays, month, year)
            // end of 1st date row

            // creates 2nd, 3rd and 4th date rows
            //conditional to determine if the first day of the month starts on Friday AND has 31 days.  They need an extra row, so we need to loop through 4 times
            var td = document.createElement("td");
            if((numberOfDays === 31 && firstDayOfMonth === 5) || (numberOfDays === 31 && firstDayOfMonth === 6) || (numberOfDays === 30 && firstDayOfMonth === 6)){
              dyanmicRowCreator(4, table, td, p, tr, numberOfDays, month, year)

              // months that have less than 31 days only need 3 additional rows, so it only needs to loop 3 times
            } else {
              dyanmicRowCreator(3, table, td, p, tr, numberOfDays, month, year)
            }
            // creates last row (6th row for months that start on Friday and have 31 days & 5th row for all others)
            var tr = document.createElement("tr")
            for(var i = 0; i < 7; i++){
              if(scope.count <= numberOfDays){
                createTDsInRows(table, td, p, tr, numberOfDays, month, year)
                // scope.count++
              } else {
                var td = document.createElement("td");
                td.setAttribute("class", "month")
                td.innerHTML = "";
                tr.appendChild(td)
              }
            }
          }
          if(scope.newView === 'week'){
            dyanmicRowCreator(1, table, td, p, tr, numberOfDays, month, year)
          }
                table.appendChild(tr)
                document.getElementById("calendar-dates").appendChild(table);
                var p = document.createElement("p")
        }
        // end ---> of make_calendar function <------//

        // monthHistory is an array that stores the months the user has viewed and acts as a changelog/history.
          // Need to view the month history to determine when to increment and decrement the year.
            // Every condition of the monthSelector function pushes the month to this array
        var monthHistory = []

        var monthSelector = function(month){
          console.log("monthSelector function called. month = " + month)
          var firstDayOfMonth = new Date(year, month-1, 1).getDay()
          var numberOfDays = new Date(year, month, 0).getDate()
          //since this function  creates a new calendar with a different month, we need to delete the original calendar HTML table first
          var calendar = document.getElementById("calendar-table")
            if(calendar){
              calendar.remove()
            }
            // this conditional looks to see if it's December and if the last month the user saw was January
            if(month === 12 && monthHistory.pop() === 1){
              // this condition builds the calendar with the month being december and decrements by 1 year
              month = 12
              year--
              monthHistory.push(month)
              // need to determine the first day of the month so we know which day of the week is the first day of the month
              makeCalendar(firstDayOfMonth, numberOfDays, month, year)
            } else if (month === 1 && monthHistory.pop() === 12) {
                month = 1
                year++
                monthHistory.push(month)
                makeCalendar(firstDayOfMonth, numberOfDays, month, year)
            } else {
              monthHistory.push(month)
              makeCalendar(firstDayOfMonth, numberOfDays, month, year)
            }
        };
        var currentMonth = function(month, year){
          console.log("month = " + month + " ; " + "year = " + year)
          var firstDayOfMonth = new Date(year, month-1, 1).getDay()
          var numberOfDays = new Date(year, month, 0).getDate()
          makeCalendar(firstDayOfMonth, numberOfDays, month, year)
        }

      }
    }
  }
})();
