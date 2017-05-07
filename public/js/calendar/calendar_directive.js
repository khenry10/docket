"use strict";

(function(){
  angular
  .module("app")
  .directive("monthlyCalendar", [
    "Todo",
    "ModalService",
    "DateService",
    calendarDirectiveFunction
  ])

  function calendarDirectiveFunction(Todo, ModalService, DateService){
    return {
      templateUrl: "/assets/html/_calendar.html",
      scope: {
        date: '=changeDate',
        newtodoLists: '=new',
        newView: "=view",
        listForCal: "=listForCal"
      },
      link: function(scope){

      scope.pastDragSrcEl = [];

        scope.$watch('listForCal', function(todosForCal, oldList){
          console.log(scope.date)
          if(todosForCal && todosForCal[0] && todosForCal[0].origin != 'master-task'){
            monthSelector(scope.date.monthCount)
            if(todosForCal.length){
              todosForCal.forEach(function(todoForCal){
                console.log(todoForCal)
                if(todoForCal.todo.lists || todoForCal.modifiedDateList ){
                  todoForCal.modifiedDateList.forEach(function(dateList){
                    var date = dateList.date;
                    var times = {start_time: dateList.start_time, end_time: dateList.end_time}
                    scope.pickCorrectDateForCal(date, todoForCal.todo, times)
                  })
                }
              })
            }
          }
        }, true);

      scope.calendarItemModal = function (list, date){
        console.log(list)
        console.log(date)
        ModalService.showModal({
          templateUrl: "/assets/html/todo/cal-entry-modal.html",
          controller: "modalController",
          inputs: {
            data: list,
            date: date,
            parseAllTasks: scope.$parent.parseAllTasks,
            allTasks: scope.$parent.allTasks
          }
        }).then(function(modal) {
          //it's a bootstrap element, use 'modal' to show it
          modal.element.modal();
          modal.close.then(function(result) {
          });
        });
      }

        var monthName = ["no month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var daysOfWeek = ["","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        var date = new Date()
        var year = date.getFullYear()

        var listsWithHourlyItems = [];

        var createHourlyCalItem = function(list, time, date, realListDate, timeStructure){

          if(timeStructure === 'middleTime'){
            listsWithHourlyItems.push({listName: list.list_name, date: date})
          }

          // creates and appends the new calendar items to the calendar
          var bigTdContainer = document.getElementsByClassName(time)
          console.log(bigTdContainer)

          var pForBigTd = document.createElement('p')
          pForBigTd.setAttribute("draggable", true)

          scope.dragSrcEl = [];
          var handleDragStart = function(e){
            var thisElement = this;
            console.log(thisElement)
            var thisElsSplit = thisElement.id.split("&")
            var thisElsDate = thisElsSplit[1]
            var moveMeToo = document.getElementsByClassName("middleTime")

            // we loop through all the TD's that have middleTime as a class name and find ones that belong
              //to the TD that has been clicked and is being moved to inform the number of middleTime TDs that should be moved
            for(var i = 0; i < moveMeToo.length; i++){
              console.log(moveMeToo[i])
              var middleTimeElementsSplit = moveMeToo[i].id.split("&")
              var middleTimeElementsDate = middleTimeElementsSplit[1];
              if(middleTimeElementsSplit[0] == list._id){
                 scope.dragSrcEl.push({element: moveMeToo[i], list: list, date: date})
              }
            }
            scope.listGrabbed = list;
            console.log(scope.listGrabbed)
            scope.dragSrcEl.push({element: this, list: list, date: date});
            // e.dataTransfer.effectAllowed = 'move';
            // e.dataTransfer.setData('text/html', this.innerHTML);
          }; // end of dragstart


          pForBigTd.addEventListener('dragstart', handleDragStart, false);
          pForBigTd.setAttribute("id", list._id+"&"+date)
          pForBigTd.setAttribute("class", list._id+date)
          if(timeStructure === 'startTime'){
            pForBigTd.innerHTML = list.list_name
          }
          if(list.list_reocurring === 'Monthly'){
            var fullDateObj = DateService.stringDateSplit(date)
            var listDay = fullDateObj.day
            bigTdContainer = bigTdContainer[listDay+1]
          } else {
            console.log(realListDate)
            console.log(realListDate.getDay()+1)
            console.log(list)
            console.log(date)
            var findDate = DateService.stringDateSplit(date)
            console.log(findDate)
            bigTdContainer = bigTdContainer[findDate.day+1];
          }
          bigTdContainer.addEventListener("click", function(e) {
            scope.calendarItemModal(list, date)
          })
          bigTdContainer.setAttribute("id", "time-with-entry")
          // bigTdContainer.addEventListener('dragover', scope.handleDragOver, false);

          // i dont think this is being used, please delete if not... 5/7/17
          var hourlyUl = document.getElementsByClassName(list.list_name + "-" + date)

          pForBigTd.setAttribute("class", timeStructure)
          bigTdContainer.appendChild(pForBigTd)

          console.log(listsWithHourlyItems)
        };

        var addMiddleTimeCalItems = function(startTime, endTime, amOrpm, list, date, realListDate){
          // addMiddleTimeCalItems function is to determine how many hours between start and end time need to be appended to teh calendar for each item
          for(var t = startTime; t <= endTime; t++){
            var time = t + ":00" + amOrpm
            createHourlyCalItem(list, time, date, realListDate, "middleTime")
          }
        }

        var putHourlyItemsOnWeeklyCalendar = function(list, date, realListDate, times){
          console.log(list)
          console.log(times)
          // this function processes the calendar item's details, like start and end end time am/pm and how many hours, and calls createHourlyCalItem and addMiddleTimeCalItems functions
          createHourlyCalItem(list, times.start_time, date, realListDate, "startTime")

          var startTime = times.start_time.split(":")
          var startTimeAmOrPm = startTime[1].substr(2,4)
          var startTime = startTime[0]

          var endTime = times.end_time.split(":")
          var endTimeAmOrPm = endTime[1].substr(2,4)
          var endTime = endTime[0]
          var originalEndTime = endTime

          var timeDifference = endTime - startTime
          // below is to account for when something starts in the am and ends in the pm
          if(timeDifference < 0){
            var time = 12 - startTime
            var timeDifference = time + endTime
          }

          if(startTimeAmOrPm === endTimeAmOrPm && timeDifference === 2){
            var endTime = endTime -1
            var endTime = endTime + ":00" + endTimeAmOrPm
            createHourlyCalItem(list, endTime, date, realListDate, "middleTime")
          } else if(startTimeAmOrPm != endTimeAmOrPm && timeDifference === 2 && times.end_time === "12:00am"){
            var endTime = endTime -1
            var endTime = endTime + ":00pm"
            createHourlyCalItem(list, endTime, date, realListDate, "middleTime")
          } else {
            var startTime = parseInt(startTime)+1
            var startTime = startTime >= 12? 12: startTime
            var endTime = parseInt(endTime)-1
            var endTime = endTime >= 12? 12: endTime

            if(startTimeAmOrPm === endTimeAmOrPm){
              if(startTime === 12){
                startTime = 1
              }
              addMiddleTimeCalItems(startTime, endTime, startTimeAmOrPm, list, date, realListDate)
            } else if(startTimeAmOrPm != endTimeAmOrPm && startTimeAmOrPm === "am"){
              addMiddleTimeCalItems(startTime, 11, "am", list, date, realListDate)
              addMiddleTimeCalItems(12, 12, "pm", list, date, realListDate)
              if(originalEndTime != 12 && endTimeAmOrPm === 'pm'){
                addMiddleTimeCalItems(1, endTime, "pm", list, date, realListDate)
              }
            } else if (startTimeAmOrPm != endTimeAmOrPm && startTimeAmOrPm === "pm") {
              addMiddleTimeCalItems(startTime, 12, "pm", list, date, realListDate)
              addMiddleTimeCalItems(1, endTime, "am", list, date, realListDate)
            }
          }
        }

        var appendToCalendar = function(listDay, date, list, realListDate, ul, times){
          console.log(times)
          var exists = document.getElementById(list._id+date)
          if(!exists){
            var li = document.createElement("li")

            li.setAttribute("draggable", true)

            var dragSrcEl = null;

            var handleDragStart = function(e){
              scope.listGrabbed = list;
              scope.dragSrcEl = this;
              // console.log(list)
              // console.log(e)
              // console.log("im being dragged")
              // console.log(dragSrcEl)
              e.dataTransfer.effectAllowed = 'move';
              // e.dataTransfer.setData('text/html', this.innerHTML);
            };

            scope.handleDragOver = function(e) {
              // console.log("handleDragOver")
              // console.log(e.preventDefault)
              // console.log(this)
              // this.style.outline = "1px solid red"

              if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
              }
              e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
              return false;
            };

            scope.handleDrop = function(e){
              console.log("DROPPED")
              console.log(e)
              console.log(e.srcElement.childNodes)

              e.preventDefault();
              var getData = event.dataTransfer.getData("text")

              if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
              }

              // Don't do anything if dropping the same column we're dragging.
              console.log(scope.dragSrcEl)

              console.log(e.target)
              var targetsChildren = e.target.childNodes
              console.log(targetsChildren)
              console.log(targetsChildren[0])

              e.target.id = "time-with-entry"
              console.log(e.target.parentElement.parentElement)
              console.log($(e.target).closest('tr').next().children())
              console.log(list)
              console.log(date)

              var arrayOfTargets = [];
              for(var p = scope.dragSrcEl.length-1; p >= 0; p--){
                console.log("***************************** START  *****************************")
                console.log(p)
                console.log(scope.dragSrcEl[p])
                if(p === scope.dragSrcEl.length-1 ){
                  console.log(e.target)
                  var newStartTime = e.target.className
                  console.log(newStartTime)
                  console.log(this)

                  scope.dragSrcEl[p].element.addEventListener("click", function(e) {
                    console.log(scope.dragSrcEl[p])
                    console.log(this.id)
                    var clickedElement = this;
                    console.log(clickedElement.id)
                    console.log(e)
                    console.log(scope.pastDragSrcEl)

                    var pastDragSrcElLength = scope.pastDragSrcEl.length-1;

                    scope.calendarItemModal(scope.pastDragSrcEl[pastDragSrcElLength].list, scope.pastDragSrcEl[pastDragSrcElLength].date)

                  })
                  e.target.appendChild(scope.dragSrcEl[p].element)
                  arrayOfTargets.push(e.target)
                } else {

                  var newTarget = $(arrayOfTargets[arrayOfTargets.length-1]).closest('tr').next().children()[0]
                  console.log(newTarget)
                  newTarget.id = "time-with-entry"
                  scope.dragSrcEl[p].element.addEventListener("click", function(e) {
                    scope.calendarItemModal(scope.pastDragSrcEl[0].list, scope.pastDragSrcEl[0].date)
                  })

                  newTarget.appendChild(scope.dragSrcEl[p].element)
                  arrayOfTargets.push(newTarget)

                  //if index = 0, this is the NEW end time, which we want to store so we can update the db
                  if(p === 0){
                    var newEndTime = newTarget.className;
                    console.log(newEndTime)
                  }

                }
                console.log(scope.dragSrcEl[p])
                console.log("***************************** end  *****************************")
              }

              var thisTdsRow = $(this).closest('tr')
              var tdsHeadingIndex = parseInt(thisTdsRow[0].className) + 1;
              console.log(tdsHeadingIndex)

              console.log(document.getElementsByClassName("row-headings"))
              var newElementsDate = document.getElementsByClassName("row-headings")[0].cells[tdsHeadingIndex].id;
              console.log(newElementsDate)

              console.log(scope.dragSrcEl)
              var elementsOldDate = scope.dragSrcEl[0].date;
              console.log(elementsOldDate)
              scope.dragSrcEl.forEach(function(drug){scope.pastDragSrcEl.push(drug)})
              scope.dragSrcEl = [];
              var updateObject = {start_time: newStartTime, endTime: newEndTime, list: list, oldDate: elementsOldDate}
              console.log(updateObject)

              for(var k = 0; k < list.lists.length; k++){
                console.log(list.lists[k])
                if(list.lists[k].date == elementsOldDate ){
                  console.log("found it")
                  list.lists[k].date = newElementsDate;
                  list.lists[k].start_time = newStartTime;
                  list.lists[k].end_time = newEndTime;
                  console.log(list.lists[k])
                  k = list.lists.length;
                }
              }
              console.log(list)
              Todo.update({list_name: list.list_name}, {todo: list})


              if (dragSrcEl != this) {
                // Set the source column's HTML to the HTML of the column we dropped on.
                // dragSrcEl.innerHTML = this.innerHTML;
                // this.innerHTML = e.dataTransfer.getData('text/html');
              }
            };

            function handleDragEnter(e){
              console.log(this)
              // this.style.outline = "1px solid red"
            }

            function handleDragEnd(e){
               e.preventDefault();
              console.log("handleDragEnd")
              console.log(e)
            };

            function ulDrop(e){
              console.log(e)
            }
            li.addEventListener('dragstart', handleDragStart, false);
            li.addEventListener('dragover', scope.handleDragOver, false);
            // li.addEventListener('drop', handleDrop, false);
            li.addEventListener('dragend', handleDragEnd, false);
            if(scope.newView== 'week'){

            } else if (scope.newView == 'month'){
              ul.addEventListener('dragEnter', handleDragEnter, false);
              ul.addEventListener('dragover', scope.handleDragOver, false);
              ul.addEventListener('drop', scope.handleDrop, false);
            }
            // console.log(ul)


            li.setAttribute("class",'a'+listDay)
            li.setAttribute("id", list._id+"&"+date)
            var url = document.createElement("a")
            url.innerHTML = list.list_name;
            li.addEventListener("click", function(e) {
              scope.calendarItemModal(list, date)
            })
            li.append(url)
            if(scope.newView === 'week' && list.start_time){
              putHourlyItemsOnWeeklyCalendar(list, date, realListDate, times)
            }
            if(scope.newView === 'month'){
              ul.appendChild(li)
            }
          } else {
            console.log("EXISTS SO I DIDNT PUT ON THE CALENDAR " + list._id+date)
          }
        };

        var dateSplit = function(listDate, date, list, times){
          var listDay = listDate[2].substring(0,2)
          var listMonth = listDate[1]
          listMonth = listMonth-1
          var listYear = listDate[0]
          var realListDate = new Date(listYear, listMonth, listDay)
          appendToCalendar(listDay, date, list, realListDate, undefined, times)
        }

        scope.pickCorrectDateForCal = function(date, list, times){
          console.log(list)
          console.log(times)
          scope.hourlyUl = document.createElement("ul")
          scope.hourlyUl.className = list.list_name + "-" + date
          console.log(scope.hourlyUl)
          if(scope.newView === 'month'){
            var listDates = date.split("-")
            var listDay = parseInt(listDates[2].substr(0,2))
            var ul = document.getElementsByClassName("u"+listDay)
            console.log(ul[0].nodeType)
            ul = ul[0];
            appendToCalendar(listDay, date, list, undefined, ul)
          } else if(scope.newView === 'week') {
            // we need to use the actual date, as opposed to list.first_day like below, since it's Daily recurring
            if(list.list_reocurring === 'Daily') {
              var listDate = date.split("-")
              dateSplit(listDate, date, list, times)
            } else {
              if(typeof list.first_day == "object"){
                var realListDate = list.first_day
                var listDay = list.first_day.getDay()
                var ul = document.getElementsByClassName("w"+listDay)
                appendToCalendar(listDay, date, list, realListDate, ul)
              } else {
                  // we use list.first_day so that the calendar items appear on the correct day of the week when is recurrs weekly, monthly, yearly
                  var listDate = list.first_day.split("-")
                  dateSplit(listDate, date, list, times)
                }
              }
            }
        };

        var addNewModal = function(e, month, year, index){
          console.log("addNewModal called")
          if(e.srcElement.nodeName === 'TD'){
            // need to add in logic so this function can handle both MONTHLY & WEEKLY views, messed up the monthly stuff while adding weekly
              if(scope.newView === 'week'){
                var startTime = e.srcElement.className;
                var date = e.srcElement.attributes[1].ownerElement.offsetParent.offsetParent.children[0].cells[index+1].id;
                var date = date.split("/");
                var month = date[0];
                var entryDate = date[1];
                var date = {date: entryDate, month: month, year: year, startTime: e.srcElement.className};
              } else {
                  var date = {date: e.srcElement.attributes[0].ownerElement.childNodes[0].data, month: month, year: year}
              }

              var data = {view: 'modal', date: date, newCal: scope.newtodoLists, dateTracker: scope.date, listForCal: scope.listForCal, scope: scope}
              data.checkLists = scope.checkLists
              data.newMaster = scope.$parent.newMasterListAddition

              ModalService.showModal({
                templateUrl: "/assets/html/calendar/modals/add-new-modal.html",
                controller: "newCalItemModalController",
                inputs: {
                  data: data
                }
              }).then(function(modal) {
                //it's a bootstrap element, use 'modal' to show it
                modal.element.modal();
                modal.close.then(function(result) {
                });
              });

          }
        }

        var buildTimeTable = function(tr, addTimes, index, year){
          var bigTd = tr === td? tr:document.createElement("td");
          if(scope.todayDay === index && scope.date.weekCount === 0){
            bigTd.setAttribute("class", "today")
          } else {
            bigTd.setAttribute("class", index)
          }

          for(var y = 0; y <= 1; y++){
            // we create 1 large TD that makes up the column, only the first time creates the big TD
            if(y === 0){
              var tr2 = document.createElement("tr");
              var td = document.createElement("td");
              td.setAttribute("class", "time")
              tr2.appendChild(td)
              bigTd.appendChild(tr2)
              tr.appendChild(bigTd)
            }
            // big TD then get's the times by the below looping twice
            for(var z = 1; z <= 12; z++){
              var tr2 = document.createElement("tr");
              tr2.setAttribute("class", index)
              var td = document.createElement("td");
              td.setAttribute("id", "time")
              td.addEventListener('dragover', scope.handleDragOver, false);
              td.addEventListener('drop', scope.handleDrop, false);
              if(z === 12){
                var amOrpm = y === 0? 'pm':'am'
              } else {
                var amOrpm = y === 0? 'am':'pm'
              }
              td.setAttribute("class", z+":00"+amOrpm)
              td.addEventListener("click", function(e){
                if(e.srcElement.nodeName === "TD" && e.srcElement.nodeName != "P"){
                  addNewModal(e, undefined, year, index)
                }
              })
              if(addTimes){
                td.innerHTML = z + amOrpm
              }
              tr2.appendChild(td)
              bigTd.appendChild(tr2)
              tr.appendChild(bigTd)
            }
          }
          var todayWeekly = document.getElementsByClassName("todayInWeeklyView")
          todayWeekly = todayWeekly.getId
        }

        function createTDsInRows(table, td, p, tr, numberOfDays, month, year, index){
            if(scope.newView === "week"){
              var td = document.createElement("td")
              buildTimeTable(tr, false, index, year)
            } else {
              var td = document.createElement("td");
              td.setAttribute("class", scope.newView)
              var p = document.createElement("p")
              p.style.height = "100%"
              // p.style.outline = "1px solid black"
              p.setAttribute("class",  "a"+scope.count)
              if(scope.newView === 'month'){
                td.innerHTML = scope.count;
              }
              var ul = document.createElement("ul");
              ul.addEventListener('dragover', scope.handleDragOver, false);
              ul.addEventListener('drop', scope.handleDrop, false);
              ul.setAttribute("class", "u"+scope.count)
              ul.style.height = "100%"
              // p.style.outline = "1px solid red"
              p.appendChild(ul)
              td.appendChild(p);
              tr.appendChild(td);
              if(scope.count === date.getDate() && month === date.getMonth()+1 && year === date.getFullYear()){
                td.setAttribute("class", "today")
              }
              scope.count++
          }
          if(scope.newView === 'month'){
            td.addEventListener("click", function(e){
              addNewModal(e, month, year)
            })
          }
        };

        var dyanmicRowCreator = function(rows, table, td, p, tr, numberOfDays, month, year){
          // we pass the number of rows to create through rows parameter to distinguish between month and weekly view. And months with 5 or 6 rows
          for(var t = 0; t < rows; t++){
            var tr = document.createElement("tr")
            if(scope.newView === 'week'){
              buildTimeTable(tr, true, undefined, year)
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

        scope.lastDate = []

        var createWeeklyDates = function(){
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
          if(scope.date.weekCount != 0 || scope.date.monthCount != scope.date.today.monthNumber){
            document.getElementById("calendar-month-year").innerHTML =
            monthName[scope.date.monthCount] + " " + scope.date.dayCount[scope.date.dayCount.length-7] + " - "+ scope.date.dayCount[scope.date.dayCount.length-1]+ ", " + year;
          } else {
            document.getElementById("calendar-month-year").innerHTML = scope.date.today.dayName + " " + scope.date.today.monthName + " " + scope.date.today.date + ", " + year;
          }
        }

        var weeklyTableHeadingRow = function(th, i){
          var daysAwayFromDate = i - scope.todayDay;
          var month = scope.date.months.thisMonth.count;
          console.log(scope.date)
          var day = scope.date.dayCount[i-1];

          if(scope.date.dayCount.length > 7){
            day = scope.date.dayCount[scope.date.dayCount.length-8+i];
          }

          th.innerHTML = daysOfWeek[i] + "  " + day
          if(daysAwayFromDate === 0){
            th.setAttribute("class", "todayInWeeklyView")
            th.setAttribute("id", scope.date.year +"-"+ month +"-"+ day)
            scope.daysAwayFromDate = i
          }
          th.setAttribute("id", scope.date.year +"-"+ month +"-"+ day)
        };

        function createTableHeadingRow(table, tr, count){
          // week gets a start of 0, becuase we need an extra column to add the times of the day
          if(scope.newView === 'month'){
            var start = 1
          } else if(scope.newView === 'week'){
            var start = 0
            createWeeklyDates()
          }
          for(var i = start; i < 8 ; i++){
            var th = document.createElement("th")
            // i > 0 is because the first column is for the time and we want the first date columns
              // start === 0 tells us that we want a weekly view that should dispaly the week of the current date
            if(i > 0 && start === 0){
              weeklyTableHeadingRow(th, i)
            } else {
              th.innerHTML = daysOfWeek[i]
            }
            tr.appendChild(th)
          }
          table.appendChild(tr)
        };

        var makeCalendar = function(firstDayOfMonth, numberOfDays, month, year){
          console.log(scope.date)
          if(scope.date.weekCount != 0 || scope.date.monthCount != scope.date.today.monthNumber){
            document.getElementById("calendar-month-year").innerHTML =  monthName[month] + " " + year;
          } else {
            document.getElementById("calendar-month-year").innerHTML = scope.date.today.dayName + " " + scope.date.today.monthName + " " + scope.date.today.date + ", " + year;
          }
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
        }; //end of monthSelector
      }
    }
  }
})();
