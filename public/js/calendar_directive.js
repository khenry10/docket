"use strict";

(function(){
  angular
  .module("app")
  .directive("calendarDirective", [
    "Events",
    calendarDirectiveFunction
  ])

  function calendarDirectiveFunction(Events){
    return {
      templateUrl: "/assets/html/_calendar.html",
      link: function(){

      // code to change the month
        //  scope.$watch('filterPosition', filterWatch, true);
         //
        //  function filterWatch(newValue, oldValue){
        //
        //  }


        // ************* Date contstructor funciton anad date logic below *************************

        var monthSelector = function(month){

        }

        // array of actual month names since the constructor function returns 0-11
        var month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        //  array of names of the days of the week since the contstructor fucntion return 0-6
        var days_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        // storing the date constructor function in a varialbe named "date", which we need in order to determine the year
        var date = new Date()

        // need to the get the current year, which gets passed into first_day_of_month
        var year = date.getFullYear()  // returns 2016

        // month gets passed into first_day_of_month
        var month = 4

        // need to determine the first day of the month so we know which day of the week is the first day of the month
          // need to pass year variable (year varialbe currently returns the current year via date contstructor)
        var first_day_of_month = new Date(year, month, 1).getDay() //returns 5 (which is Friday) for April

        // passing month variable (which uses date contstructor to return an integer 0-11) into the month_name array
        var first_date = month_name[month] + " " + 1 + " " + year; // April 1 2016

        //pass first_date in to date constructor, convert to a string, and stores in tmp variable
        var tmp = new Date(first_date).toDateString() // returns Fri Apr 01 2016

        //takes the first 3 characters of the tmp variable
        var first_day = tmp.substr(0, 3) // returns Fri

        // passes first_day into indexOf method of days_of_week array to return the day of the week that is the first day of the month
        var day_no = days_of_week.indexOf(first_day)


        // passes in year and month variable, along with 0 (which means last day of month) in order to store the number of days in a month into number_of_days varialbe
        var number_of_days = new Date(year, month+1, 0).getDate() //returns 30, which is the number of days in April.  For some reason January is month 1 here


        // **************** sandbox below **********


        function nextMonth(){
          console.log("I was clicked")
        }

        // ********** end of sandbox *******************

        document.getElementById("calendar-month-year").innerHTML = month_name[month] + " " + year

        // passing in first_day_of_month which is the value (0 - 6) of the first day of the month and number_of_days which is the number of days in each month

        var makeCalendar = function(first_day_of_month, number_of_days){
          var table = document.createElement("table");
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
              createTableRows(table, td, count, p, tr, number_of_days, month)
              count++
            }

            table.appendChild(tr)

            // end of 1st date row

            // creates 2nd, 3rd and 4th date rows
              //conditional to determine if the first day of the month starts on Friday AND has 31 days.  They need an extra row, so we need to loop through 4 times
              if(number_of_days === 31 && first_day_of_month === 5){
                for(var t = 0; t < 4; t++){
                  var tr = document.createElement("tr")
                  for(var i = 0; i < 7; i++){
                    createTableRows(table, td, count, p, tr, number_of_days, month);
                    count++
                  }

                table.appendChild(tr)
              }
              // months that have less than 31 days only need 3 additional rows, so it only needs to loop 3 times
            } else {
                for(t = 0; t < 3; t++){
                  var tr = document.createElement("tr")
                    for(var i = 0; i < 7; i++){

                      createTableRows(table, td, count, p, tr, number_of_days, month);
                      count++

                    }

                  table.appendChild(tr)
                }
              }

            // creates last row (6th row for months that start on Friday and have 31 days & 5th row for all others)
            var tr = document.createElement("tr")
                for(var i = 0; i < 7; i++){
                  if(count <= number_of_days){
                    createTableRows(table, td, count, p, tr, number_of_days, month)
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

        //invokes function to build the calendar
        makeCalendar(first_day_of_month, number_of_days)

        function createFirstRow(table, tr){
          for(var i = 0; i < 7 ; i++){
            var th = document.createElement("th")
            th.innerHTML = days_of_week[i]
            tr.appendChild(th)
          }
          table.appendChild(tr)
        };

        function createTableRows(table, td, count, p, tr, number_of_days, month){
            //creates a td attribute which is one 1 in the table
            var td = document.createElement("td");
            //creates a paragraph attribute, which is where the name of the event will render on the calendar
            var p = document.createElement("p")
            //setting a class attribute in the p tag, with a name of "a" + whatever the count is so we can target with class
            p.setAttribute("class",  "a"+count)
            // innerHTML of td is what the user sees on teh calendar
            td.innerHTML = count;
            // in order to handle multiple events on the same day, need to create ul and then have each event name be an li
            var ul = document.createElement("ul");
            //then need to append the ul to the p tag, p tag to the td and then the td to the table row
            p.appendChild(ul)
            td.appendChild(p);
            tr.appendChild(td);


            // Events.all[1] accesses the part of the object that actually stores the event data.
              //we have a conditional to see if the month of the object is the same month we are currently displaying
            if(Events.all[1].month == month){
                //loop through all the events to see if the date of the event is the same as the count, if yes, we set the p tag to the name of the event
              for(var i = 0; i < Events.all.length; i++ ){
                if(Events.all[i].date === count){
                  var li = document.createElement("li")
                  li.innerHTML = Events.all[i].name;
                  ul.appendChild(li)
                };
              };
            };
            count++;
        };

      }
    }
  }

})();
