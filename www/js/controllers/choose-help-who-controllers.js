angular.module('afu.choose-help-who-controller', [])
////选择帮助谁
.controller('chooseHelpWhoCtrl', function($scope,$rootScope,$stateParams,$state,$ionicPopup,donateService) {  // 
    console.log("chooseHelpWhoCtrl");
    var xid = $stateParams;
    $scope.doRefresh = function(){
	donateService.viewClaimsList(xid).then(
		    function(data){
			console.log("[viewClaimsList]:"+JSON.stringify(data));
			$scope.claims = data.dataList;
	            },function(data){
	        	console.log("[viewClaimsList]:Error");
	        	$rootScope.showTopMsg(data.toast+",请重试！");
	            });
	$scope.$broadcast('scroll.refreshComplete');

    };
    $scope.doRefresh();
    
    ///确认捐助弹窗
    $scope.popupOptions = function() {
	       
	    $scope.popup = $ionicPopup.show({
	            cssClass:'er-popup',
	            templateUrl: "templates/home/help-popup.html",
	            scope: $scope
	        });
	       
	    };
   //////关闭弹出窗
   $scope.cancel = function(){
       $scope.popup.close();
   };
	    
    ///查看具体
    $scope.watch = function(claim){
	 $state.go("watch_user",claim);
    };
    
    $scope.donateusers_id = '';
    $scope.xid = '';
    $scope.goToHelp = function(){
	donateService.conformRecipientUser({donateusers_id:$scope.donateusers_id}).then(
		function(data){
		    console.log("[conformRecipientUser]:"+JSON.stringify(data));
		    $scope.cancel();
		    $state.go("choose_express",{info_type:'donate',xid:$scope.xid});
		},function(data){
		    console.log("[conformRecipientUser]:Error");
		    $rootScope.showTopMsg(data.toast+",请重试！");
		});
    };
    
    ///通过某人的捐助请求
    $scope.passThis = function(donateusers_id,xid){
	$scope.popupOptions();
	$scope.donateusers_id = donateusers_id;
	$scope.xid = xid;
    };
    
})

////查看某个求助人
//certifications-service在哪里？？？
.controller('watchUserCtrl', function($scope,$rootScope,$stateParams,$state,$ionicPopup,donateService,certificationService) {  //
    console.log("watchUserCtrl");
    $scope.claimInfo = $stateParams;
    console.log("[claimInfo]:"+JSON.stringify($scope.claimInfo));
    ///确认捐助弹窗
    $scope.popupOptions = function() {
	       
	    $scope.popup = $ionicPopup.show({
	            cssClass:'er-popup',
	            templateUrl: "templates/home/help-popup.html",
	            scope: $scope
	        });
	       
	    };
   //////关闭弹出窗
   $scope.cancel = function(){
       $scope.popup.close();
   };
   
   $scope.donateusers_id = '';
   $scope.goToHelp = function(){
	donateService.conformRecipientUser({donateusers_id:$scope.donateusers_id}).then(
		function(data){
		    console.log("[conformRecipientUser]:"+JSON.stringify(data));
		    $scope.cancel();
		    $state.go("choose_express",{info_type:'donate',xid:$scope.claimInfo.xid});
		},function(data){
		    console.log("[conformRecipientUser]:Error");
		    $rootScope.showTopMsg(data.toast+",请重试！");
		});
   };
   
   ///通过某人
   $scope.passThis = function(donateusers_id){
	$scope.popupOptions();
	$scope.donateusers_id = donateusers_id;
   };
   //////查看认证照片
   $scope.watchIdCard = function(pic_type,user_id){
        $rootScope.log("watchIdCard");
        certificationService.viewAuthenticatePic({pic_type:pic_type,user_id:user_id}).then(
            function(data){
                $rootScope.log("authpic succeed",JSON.stringify(data.auithenPicList));
                var url = $rootScope.basePicUrl + data.auithenPicList[0];
                $rootScope.showSlideImages ([ url ]);
            },function(data){
                $rootScope.showTopMsg(data.toast+",请重试！");
            }

        );

   };

   $scope.watchOther = function(pic_type,user_id){
       $rootScope.log("watchOther");
        certificationService.viewAuthenticatePic({pic_type:pic_type,user_id:user_id}).then(
            function(data){
                $rootScope.log("authpic succeed",JSON.stringify(data.auithenPicList));
                var url = $rootScope.basePicUrl + data.auithenPicList[0];
                $rootScope.showSlideImages([ url ]);
            },function(data){
                $rootScope.showTopMsg(data.toast+",请重试！");
            }

        );
   };
    
})

