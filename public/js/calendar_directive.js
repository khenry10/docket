"use strict";

(function(){
  angular
  .module("app")
  .directive("calendarDirective", [
    calendarDirectiveFunction
  ])

  function calendarDirectiveFunction(){
    return {
      templateUrl: "/assets/html/_calendar.html",
      link: function(){
        var date = new Date()

        // var month = date.getMonth() //returns 0-11 (0 is Janauary)
        var month = 4
        console.log("month = " + month)
        var month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

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

        console.log("day_no = " + day_no)
        console.log("number_of_days = " + number_of_days)


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
        function make_calendar(day_no, number_of_days){
          console.log("make_calendar function invoked")
          var table = document.createElement("table");
          var tr    = document.createElement("tr");

          // row for Day names
          for(var i = 0; i < 7 ; i++){
            var th = document.createElement("th")
            th.innerHTML = days_of_week[i]
            tr.appendChild(th)
          }
          table.appendChild(tr)
          //end of first row

          // create 2nd row, which is the first row of dates.  First loop looks to see which day is the first of the month and then puts a '1'in that td.
          tr = document.createElement("tr");
          for(var i = 0; i < 7; i++){
            if(i === day_no){
              break;
            }
            // this section creates a td and puts a blank string in until the loop reaches the first day of the month
              var td = document.createElement("td");
              td.innerHTML = "";
              tr.appendChild(td)
          }
            var count = 1;
            for(; i < 7; i++){
              var td = document.createElement("td");
              var p = document.createElement("p")
              p.setAttribute("class",  "a"+count)
              // p.innerHTML = indexVM.events
              td.innerHTML = count;
              count++;
              tr.appendChild(td);
              td.appendChild(p)
            }
            table.appendChild(tr)
            // end of 2nd row

            // creates 3rd, 4th, and 5th row
              if(number_of_days === 31 && day_no === 5){
                for(var t = 0; t < 4; t++){
                var tr = document.createElement("tr")
                for(var i = 0; i < 7; i++){
                  var td = document.createElement("td")
                  td.innerHTML = count
                  td.setAttribute("id", count)
                  count++
                  tr.appendChild(td)
                  var p = document.createElement("p")
                  p.setAttribute("class",  "a"+count)
                  td.appendChild(p)
                }
                table.appendChild(tr)
              }
            } else {
              for(t = 0; t < 3; t++){
              var tr = document.createElement("tr")
              for(var i = 0; i < 7; i++){
                var td = document.createElement("td")
                td.setAttribute("id", count)
                td.innerHTML = count
                count++
                tr.appendChild(td)
                var p = document.createElement("p")
                p.setAttribute("class",  "a"+count)
                td.appendChild(p)
              }
              table.appendChild(tr)
            }
          }

            //creates 6th row
            var tr = document.createElement("tr")
            for(var i = 0; i < 7; i++){
              console.log("6th row loop invoked")
              if(count > number_of_days){
                tr.appendChild(td);
                return table
              }
                var td = document.createElement("td")

                td.innerHTML = count
                console.log(count)
                tr.appendChild(td)
                table.appendChild(tr)
                document.getElementById("calendar-dates").appendChild(table);
                var p = document.createElement("p")
                p.setAttribute("class",  "a"+count)
                td.appendChild(p)
                count++
              }
              table.appendChild(tr)
              document.getElementById("calendar-dates").appendChild(table);
              var p = document.createElement("p")
              p.setAttribute("class",  "a"+count)
              td.appendChild(p)
        }

         var calendar = make_calendar(day_no, number_of_days)
      }
    }
  }

})();
