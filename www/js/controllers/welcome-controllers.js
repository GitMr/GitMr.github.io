angular.module('afu.welcome-controllers', [])

.controller('welcomeCtrl', function($scope,$rootScope,$state,$location,$timeout, $interval,localStorageService,registerService,utilsService,loginService) {  //
    console.log("welcomeCtrl");
    $scope.$on("$ionicView.beforeEnter", function(){
           console.log("$ionicView.beforeEnter");
           window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
              console.log( "event fired!" );
              } );
    });
    $scope.login = function(){
        $state.go("login");
    };
    $scope.register = function(){
        $state.go("register");
    }

    $scope.goLook = function(){
        $state.go("tab.home");
    };
})
