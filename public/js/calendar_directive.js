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

        // storing the date constructor function in a varialbe named "date"
        var date = new Date()

        // var month = date.getMonth() //returns 0-11 (0 is Janauary)
        var month = 6

        var month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        var d = date.getDate() // returns day of the month.  Example: returns "22" on April 22nd 2016

        var weekday = date.getDay() // returns 0-6 (0 is sunday)

        var days_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        var year = date.getFullYear()  // returns 2016

        var first_day_of_month = new Date(year, month, 1).getDay() //returns 5 (which is Friday) for April

        // var number_of_days = new Date(year, month+1, 0).getDate() //returns 30, which is the number of days in April.  For some reason January = 1 here

        var first_date = month_name[month] + " " + 1 + " " + year; // April 1 2016

        var number_of_days = new Date(year, month+1, 0).getDate() //returns 30, which is the number of days in April.  For some reason January = 1 here

        var tmp = new Date(first_date).toDateString()
        var first_day = tmp.substr(0, 3) // returns Fri

        var day_no = days_of_week.indexOf(first_day)

        // starting to move some of the new Date constructor into an object, but not currently using it yet
        function change_month(){
          var first_date = month_name[month] + " " + 1 + " " + year; // April 1 2016
          var tmp        = new Date(first_date).toDateString()  // returns Fri Apr 01 2016
          var first_day  = tmp.substr(0, 3) // retruns the first three letters of the day.  ex: Fri
          var day_no     = days_of_week.indexOf(first_day) //returns the number (0 - 6) of the first day of the month
          return day_no
        }

        document.getElementById("calendar-month-year").innerHTML = month_name[month] + " " + year



        // passing in day_no which is the value (0 -6) of the first day of the month and number_of_days which is the number of days in each month
        function makeCalendar(day_no, number_of_days){
          var table = document.createElement("table");
          var tr    = document.createElement("tr");
          // Table Heading row with names of days
          createFirstRow(table, tr)
          // create 1st row of dates.  First loop looks to see which day (sunday -friday) is the first of the month and then puts a '1'in that td.
          tr = document.createElement("tr");
          for(var i = 0; i < 7; i++){
            if(i >= day_no){
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
              if(number_of_days === 31 && day_no === 5){
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
                    console.log("count = " + count)
                    console.log("number_of_days = " + number_of_days)
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
        makeCalendar(day_no, number_of_days)

        function createFirstRow(table, tr){
          for(var i = 0; i < 7 ; i++){
            var th = document.createElement("th")
            th.innerHTML = days_of_week[i]
            tr.appendChild(th)
          }
          table.appendChild(tr)
        };

        function createTableRows(table, td, count, p, tr, number_of_days, month){
            var td = document.createElement("td");
            var p = document.createElement("p")
            p.setAttribute("class",  "a"+count)
            td.innerHTML = count;

            count++;
            td.appendChild(p);
            tr.appendChild(td);
            console.log(td)

            // Events.all[1] accesses the part of the object that actually stores the event data, the object had a bunch of other shit too
            if(Events.all[1].month == month){
              for(var i = 0; i < Events.all.length; i++ ){
                if(Events.all[i].date === count){
                  p.innerHTML = Events.all[i].name;
                };
              };
            };
        };





      }
    }
  }

})();
