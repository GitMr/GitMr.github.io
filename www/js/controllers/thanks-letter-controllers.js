angular.module('afu.thanks-controllers', [])
////编辑感谢信
.controller('editThanksLetterCtrl', function($scope,$rootScope,$stateParams,$state,$ionicPopup,$ionicActionSheet,$ionicLoading,$cordovaCamera,$cordovaImagePicker) {  //
    console.log("editThanksLetterCtrl");
    
    $scope.thanksLetter = { xid:$stateParams.xid,info_type:$stateParams.info_type, image:"img/thanks_pick_image.png",thanks_content:''};
    
    //选择照片的配置项
    /*var myOptions = {
	    maximumImagesCount: 1,
	    width: 0,
	    height: 0,
	    quality: 0
	   };
    $scope.pickImage = function()
    {
	console.log("[pickImages]");	    
	$cordovaImagePicker.getPictures(myOptions)		  
	.then(function (results) {	
	    
	    for (var i = 0; i < results.length; i++) {		      
		console.log('[Image URI]: ' + results[i]);
		$scope.thanksLetter.image = results[i];
		
		}	
		
	}, function(error) {		   
	    // error getting photos
	    //$scope.images = [];
	    console.log("[pickImages error]:error getting photos");
		 
	});
	
	 
    };*/

    var options = {
         quality: 100,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: Camera.PictureSourceType.CAMERA,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: screen.width*2,
         targetHeight: screen.height*2,
         popoverOptions: CameraPopoverOptions,
         saveToPhotoAlbum: false,
         correctOrientation:true
       };

    var startCamera = function(){
       options.sourceType = Camera.PictureSourceType.CAMERA;
       $cordovaCamera.getPicture(options).then(function(imageData) {
         console.log('Image URI: ' + imageData);
         $scope.thanksLetter.image = imageData;
       }, function(err) {
         console.log("error getting photos");
       });
    };
    var startAlbum = function(){
       options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
       $cordovaCamera.getPicture(options).then(function(imageData) {
         console.log('Image URI: ' + imageData);
         $scope.thanksLetter.image = imageData;
       }, function(err) {
         console.log("error getting photos");
       });
    };

    $scope.pickImage = function()
    {
     console.log("pickImages");
     $ionicActionSheet.show({
         buttons: [
           { text: '相册' },
           { text: '拍照' },
         ],
         titleText: '照片来源',
         cancelText: '取消',

         buttonClicked: function(index) {
            switch (index){
            //相册
                case 0:
                {
                startAlbum();
                break;
                }
                case 1:
                {
                startCamera();
                break;
                }
            }
            return true;
         }
       });
    };


    $scope.writeOk = function(){
        if($scope.thanksLetter.thanks_content.length < 10 ){
            $rootScope.showTopMsg("请认真输入感谢信内容~");
            return false;
        }
        if( $scope.thanksLetter.image != "img/thanks_pick_image.png" ){
            $state.go('preview_thanks_letter',$scope.thanksLetter );
        }else{
            $rootScope.showTopMsg("请上传一张确认照片~");
            return false;
        }

    };

})
/////预览感谢信
.controller('previewThanksLetterCtrl', function($scope,$rootScope,$stateParams,$state,$ionicPopup,$ionicLoading,$cordovaImagePicker,recipientService) {  //
    console.log("previewThanksLetterCtrl");
    
    $scope.thanksLetter = $stateParams;

    ///确认发送感谢信
    $scope.popupOptions = function() {
	       
	    $scope.popup = $ionicPopup.show({
	            cssClass:'er-popup',
	            templateUrl: "templates/popup/send-thanks-popup.html",
	            scope: $scope
	        });
	       
	    };
	    
   //////关闭弹出窗
   $scope.cancel = function(){
       $scope.popup.close();
   };
    
 //上传成功
   var success = function (r) {
        $ionicLoading.hide();
       console.log("[Register]:上传成功! Code = " + r.responseCode);
       var res = JSON.parse(r.response);
       $rootScope.log("result",JSON.stringify(res));
       if( res.result == "ok"){
            $rootScope.showTopMsg("发送成功");
            $scope.popup.close();
            if( $scope.thanksLetter.info_type == "donate" ){
                $state.go("tab.progress",{tab:'qiu',subtab:'my_ren'});
            }else if($scope.thanksLetter.info_type == "recipient"){
                $state.go("tab.progress",{tab:'qiu',subtab:'fabu_recipient'});
            }

       }else{
            $rootScope.showTopMsg("失败,"+res.message);
       }

   }

   //上传失败
   var fail = function (error) {
        $ionicLoading.hide();
        $rootScope.showTopMsg("发送失败！请重试！");
       //alert("[Register]:上传失败! Code = " + error.code);
       $rootScope.log('result Code',error.code);
   }

   var optionss = new FileUploadOptions();
   optionss.fileKey = "thanks_picture";
   optionss.fileName =  $scope.thanksLetter.image.substring( $scope.thanksLetter.image.lastIndexOf('/') + 1,$scope.thanksLetter.image.length ).split('?')[0];
   optionss.mimeType = "image/jpeg";

   //上传参数
   var params = $scope.thanksLetter;
   optionss.params = params;

   var ft = new FileTransfer();
   
   
   
   var done = function(){
    $ionicLoading.show({
     template: '<p>发送中...</p><ion-spinner class="spinner-assertive"></ion-spinner>',
        });
	ft.upload($scope.thanksLetter.image, encodeURI($rootScope.baseUrl+"recipient/send_thanks"), success, fail, optionss);

   };
   
   
   
    var send = function(){
	done();
	/*recipientService.sendThanks($scope.thanksLetter).then(
		function(data){
		    console.log("[recipientService.sendThanks]:"+JSON.stringify(data));
		},function(){
		    console.log("[recipientService.sendThanks]:Error");
		}
	);*/
    };
    
    //////确认
    $scope.confirm = function(){
	send();
    };
    $scope.showBig = function(src){
        var srcArr = new Array(src);
        $rootScope.log('src',src);
        $rootScope.showSlideImages(srcArr);
    };


})


/////查看感谢信
.controller('viewThanksLetterCtrl', function($scope,$rootScope,$stateParams,$ionicModal,$ionicActionSheet,$state,
$ionicPopup,$cordovaImagePicker,donateService,shareService,commonService) {  //
    console.log("viewThanksLetterCtrl"); 
   $scope.markRead = function(){
           commonService.markRead($stateParams).then(
               function(data){
                   $rootScope.log("mark read response",JSON.stringify(data));
               },function(data){
                   $rootScope.log("mark read response","error");
               }
           );
       };

    $scope.doRefresh = function(){
	donateService.viewThanksLetter($stateParams).then(
		function(data){
		    console.log("[viewThanksLetter]:"+JSON.stringify(data));
		    $scope.thanksLetter = data;
		},function(data){
		    console.log("[viewThanksLetter]:Error");
		    $rootScope.showTopMsg(data.toast+",请重试！");
		}
	);
	 $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();
    $scope.markRead();
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
	$scope.thumb = $rootScope.basePicUrl + $scope.thanksLetter.thanks_small_picture; 
         switch (index){
             //微信好友
             case 0:
             {
      	   	message = {
            		title: "感谢信",
            	        description: $scope.thanksLetter.thanks_content.substr(0,50),
            	        thumb: $scope.thumb,
            	        mediaTagName: "",
            	        messageExt: "阿福公益",
            	        messageAction: "",
            	        media: {
            	            type: Wechat.Type.LINK,
            	            webpageUrl:  $rootScope.baseUrl + "common/thanks?info_type="+$stateParams.info_type+"&xid="+$stateParams.xid
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
       		title: "感谢信",
       	        description: $scope.thanksLetter.thanks_content.substr(0,50),
       	        thumb: $scope.thumb,
       	        mediaTagName: "",
       	        messageExt: "阿福公益",
       	        messageAction: "",
       	        media: {
       	            type: Wechat.Type.LINK,
       	            webpageUrl:  $rootScope.baseUrl + "common/thanks?info_type="+$stateParams.info_type+"&xid="+$stateParams.xid
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
                 args.url = $rootScope.baseUrl + "common/thanks?info_type="+$stateParams.info_type+"&xid="+$stateParams.xid;
                 args.title = "关注阿福，关注公益";
                 args.description = $scope.thanksLetter.thanks_content;
                 args.imageUrl = $scope.thumb;
                 args.appName = "阿福公益";
                 shareService.QQShare(args);
    
             break;
             }
         //qq空间
             case 4:
             {
          	   var args = {};
                     args.url = $rootScope.baseUrl + "common/thanks?info_type="+$stateParams.info_type+"&xid="+$stateParams.xid;
                     args.title = "关注阿福，关注公益";
                     args.description = $scope.thanksLetter.thanks_content;
                     var imgs =[$scope.thumb];
                     args.imageUrl = imgs;
                     shareService.QzoneShare(args);
    
             break;
             }
             //新浪微博
             case 3:
             {
                     var args = {};
                     args.url = $rootScope.baseUrl + "common/thanks?info_type="+$stateParams.info_type+"&xid="+$stateParams.xid;
                     args.title = "关注阿福，关注公益";
                     args.description = $scope.thanksLetter.thanks_content;
                     //if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png 
                     //will be the defualt one
                     args.imageUrl = $scope.thumb;
                     args.defaultText = "关注阿福，关注公益";
                     shareService.sinaShare(args);
             break;
             }
         }
      };
    $scope.showBig = function(){
            var src = $rootScope.basePicUrl + $scope.thanksLetter.thanks_picture;
            var srcArr = new Array(src);
            $rootScope.log('showbig',JSON.stringify(srcArr));
            $rootScope.showSlideImages(srcArr);
        };
    
})


