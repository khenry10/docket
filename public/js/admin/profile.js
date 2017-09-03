'use strict';

angular.module('app').controller('profileController', ['Employment', 'DateService', '$scope', profileController])

  function profileController(Employment, DateService, $scope){
    $scope.name = 'Keith'

    function round(num){
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    }

    $scope.totalComp = 0;

    Employment.all.$promise.then(function(){
      $scope.positions = Employment.all.map(function(position){
        console.log(position)
        if(position.hourly_rate){
          const weekly = position.hourly_rate * 40
          const annual = weekly * 52;
          console.log("weekly = " + weekly )
          console.log("weekly = " + round(weekly) )
          console.log("annual = " + annual )
          console.log("annual = " + Math.round(annual, -1))
          console.log(parseFloat(Math.round(annual * 100) / 100).toFixed(2))
          console.log("annual = " + round(annual) )
          console.log("paycheck = " + round(weekly * 2))
          position.salary = round(annual);
        }
        $scope.totalComp += parseInt(position.salary);
        if(position.paycheck_frequency === 'bi-weekly'){
          DateService.biWeeklyFridays()
        }
        return position
      })
    })
  };
