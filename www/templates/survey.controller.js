(function(){
    angular.module("survey")
        .component('main', {
            templateUrl: "src/html/main.html",
            controller: mainController
        });
    function mainController($scope){
        var vm = this,

        console.log("Controller");
        // $scope.$watch(function () {
        //     return groups.isLoggedIn = logSrv.isLoggedIn;
        // },function() {
        //     srv.getTechs();
        //     groups.techs = srv.techList;
        //     // console.log(groups.techs);
        //     // if (groups.techs == undefined){
        //     //     srv.getTechs();
        //     // } 
        // });
    }
})();