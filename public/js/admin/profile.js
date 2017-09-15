'use strict';

angular.module('app').controller('profileController', ['Employment', 'DateService', '$scope', profileController])

  function profileController(Employment, DateService, $scope){
    console.log("profileController")
    $scope.name = 'Keith'

    function round(num){
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    }

    $scope.totalComp = 0;

    Employment.all.$promise.then(function(){
      console.log(Employment.all)
      $scope.positions = Employment.all.map(function(position){
        console.log(position)
        if(position.hourly_rate){
          const weekly = position.hourly_rate * 40
          const annual = weekly * 52;
          position.salary = round(annual);
        }
        $scope.totalComp += parseInt(position.salary);
        if(position.paycheck_frequency === 'bi-weekly'){
          position.paychecks = DateService.paychecks.biWeeklyFridays;

        }
        console.log(position)
        return position
      })
    })
  };
