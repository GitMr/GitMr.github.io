angular.module('afu.home-controllers', [])
/////////捐助需求详情
.controller('homeJuanItemCtrl', function($ionicLoading,$scope,$rootScope,$ionicModal,$state,$ionicPopup,$stateParams,$ionicActionSheet,
localStorageService,commonService,shareService,popupService,recipientService) {  //
    console.log("homeJuanItemCtrl");
    $scope.$on("$ionicView.beforeEnter", function(){
        console.log("$ionicView.beforeEnter");

        $scope.loadDetail();
        ///var xid = $stateParams.xid;
        //console.log("[beforeEnter info xid]:"+xid);
        ///$scope.loadDetail();
        //////查看还能求助多少次
        $scope.leftCount = 1;
        recipientService.getLeftClaimCount(null).then(
            function(data){
                $rootScope.log('commonService.leftCount',JSON.stringify(data));
                $scope.leftCount = data.claimAbsentCount;
            },function(data){
                $rootScope.log('commonService.leftCount',"error");
            }

        );


     });
    /////////
    $scope.$on("$ionicView.afterEnter", function(){
            console.log("$ionicView.afterEnter");

         });
    //获取某条信息的具体详细
    var xid = $stateParams.xid; 
    console.log("[info xid]:"+xid);
    
    $scope.progress_state = "";
    $scope.isMyFaBu = false;
    
    var userId= localStorageService.get("userID");//获取当前用户user_id
    $rootScope.log("userId",userId);
    $scope.loadDetail = function(){

	var promise = commonService.getInfo({info_type:"donate",xid:xid});
	    promise.then(function(data){
		console.log("[response commonService datas]:"+JSON.stringify(data));
		$scope.info_detail = data;
		////是否收藏对应的图片
		if( $scope.info_detail.is_collection )
		{
		    $scope.collection_src = "collection_checked";
		}else
		{
		    $scope.collection_src = "collection_unchecked";
		}
		
		////进程状态 wait/recipient/mail/signfor/thanks
		if( $scope.info_detail.user_id == userId){    ////////该条需求的发布人视角
		    $scope.isMyFaBu = true;
		    switch($scope.info_detail.progress_state)
		    {
		    case "wait":
			$scope.progress_state = "等待认领";
			break;
		    case "recipient":
			$scope.progress_state = "已有"+$scope.info_detail.recipient_user_count+"人求捐 查看";
			break;
		    case "before_mail":
			$scope.progress_state = "我已确认捐助 查看快递信息";
			break;
		    case "mail":
			$scope.progress_state = "我已确认捐助 爱心邮寄中";
			break;
		    case "signfor":
			$scope.progress_state = "我已确认捐助 爱心已被签收";
			break;
		    case "thanks":
			$scope.progress_state = "爱心已被签收 查看感谢信";
			break;
		    default:
		    }
		    
		   
		    	
		}else{
		    $scope.isMyFaBu = false;
		    switch($scope.info_detail.progress_state)
		    {
		    case "wait":
			$scope.progress_state = "我需要";
			break;
		    case "recipient":
			$scope.progress_state = "我已求捐 待确认";
			break;
		    case "before_mail":
			$scope.progress_state = "求助已被通过 等待邮寄";
			break;
		    case "mail":
			$scope.progress_state = "求助已被通过 邮寄中";
			break;
		    case "signfor":
			$scope.progress_state = "我已签收 填写感谢信";
			break;
		    case "thanks":
			$scope.progress_state = "我已签收   查看感谢信";
			break;
		    default:
		    }
		    	/**/
		    
		}
		
		
		
	    },function(data){
		console.log("response commonService datas: error");
		$rootScope.showTopMsg(data.toast+",请重试！");
	    });

    };

    //收藏
    $scope.addCollection = function(){
    var addCollectionMsg = "操作";
    if($scope.info_detail.is_collection)
    {
        addCollectionMsg = "已取消收藏";
    }else{
        addCollectionMsg = "收藏成功！"
    }
    console.log("[xid]:"+$scope.info_detail.xid);
    commonService.addCollection({xid:$scope.info_detail.xid,info_type:"donate",state:!$scope.info_detail.is_collection}).then(
        function(data){
            
            console.log("[add Collection success]");
            if(!$scope.info_detail.is_collection == true)
            {
            $scope.info_detail.is_collection = true;
            $scope.collection_src = "collection_checked";
            }else{
            $scope.info_detail.is_collection = false;
            $scope.collection_src = "collection_unchecked";
            }
            
            
            $rootScope.showTopMsg(addCollectionMsg);
        },function(data){
            console.log("[add Collection fail]");
            $rootScope.showTopMsg(data.toast+",请重试！");
        }
    );
    };

    $scope.doRefreshJuanDetail = function(){
    $scope.loadDetail();
    $scope.$broadcast('scroll.refreshComplete');
    };


  //分享的弹出层
    $ionicModal.fromTemplateUrl('templates/modal-share-choice.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
	    $scope.modal.show();
	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  // Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  }); 
     
    $scope.share = function(index) {
	$scope.thumb = $rootScope.basePicUrl + $scope.info_detail.small_picture; 
         switch (index){
         //微信好友
             case 0:
             {
                
                 message = {
         		title: "关注阿福，关注公益",
         	        description: $scope.info_detail.title,
         	        thumb: $scope.thumb,
         	        mediaTagName: "",
         	        messageExt: "阿福公益",
         	        messageAction: "",
         	        media: {
         	            type: Wechat.Type.LINK,
         	            webpageUrl:  $rootScope.baseUrl + "common/share?info_type=donate&xid="+$scope.info_detail.xid
         	        }
         	    };
         	    scene = Wechat.Scene.SESSION;   // share to SESSION
                 shareService.wechatShare(message,scene);
                
             break;
             }
             //朋友圈
             case 1:
             {
                 message = {
             		title: $scope.info_detail.title,
             	        description: $scope.info_detail.title,
             	        thumb: $scope.thumb,
             	        mediaTagName: "",
             	        messageExt: "阿福公益",
             	        messageAction: "",
             	        media: {
             	            type: Wechat.Type.LINK,
             	            webpageUrl:  $rootScope.baseUrl + "common/share?info_type=donate&xid="+$scope.info_detail.xid
             	        }
             	    };
             	    scene = Wechat.Scene.TIMELINE;   // share to TIMELINE
                     shareService.wechatShare(message,scene);
            
             break;
             }
             //qq好友
             case 2:
             {
                  //QQ分享
                 var args = {};
                 args.url = $rootScope.baseUrl + "common/share?info_type=donate&xid="+$scope.info_detail.xid;
                 args.title = "关注阿福，关注公益";
                 args.description = $scope.info_detail.title;
                 args.imageUrl = $scope.thumb;
                 args.appName = "阿福公益";
                 shareService.QQShare(args);

             break;
             }
         //qq空间
             case 4:
             {
              //   $scope.shareQQQzone = function(){
                 var args = {};
                 args.url = $rootScope.baseUrl + "common/share?info_type=donate&xid="+$scope.info_detail.xid;
                 args.title = "关注阿福，关注公益";
                 args.description = $scope.info_detail.title;
                 var imgs =[$scope.thumb];
                 args.imageUrl = imgs;
                 shareService.QzoneShare(args);

             break;
             }
             //新浪微博
             case 3:
             {
                     var args = {};
                     args.url = $rootScope.baseUrl + "common/share?info_type=donate&xid="+$scope.info_detail.xid;
                     args.title = "关注阿福，关注公益";
                     args.description = $scope.info_detail.title;
                     //if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png 
                     //will be the defualt one
                     args.imageUrl = $scope.thumb;
                     args.defaultText = "关注阿福，关注公益";
                     shareService.sinaShare(args);
             break;
             }
         }
      };


    //////检查认证状态弹出窗
    $scope.popupCertification = function() {

        $scope.popupCert = $ionicPopup.show({
            cssClass:'er-popup',
            templateUrl: "templates/home/certification-popup.html",
            scope: $scope
        });

    };
    /////去认证
    $scope.goToCertification = function(){
        $rootScope.log('去认证');
        $scope.popupCert.close();
        $state.go('certification');
    };
    //////关闭认证状态弹出窗
    $scope.cancel = function(){
        $scope.popupCert.close();
    };


    $scope.checkCertification = function(){
        //////检查实名认证状态
        var authState = localStorageService.get("authenticateState",null);

        console.log("[authState]:"+JSON.stringify(authState) );

        if( null != authState )
        {
            if("checking" == authState.identity_state)
            {
                $rootScope.showTopMsg("请等待实名认证审核通过~");
                return false;
            }else if("pass" == authState.identity_state){
                return true;
            }else if("refuse" == authState.identity_state){
                $rootScope.showTopMsg("实名认证未通过！");
                return false;
            }else if("none" == authState.identity_state)
            {
                $scope.popupCertification();
                return false;
            }
        }

    };



    //////确认我需要-弹出窗
    $scope.popupOptions = function() {
       
    $scope.popup = $ionicPopup.show({
            cssClass:'er-popup',
            templateUrl: "templates/home/need-popup.html",
            scope: $scope
        });
       
    };
    
    //////关闭我需要弹出窗
    $scope.cancelNeed = function(){
    $scope.popup.close();
    };
    //////////////剩余数量提示框
    $scope.alertLeftCount = function(){
        $scope.leftCountPopup = popupService.show('show',
         {
             cssClass:'er-popup',
             templateUrl: "templates/popup/alert-leftcount-popup.html",
             scope: $scope
          });
    };
    ///////关闭数量提示框
    $scope.cancelAlertLeftCount = function(){
        $scope.leftCountPopup.close();
    };


    $scope.needThis = function(){
	if($scope.isMyFaBu){
	    
	    switch($scope.info_detail.progress_state)
	    {
	    case "wait":
		$rootScope.showTopMsg("这是你自己发布的哦~~");
		break;
	    case "recipient":
		//$rootScope.showTopMsg("已有n人求捐 --->查看");
		$state.go("choose_help_who",{info_type:'donate',xid:$scope.info_detail.xid});
		break;
	    case "before_mail":
		$state.go("choose_express",{info_type:"donate",xid:$scope.info_detail.xid});
		break;
	    case "mail":
		$rootScope.showTopMsg("爱心邮寄中");
		$state.go("myactive_express_mailing",{info_type:'donate',xid:$scope.info_detail.xid,from:'other'});
		break;
	    case "signfor":
		$rootScope.showTopMsg("爱心已签收");
		break;
	    case "thanks":
		$rootScope.showTopMsg("查看感谢信");
		$state.go("view_thanks_letter",{info_type:'donate',xid:$scope.info_detail.xid});
		break;
	    default:
	    }
	    
	}else{
	    console.log("needTHis");
	    switch($scope.info_detail.progress_state)
	    {
	    case "wait":
	    if( $scope.leftCount <= 0 ){
            $scope.alertLeftCount();
            break;
        }
	    if($scope.checkCertification()){
            $scope.popupOptions();
	    }

		break;
	    case "recipient":
		$rootScope.showTopMsg("等待通过");
		break;
	    case "before_mail":
	    /////发件人的头像肯定是该条捐助信息的捐助人的头像
	    $state.go("wait_express",{donate_nick_name:$scope.info_detail.nick_name,donate_avatar:$scope.info_detail.avatar});
		$rootScope.showTopMsg("等待邮寄");
		break;
	    case "mail":
		$rootScope.showTopMsg("爱心邮寄中");
		$state.go("express_mailing",{info_type:'donate',xid:$scope.info_detail.xid,from:'my'});
		break;
	    case "signfor":
		$rootScope.showTopMsg("已签收--->填写感谢信");
		$state.go("edit_thanks_letter", {info_type:'donate',xid:$scope.info_detail.xid});
		break;
	    case "thanks":
		$rootScope.showTopMsg("完成");
		$state.go("view_thanks_letter",{info_type:'donate',xid:$scope.info_detail.xid});
		break;
	    default:
	    }
	    
	}
    
    };

    /////去申请
    $scope.goToNeed = function(){
    $scope.popup.close();
    $state.go('need_detail',{'xid':xid});
    };
    ///////////////////////////////

    ////////点击查看大图
    $scope.viewBigImage = function(index){
        $rootScope.slideIndex = index;
        $rootScope.log("slide index",$rootScope.slideIndex);
        var imgArr = new Array();
        for( var i= 0;i < $scope.info_detail.picture.length;i++)
        {
            imgArr[i] = $rootScope.basePicUrl + $scope.info_detail.picture[i];
        }
        $rootScope.showSlideImages(imgArr);
    };
  ///////////////////////
  ///////删除提示框
      //////弹出窗
  $scope.popupDelete = function() {

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

    $scope.deleteItem = {info_type:'',xid:''};
        $scope.onItemDelete = function(info_type,xid){

            console.log("deleting");
            $scope.deleteItem.info_type = info_type;
            $scope.deleteItem.xid = xid;
            $scope.popupDelete();

        };
      $scope.removeFromCollection = function(){
  	    //remove from collection
  	    $rootScope.log("deleteItem",JSON.stringify($scope.deleteItem));
  	    commonService.deleteInfo($scope.deleteItem).then(
  	        function(data){
  	            $rootScope.log('删除成功',JSON.stringify(data));
                $rootScope.showTopMsg("操作成功！");
                $rootScope.goBack();
  	        },function(data){
  	            $rootScope.log('删除失败','error');
  	            $rootScope.showTopMsg(data.toast+",请重试！");
  	        }
  	    );
      };



    
})
/////////////////////////求助需求详情
.controller('homeQiuItemCtrl', function($scope,$rootScope,$ionicActionSheet,$ionicModal,$state,$ionicPopup,$stateParams,
    localStorageService,commonService,donateService,shareService,popupService) {  //
    console.log("homeQiuItemCtrl");
  //根据dpr选择不同的图片尺寸
    $scope.myImgSize = (lib.flexible.dpr == '3') ? '3' : '2';
    
    //获取某条信息的具体详细
    var xid = $stateParams.xid; 
    console.log("[info xid]:"+xid);

    $scope.$on("$ionicView.beforeEnter", function(){
            console.log("$ionicView.beforeEnter");
            $scope.loadDetail();
         });

    $scope.progress_state = "";
    $scope.isMyFaBu = false;
    var userId= localStorageService.get("userID");//获取当前用户user_id
    console.log("[userId]:"+userId);
    $scope.loadDetail = function(){
        var promise = commonService.getInfo({info_type:"recipient",xid:xid});
        promise.then(function(data){
        console.log("[response commonService datas]:"+JSON.stringify(data));
        $scope.info_detail = data;
        if( $scope.info_detail.is_collection )
        {
            $scope.collection_src = "collection_checked";
        }else
        {
            $scope.collection_src = "collection_unchecked";
        }
        ////进程状态 wait/donate/mail/signfor/thanks
	if( $scope.info_detail.user_id == userId){    ////////该条需求的发布人视角
	    $scope.isMyFaBu = true;
	    switch($scope.info_detail.progress_state)
	    {
	    case "wait":
		$scope.progress_state = "等待捐助";
		break;
	    case "donate":
		$scope.progress_state = "已获捐 等待邮寄";
		break;
	   
	    case "mail":
		$scope.progress_state = "已获捐 爱心邮寄中";
		
		break;
	    case "signfor":
		$scope.progress_state = "我已签收 填写感谢信";
		break;
	    case "thanks":
		$scope.progress_state = "我已签收 查看感谢信";
		break;
	    default:
	    }
	    
	   
	    	
	}else{
	    $scope.isMyFaBu = false;
	    switch($scope.info_detail.progress_state)
	    {
	    case "wait":
		$scope.progress_state = "我要捐助";
		break;
	    case "donate":
		$scope.progress_state = "已确认捐助 查看快递信息";
		break;
	    
	    case "mail":
		$scope.progress_state = "已确认捐助 邮寄中";
		
		break;
	    case "signfor":
		$scope.progress_state = "爱心已被签收 ";
		break;
	    case "thanks":
		$scope.progress_state = "爱心已被签收 查看感谢信";
		break;
	    default:
	    }
	    
	}
        
        
        },function(data){
        console.log("response commonService datas: error");
        $rootScope.showTopMsg(data.toast+",请重试！");
        });
    };
    //收藏
    $scope.addCollection = function(){
    var addCollectionMsg = "操作";
    if($scope.info_detail.is_collection)
    {
        addCollectionMsg = "已取消收藏";
    }else{
        addCollectionMsg = "收藏成功！"
    }
    console.log("[xid]:"+$scope.info_detail.xid);
    commonService.addCollection({xid:$scope.info_detail.xid,info_type:"recipient",state:!$scope.info_detail.is_collection}).then(
        function(data){
            
            console.log("[add Collection success]");
            if(!$scope.info_detail.is_collection == true)
            {
            $scope.info_detail.is_collection = true;
            $scope.collection_src = "collection_checked";
            }else{
            $scope.info_detail.is_collection = false;
            $scope.collection_src = "collection_unchecked";
            }
            
            
            $rootScope.showTopMsg(addCollectionMsg);
        },function(data){
            console.log("[add Collection fail]");
            $rootScope.showTopMsg(data.toast+",请重试！");
        }
    );
    };

    
    // 分享
  //分享的弹出层
    $ionicModal.fromTemplateUrl('templates/modal-share-choice.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
	    $scope.modal.show();
	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  // Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  }); 
     
    $scope.share = function(index) {
	$scope.thumb = $rootScope.basePicUrl + $scope.info_detail.small_picture; 
         switch (index){
         //微信好友
             case 0:
             {
                
                 message = {
         		title: "关注阿福，关注公益",
         	        description: $scope.info_detail.title,
         	        thumb: $scope.thumb,
         	        mediaTagName: "",
         	        messageExt: "阿福公益",
         	        messageAction: "",
         	        media: {
         	            type: Wechat.Type.LINK,
         	            webpageUrl:  $rootScope.baseUrl + "common/share?info_type=recipient&xid="+$scope.info_detail.xid
         	        }
         	    };
         	    scene = Wechat.Scene.SESSION;   // share to SESSION
                 shareService.wechatShare(message,scene);
                
             break;
             }
             //朋友圈
             case 1:
             {
                 message = {
             		title: $scope.info_detail.title,
             	        description: $scope.info_detail.title,
             	        thumb: $scope.thumb,
             	        mediaTagName: "",
             	        messageExt: "阿福公益",
             	        messageAction: "",
             	        media: {
             	            type: Wechat.Type.LINK,
             	            webpageUrl:  $rootScope.baseUrl + "common/share?info_type=recipient&xid="+$scope.info_detail.xid
             	        }
             	    };
             	    scene = Wechat.Scene.TIMELINE;   // share to TIMELINE
                     shareService.wechatShare(message,scene);
            
             break;
             }
             //qq好友
             case 2:
             {
                  //QQ分享
                 var args = {};
                 args.url = $rootScope.baseUrl + "common/share?info_type=recipient&xid="+$scope.info_detail.xid;
                 args.title = "关注阿福，关注公益";
                 args.description = $scope.info_detail.title;
                 args.imageUrl = $scope.thumb;
                 args.appName = "阿福公益";
                 shareService.QQShare(args);

             break;
             }
         //qq空间
             case 4:
             {
              //   $scope.shareQQQzone = function(){
                 var args = {};
                 args.url = $rootScope.baseUrl + "common/share?info_type=recipient&xid="+$scope.info_detail.xid;
                 args.title = "关注阿福，关注公益";
                 args.description = $scope.info_detail.title;
                 var imgs =[$scope.thumb];
                 args.imageUrl = imgs;
                 shareService.QzoneShare(args);

             break;
             }
             //新浪微博
             case 3:
             {
                     var args = {};
                     args.url = $rootScope.baseUrl + "common/share?info_type=recipient&xid="+$scope.info_detail.xid;
                     args.title = "关注阿福，关注公益";
                     args.description = $scope.info_detail.title;
                     //if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png 
                     //will be the defualt one
                     args.imageUrl = $scope.thumb;
                     args.defaultText = "关注阿福，关注公益";
                     shareService.sinaShare(args);
             break;
             }
         }
      };
    
    
    
    //刷新
    $scope.doRefreshQiuDetail = function(){
    $scope.loadDetail();
    $scope.$broadcast('scroll.refreshComplete');
    };
    
    $scope.helpThis = function(){
	if($scope.isMyFaBu){
	    switch($scope.info_detail.progress_state)
	    {
	    case "wait":
		$rootScope.showTopMsg("请耐心等待捐助~~");
		break;
	    case "donate":
		$rootScope.showTopMsg("已获捐，等待邮寄");
		$state.go("wait_express",{donate_nick_name:$scope.info_detail.donate_nick_name,donate_avatar:$scope.info_detail.donate_avatar});
		break;
	    
	    case "mail":
		$rootScope.showTopMsg("邮寄中");
		$state.go("express_mailing",{info_type:'recipient',xid:$scope.info_detail.xid,from:'my'});
		break;
	    case "signfor":
		$rootScope.showTopMsg("已签收--->填写感谢信");
		$state.go("edit_thanks_letter", {info_type:'recipient',xid:$scope.info_detail.xid});
		break;
	    case "thanks":
		//$scope.progress_state = "已完成";
		$state.go("view_thanks_letter",{info_type:'recipient',xid:$scope.info_detail.xid});
		break;
	    default:
	    }
	   
	}else{
	    
	    switch($scope.info_detail.progress_state)
	    {
	    case "wait":
		console.log("helpThis");
		$scope.popupOptions();
		break;
	    case "donate":
		$state.go("choose_express",{info_type:'recipient',xid:$scope.info_detail.xid});
		break;
	    
	    case "mail":
		//$scope.progress_state = "邮寄中";
		$state.go("myactive_express_mailing",{info_type:'recipient',xid:$scope.info_detail.xid,from:'other'});
		break;
	    case "signfor":
		$scope.showTopMsg( "爱心已签收");
		break;
	    case "thanks":
		//$scope.progress_state = "已签收 --->查看感谢信";
		$state.go("view_thanks_letter",{info_type:'recipient',xid:$scope.info_detail.xid});
		break;
	    default:
	    }
	    
	}
    
    };
    
    //////确认我要帮助-弹出窗
    $scope.popupOptions = function() {
        $scope.popup = popupService.show('show',
             {
                 cssClass:'er-popup',
                 templateUrl: "templates/home/help-popup.html",
                 scope: $scope
              });
   /* $scope.popup = $ionicPopup.show({
            cssClass:'er-popup',
            templateUrl: "templates/home/help-popup.html",
            scope: $scope
        });*/
       
    }; 
    
    //////关闭确认我要帮助弹出窗
    $scope.cancel = function(){
    $scope.popup.close();
    };

    //////确认帮助彩蛋弹出窗
   $scope.popupHelpSurprise = function() {

        $scope.popupSurprise = popupService.show('show',
             {
                 cssClass:'surprise-er-popup',
                 templateUrl: "templates/popup/confirm-help-surprise-popup.html",
                 scope: $scope
              });
    /*$scope.popupSurprise = $ionicPopup.show({
               cssClass:'surprise-er-popup',
               templateUrl: "templates/popup/confirm-help-surprise-popup.html",
               scope: $scope
           });*/

    };

       //////关闭确认帮助彩蛋弹出窗
    $scope.cancelHelpSurprise = function(){
        $scope.popupSurprise.close();
       };

    /////去帮助
    $scope.goToHelp = function(){

     donateService.conformHelp({xid:xid}).then(
        function(data){
            console.log("[confiem help]:"+JSON.stringify(data));
            $scope.popup.close();
            $scope.popupHelpSurprise();
            $state.go("choose_express",{info_type:'recipient',xid:$scope.info_detail.xid});
        },function(data){
            console.log("[confiem help]:fail");
            $rootScope.showTopMsg("失败了！" + data.toast);
        });
    
    };
  ///////////////////////////////

  ////////点击查看大图
  $scope.viewBigImage = function(index){
      $rootScope.slideIndex = index;
      $rootScope.log("slide index",$rootScope.slideIndex);
      var imgArr = new Array();
      for( var i= 0;i < $scope.info_detail.picture.length;i++)
      {
          imgArr[i] = $rootScope.basePicUrl + $scope.info_detail.picture[i];
      }
      $rootScope.showSlideImages(imgArr);
  };
///////////////////////
  ///////删除提示框
      //////弹出窗
  $scope.popupDelete = function() {

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

    $scope.deleteItem = {info_type:'',xid:''};
        $scope.onItemDelete = function(info_type,xid){

            console.log("deleting");
            $scope.deleteItem.info_type = info_type;
            $scope.deleteItem.xid = xid;
            $scope.popupDelete();

        };
      $scope.removeFromCollection = function(){
        //remove from collection
        $rootScope.log("deleteItem",JSON.stringify($scope.deleteItem));
        commonService.deleteInfo($scope.deleteItem).then(
            function(data){
                $rootScope.log('删除成功',JSON.stringify(data));
                $rootScope.showTopMsg("操作成功！");
                $rootScope.goBack();
            },function(data){
                $rootScope.log('删除失败','error');
                $rootScope.showTopMsg(data.toast+",请重试！");
            }
        );
      };
    
})
/////////////////////////我需要---填写详细的信息
.controller('needDetailCtrl', function($scope,$rootScope,$ionicModal, $state,$ionicPopup,$stateParams,localStorageService,addressService,
    commonService,recipientService,utilsService,popupService) {  //
    console.log("needDetailCtrl");

    //获取某条信息的具体xid
    var xid = $stateParams.xid;
    console.log("[info xid]:"+xid);

    ////确认申请帮助要提交到服务器数据
    $scope.needData = {xid:xid,is_mypay:null,comment:null,address_id:null};
    $scope.addressData = {address_id:'',phonenum:null,realname:null,province:'选择地区',city:'',county:'',detail_address:null,is_default:false,postcode:'123456'};

    ///
    //地址
    var vm=$scope.vm={};

    vm.cb = function () {
      console.log(vm.CityPickData.areaData)
      console.log(JSON.stringify( vm.CityPickData) );
      //$scope.addressData.pro_city_county = vm.CityPickData.areaData;
      var pro_city_county = vm.CityPickData.areaData;
      /////普通省和直辖市
      if(pro_city_county.length == 3){
      $scope.addressData.province = pro_city_county[0];
      $scope.addressData.city = pro_city_county[1];
      $scope.addressData.county = pro_city_county[2];
      }else if(pro_city_county.length == 2){
      $scope.addressData.province = pro_city_county[0];
      $scope.addressData.city = pro_city_county[0];
      $scope.addressData.county = pro_city_county[1];
      }

    }

    vm.CityPickData = {
      areaData: ['选择地址'],
      defaultAreaData: ['选择地址'],
      title: '地区',
      tag: '，',
      hardwareBackButtonClose: false,
      buttonClicked: function () {
          vm.cb()
        }
    }

    ///////////////////////原生pickcity
    $rootScope.globalAddress = {totalProCityCounty:'选择地区',province:'',city:'',county:''};
    $scope.pickDetailCity = function(){

        if( $scope.addressData.address_id != ''){    /////历史选择地址不可更改
            return false;
        }

        console.log("pickCity");
        if (ionic.Platform.isAndroid())
        { //android 下
            window.broadcaster.addEventListener( "detail_pick_city_success", function(e){
                ////////为毛通过$rootScope周转一边
                $rootScope.globalAddress.province = e.province;
                $rootScope.globalAddress.city = e.city;
                $rootScope.globalAddress.county = e.county;
                $rootScope.globalAddress.totalProCityCounty = $rootScope.globalAddress.province + ',' + $rootScope.globalAddress.city + ',' + $rootScope.globalAddress.county;
                $rootScope.log("data",JSON.stringify($rootScope.globalAddress.totalProCityCounty));
                $rootScope.showUpdateTransparent();
            });
            window.plugins.webintent.startActivity({
                action: 'com.afu.pick_city',
                url:'afu://pick_city?from=detail&city='+$rootScope.globalAddress.city+'&county='+$rootScope.globalAddress.county},
                function() {console.log("open success");},
                function() {
                console.log("open failed");
                alert('Failed to open URL via Android Intent')}
            );
        }else if(ionic.Platform.isIOS()){
            //$rootScope.showTopMsg("please wait ios");
            window.broadcaster.addEventListener( "update_pick_city_success", function(e){
                                                ////////为毛通过$rootScope周转一边
                                                $rootScope.globalAddress.province = e.province;
                                                $rootScope.globalAddress.city = e.city;
                                                $rootScope.globalAddress.county = e.county;
                                                $rootScope.globalAddress.totalProCityCounty = $rootScope.globalAddress.province + ',' + $rootScope.globalAddress.city + ',' + $rootScope.globalAddress.county;
                                                $rootScope.log("data",JSON.stringify($rootScope.globalAddress.totalProCityCounty));
                                                $rootScope.showUpdateTransparent();
                                                });

            window.broadcaster.fireNativeEvent( "pick_city", { province:$rootScope.globalAddress.province,city:$rootScope.globalAddress.city,county:$rootScope.globalAddress.county}, function() {
                                               console.log( "pick city fired!" );
                                               } );
        }
    };

    /**********************************通过历史地址选择********************************************/

    //历史地址选择弹出层
    $ionicModal.fromTemplateUrl('templates/home/pick-address.html', {
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.addressModal = modal;
     });
     $scope.openAddressModal = function() {
       $scope.addressModal.show();
       addressService.addressList().then(
            function(data){
                console.log("[address List]:"+JSON.stringify(data));
                $scope.addressList = data;
            },function(data){
                console.log("[address List]:failed");
                $rootScope.showTopMsg(data.toast+",请重试！");
            });
     };
     $scope.closeAddressModal = function() {
       $scope.addressModal.hide();
     };
     // Cleanup the modal when we're done with it!
     $scope.$on('$destroy', function() {
       $scope.addressModal.remove();
     });
     // Execute action on hide modal
     $scope.$on('modal.hidden', function() {
       // Execute action
     });
     // Execute action on remove modal
     $scope.$on('modal.removed', function() {
       // Execute action
     });

     $scope.chooseAddress = function(address){
         $scope.pickedAddress = address;
     };

     ///完成历史地址选择
     $scope.donePickAddress = function(){
         $scope.closeAddressModal();
         $scope.addressData = $scope.pickedAddress;
         $rootScope.globalAddress.province = $scope.pickedAddress.province;
         $rootScope.globalAddress.city = $scope.pickedAddress.city;
         $rootScope.globalAddress.county = $scope.pickedAddress.county;
         $rootScope.globalAddress.totalProCityCounty = $rootScope.globalAddress.province + ',' + $rootScope.globalAddress.city + ',' + $rootScope.globalAddress.county;

         console.log("[$scope.addressData]:"+JSON.stringify($scope.addressData));
         console.log("[$scope.pickedAddress]:"+JSON.stringify($scope.pickedAddress));
         if($scope.addressData.province == $scope.addressData.city)
         {
             vm.CityPickData.defaultAreaData = [$scope.addressData.city,$scope.addressData.county];
             vm.CityPickData.areaData = [$scope.addressData.city,$scope.addressData.county];
         }else{
             vm.CityPickData.defaultAreaData = [$scope.addressData.province,$scope.addressData.city,$scope.addressData.county];
             vm.CityPickData.areaData = [$scope.addressData.province,$scope.addressData.city,$scope.addressData.county];
         }

     };

    $scope.reset = function(){
	    $scope.addressData = {address_id:'',phonenum:null,realname:null,province:'选择地区',city:'',county:'',detail_address:null,is_default:false,postcode:'  '};
         $rootScope.globalAddress = {totalProCityCounty:'选择地区',province:'',city:'',county:''};
    };

    /*****************************是否承担运费选择器*************************************/
      $ionicModal.fromTemplateUrl('templates/home/money-choice.html', {
           scope: $scope,
           animation: 'slide-in-up'
         }).then(function(modal) {
           $scope.sexModal = modal;
         });
         $scope.openMoneyModal = function() {
           $scope.sexModal.show();
         };
         $scope.closeMoneyModal = function() {
           $scope.sexModal.hide();
         };
         // Cleanup the modal when we're done with it!
         $scope.$on('$destroy', function() {
           $scope.sexModal.remove();
         });
         // Execute action on hide modal
         $scope.$on('modal.hidden', function() {
           // Execute action
         });
         // Execute action on remove modal
         $scope.$on('modal.removed', function() {
           // Execute action
         });

$scope.openMoney = function(){
    $scope.openMoneyModal();
}
//


$scope.moneys = [
      { name: '本人承担运费',value:true },
      { name: '不承担运费',value:false }
        ];

$scope.tempMoney = { name: '是否承担运费',value:null};
$scope.needData.is_mypay = $scope.tempMoney.value;
//选择是否承担运费，打开modal选择器
$scope.chooseMoney = function(money)
{
    console.log("[chooseMoney]:");
    console.log("[chooseMoney]:==name:"+money.name+"==value:"+money.value);
    $scope.tempMoney = money;
    $scope.needData.is_mypay = money.value;
};

//完成选择是否承担运费，关闭modal选择器
$scope.doneMoney = function()
{
    console.log("[money-choice.html modal]:Close");
    $scope.closeMoneyModal();
};

//////检查认证状态弹出窗
$scope.popupOptions = function() {

    $scope.popup = $ionicPopup.show({
        cssClass:'er-popup',
        templateUrl: "templates/home/certification-popup.html",
        scope: $scope
    });

};
/////去认证
$scope.goToCertification = function(){
    $rootScope.log('去认证');
    $scope.popup.close();
    $state.go('certification');
};
//////关闭认证状态弹出窗
$scope.cancel = function(){
    $scope.popup.close();
};


$scope.checkCertification = function(){
    //////检查实名认证状态
    var authState = localStorageService.get("authenticateState",null);

    console.log("[authState]:"+JSON.stringify(authState) );

    if( null != authState )
    {
        if("checking" == authState.identity_state)
        {
            $rootScope.showTopMsg("请等待实名认证审核通过~");
            return false;
        }else if("pass" == authState.identity_state){
            return true;
        }else if("refuse" == authState.identity_state){
            $rootScope.showTopMsg("实名认证未通过！");
            return false;
        }else if("none" == authState.identity_state)
        {
            $scope.popupOptions();
            return false;
        }
    }

};

//////确认提交申请详细弹出窗
$scope.popupNeedDetail = function() {

    $scope.popupDetail = popupService.show('show',{
        cssClass:'er-popup',
        templateUrl: "templates/popup/need-detail-popup.html",
        scope: $scope
    });

};

//////关闭提交申请详细弹出窗
$scope.cancelNeedDetail = function(){
    $scope.popupDetail.close();
};




/////验证输入框是否都已经完整输入
var validateSubmitForm = function(){
    $scope.addressData.province = $rootScope.globalAddress.province;
    $scope.addressData.city = $rootScope.globalAddress.city;
    $scope.addressData.county = $rootScope.globalAddress.county;
    //$scope.needData = {xid:xid,is_mypay:null,comment:null,address_id:null};
    console.log("[addressData]："+JSON.stringify($scope.addressData));
    console.log("[needData]："+JSON.stringify($scope.needData));
    if( $scope.addressData.phonenum != null && $scope.addressData.realname !=null &&
        $scope.addressData.province != '' && $scope.addressData.city != '' &&
        $scope.addressData.county != '' && $scope.addressData.detail_address != null &&
        $scope.needData.is_mypay != null )
    {
        if( utilsService.testPhonenum($scope.addressData.phonenum) ){

            console.log("[validateSubmitForm]:OK");
            return true;
        }else{
            $rootScope.showTopMsg("手机号码格式不正确！");
            return false;
        }

    }else {
        console.log("[validateSubmitForm]:不完整");
        $rootScope.showTopMsg("信息填写不完整，请填写完整再申请！");
        return false;
    }
};

var submitWithAddressId = function (address_id) {
    $scope.needData.address_id = address_id;
    /////////申请求助
    console.log("[needData requesr]:"+JSON.stringify($scope.needData));
    recipientService.confirmClaim($scope.needData).then(
	function(data){
	        $scope.cancelNeedDetail();
            console.log("[recipientService datas]:"+JSON.stringify(data));
            $rootScope.showTopMsg("提交成功");
            $state.go("tab.progress",{tab:'qiu',subtab:'my_ren'});
            },
        function(data){
            console.log("[recipientService datas]:fails");
            $rootScope.showTopMsg("提交失败!" + data.toast);
            });
};

$scope.popupSubmit = function(){
    console.log("[addAddress requesr]:"+JSON.stringify($scope.addressData));
    if($scope.addressData.address_id != ''){
	submitWithAddressId($scope.addressData.address_id);
    }else{
	addressService.addAddress($scope.addressData).then(
	        function(data){
	            console.log("[addAddress datas]:"+JSON.stringify(data));
	            submitWithAddressId(data.address_id);

	        },function(data){
	            console.log("[addAddress datas]:error");
	            $rootScope.showTopMsg("提交失败!" + data.toast);
	        });
    }
};

$scope.submit = function(){
     $rootScope.log('[click 我需要 button]');
    if($scope.checkCertification() ){
         $rootScope.log('[checkCertification]:pass');
        if(validateSubmitForm()){
             $rootScope.log('[validateSubmitForm]:pass');
            $scope.popupNeedDetail();

        }else{
             $rootScope.log('[validateSubmitForm]:not pass');
            return false;
        }
    }else{
        $rootScope.log('[checkCertification]:not pass');
	    return false;
    }


};




})

/////////////////////////挑选要帮助的人
.controller('chooseHelpCtrl', function($scope,$rootScope, $state,$ionicPopup,$stateParams,localStorageService,commonService) {  //
    console.log("chooseHelpCtrl");
  //根据dpr选择不同的图片尺寸
    $scope.myImgSize = (lib.flexible.dpr == '3') ? '3' : '2';



})


/////////////////////////挑选要帮助的人
.controller('waitExpressCtrl', function($scope,$rootScope, $state,$ionicPopup,$stateParams,localStorageService,commonService) {  //
    console.log("waitExpressCtrl");
    $scope.donate = $stateParams;
})


/////////////////////////挑选快递
.controller('chooseExpressCtrl', function($scope,$rootScope, $state,$ionicPopup,$stateParams,localStorageService,commonService) {  //
    console.log("chooseExpressCtrl");
    var pageParameter = $stateParams;
    console.log("[pageParameter]:"+JSON.stringify(pageParameter));
    $scope.selfExpress = function() {
    $state.go("self_express",pageParameter);
    };
    $scope.stoneExpress = function() {
    $rootScope.showTopMsg("很快上线，敬请期待~");
    };

})

/////////////////////////自助快递
.controller('selfExpressCtrl', function($scope,$rootScope, $state,$ionicPopup,$stateParams,localStorageService,donateService,recipientService,popupService) {  //
    console.log("selfExpressCtrl");
     var pageParameter = $stateParams;
    console.log("[pageParameter]:"+JSON.stringify(pageParameter));

    if(pageParameter.info_type == "donate")
    {
	donateService.getExpressAddress({xid:pageParameter.xid}).then(
		function(data){
		    console.log("[donateService.getExpressAddress]:"+JSON.stringify(data));
		    $scope.expressAddress = data;
		},function(data){
		    $rootScope.showTopMsg(data.toast+",请重试！");
		    console.log("[donateService.getExpressAddress]:Error");
		});
    }else if(pageParameter.info_type == "recipient"){
	recipientService.getExpressAddress({xid:pageParameter.xid}).then(
		function(data){
		    console.log("[recipientService.getExpressAddress]:"+JSON.stringify(data));
		    $scope.expressAddress = data;
		},function(data){
		    console.log("[recipientService.getExpressAddress]:Error");
		    $rootScope.showTopMsg(data.toast+",请重试！");
		});
    }else{
	$rootScope.showTopMsg("info_type 类型错误");
    }

    //////确认我已经寄出-弹出窗
    $scope.confirmPopupOptions = function() {
        if( $scope.expressInfo.express_name == '' || $scope.expressInfo.express_number == '' ){
        	       $rootScope.showTopMsg("请完善物流信息！！");
        	       return false;
        	}
        $scope.confirmPopup = popupService.show('show',
             {
                 cssClass:'er-popup',
                 templateUrl: "templates/popup/confirm-send-out.html",
                 scope: $scope
              });
        $scope.confirmPopup.then(
            function(){
                console.log("popup close callback");
            }
        );
    };

    //////关闭确认我要帮助弹出窗
    $scope.cancelConfirm = function(){
        $scope.confirmPopup.close();
    };


    //////爱心寄出提醒弹出窗
    $scope.popupOptions = function() {

        $scope.popup = popupService.show('show',{
            cssClass:'er-popup',
            templateUrl: "templates/popup/send-out.html",
            scope: $scope
        });
    $scope.popup.then(
            function(){
                console.log("popup close callback");
                if(pageParameter.info_type == "donate")
                {
                    $state.go("tab.progress",{tab:'juan',subtab:'fabu_donate'});
                }else if(pageParameter.info_type == "recipient"){
                    $state.go("tab.progress",{tab:'juan',subtab:'my_juan'});
                }
            }
        );
    };

    //////关闭弹出窗
    $scope.cancel = function(){
        $scope.popup.close();
    };
    $scope.expressInfo = {info_type:pageParameter.info_type,xid:pageParameter.xid,express_name:'',express_number:''};
    //我已寄出按钮事件
    $scope.sendOut = function(){

	if(pageParameter.info_type == "donate")
	{
	    donateService.addExpress($scope.expressInfo).then(
		    function(data){
			console.log("[recipientService.addExpress]:"+JSON.stringify(data));
			$scope.confirmPopup.close();
            $scope.popupOptions();
		    },
		    function(data){
			console.log("[recipientService.addExpress]:Error");
			$rootScope.showTopMsg(data.toast+",请重试！");
		    });

	}else if(pageParameter.info_type == "recipient"){

	    donateService.addExpress($scope.expressInfo).then(
		    function(data){
			console.log("[donateService.addExpress]:"+JSON.stringify(data));
            $scope.confirmPopup.close();
			$scope.popupOptions();
		    },
		    function(data){
			console.log("[donateService.addExpress]:Error");
			$rootScope.showTopMsg(data.toast+",请重试！");
		    });

	}else{
	    $rootScope.showTopMsg("sendout info_type 类型错误");
	}
    };
})

/////////////////////////爱心邮寄中---收件人（求捐者）视角
.controller('expressMailingCtrl', function($scope,$rootScope, $state,$ionicPopup,$stateParams,localStorageService,recipientService,commonService,popupService) {
    console.log("expressMailingCtrl");
    console.log("[page params]"+JSON.stringify($stateParams));
    $scope.fromData = $stateParams;

    $scope.doRefresh = function(){
	commonService.viewExpressInfo($scope.fromData).then(
		function(data){
		    console.log("[commonService.viewExpressInfo]:" + JSON.stringify(data) );
		    $scope.expressInfo = data;
		},function(data){
		    console.log("[commonService.viewExpressInfo]:Error"  );
		    $rootScope.showTopMsg(data.toast+",请重试！");
		}
	);
	$scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();
    ///确认签收
    $scope.popupOptions = function() {

	    $scope.popup = $ionicPopup.show({
	            cssClass:'er-popup',
	            templateUrl: "templates/popup/confirm-sign-popup.html",
	            scope: $scope
	        });

	};
   //////关闭弹出窗
   $scope.cancel = function(){
       $scope.popup.close();
   };

   //////收到爱爱心彩蛋弹出窗
   $scope.popupReceiveSurprise = function() {

   	$scope.popupSurprise = popupService.show('show',{
               cssClass:'surprise-er-popup',
               templateUrl: "templates/popup/confirm-receive-surprise-popup.html",
               scope: $scope
           });
     $scope.popupSurprise.then(
                function(){
                    $rootScope.log("popup","callback");
                    if($stateParams.info_type == 'donate'){
                        $state.go("tab.progress",{tab:'qiu',subtab:'my_ren'});
                    }else if($stateParams.info_type == 'recipient'){
                        $state.go("tab.progress",{tab:'qiu',subtab:'fabu_recipient'});
                    }

                }
            );
    };

       //////关闭爱心彩蛋弹出窗
    $scope.cancelReceiveSurprise = function(){
   	    $scope.popupSurprise.close();
       };


    var sign = function(){
	    recipientService.signFor({info_type:$scope.fromData.info_type,xid:$scope.fromData.xid}).then(
		function(data){
		    console.log("[recipientService.signFor]:" + JSON.stringify(data) );
		    $scope.popup.close();

		    $scope.popupReceiveSurprise();
            //$state.go("tab.progress");

		},function(data){
		    console.log("[recipientService.signFor]:Error");
		    $rootScope.showTopMsg(data.toast+",请重试！");
		}
	);
    };
    
    //////确认
    $scope.confirm = function(){
	sign();
	
    };
})

/////////////////////////爱心邮寄中---寄件人（捐助者）视角
.controller('myActiveExpressMailingCtrl', function($scope,$rootScope, $state,$ionicPopup,$stateParams,localStorageService,recipientService,donateService,commonService) {  //
    console.log("myActiveExpressMailingCtrl");
    console.log("[page params]"+JSON.stringify($stateParams));
    var fromData = $stateParams;
    $scope.doRefresh = function(){

        if(fromData.info_type == "donate")
        {
            donateService.getExpressAddress({xid:fromData.xid}).then(
                function(data){
                    console.log("[donateService.getExpressAddress]:"+JSON.stringify(data));
                    $scope.expressAddress = data;
                },function(data){
                    console.log("[donateService.getExpressAddress]:Error");
                    $rootScope.showTopMsg(data.toast+",请重试！");
                });
        }else if(fromData.info_type == "recipient"){
            recipientService.getExpressAddress({xid:fromData.xid}).then(
                function(data){
                    console.log("[recipientService.getExpressAddress]:"+JSON.stringify(data));
                    $scope.expressAddress = data;
                },function(data){
                    console.log("[recipientService.getExpressAddress]:Error");
                    $rootScope.showTopMsg(data.toast+",请重试！");
                });
        }else{
            $rootScope.showTopMsg("info_type 类型错误");
        }

        commonService.viewExpressInfo(fromData).then(
            function(data){
                console.log("[commonService.viewExpressInfo]:" + JSON.stringify(data) );
                $scope.expressInfo = data;
            },function(data){
                console.log("[commonService.viewExpressInfo]:Error"  );
                $rootScope.showTopMsg(data.toast+",请重试！");
            }
        );
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();

})