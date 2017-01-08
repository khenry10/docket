"use strict";

(function(){
  angular
  .module("app")
  .directive("monthlyCalendar", [
    "Events",
    calendarDirectiveFunction
  ])

  function calendarDirectiveFunction(Events){
    return {
      templateUrl: "/assets/html/_calendar.html",
      scope: {
        month: '=changeMonth',
        current: '=currentMonth'
      },
      link: function(scope){

      // $watch listens for changes that occur in the view/model.  The "<" or ">" buttons are attached to ng-model and a function in that controller which manipluates the month (count++ or count--).  Data binding allows for this to happen in both the view and the model, and passes to "change-month" in the directive, which triggers the anonymous function and passes the newValue from the model into the monthSelector function.  monthSelector deletes the current calendar HTML table and then invokes makeCalendar function with new month parameters.
      scope.$watch('month', function(newMonth, oldValue){
        monthSelector(newMonth)

      }, true);

      scope.$watch('current', function(newValue, oldValue){
        if(newValue){
          var currentMonth = date.getMonth()+1
          var currentYear = date.getFullYear()
        }
      }, true);

        // array of actual month names since the constructor function returns 0-11
        var month_name = ["no month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        //  array of names of the days of the week since the contstructor fucntion return 0-6
        var days_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        // storing the date constructor function in a varialbe named "date", which we need in order to determine the year
        var date = new Date()

        // need to the get the current year, which gets passed into first_day_of_month
        var year = date.getFullYear() // returns 2016

        // passing in first_day_of_month which is the value (0 - 6) of the first day of the month and number_of_days which is the number of days in each month

        var makeCalendar = function(first_day_of_month, number_of_days, month, year){
          document.getElementById("calendar-month-year").innerHTML = month_name[month] + " " + year
          var table = document.createElement("table");
          table.className = 'calendar';
          table.setAttribute("id", "calendar-table");
          var tr    = document.createElement("tr");
          // Table Heading row with names of days
          createFirstRow(table, tr)
          // create 1st row of dates.  First loop looks to see which day (sunday -friday) is the first of the month and then puts a '1'in that td.
          tr = document.createElement("tr");
          for(var i = 0; i < 7; i++){
            if(i >= first_day_of_month){
              break;
            }
            // this section creates a td and puts a blank string in until the loop reaches the first day of the month

              var td = document.createElement("td");
              td.innerHTML = "";
              tr.appendChild(td)
          }
            var count = 1;
            for(; i < 7; i++){
              createTableRows(table, td, count, p, tr, number_of_days, month, year)
              count++
            }

            table.appendChild(tr)

            // end of 1st date row

            // creates 2nd, 3rd and 4th date rows
              //conditional to determine if the first day of the month starts on Friday AND has 31 days.  They need an extra row, so we need to loop through 4 times
              if((number_of_days === 31 && first_day_of_month === 5) || (number_of_days === 31 && first_day_of_month === 6)){
                for(var t = 0; t < 4; t++){
                  var tr = document.createElement("tr")
                  for(var i = 0; i < 7; i++){
                    createTableRows(table, td, count, p, tr, number_of_days, month, year);
                    count++
                  }

                table.appendChild(tr)
              }
              // months that have less than 31 days only need 3 additional rows, so it only needs to loop 3 times
            } else {
                for(t = 0; t < 3; t++){
                  var tr = document.createElement("tr")
                    for(var i = 0; i < 7; i++){

                      createTableRows(table, td, count, p, tr, number_of_days, month, year
                      );
                      count++

                    }

                  table.appendChild(tr)
                }
              }

            // creates last row (6th row for months that start on Friday and have 31 days & 5th row for all others)
            var tr = document.createElement("tr")
                for(var i = 0; i < 7; i++){
                  if(count <= number_of_days){
                    createTableRows(table, td, count, p, tr, number_of_days, month, year)
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
          for(var i = 0; i < 7 ; i++){
            var th = document.createElement("th")
            th.innerHTML = days_of_week[i]
            tr.appendChild(th)
          }
          table.appendChild(tr)
        };


        function createTableRows(table, td, count, p, tr, number_of_days, month, year){
            //creates a td attribute which is one 1 in the table
            var td = document.createElement("td");
            //creates a paragraph attribute, which is where the name of the event will render on the calendar
            var p = document.createElement("p")
            //setting a class attribute in the p tag, with a name of "a" + whatever the count is so we can target with class
            p.setAttribute("class",  "a"+count)
            // innerHTML of td is what the user sees on the calendar
            td.innerHTML = count;
            // in order to handle multiple events on the same day, need to create ul and then have each event name be an li
            var ul = document.createElement("ul");
            //then need to append the ul to the p tag, p tag to the td and then the td to the table row
            p.appendChild(ul)
            td.appendChild(p);
            tr.appendChild(td);

            if(count === date.getDate() && month === date.getMonth()+1 && year === date.getFullYear()){
              td.setAttribute("class", "today")
            }

            // Events.all[1] accesses the part of the object that actually stores the event data.
              //we have a conditional to see if the month of the object is the same month we are currently displaying
                //loop through all the events to see if the date of the event is the same as the count, if yes, we set the p tag to the name of the event
                  //lastly, we incremnt the count

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

        // month_history is an array that stores the months the user has viewed and acts as a changelog/history.  Need to the month history to determine when to increment and decrement the year.  Every condition of the monthSelector function pushes the month to this array
        var month_history = []

        var monthSelector = function(month){
          // year comes from currentDate varilabe towards the top of the file, which is generated from constructor function

          //since this function  creates a new calendar with a different month, we need to delete the original calendar HTML table first

          var calendar = document.getElementById("calendar-table")
            if(calendar){
              calendar.remove()
            }

            // this conditional looks to see if it's December and if the last month the user saw was January
            if(month === 12 && month_history.pop() === 1){
              // this condition builds the calendar with the month being december and decrements by 1 year
              month = 12
              year--

              month_history.push(month)
              // need to determine the first day of the month so we know which day of the week is the first day of the month
              // need to pass year variable (year varialbe currently returns the current year via date contstructor)
              var first_day_of_month = new Date(year, month-1, 1).getDay() //returns 5 (which is Friday) for April

              // passes in year and month variable, along with 0 (which means last day of month) in order to store the number of days in a month into number_of_days varialbe
              var number_of_days = new Date(year, month, 0).getDate() //returns 30, which is the number of days in April.  For some reason January is month 1 here

              makeCalendar(first_day_of_month, number_of_days, month, year)

            } else if (month === 1 && month_history.pop() === 12) {
                month = 1
                year++

                month_history.push(month)

                var first_day_of_month = new Date(year, month-1, 1).getDay()
                var number_of_days = new Date(year, month, 0).getDate()
                makeCalendar(first_day_of_month, number_of_days, month, year)

            } else {
              month_history.push(month)
              var first_day_of_month = new Date(year, month-1, 1).getDay()
              var number_of_days = new Date(year, month, 0).getDate()
              makeCalendar(first_day_of_month, number_of_days, month, year)

            }
        };

        var currentMonth = function(month, year){
          console.log("month = " + month + " ; " + "year = " + year)
          var first_day_of_month = new Date(year, month-1, 1).getDay()
          var number_of_days = new Date(year, month, 0).getDate()
          makeCalendar(first_day_of_month, number_of_days, month, year)
        }

      }
    }
  }

})();
