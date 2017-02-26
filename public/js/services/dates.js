angular.module('app').service('DateService', [ function () {

  var processDate = function(date){

  }

  this.stringToDate = function(date, monthType){
    console.log("date in DateService = " + date)
    console.log(typeof date)
    if(typeof date === 'string'){
      var year = date.substring(0,4)
      var month = date.length === 9? date.substring(5,6):date.substring(5,7)
      var day = date.length === 9? date.substring(7,9):date.substring(8,10)
    } else {
      var year = date.getFullYear()
      var month = date.getMonth()+1
      var day = date.getDate()
    }
    if(monthType == 'regMonth'){
      console.log("I'm in here")
    month = month-1
    }
    console.log("month in DateService = " + month)
    var date = new Date(year, month, day)
    console.log("date in DateService = " + date)
    return date
  }

  this.stringDaysInAMonth = function(date){
    console.log("stringDaysInAMonth date = " + date)
    if(typeof date === 'string'){
      var year = date.substring(0,4)
      var month = date.substring(5,7)
      var day = date.substring(8,10)
    } else {
      var year = date.getFullYear()
      var month = date.getMonth()+1
      var day = date.getDate()
    }
    var numberOfDaysInMonth = new Date(year, month, 0).getDate()
    console.log(numberOfDaysInMonth)
    return numberOfDaysInMonth
  }

  this.dateDaysInAMonth = function(date){
    console.log(date)
    var numberOfDaysInMonth = new Date(date.getFullYear(), date.getMonth(), 0)
    return numberOfDaysInMonth.getDate()
  }

  this.stringDateToDay = function(date){
    console.log(date)
    var day = date.getDay()
    return day
  }

  var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  this.getNiceDate = function(date){
    var month = date.getMonth()
    var day = date.getDay()
    var dayDate = date.getDate()
    var year = date.getFullYear()

    return daysOfWeek[day] +" "+ monthName[month] + " " + dayDate + ", "+ year
  }

  this.percentageOfYearPassed = function(){
    var date = new Date()
    var totalDays = 0;
    var month = date.getMonth()
    var daysPassed = 0;
    var year = date.getFullYear();
    var fridays = 0;
    var totalFridays = 0;

    var data = []
    data.months = []

    for(var i = 1; i <= 12; i++){
      var daysInMonth = new Date(year, i, 0)
      daysInMonth = daysInMonth.getDate()
      var firstDayOfMonth = new Date(year, i, 1)
      firstDayOfMonth = firstDayOfMonth.getDay()
      var secondFirstDayOfMonth = firstDayOfMonth

      while(firstDayOfMonth < daysInMonth){
        fridays = fridays + 1
        totalFridays = totalFridays + 1
        firstDayOfMonth = firstDayOfMonth + 7
      }
      totalDays = totalDays + daysInMonth

      data.months.push({month: monthName[i-1], days_in_month: daysInMonth, fridays: fridays})

      if(month+1 > i){
        daysPassed = daysPassed + daysInMonth
      } else if(month+1 === i){
        var daysPassedInMonth = new Date(year, month, date.getDate())
        daysPassed = daysPassed + daysPassedInMonth.getDate()
        subtractForEndOfMonthProjection = daysPassedInMonth
      }
      fridays = 0
    }

    var percent = daysPassed/totalDays
    data.currentPercent = percent
    var cumulative = 0
    data.months.forEach(function(month, index){
      var percent_of_year = month.days_in_month/totalDays
      cumulative = cumulative + percent_of_year
      data.months[index].percent_of_year = percent_of_year
      data.months[index].cumulative_percent_of_year = cumulative
      data.months[index].remaining_fridays = totalFridays - month.fridays
    })
    return data
  }

  this.monthName = function(date){
    var month = date.getMonth()
    var nameOfMonth = monthName[month]
    return nameOfMonth
  }

}]);
