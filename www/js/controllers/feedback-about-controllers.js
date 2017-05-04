angular.module('afu.feedback-about-controller', ['ngCordova'])
////反馈
.controller('feedbackCtrl', function($scope,$rootScope, $state,$ionicPopup,commonService) {  // 
    console.log("feedbackCtrl");
    $scope.$on("$ionicView.beforeEnter", function(){
           console.log("$ionicView.beforeEnter");
          /* window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
              console.log( "event fired!" );
              } );*/
    });
    $scope.feedback = {content:""};
    $scope.submit = function(){
        if($scope.feedback.content.length < 5){
            $rootScope.showTopMsg("认真点，多写点好么~");
            return false;
        }
    	commonService.feedback($scope.feedback).then(
    			function(data){
    				console.log("[feedback]:"+JSON.stringify(data));
    				$rootScope.goBack();
    				$rootScope.showTopMsg("反馈成功！");
    			},function(data){
    				console.log("[feedback]:fail");
    				$rootScope.showTopMsg(data.toast+",请重试！");
    				
    			});

    }
       
})


