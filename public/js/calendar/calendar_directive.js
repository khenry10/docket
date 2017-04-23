"use strict";

(function(){
  angular
  .module("app")
  .directive("monthlyCalendar", [
    "Todo",
    "ModalService",
    "DateService",
    calendarDirectiveFunction
  ])

  function calendarDirectiveFunction(Todo, ModalService, DateService){
    return {
      templateUrl: "/assets/html/_calendar.html",
      scope: {
        date: '=changeDate',
        newtodoLists: '=new',
        newView: "=view",
        listForCal: "=listForCal"
      },
      link: function(scope){
        console.log("calendar directive")
        console.log(scope)

        scope.$watch('listForCal', function(todosForCal, oldList){
          console.log("listForCal $watch called")
          // console.log(todosForCal)
          // console.log(scope.date.monthCount)
          if(todosForCal[0] && todosForCal[0].origin != 'master-task'){
            monthSelector(scope.date.monthCount)
            if(todosForCal.length){
              todosForCal.forEach(function(todoForCal){
                if(todoForCal.todo.lists || todoForCal.modifiedDateList ){
                  todoForCal.modifiedDateList.forEach(function(dateList){
                    var date = dateList.date;
                    scope.pickCorrectDateForCal(date, todoForCal.todo)
                  })
                }
              })
            }
          }
        }, true);

      scope.testModal = function (list, date){
        console.log("scope.TestModal called")
        console.log(scope)
        ModalService.showModal({
          templateUrl: "/assets/html/todo/cal-entry-modal.html",
          controller: "modalController",
          inputs: {
            data: list,
            date: date,
            allTasks: scope.$parent.allTasks
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
          // creates and appends the new calendar items to the calendar
          var bigTdContainer = document.getElementsByClassName(time)
          var pForBigTd = document.createElement('p')
          pForBigTd.setAttribute("id", list._id+date)
          if(timeStructure === 'startTime'){
            pForBigTd.innerHTML = list.list_name
          }
          if(list.list_reocurring === 'Monthly'){
            var fullDateObj = DateService.stringDateSplit(date)
            console.log(fullDateObj)
            var listDay = fullDateObj.day
            bigTdContainer = bigTdContainer[listDay+1]
          } else {
            bigTdContainer = bigTdContainer[realListDate.getDay()+1];
          }
          bigTdContainer.addEventListener("click", function(e) {
            console.log(e)
            scope.testModal(list, date)
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
          } else if(startTimeAmOrPm != endTimeAmOrPm && timeDifference === 2 && list.end_time === "12:00am"){
            console.log(realListDate)
            var endTime = endTime -1
            var endTime = endTime + ":00pm"
            createHourlyCalItem(list, endTime, date, realListDate, "middleTime")
          } else {
            var startTime = parseInt(startTime)+1
            var startTime = startTime >= 12? 12: startTime
            var endTime = parseInt(endTime)-1
            var endTime = endTime >= 12? 12: endTime
            console.log(endTime)
            console.log(startTimeAmOrPm)
            console.log(endTimeAmOrPm)
            if(startTimeAmOrPm === endTimeAmOrPm){
              console.log(startTime)
              console.log(endTime)
              if(startTime === 12){
                // startTime = startTime +":00"+startTimeAmOrPm
                // createHourlyCalItem(list, startTime, date, realListDate, "middleTime")
                startTime = 1
              }
              addMiddleTimeCalItems(startTime, endTime, startTimeAmOrPm, list, date, realListDate)
            } else if(startTimeAmOrPm != endTimeAmOrPm && startTimeAmOrPm === "am"){
              console.log(startTime)
              console.log(endTime)
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
          var exists = document.getElementById(list._id+date)
          if(!exists){
            var li = document.createElement("li")
            li.setAttribute("class",'a'+listDay)
            li.setAttribute("id", list._id+date)
            var url = document.createElement("a")
            url.innerHTML = list.list_name;
            li.addEventListener("click", function(e) {
              scope.testModal(list, date)
            })
            li.append(url)
            if(scope.newView === 'week' && list.start_time){
              putHourlyItemsOnWeeklyCalendar(list, date, realListDate)
            }
            if(scope.newView === 'month'){
              ul[0].appendChild(li)
            }
          } else {
            console.log("EXISTS SO I DIDNT PUT ON THE CALENDAR " + list._id+date)
          }
        };

        var dateSplit = function(listDate, date, list){
          var listDay = listDate[2].substring(0,2)
          var listMonth = listDate[1]
          listMonth = listMonth-1
          var listYear = listDate[0]
          var realListDate = new Date(listYear, listMonth, listDay)
          appendToCalendar(listDay, date, list, realListDate)
        }

        scope.pickCorrectDateForCal = function(date, list){
          if(scope.newView === 'month'){
            var listDates = date.split("-")
            var listDay = parseInt(listDates[2].substr(0,2))
            var ul = document.getElementsByClassName("u"+listDay)
            appendToCalendar(listDay, date, list, undefined, ul)
          } else if(scope.newView === 'week') {
            // we need to use the actual date, as opposed to list.first_day like below, since it's Daily recurring
            if(list.list_reocurring === 'Daily') {
              var listDate = date.split("-")
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
        };

        var addNewModal = function(e, month, year, index){
          console.log("addNewModal called")
          if(e.srcElement.nodeName === 'TD'){
            // need to add in logic so this function can handle both MONTHLY & WEEKLY views, messed up the monthly stuff while adding weekly
              if(scope.newView === 'week'){
                console.log(e)
                var startTime = e.srcElement.className;
                var date = e.srcElement.attributes[1].ownerElement.offsetParent.offsetParent.children[0].cells[index+1].id;
                var date = date.split("/");
                var month = date[0];
                var entryDate = date[1];
                var date = {date: entryDate, month: month, year: year, startTime: e.srcElement.className};
              } else {
                  var date = {date: e.srcElement.attributes[0].ownerElement.childNodes[0].data, month: month, year: year}
              }

              var data = {view: 'modal', date, newCal: scope.newtodoLists, dateTracker: scope.date, listForCal: scope.listForCal, scope: scope}
              data.checkLists = scope.checkLists
              data.newMaster = scope.$parent.newMasterListAddition

              ModalService.showModal({
                templateUrl: "/assets/html/calendar/modals/add-new-modal.html",
                controller: "newCalItemModalController",
                inputs: {
                  data: data
                }
              }).then(function(modal) {
                console.log(".then in modal")
                console.log(modal)
                console.log(modal.scope)
                //it's a bootstrap element, use 'modal' to show it
                modal.element.modal();
                console.log(modal.element)
                modal.close.then(function(result) {
                  console.log(result);

                });
              });

          }
        }

        var buildTimeTable = function(tr, addTimes, index, year){
          console.log("buildTimeTable")
          var bigTd = tr === td? tr:document.createElement("td");
          console.log(index)

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
              td.addEventListener("click", function(e){
                console.log(e)

                if(e.srcElement.nodeName === "TD" && e.srcElement.nodeName != "P"){
                  addNewModal(e, undefined, year, index)
                } else {

                }

              })
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
            if(scope.newView === "week"){
              var td = document.createElement("td")
              console.log("calling buildTimeTable from createTDsInRows!!!!!")
              buildTimeTable(tr, false, index, year)
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
              scope.count++
          }
          if(scope.newView === 'month'){
            td.addEventListener("click", function(e){
              console.log(e)
              addNewModal(e, month, year)
            })
          }
        };

        var dyanmicRowCreator = function(rows, table, td, p, tr, numberOfDays, month, year){
          console.log("dyanmicRowCreator td = " + td)
          // we pass the number of rows to create through rows parameter to distinguish between month and weekly view. And months with 5 or 6 rows
          for(var t = 0; t < rows; t++){
            var tr = document.createElement("tr")
            if(scope.newView === 'week'){
              console.log("calling buildTimeTable from dynamicRowCreator")
              buildTimeTable(tr, true, undefined, year)
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
          var daysAwayFromDate = i - scope.todayDay;
          daysAwayFromDate = daysAwayFromDate -1;
          var daysAwayMinusTodayDate = daysAwayFromDate + scope.TodayDate;
          var date = daysAwayMinusTodayDate;
          var month = new Date (scope.TodaysYear, scope.TodaysMonth+2, 0).getMonth()
          if(daysAwayMinusTodayDate < 0 ){
            if(date < 0){
              var lastMonth = new Date (scope.TodaysYear, scope.TodaysMonth, 0)
              var lastDayOfLastMonth = lastMonth.getDate()
              var date = lastDayOfLastMonth + date
              var month = month-1
              scope.lastDate.push(date)
            }
            // when scope.date.weekCount doesn't equal 0, we are increment/decrementing from the current week

          } else if (daysAwayMinusTodayDate > 0 && (daysAwayMinusTodayDate < scope.daysInMonth)){
            console.log("here 1")
            console.log(date)
              scope.lastDate.push(date)
          } else if(daysAwayMinusTodayDate > scope.daysInMonth){
            console.log("here 2")
            console.log(date)
            date = daysAwayMinusTodayDate - scope.daysInMonth
            scope.lastDate.push(date)
            var month = month + 1
          } else {
            console.log("here 3")
            console.log("date = " + date)

            if(scope.date.lastMove === 'increment'){
              var date = scope.date.months.previousMonth.days
            } else {
              var date = scope.date.months.thisMonth.days
            }
            console.log(date)
            scope.lastDate.push(date)
          }
          th.innerHTML = daysOfWeek[i] + "  " + date
          if(daysAwayFromDate === 0){
            th.setAttribute("class", "todayInWeeklyView")
            // th.setAttribute("id", i)
            th.setAttribute("id", month +"/"+ date)
            scope.daysAwayFromDate = i
          }
          th.setAttribute("id", month +"/"+ date)

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
        }; //end of monthSelector
      }
    }
  }
})();
