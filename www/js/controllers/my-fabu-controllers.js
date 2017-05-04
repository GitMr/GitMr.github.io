angular.module('afu.my-fabu-controllers', ['ngCordova'])
////我的发布
.controller('myFaBuCtrl', function($scope,$rootScope, $state,$ionicPopup,donateService,recipientService,commonService,popupService) {  //
    console.log("myFaBuCtrl");
    var pageData = {juan_page_num:1,qiu_page_num:1};
    pageData.juan_page_num = 1;
    pageData.qiu_page_num = 1;

    $scope.$on("$ionicView.beforeEnter", function(){
               console.log("$ionicView.beforeEnter");
              /* window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
                  console.log( "event fired!" );
                  } );*/
        });
	$scope.$on('$ionicView.afterEnter', function(scopes, states ) {
         console.log("$ionicView.afterEnter");

       });

	$scope.isJuanActive = true;
	$scope.isQiuActive = false;

    $scope.doRefreshDonate = function(){
        pageData.juan_page_num = 1;
        donateService.viewMyDonateInfoList({page_num:pageData.juan_page_num}).then(
                function(data){
                $scope.isMoreJuanDataCanBeLoaded = true;
                console.log("[viewMyDonateInfoList]:"+JSON.stringify(data));
                $scope.infos = data.data;
                pageData.juan_page_num++;
                $scope.note = "";
                $scope.$broadcast('scroll.refreshComplete');
                },function(data){
                console.log("[viewMyDonateInfoList]:error");
                $scope.$broadcast('scroll.refreshComplete');
                $rootScope.showTopMsg(data.toast+",请重试！");
                });
    };

       
    $scope.loadMoreDonate = function(){
    $scope.isMoreJuanDataCanBeLoaded = false;
	donateService.viewMyDonateInfoList({page_num:pageData.juan_page_num}).then(
		    function(data){
			console.log("do loadMore success");
			$scope.$broadcast('scroll.infiniteScrollComplete');
			if( 10 == data.data.length )   //每次返回几条数据
			{
			    $scope.note = "";
			    $scope.isMoreJuanDataCanBeLoaded = true;
			    pageData.juan_page_num++;
			}else {

    			    $scope.isMoreJuanDataCanBeLoaded = false;
    			    $scope.note =  $rootScope.meiYouLe;
    			}
			if( data.data.length >= 1)
			{$scope.infos = $scope.infos.concat(data.data);}
			if($scope.infos.length == 0){
			    $scope.note = "";
			}

		    },function(data){
		    $scope.isMoreJuanDataCanBeLoaded = true;
			console.log("[viewCollection]:error");
			$scope.$broadcast('scroll.refreshComplete');
			$rootScope.showTopMsg(data.toast+",请重试！");
		    });
    };

    $scope.doRefreshRecipient = function(){
        pageData.qiu_page_num = 1;
    	recipientService.viewMyRecipientInfoList({page_num:pageData.qiu_page_num}).then(
    		    function(data){
    			$scope.isMoreQiuDataCanBeLoaded = true;
    			console.log("[viewMyRecipientInfoList]:"+JSON.stringify(data));
    			$scope.infos_recipient = data.data;
    			pageData.qiu_page_num++;
    			$scope.note_recipient = "";
    			$scope.$broadcast('scroll.refreshComplete');
    		    },function(data){
    			console.log("[viewMyRecipientInfoList]:error");
    			$scope.$broadcast('scroll.refreshComplete');
    			$rootScope.showTopMsg(data.toast+",请重试！");
    		    });
        };

        $scope.loadMoreRecipient = function(){
        $scope.isMoreQiuDataCanBeLoaded = false;
    	recipientService.viewMyRecipientInfoList({page_num:pageData.qiu_page_num}).then(
    		    function(data){
    			console.log("do loadMore success");
    			$scope.$broadcast('scroll.infiniteScrollComplete');
    			if( 10 == data.data.length )   //每次返回几条数据
    			{
    			    $scope.note_recipient = "";
    			    $scope.isMoreQiuDataCanBeLoaded = true;
    			    pageData.qiu_page_num++;
    			}else {
        			    $scope.isMoreQiuDataCanBeLoaded = false;
        			    $scope.note_recipient =  $rootScope.meiYouLe;
        			}
    			if( data.data.length >= 1)
    			{$scope.infos_recipient = $scope.infos_recipient.concat(data.data);}
    			if($scope.infos_recipient.length == 0){
                    $scope.note_recipient = "";
                }
    		    },function(data){
    		    $scope.isMoreQiuDataCanBeLoaded = true;
    			console.log("[viewCollection]:error");
    			$scope.$broadcast('scroll.refreshComplete');
    			$rootScope.showTopMsg(data.toast+",请重试！");
    		    });
        };


    $scope.moreJuanDataCanBeLoaded = function(){
	    return $scope.isMoreJuanDataCanBeLoaded;
    };

    $scope.moreQiuDataCanBeLoaded = function(){
    	    return $scope.isMoreQiuDataCanBeLoaded;
    };

    $scope.doRefreshDonate(pageData);
    $scope.doRefreshRecipient(pageData);

    $scope.switchSubTab = function(from){

        $rootScope.log('from',from);
        if( from == 'juan'){
            $scope.isJuanActive = true;
            $scope.isQiuActive = false;
        }else if( from == 'qiu'){
            $scope.isJuanActive = false;
            $scope.isQiuActive = true;
        }

    };
    $scope.deleteItem = {index:'',info_type:'',xid:''};
    $scope.onItemDelete = function(deleteIndex,info_type,xid,$event){
        $scope.deleteItem.info_type = info_type;
        $scope.deleteItem.xid = xid;
        $scope.deleteItem.index = deleteIndex;
        $scope.popupOptions();
        $event.stopPropagation();
    };

    ///////删除提示框
    //////弹出窗
    $scope.popupOptions = function() {
       
	$scope.popup = $ionicPopup.show({
            cssClass:'er-popup',
            templateUrl: "templates/popup/delete-my-fabu-popup.html",
            scope: $scope
        });
       
    };



    //////关闭弹出窗
    $scope.cancel = function(){
	$scope.popup.close();
    };
    /////确认删除
    $scope.confirm = function(){
        $scope.removeFromCollection();
	    $scope.cancel();
    };

    $scope.removeFromCollection = function(){
	    //remove from collection
	    $rootScope.log("deleteItem",JSON.stringify($scope.deleteItem));
	    commonService.deleteInfo($scope.deleteItem).then(
	        function(data){
	            $rootScope.log('删除成功',JSON.stringify(data));
                if( $scope.deleteItem.info_type == "donate"){
                    $scope.infos.splice($scope.deleteItem.index,1);
                }else if( $scope.deleteItem.info_type == "recipient"){
                    $scope.infos_recipient.splice($scope.deleteItem.index,1);
                }
                //$scope.data.showDelete = false;
                $rootScope.showTopMsg("操作成功！");
	        },function(data){
	            $rootScope.log('删除失败','error');
	            $rootScope.showTopMsg(data.toast+",请重试！");
	        }
	    );
    };
    
    
    $scope.goToDetail = function(info_item,info_type){
        console.log("info:"+JSON.stringify(info_item));
        /*if( !info_item.is_effective )
        {
            $rootScope.showTopMsg("该消息已失效！");
            return false;
        }*/
        if(info_type=="donate")
        {
            $state.go('juan_detail',{'xid':info_item.xid});
        }else if(info_type=="recipient"){
            $state.go('qiu_detail',{'xid':info_item.xid});
        }
    };
})



