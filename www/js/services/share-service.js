/*
 * FileName:share-service.js
 * TODO:分享service
 * Author：WY
 * Date:
 */

/*module中ng-app的名字应该在html中标明*/
angular.module('afu.share-service',[])
.factory("shareService",function($q,$http,$rootScope,$ionicLoading){
    
    return{
      
        /*wechat share*/
        wechatShare:function(message,scene){
                $ionicLoading.show({
    		 template: '<p>准备分享内容...</p><ion-spinner class="spinner-assertive"></ion-spinner>',
    		 duration:5000
    		
                });
            Wechat.isInstalled(function (installed) {
                Wechat.share({
                    message: message,
                    scene: scene   // share to SESSION/TIMELINE
                }, function () {
                    $ionicLoading.hide();
                    $rootScope.showTopMsg("分享成功");
                }, function (reason) {
                    $ionicLoading.hide();
                    $rootScope.showTopMsg("失败: " + reason);
                });
            }, function (reason) {
                $ionicLoading.show({
                    template: '<p>未安装微信</p>',
                    duration:1500
                    });
            });

        },//wechat share
        
        /*QQ share*/
        QQShare:function(args){
            $ionicLoading.show({
             template: '<p>准备分享内容...</p><ion-spinner class="spinner-assertive"></ion-spinner>',
             duration:5000
               });
           //////检查是否安装qq
           YCQQ.checkClientInstalled(function(){
                YCQQ.shareToQQ(
                    function(){
                    $ionicLoading.hide();
                        console.log("share success");
                        $rootScope.showTopMsg("分享成功");
                    },function(failReason){
                     $ionicLoading.hide();
                        console.log(failReason);
                        $rootScope.showTopMsg("失败: " + failReason);
                    },args);
           },function(){
               $ionicLoading.show({
                   template: '<p>未安装手机QQ</p>',
                   duration:1500
                   });
               console.log('client is not installed');
           });

            
        },//QQ share end
        
        /*Qzone share*/
        QzoneShare:function(args){
            $ionicLoading.show({
  		 template: '<p>准备分享内容...</p><ion-spinner class="spinner-assertive"></ion-spinner>',
  		 duration:5000
              });

          YCQQ.checkClientInstalled(function(){
               console.log('client is installed');
               YCQQ.shareToQzone(
                    function(){
                        $ionicLoading.hide();
                       console.log("share success");
                       $rootScope.showTopMsg("分享成功");
                   },function(failReason){
                $ionicLoading.hide();
                       console.log(failReason);
                       $rootScope.showTopMsg("失败: " + failReason);
                   },args);
          },function(){
              $ionicLoading.show({
                 template: '<p>未安装手机QQ</p>',
                 duration:1500
                 });
             console.log('client is not installed');
          });


            
        },//Qzone share end
        
        /*sina share*/
        sinaShare:function(args){
            $ionicLoading.show({
  		 template: '<p>准备分享内容...</p><ion-spinner class="spinner-assertive"></ion-spinner>',
  		 duration:5000
              });
            YCWeibo.shareToWeibo(function () {
        	$ionicLoading.hide();
        	console.log("share success");
                $rootScope.showTopMsg("分享成功");
             }, function (failReason) {
        	 $ionicLoading.hide();
                 console.log(failReason);
                 $rootScope.showTopMsg("失败: " + failReason);
             }, args);
            
        },//sina share end
    };
    
})
