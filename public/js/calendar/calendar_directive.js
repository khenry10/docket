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
        scope.pulledTodoList = Todo.all
        console.log(scope.todoList)
        checkLists('new pullTodo function', scope.pulledTodoList)
      }

      scope.$watch('newView', function(newView, oldView){
        console.log("newView = " + newView)
        console.log("oldView = " + oldView)

        monthSelector(date.getMonth()+1)
      }, true)

      scope.$watch('date', function(newDate, oldValue){
        console.log("month $watch called. newDate below: ")
        console.log(newDate)
        var todoList = scope.todolist
        monthSelector(newDate.monthCount)
        console.log(scope.todolist)

        // below is commented out because Lists weren't showing up on the calendar after creating a new one and moving to the next month (only the new list was appearing)

        // if(scope.todolist){
        //     checkLists('month $watch', todoList)
        // } else if(!scope.todoList){
          pullTodo()
        // }

      }, true);

      scope.$watch('current', function(newValue, oldValue){
        console.log("current $watch called")
        console.log(newValue)
        if(newValue){
          var currentMonth = date.getMonth()+1
          var currentYear = date.getFullYear()
        }
      }, true);

      scope.$watch('todoList', function(newValue, oldValue){
        console.log("todolist $watch called")
        console.log(scope.todoList)
        console.log(newValue)
        console.log(oldValue)

        var todoList = scope.todoList
        if(scope.todoList){
            checkLists('todoList $watch', todoList)
        }
      }, true);

      scope.$watch('newtodoLists', function(newValue, oldValue){
        console.log("newtodoLists $watch called")
        scope.todoList = newValue
        if(scope.todoList){
            checkLists('newTodoList $watch')
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

        var checkDates = function(date, list){
          console.log(list)
          var listDates = date.date.split("-")
          var listDay = parseInt(listDates[2].substr(0,2))
          var ul = document.getElementsByClassName("u"+listDay)
          var exists = document.getElementById(list._id+date.date)

          if(!exists){
            var li = document.createElement("li")
            li.setAttribute("class",'a'+listDay)
            li.setAttribute("id", list._id+date.date)

            var url = document.createElement("a")
            // url.href = "/tasks/"+list.list_name;
            url.innerHTML = list.list_name;

            li.addEventListener("click", function() {
              scope.testModal(list, date.date)
            })

            li.append(url)
            ul[0].appendChild(li)
          } else {
            console.log("EXISTS SO I DIDNT PUT ON THE CALENDAR ")
          }
        }

        var checkLists = function(message, todoList){
          console.log("checkLists message = " + message)
          console.log(todoList)
          if(todoList){
            if(todoList.length){
              for(var k = 0; k < todoList.length; k++){
                var list = todoList[k]
                var reocurringDates = list.lists
                console.log(reocurringDates)
                reocurringDates.forEach(function(date){
                  var listDates = date.date.split("-")
                  var listYear = parseInt(listDates[0])
                  var listMonth = parseInt(listDates[1])
                  var listDay = parseInt(listDates[2].substr(0,2))
                  if(listYear === year){
                    if(listMonth === scope.date.monthCount){
                    checkDates(date, list)
                    }
                  }
                })
              }
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

        var buildTimeTable = function(tr, addTimes, index){
          console.log("buildTimeTable")
          console.log(index)
          // var timeGrid = document.createElement("table")
          console.log(tr)
          // var addTimes = td? false: true;
          var bigTd = tr === td? tr:document.createElement("td");
          console.log(scope.daysAwayFromDate)

          index = index
          console.log(index)
          // scope.daysAwayFromDate = scope.daysAwayFromDate-1
          if(scope.todayDay === index && scope.date.weekCount === 0){

            bigTd.setAttribute("class", "today")
          }

          // bigTd.setAttribute('class', "bigTd"+index)
          for(var y = 0; y <= 1; y++){
            if(y === 0){
              var tr2 = document.createElement("tr");
              var td = document.createElement("td");
              td.setAttribute("class", "time")
              if(addTimes){
                // this is causing alighment issues
                // td.innerHTML = "Midnight"
              }
              tr2.appendChild(td)
              bigTd.appendChild(tr2)
              tr.appendChild(bigTd)
            }
            for(var z = 1; z <= 12; z++){
              var tr2 = document.createElement("tr");
              var td = document.createElement("td");
              td.setAttribute("class", "time")
              console.log("addTimes = " +addTimes)
              if(addTimes){
                var amOrpm = y === 0? ' am':' pm'
                td.innerHTML = z + amOrpm
              }
              tr2.appendChild(td)
              bigTd.appendChild(tr2)
              tr.appendChild(bigTd)
            }
          }
          var todayWeekly = document.getElementsByClassName("todayInWeeklyView")
          // var todayWeekly = document.getElementById(index+1)

          console.log(todayWeekly)
          console.log(todayWeekly[0])
          console.log(todayWeekly.id)
          todayWeekly = todayWeekly.getId
          console.log(todayWeekly)
        }

        function createTDsInRows(table, td, p, tr, numberOfDays, month, year, index){
            console.log("*** createTDsInRows called." + scope.count)

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
              for(var i = 0; i < Events.all.length; i++ ){
                var eventDate = Events.all[i].start_time
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

        var lastDate = []

        var createDate = function(){
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

        function createTableHeadingRow(table, tr, count){
          console.log("createTableHeadingRow called. count = " + count)
          // week gets a start of 0, becuase we need an extra column to add the times of the day
          if(scope.newView === 'month'){
            var start = 1
          } else if(scope.newView === 'week'){
            var start = 0
            // scope.date.weekCount is used to track when the user is incrementing to the next month.
              // 0 means that they have only clicked "weekly" button and should be seeing the current week

            createDate(21)

          }

          for(var i = start; i < 8 ; i++){
            var th = document.createElement("th")
            // i > 0 is because the first column is for the time and we want the first date columns
              // start === 0 tells us that we want a weekly view that should dispaly the week of the current date
            if(i > 0 && start === 0){
              var daysAwayFromDate = i - scope.todayDay
              daysAwayFromDate = daysAwayFromDate -1
              var daysAwayMinusTodayDate = daysAwayFromDate + scope.TodayDate
              var date = daysAwayMinusTodayDate
              console.log(daysAwayMinusTodayDate <= scope.daysInMonth)
              console.log("daysAwayMinusTodayDate = " + daysAwayMinusTodayDate)
              console.log("scope.daysInMonth = " + scope.daysInMonth)
              if(daysAwayMinusTodayDate < 0 ){
                lastDate.push(date)
                if(date < 0){
                  var lastMonth = new Date (scope.TodaysYear, scope.TodaysMonth, 0)
                  var lastDayOfLastMonth = lastMonth.getDate()
                  var date = lastDayOfLastMonth + date
                  lastDate.push(date)
                }
                // when scope.date.weekCount doesn't equal 0, we are increment/decrementing from the current week

              } else if (daysAwayMinusTodayDate > 0 && (daysAwayMinusTodayDate < scope.daysInMonth)){
                console.log("here 1")
                  lastDate.push(date)
              } else if(daysAwayMinusTodayDate > scope.daysInMonth){
                console.log("here 2")
                date = daysAwayMinusTodayDate - scope.daysInMonth
                lastDate.push(date)
              } else {
                console.log("here 3")
                var date = lastDate.pop() + 1;
                lastDate.push(date)
              }
              th.innerHTML = daysOfWeek[i] + "  " + date
              if(daysAwayFromDate === 0){
                th.setAttribute("class", "todayInWeeklyView")
                th.setAttribute("id", i)
                scope.daysAwayFromDate = i
              }
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

        var todayWeekly = document.getElementsByClassName("todayInWeeklyView")
        // var todayWeekly = document.getElementById(index+1)

        console.log(todayWeekly[0])
        console.log(todayWeekly.id)
        todayWeekly = todayWeekly.getId
        console.log(todayWeekly)


      }
    }
  }
})();
