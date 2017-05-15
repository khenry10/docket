angular.module('app').service('DateService', [ function () {

  this.monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  this.shortMonthNames = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  this.dataStoreForTasks = [];
  this.saveUpdatesFromLeftRail = function(storeUpdatedTask, param2, datelist){
    if(storeUpdatedTask){
      this.dataStoreForTasks.push(storeUpdatedTask)
    }
    return this.dataStoreForTasks
  };

  this.stringToDate = function(date, monthType){
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
    month = month-1
    }
    return new Date(year, month, day)
  };

  this.stringDaysInAMonth = function(date){
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
    return numberOfDaysInMonth
  };

  this.getNiceDate = function(date){
    console.log(date)
    var month = date.getMonth()+1
    var day = date.getDay()
    var dayDate = date.getDate()
    var year = date.getFullYear()

    return daysOfWeek[day] +" "+ this.monthNames[month] + " " + dayDate + ", "+ year
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

      data.months.push({month: this.monthNames[i-1], days_in_month: daysInMonth, fridays: fridays})

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
  };

  this.dateSplit = function(fullDate){
    var year = fullDate.getFullYear();
    var monthNumber = fullDate.getMonth()+1;
    var monthNames = this.monthNames[monthNumber];
    var date = fullDate.getDate();
    var dayNumber = fullDate.getDay();
    var dayName = daysOfWeek[dayNumber];
    return {year: year, monthNumber: monthNumber, monthNames: monthNames, date: date, dayNumber: dayNumber, dayName: dayName, fullDate: fullDate}
  }

  this.stringDateSplit = function(date){
    var date = date.split("-");
    var year = date[0];
    var month = date[1];
    var date = date[2];

    if(date.length > 2){
      date = date.substring(0,2)
    }

    var fullDate = new Date(year, month-1, date)

    return {year: year, month: month, date: date, day: fullDate.getDay(), fullDate: fullDate}
  };


}]);
