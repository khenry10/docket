"use strict";

(function(){
  angular
  .module("app")
  .directive("monthlyCalendar", [
    "Events",
    "Todo",
    calendarDirectiveFunction
  ])

  function calendarDirectiveFunction(Events, Todo){
    return {
      templateUrl: "/assets/html/_calendar.html",
      scope: {
        month: '=changeMonth',
        current: '=currentMonth',
        todoList: '=list',
        newtodoLists: '=new'
      },
      link: function(scope){

      var pullTodo = function (){
        scope.pulledTodoList = Todo.all
        console.log(scope.todoList)
        checkLists('new pullTodo function', scope.pulledTodoList)
      }

      scope.$watch('month', function(newMonth, oldValue){
        console.log("month $watch called")
        monthSelector(newMonth)
        var todoList = scope.todolist
        if(scope.todolist){
            checkLists('month $watch', todoList)
        } else if(!scope.todoList){
          pullTodo()
        }
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

        var monthName = ["no month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        var date = new Date()
        var year = date.getFullYear()

        var makeCalendar = function(firstDayOfMonth, numberOfDays, month, year){
          console.log("makeCalendar function envoked. firstDayOfMonth = " + firstDayOfMonth + ", numberOfDays = "+ numberOfDays + ", month = " + month + ", year = " + year)
          document.getElementById("calendar-month-year").innerHTML = monthName[month] + " " + year
          var table = document.createElement("table");
          table.className = 'calendar';
          table.setAttribute("id", "calendar-table");
          var tr    = document.createElement("tr");
          tr.setAttribute("class", "row-headings")
          // Table Heading row with names of days
          createFirstRow(table, tr)
          // create 1st row of dates.  First loop looks to see which day (sunday -friday) is the first of the month and then puts a '1'in that td.
          tr = document.createElement("tr");
          tr.setAttribute("class", "first-row")
          for(var i = 0; i < 7; i++){
            if(i >= firstDayOfMonth){
              break;
            }
            // this section creates a td and puts a blank string in until the loop reaches the first day of the month
              var td = document.createElement("td");
              td.innerHTML = "";
              tr.appendChild(td)
          }
            var count = 1;
            for(; i < 7; i++){
              createTableRows(table, td, count, p, tr, numberOfDays, month, year)
              count++
            }
            table.appendChild(tr)
            // end of 1st date row

            // creates 2nd, 3rd and 4th date rows
              //conditional to determine if the first day of the month starts on Friday AND has 31 days.  They need an extra row, so we need to loop through 4 times
              if((numberOfDays === 31 && firstDayOfMonth === 5) || (numberOfDays === 31 && firstDayOfMonth === 6)){
                for(var t = 0; t < 4; t++){
                  var tr = document.createElement("tr")
                  tr.setAttribute("class", "date-row-"+t)
                  console.log(tr)
                  for(var i = 0; i < 7; i++){
                    createTableRows(table, td, count, p, tr, numberOfDays, month, year);
                    count++
                  }
                table.appendChild(tr)
              }
              // months that have less than 31 days only need 3 additional rows, so it only needs to loop 3 times
            } else {
                for(t = 0; t < 3; t++){
                  var tr = document.createElement("tr")
                  tr.setAttribute("class", "date-row-"+t)
                    for(var i = 0; i < 7; i++){
                      createTableRows(table, td, count, p, tr, numberOfDays, month, year
                      );
                      count++
                    }
                  table.appendChild(tr)
                }
              }
            // creates last row (6th row for months that start on Friday and have 31 days & 5th row for all others)
            var tr = document.createElement("tr")
                for(var i = 0; i < 7; i++){
                  if(count <= numberOfDays){
                    createTableRows(table, td, count, p, tr, numberOfDays, month, year)
                    count++
                  } else {
                      var td = document.createElement("td");
                      td.innerHTML = "";
                      tr.appendChild(td)
                    }
                };
                table.appendChild(tr)
                document.getElementById("calendar-dates").appendChild(table);
                var p = document.createElement("p")
        }
        // end ---> of make_calendar function <------//

        function createFirstRow(table, tr){
          console.log("createFirstRow called")
          for(var i = 0; i < 7 ; i++){
            var th = document.createElement("th")
            th.innerHTML = daysOfWeek[i]
            tr.appendChild(th)
          }
          table.appendChild(tr)
        };

        var checkDates = function(date, list){
          console.log(date)
          var listDates = date.date.split("-")
          var listYear = parseInt(listDates[0])
          var listMonth = parseInt(listDates[1])
          var listDay = parseInt(listDates[2].substr(0,2))

          if(listYear === year){
            if(listMonth === scope.month){

                var ul = document.getElementsByClassName("u"+listDay)
                var li = document.createElement("li")
                li.setAttribute("class",'a'+listDay)
                var url = document.createElement("a")
                url.href = "/tasks/"+list.list_name;
                url.innerHTML = list.list_name;

                li.append(url)
                ul[0].appendChild(li)
            }
          }
        }

        var checkLists = function(message, todoList){
          console.log("checkLists message = " + message)
          console.log(todoList)
          if(todoList.length){
            for(var k = 0; k < todoList.length; k++){
              var list = todoList[k]
              var reocurringDates = list.lists
              console.log(reocurringDates)
              reocurringDates.forEach(function(date){
                // console.log(date)
                checkDates(date, list)
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
        };

        function createTableRows(table, td, count, p, tr, numberOfDays, month, year){
            console.log("*** createTableRows called.")
            var td = document.createElement("td");
            td.setAttribute("class", "b"+count)
            var p = document.createElement("p")
            p.setAttribute("class",  "a"+count)
            td.innerHTML = count;
            var ul = document.createElement("ul");
            ul.setAttribute("class", "u"+count)
            p.appendChild(ul)
            td.appendChild(p);
            tr.appendChild(td);
            if(count === date.getDate() && month === date.getMonth()+1 && year === date.getFullYear()){
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
                    if(eventDay === count){
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
              count++
        };

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
