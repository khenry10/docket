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
      scope.monthlyDraggedItem = [];

        scope.$watch('listForCal', function(todosForCal, oldList){
          console.log(scope.date)
          if(todosForCal && todosForCal[0] && todosForCal[0].origin != 'master-task'){
            monthSelector(scope.date.monthCount)
            if(todosForCal.length){
              todosForCal.forEach(function(todoForCal){
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
      };

        var monthName = ["no month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var daysOfWeek = ["","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        var date = new Date()
        var year = date.getFullYear()

        var createHourlyCalItem = function(list, time, date, realListDate, timeStructure){
          // creates and appends the new calendar items to the calendar
          var bigTdContainer = document.getElementsByClassName(time)
          var pForBigTd = document.createElement('p')
          pForBigTd.setAttribute("draggable", true)

          scope.dragSrcEl = [];
          var handleDragStart = function(e){
            var thisElement = this;
            e.srcElement.childNodes[0].parentElement.className = "time"
            thisElement.className = "startTime"
            $(thisElement).parent()[0].id = 'time'
            var thisElsSplit = thisElement.id.split("&")
            var thisElsDate = thisElsSplit[1]
            var moveMeToo = document.getElementsByClassName("middleTime")
            // we loop through all the TD's that have middleTime as a class name and find ones that belong
              //to the TD that has been clicked and is being moved to inform the number of middleTime TDs that should be moved
            for(var i = 0; i < moveMeToo.length; i++){
              var middleTimeElementsSplit = moveMeToo[i].id.split("&")
              var middleTimeElementsDate = middleTimeElementsSplit[1];
              if(middleTimeElementsSplit[0] == list._id && middleTimeElementsSplit[1] == thisElsDate){
                 scope.dragSrcEl.push({element: moveMeToo[i], list: list, date: date})
              }
            }
            scope.listGrabbed = list;
            scope.dragSrcEl.push({element: this, list: list, date: date});
            e.dataTransfer.effectAllowed = 'move';
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
            var findDate = DateService.stringDateSplit(date)
            bigTdContainer = bigTdContainer[findDate.day+1];
          }
          bigTdContainer.addEventListener("click", function(e) {
            scope.calendarItemModal(list, date)
          })
          bigTdContainer.setAttribute("id", "time-with-entry");
          pForBigTd.setAttribute("class", timeStructure);

          bigTdContainer.appendChild(pForBigTd);
        };

        var addMiddleTimeCalItems = function(startTime, endTime, amOrpm, list, date, realListDate){
          // addMiddleTimeCalItems function is to determine how many hours between start and end time need to be appended to teh calendar for each item
          for(var t = startTime; t <= endTime; t++){
            var time = t + ":00" + amOrpm
            createHourlyCalItem(list, time, date, realListDate, "middleTime")
          }
        }

        var putHourlyItemsOnWeeklyCalendar = function(list, date, realListDate, times){
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
        };

        scope.drugOverElements = [];

        scope.handleDragOver = function(e) {
          if(scope.dragSrcEl.length){
            if(scope.dragSrcEl[0].element.className == "middleTime"){
              for(var i = 0; i < scope.dragSrcEl.length; i++){
                scope.dragSrcEl[i].element.className = "time"
              }
            }
          }

          if(scope.newView === 'week'){
            this.style.backgroundColor = "grey"
          }

          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }
          e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
          return false;
        };


        var appendToCalendar = function(listDay, date, list, realListDate, ul, times){

          var exists = document.getElementById(list._id+date)
          if(!exists){
            var li = document.createElement("li")
            li.setAttribute("draggable", true)
            var dragSrcEl = null;

            var handleDragStart = function(e){
              scope.listGrabbed = list;
              // scope.dragSrcEl is the element that has been clicked and is being dragged
              scope.dragSrcEl = this;

              if(scope.newView === 'month'){
                scope.monthlyDraggedItem.push(scope.dragSrcEl);
              }

              e.dataTransfer.effectAllowed = 'move';
              // e.dataTransfer.setData('text/html', this.innerHTML);
            };

            scope.handleDragLeave = function(e) {
              if(scope.dragSrcEl.length){
                if(scope.dragSrcEl[0].className === 'time'){
                  for(var i = 0; i < scope.dragSrcEl.length; i++){
                    scope.dragSrcEl[i].element.className = "middleTime"
                  }
                }
              }
              this.style.backgroundColor = "#F2F3F4";  // this / e.target is previous target element.
            };

            scope.handleWeeklyDrop = function(e){
              console.log("DROPPED")
              e.preventDefault();

              if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
              }
              console.log(e)
              console.log(e.target)

              e.target.id = "time-with-entry"
              var arrayOfTargets = [];

              for(var p = scope.dragSrcEl.length-1; p >= 0; p--){
                if(p === scope.dragSrcEl.length-1 ){
                  var newStartTime = e.target.className

                  scope.dragSrcEl[p].element.addEventListener("click", function(e) {
                    var clickedElement = this;
                    var pastDragSrcElLength = scope.pastDragSrcEl.length-1;
                    scope.calendarItemModal(scope.pastDragSrcEl[pastDragSrcElLength].list, scope.pastDragSrcEl[pastDragSrcElLength].date)
                  })
                  e.target.appendChild(scope.dragSrcEl[p].element)
                  arrayOfTargets.push(e.target)
                } else {
                  var newTarget = $(arrayOfTargets[arrayOfTargets.length-1]).closest('tr').next().children()[0];
                  newTarget.id = "time-with-entry"
                  scope.dragSrcEl[p].element.addEventListener("click", function(e) {
                    scope.calendarItemModal(scope.pastDragSrcEl[0].list, scope.pastDragSrcEl[0].date)
                  })
                  console.log(newTarget)
                  newTarget.appendChild(scope.dragSrcEl[p].element)
                  arrayOfTargets.push(newTarget)

                  //if index = 0, this is the NEW end time, which we want to store so we can update the db
                  if(p === 0){
                    var newEndTime = newTarget.className;
                  }
                }
              }; //end of scope.dragSrcEl loop

              var list = scope.listGrabbed;
              var thisTdsRow = $(this).closest('tr')
              var tdsHeadingIndex = parseInt(thisTdsRow[0].className) + 1;
              var newElementsDate = document.getElementsByClassName("row-headings")[0].cells[tdsHeadingIndex].id;
              console.log(newElementsDate)
              var elementsOldDate = scope.dragSrcEl[0].date;
              scope.dragSrcEl.forEach(function(drug){scope.pastDragSrcEl.push(drug)})
              scope.dragSrcEl = [];

              var newStartTimeSplit = newStartTime.split(":")
              if(!newEndTime){
                var newEndTimeSplit =  parseInt(newStartTimeSplit[0]) + parseInt(list.duration) + ":" + newStartTimeSplit[1]
                newEndTimeSplit.split(":")
              } else {
                var newEndTimeSplit = newEndTime.split(":")
              }

              // I couldn't figure out how/where endTime was beig over-ridden so I created this logic to compare against list.duration
              if(newEndTimeSplit[1].substring(2,4) === newStartTimeSplit[1].substring(2,4)){
                var newDuration = newEndTimeSplit[0] - newStartTimeSplit[0];
              } else {
                var newDuration = 12 - parseInt(newStartTimeSplit[0]) + parseInt(newEndTimeSplit[0])
              }

              if(newDuration < list.duration){
                newEndTime = parseInt(newStartTimeSplit) + list.duration
                var amOrPm = ":" + newStartTimeSplit[1];
                if(newEndTime > 12 && newStartTimeSplit[0] != 12){
                  newEndTime = newEndTime -12
                  var amOrPm = amOrPm === ":00pm"? ":00am": ":00pm";
                } else if(newEndTime > 12) {
                  newEndTime = newEndTime -12
                }
                newEndTime = newEndTime + amOrPm
              };

              for(var k = 0; k < list.lists.length; k++){
                if(list.lists[k].date == elementsOldDate ){
                  list.lists[k].date = newElementsDate;
                  list.lists[k].start_time = newStartTime;
                  list.lists[k].end_time = newEndTime;
                  k = list.lists.length;
                }
              };

              var newElementsDateSplit = newElementsDate.split("-")

              for(var m = 1; m < list.listsInMonths.length; m++){
                if(list.listsInMonths[m].monthNumber === newElementsDateSplit[1] && list.listsInMonths[m].year === newElementsDateSplit[0] ){
                  console.log(list.listsInMonths[m])
                  list.listsInMonths[m].numberOfLists = list.listsInMonths[m].numberOfLists+1
                }
              }
              console.log(list.listsInMonths)

              Todo.update({list_name: list.list_name}, {todo: list})
            };

            li.addEventListener('dragstart', handleDragStart, false);
            li.addEventListener('dragover', scope.handleDragOver, false);
            li.addEventListener('dragleave', scope.handleDragLeave, false);

            if(scope.newView == 'month'){
              ul.addEventListener('dragover', scope.handleDragOver, false);
              ul.addEventListener('dragleave', scope.handleDragLeave, false);
              ul.addEventListener('drop', scope.handleWeeklyDrop, false);
            };

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
          scope.hourlyUl = document.createElement("ul")
          scope.hourlyUl.className = list.list_name + "-" + date

          if(scope.newView === 'month'){
            var listDates = date.split("-")
            var listDay = parseInt(listDates[2].substr(0,2))
            var ul = document.getElementsByClassName("u"+listDay)
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
          if(e.srcElement.nodeName === 'TD' || e.srcElement.nodeName === 'UL'){
            // need to add in logic so this function can handle both MONTHLY & WEEKLY views, messed up the monthly stuff while adding weekly
              if(scope.newView === 'week'){
                var startTime = e.srcElement.className;
                var date = e.srcElement.attributes[1].ownerElement.offsetParent.offsetParent.children[0].cells[index+1].id;
                var date = date.split("/");
                var month = date[0];
                var entryDate = date[1];
                var date = {date: entryDate, month: month, year: year, startTime: e.srcElement.className};
              } else {
                  var ulDate = e.srcElement.id.split("-")[2];
                  var date = {date: ulDate, month: month, year: year}
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
        };

        scope.handleMonthlyDrop = function(e){
          e.target.appendChild(scope.monthlyDraggedItem[0])
          scope.monthlyDraggedItem[0].style.backgroundColor = "#4FF427"
          e.target.style.backgroundColor = "#F2F3F4";

          var monthlyDraggedSplit = scope.monthlyDraggedItem[0].id.split("&")

          var originalDateOfMovedItem = monthlyDraggedSplit[1];
          for(var z = 0; z < scope.listGrabbed.lists.length; z++){
            if(scope.listGrabbed.lists[z].date === originalDateOfMovedItem){
              scope.listGrabbed.lists[z].date = e.target.id
              z = scope.listGrabbed.lists.length;
            }
          }
          Todo.update({list_name: scope.listGrabbed.list_name}, {todo: scope.listGrabbed})
          scope.monthlyDraggedItem = [];
        };

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
              td.addEventListener('dragleave', scope.handleDragLeave, false);
              if(scope.newView === 'week'){
                td.addEventListener('drop', scope.handleWeeklyDrop, false);
              } else {
                td.addEventListener('drop', scope.handleMonthlyDrop, false);
              }
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

              if(scope.newView === 'month'){
                ul.addEventListener('drop', scope.handleMonthlyDrop, false);
                ul.addEventListener('dragleave', scope.handleDragLeave, false);
              }
              ul.setAttribute("class", "u"+scope.count)
              ul.setAttribute("id", year+"-"+month+"-"+scope.count)
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
          var begOfWeek = scope.date.dayCount[scope.date.dayCount.length-7];
          var endOfWeek = scope.date.dayCount[scope.date.dayCount.length-1];

          var longMonthNames = DateService.monthNames;
          var currentMonth = longMonthNames[scope.date.monthCount];
          if(scope.date.weekCount != 0 || scope.date.monthCount != scope.date.today.monthNumber){
            document.getElementById("calendar-month-year").innerHTML =
            currentMonth + " " + begOfWeek + " - "+ endOfWeek + ", " + year;
            if(scope.date.twoMonthsWeekly){
              var shortMonthNames = DateService.shortMonthNames;
              console.log(shortMonthNames)
              console.log(scope.date.monthsCount)
              var oldMonth = shortMonthNames[scope.date.months.previousMonth.count];
              var currentMonth = shortMonthNames[scope.date.months.previousMonth.count];
              document.getElementById("calendar-month-year").innerHTML =
              oldMonth + " " + begOfWeek + " - "+ currentMonth + " " + endOfWeek + ", " + year;
            }
          } else {
            console.log(scope.date)
            document.getElementById("calendar-month-year").innerHTML = scope.date.today.dayName + " " + scope.date.today.monthNames + " " + scope.date.today.date + ", " + year;
          }
        }

        var weeklyTableHeadingRow = function(th, i){
          console.log(scope.date)
          if(scope.date.twoMonthsWeekly){
            console.log(JSON.stringify(scope.date.twoMonthsWeeklyDate.fullDates))
            th.setAttribute("id", scope.date.twoMonthsWeeklyDate.fullDates[i-1])
            th.innerHTML = daysOfWeek[i] + "  " + scope.date.twoMonthsWeeklyDate.fullDates[i-1].split("-")[2]
          } else {
            var daysAwayFromDate = i - scope.todayDay;
            var month = scope.date.months.thisMonth.count;
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
          }
          if(daysAwayFromDate === 0){
            th.setAttribute("class", "todayInWeeklyView")
            scope.daysAwayFromDate = i
          }
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
            document.getElementById("calendar-month-year").innerHTML = scope.date.today.dayName + " " + scope.date.today.monthNames + " " + scope.date.today.date + ", " + year;
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
