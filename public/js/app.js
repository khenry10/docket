
var date = new Date()

var month = date.getMonth() //returns 0-11 (0 is Janauary)
var month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

var d = date.getDate() // returns day of the month.  Example: returns "22" on April 22nd 2016

var weekday = date.getDay() // returns 0-6 (0 is sunday)

days_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

var year = date.getFullYear()  // returns 2016

var number_of_days = new Date(year, month+1, 0).getDate() //returns 30, which is the number of days in April.  For some reason January = 1 here

var first_day_of_month = new Date(year, month, 1).getDay() //returns 5 (which is Friday) for April

var first_date = month_name[month] + " " + 1 + " " + year; // April 1 2016

console.log(first_date)

var tmp = new Date(first_date).toDateString()
var first_day = tmp.substr(0, 3) // returns Fri

var day_no = days_of_week.indexOf(first_day)

document.getElementById("calendar-month-year").innerHTML = month_name[month] + " " + year
console.log(document.getElementById("calendar-container"))

// passing in day_no which is the value (0 -6) of the first day of the month and number_of_days which is the number of days in each month
function make_calendar(day_no, number_of_days){
  var table = document.createElement("table");
  var tr    = document.createElement("tr");
  // row for Day names
  for(var i = 0; i < 7 ; i++){
    var th = document.createElement("th")
    th.innerHTML = days_of_week[i]
    tr.appendChild(th)
  }
  table.appendChild(tr)

  // create 2nd row, which is the first row of dates
  tr = document.createElement("tr");
  for(var i = 0; i < 7; i++){
    if(i === day_no){
      break;
    }
      var td = document.createElement("td");
      td.innerHTML = "";
      tr.appendChild(td)
  }
    var count = 1;
    for(; i < 7; i++){
      var td = document.createElement("td");
      td.innerHTML = count;
      count++;
      tr.appendChild(td);
    }
    table.appendChild(tr)

    // creats 3rd, 4th, and 5th row
    for(t = 0; t < 3; t++){
      var tr = document.createElement("tr")
      for(var i = 0; i < 7; i++){
        var td = document.createElement("td")
        td.innerHTML = count
        count++
        tr.appendChild(td)
      }
      table.appendChild(tr)
    }

    //creates 6th row
    var tr = document.createElement("tr")
    for(var i = 0; i < 7; i++){
      if(count > number_of_days){
        tr.appendChild(td);
        return table
      }
        var td = document.createElement("td")
        td.innerHTML = count
        count++
        tr.appendChild(td)
      }
      table.appendChild(tr)

      document.getElementById("calendar-dates").appendChild(table);
}

// var calendar = 
make_calendar(day_no, number_of_days)
