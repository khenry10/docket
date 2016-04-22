var date = new Date()

var month = date.getMonth() //returns 0-11 (0 is Janauary)
month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

var d = date.getDate() // returns day of the month.  Example: returns "22" on April 22nd 2016

var weekday = date.getDay() // returns 0-6 (0 is sunday)

days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

var year = date.getFullYear()  // returns 2016

var days = new Date(year, month+1, 0).getDate() //returns 30, which is the number of days in April.  For some reason January = 1 here

var first_day_of_month = new Date(year, month, 1).getDay() //returns 5 (which is Friday) for April

// module.exports = days[weekday] + " " + month[m] + " " + d + ", " + year;
module.exports = days_of_week[first_day_of_month];
