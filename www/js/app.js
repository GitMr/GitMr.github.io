// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('afu', ['ionic',
                       'afu.controllers', 
                       'afu.routes',
                       'afu.services', 
                       'afu.directives',
                       'monospaced.elastic',
                       'ngCordova',
                       'ngCookies',
                       'ionicLazyLoad',  //lazy load
                       'ionicImgCache',
                       'ionic-citypicker',
                       'afu.new-controllers',
                       'afu.home-controllers',
                       'afu.auth-controllers',
                       'afu.address-controllers',
                       'afu.certification-controller',
                       'afu.personal-info-controller',
                       'afu.feedback-about-controller',
                       'afu.my-collection-controllers',
                       'afu.thanks-controllers',
                       'afu.choose-help-who-controller',
                       'afu.welcome-controllers',
                       'afu.settings-controllers',
                       'afu.my-fabu-controllers',
                       'afu.auth-services',
                       'afu.common-service',
                       'afu.person-service',
                       'afu.donate-service',
                       'afu.address-service',
                       'afu.recipient-service',
                       'afu.share-service',
                       'afu.popup-service'
])
/*.constant('$ionicLoadingConfig', {
    duration:6000
})*/

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}])

/////图片缓存
.config(function(ionicImgCacheProvider) {
    // Enable imgCache debugging.
    ionicImgCacheProvider.debug(false);
    // Set storage size quota to 100 MB.
    ionicImgCacheProvider.quota(100);
    // Set foleder for cached files.
    ionicImgCacheProvider.folder('afu-cache');
  })
.config(function($provide){
 
    $provide.decorator("$exceptionHandler", function($delegate, $injector){
        return function(exception, cause){
            console.log("[app exception]:"+JSON.stringify(exception)+"\n[cause]:"+JSON.stringify(cause));
            //var $rootScope = $injector.get("$rootScope");
            //$rootScope.addError({message:"Exception", reason:exception});
            $delegate(exception, cause);
        };
    });
 
})

.config([ '$httpProvider', function($httpProvider) { 
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('httpInterceptor'); 
  
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
	/**
	 * The workhorse; converts an object to x-www-form-urlencoded serialization.
	 * @param {Object} obj
	 * @return {String}
	 */
	var param = function(obj) {
		var query = '';
		var name, value, fullSubName, subName, subValue, innerObj, i;

		for (name in obj) {
			value = obj[name];

			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null) {
				query += encodeURIComponent(name) + '='
						+ encodeURIComponent(value) + '&';
			}
		}

		return query.length ? query.substr(0, query.length - 1) : query;
	};

	return angular.isObject(data) && String(data) !== '[object File]'? param(data): data;
}];
  
} ])


.run(function($state,$ionicPlatform,$injector, $http,$ionicPopup,$ionicModal,$timeout,$rootScope,$location,$cordovaSplashscreen,$cordovaToast,$cordovaNetwork,$cordovaStatusbar,$ionicHistory,
	localStorageService, dateService,commonService,certificationService,popupService,$ionicSlideBoxDelegate,$cordovaFileTransfer,$ionicLoading) {

    console.log("[init thanks popup]");

    ///新的感谢信弹窗
     $rootScope.popupNewThanks = function(){
         $rootScope.thanksPopup = popupService.show('show',
         {
             cssClass:'er-popup',
             templateUrl: "templates/popup/new-thanks-popup.html",
             scope: $rootScope
          });
          console.log("[$rootScope.thanksPopup]:"+JSON.stringify($rootScope.thanksPopup));
         };
    $rootScope.cancelThanksPopup = function(){
        console.log("[$rootScope.thanksPopup cancel]:"+JSON.stringify($rootScope.thanksPopup));
        $rootScope.thanksPopup.close();
    };

    var arrayPushData = new Array();
    $rootScope.progressActive = localStorageService.get("isProgressActive",{value:false}).value;
    $rootScope.personalActive = localStorageService.get("isPersonalActive",{value:false}).value;
    console.log("redddddd:"+JSON.stringify(localStorageService.get("isProgressActive",{value:false})));
    $rootScope.pushData = {push_type:'',info_type:'',xid:''};  ///push_type: progress identity thanks
    $rootScope.thanks = {info_type:'',xid:''};
    //监听jpush推送
	var onReceiveMessage = function(event){
	    console.log("[receive push msg]:"+JSON.stringify(event));
	    $rootScope.pushData = JSON.parse(event.message);
	    console.log("pushData:"+JSON.stringify($rootScope.pushData));

	    if( $rootScope.pushData.push_type == "thanks"){   //感谢信推送弹窗
	        console.log("push_type:"+$rootScope.pushData.push_type);
	        $rootScope.thanks = $rootScope.pushData;
            $rootScope.popupNewThanks();
            $rootScope.progressActive = true;
            localStorageService.update("isProgressActive",{value:$rootScope.progressActive});
	    }else if( $rootScope.pushData.push_type == "progress" ){  //普通的进程更新推送打上小红点
	        $rootScope.progressActive = true;
	        localStorageService.update("isProgressActive",{value:$rootScope.progressActive});
	        $rootScope.showTopMsg("有新进程哦~~");
           // arrayPushData.push($rootScope.pushData);
            console.log("push_type:"+$rootScope.pushData.push_type);
            //localStorageService.update("arrayPushData",arrayPushData);
            //$rootScope.$broadcast("progressData", $rootScope.pushData);

	    }else if( $rootScope.pushData.push_type == "identity" ){   //认证更新推送打上小红点
	        $rootScope.personalActive = true;
	        localStorageService.update("isPersonalActive",{value:$rootScope.personalActive});
	        $rootScope.showTopMsg("实名认证有更新哦~~");
            console.log("push_type:"+$rootScope.pushData.push_type);
	    }



    };
    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);


    $rootScope.goToWatchThanks = function(){
        $rootScope.thanksPopup.close();
        $state.go("view_thanks_letter",{info_type:$rootScope.thanks.info_type,xid:$rootScope.thanks.xid});
    };

    ///////用于提示错误，供调试，上线则关闭此功能
    $rootScope.showDebugToast = function(msg){
        var isDebug = false;
        if(isDebug)
        {
            $cordovaToast.showLongCenter("!!!!开发者模式!!!!\n"+msg);
        }
    }
    ///////用于提示错误，供调试，上线则关闭此功能
    $rootScope.log = function(tag,msg){
        var isDebug = false;
        if(isDebug)
        {
            console.log('['+tag+']:'+msg);
        }
    }


    $rootScope.meiYouLe = "- 没有内容了 -";
    $rootScope.appName = "阿福公益";
    $rootScope.defaultShareDescription = "关注阿福，关注公益";
    //$rootScope.baseUrl = 'http://192.168.199.161:8080/AFu/';
    //$rootScope.basePicUrl = 'http://192.168.199.161:8080/';
    //var host = "http://123.57.243.128/AFu/";
    var host = "http://afuu.mobi/AFu/";
    $rootScope.baseUrl = host + "" ;
    $rootScope.basePicUrl = host + "../";

    //$rootScope.baseUrl = 'http://202.204.121.58:8001/AFu/';
    //$rootScope.basePicUrl = 'http://202.204.121.58:8001/';
	//'http://202.204.121.58:8080/AFu/';
	//'http://192.168.199.161:8080/AFu/';
   
    /***图片预览轮播***/
    var buildModal = function(){

        $ionicModal.fromTemplateUrl('templates/modal-slide-images.html', {
            scope: $rootScope,
            animation: 'slide-in-down'
          }).then(function(modal) {
              $rootScope.slide = modal;
              $rootScope.slide.show();
          });

    };


    $rootScope.hideAndRemove = function(){
        $rootScope.slide.hide();
        $rootScope.index = 0;
        $rootScope.slide.remove();
    };

    $rootScope.showSlideImages = function(images) {

        console.log("[showSlideImages]:"+JSON.stringify(images));
        $rootScope.slideImages = images;
        buildModal();
    };

    $rootScope.slideChanged = function(index){
        $rootScope.slideIndex = index;
    };

	//////save image to photo gallery from url
	 $rootScope.saveToGallery = function(){
	    if(ionic.Platform.isAndroid()){
             var timestamp = new Date().getTime();
             var url =  $rootScope.slideImages[$rootScope.slideIndex];
             var targetPath = cordova.file.externalRootDirectory + "/AFu/afugongyi/save-"+timestamp+".jpg"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
             var trustHosts = true
             var options = {};
             $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(
             function (result) {
                 $ionicLoading.show({template: '保存成功！', noBackdrop: true, duration: 2000});
            }, function (err) {
                console.log("err:"+JSON.stringify(err));
                $ionicLoading.show({template: '保存失败！请重试！', noBackdrop: true, duration: 2000});
            }, function (progress) {
                $ionicLoading.show({ template: '<ion-spinner class="spinner-assertive"></ion-spinner>'});

            });
        }else if(ionic.Platform.isIOS()){
            var url =  $rootScope.slideImages[$rootScope.slideIndex];
            ImgCache.cacheFile(url,
            function(){
                console.log("success callback");
                console.log("path:"+ImgCache.private.getCachedFilePath(url));
                console.log("full_path:"+ImgCache.private.getCachedFileFullPath(url));

            },
            function(){
                console.log("fail callback");
            },
            function(){
                console.log("on_progress callback");
            });
        }

	 };


    
    //上方下滑提示
    $ionicModal.fromTemplateUrl('templates/topmsg.html', {
	    scope: $rootScope,
	    animation: 'slide-in-down'
	  }).then(function(modal) {
	      $rootScope.topmsg = modal;
	  });
    /**
     * Param: msg 提示性的文字
     * **/
    $rootScope.showTopMsg = function(msg) {
        console.log("[showTopMsg]:"+ msg);
        $rootScope.msg = msg;
        $rootScope.topmsg.show();
            $timeout(function() {
            $rootScope.topmsg.hide(); //close the popup after 2 seconds
            }, 2000);
	  };
	  
	  
	//加载动画

/** * Param: loading 动画
	    * **/
     $rootScope.showLoading = function() {
	
	$ionicLoading.show({
		 template: '<p>加载中..</p><ion-spinner class="spinner-assertive"></ion-spinner>'
         });
	
	};
     $rootScope.dismissLoading = function() {
		
	 $ionicLoading.hide();	
	};
	//透明的窗口，看不见。用来强制刷新页面数据和UI
    $ionicModal.fromTemplateUrl('templates/update_transparent.html', {
        scope: $rootScope,
        animation: 'slide-in-down'
      }).then(function(modal) {
          $rootScope.updateTransparent = modal;
      });
    /**
     * //透明的窗口，看不见。用来强制刷新页面数据和UI function
     * **/
    $rootScope.showUpdateTransparent = function() {
        $rootScope.updateTransparent.show();
            $timeout(function() {
            $rootScope.updateTransparent.hide(); //close the popup after 1 seconds
            }, 500);
      };



	///网络弹窗
     $rootScope.myImgSize = (lib.flexible.dpr == '3') ? '3' : '2';
     $rootScope.networkOfflinePopup = function(){
         $rootScope.netpopup =  popupService.show('show',
         {
             cssClass:'er-popup',
             templateUrl: "templates/popup/network-offline-popup.html",
             scope: $rootScope
          });
     };

    $rootScope.goToSettings = function(){
        if(ionic.Platform.isAndroid()){
            window.plugins.webintent.startActivity({
            action: 'android.settings.WIFI_SETTINGS',
            },
            function() {
                $rootScope.netpopup.close();
                console.log("open success");
            },
            function() {
                console.log("open failed");
                alert('Failed to open URL via Android Intent');
            }
        );
        }else if(ionic.Platform.isIOS()){
           window.broadcaster.fireNativeEvent( "set.settings", {}, function() {
             console.log( "go settings" );
             } );

        }

    };

	
    //goBack 回退函数
	  $rootScope.goBack = function()
	  {
	      console.log("ionicHistory backView");  
	      $ionicHistory.goBack();
	  }


    //双击退出   只有android有返回键
    if (ionic.Platform.isAndroid()) {

        //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            console.log("app backbutton" + $location.path());

            //判断处于哪个页面时双击退出
            if ($location.path() == '/tab/home'   //在主页无论哪个tab下，两次后退键都是退出
                || $location.path() == '/tab/progress'
                || $location.path() == '/tab/personal'
                || $location.path() == '/welcome'
                ) {
                if ($rootScope.backButtonPressedOnceToExit) {
                    $rootScope.log("exit","exit app");
                    window.close();    //因为加了addEventListener无法退出，家这条语句
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortCenter('再按一次退出应用');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
                console.log("click back in index");
            }else if ($location.path() == '/personal/certification')
            {
                console.log("click back in certification");
                $rootScope.$broadcast("get_backbutton", "");
            }
            else if ($ionicHistory.backView()) {
                console.log("ionicHistory backView");
                $ionicHistory.goBack();

            } else {  //在后退没有历史页面情况下，两次后退键都是退出
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortCenter('再按一次退出应用');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
                console.log("-----------------------4");
            }
            e.preventDefault();
            return false;
        }, 101);

        ////////////启动页退出   启动页用的是modalview  默认的返回键优先级是200   必须定义一个优先级比200高的才能在启动页的时候点击返回退出

       $rootScope.deRegisterBackBtn = $ionicPlatform.registerBackButtonAction(function (e) {
    	    console.log("app backbutton" + $location.path());

            if ($rootScope.isFirstIn.state) {
                if ($rootScope.backButtonPressedOnceToExit) {
                    $rootScope.log("exit","exit app");
                    window.close();    //因为加了addEventListener无法退出，家这条语句
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortCenter('再按一次退出应用');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
                console.log("click back in index");
            }else if ($location.path() == '/personal/certification')
            {
                console.log("click back in certification");
                $rootScope.$broadcast("get_backbutton", "");
            }
            else if ($ionicHistory.backView()) {
                console.log("ionicHistory backView");
                $ionicHistory.goBack();

            } else {  //在后退没有历史页面情况下，两次后退键都是退出
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortCenter('再按一次退出应用');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
                console.log("-----------------------4");
            }
            e.preventDefault();
            return false;
        }, 201);

    }
    var url = "";
    if (ionic.Platform.isAndroid()) {  //android 下
        url = "/android_asset/www/";
    }
    
    
    //
    
    //获取认证状态
    certificationService.viewAuthenticateState().then(
	    function(data){
		localStorageService.update("authenticateState",data);
	    },function(){
		
	    });
    //获取物品种类
   commonService.getwtype().then(
        function(data){
           localStorageService.update("getwtype",data);
        },function(){

        });
    //获取首页初始捐助数据
   commonService.infoList({info_type:"donate",page_num:1}).then(
	    function(data){
		localStorageService.update("juan_infoList",data);
	    },function(){
		
	    });
    //获取首页初始求助数据
    commonService.infoList({info_type:"recipient",page_num:1}).then(
	    function(data){
		localStorageService.update("qiu_infoList",data);
	    },function(){
		
	    });

   //每次退出应用再次进入前会检查认证状态，所以每次初始化时将状态设为需要检查
    localStorageService.update("iSCheckCertification", true);

   //////
    //欢迎 引导

    /**
     * //欢迎 引导
     * **/
    $rootScope.showGuide = function() {
        $ionicModal.fromTemplateUrl('templates/guide/guide.html', {
        scope: $rootScope,
        animation: 'slide-in-down'
      }).then(function(modal) {
          ionic.Platform.fullScreen(true,false);
          $rootScope.guide = modal;
          $rootScope.guide.show();
      });
        //$rootScope.is
      };
    $rootScope.confirmFirstIn = function(){
        console.log("close guideCtrl");
        if(ionic.Platform.isAndroid()){
            ionic.Platform.fullScreen(false,true);
        }else{
            ionic.Platform.fullScreen(true,true);
        }

        localStorageService.update("is_first_in", {"state":false});
        $rootScope.guide.hide();
        $rootScope.guide.remove();
        $rootScope.deRegisterBackBtn();

        $rootScope.isFirstIn.state = false;
    };




    ///////////////////////////////////////////
    //
    $ionicPlatform.ready(function() {

        //method should be called in the platfrom ready function wangyong
        if(ionic.Platform.isAndroid()){
            ionic.Platform.fullScreen(true,false);

        }else{
            ionic.Platform.fullScreen(true,true);
            if (window.StatusBar) {
                 $cordovaStatusbar.style(0);
                 $cordovaStatusbar.styleColor('white');
                 $cordovaStatusbar.overlaysWebView(false);
                 console.log("set status bar");
             }else{
                console.log("set status bar fail");
             }
        }

         // listen for Online event
         $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            var onlineState = networkState;
            //$cordovaToast.showLongCenter("online");
            $rootScope.netpopup.close();
         })

         // listen for Offline event
         $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            //$cordovaToast.showLongCenter("offline");
            $rootScope.networkOfflinePopup();
         })

        /**
         * updated by wangyong
         * jpush 推送服务。以下两行初始化代码务必放在此函数中！
         * */
        console.log("初始化jpush");
        //启动极光推送服务
        window.plugins.jPushPlugin.init();
        //调试模式
        window.plugins.jPushPlugin.setDebugMode(true);

        var timeout = 1500;
        $rootScope.deviceSize = screen.width * window.devicePixelRatio + "_" + screen.height * window.devicePixelRatio;
        console.log("deviceSize:"+ $rootScope.deviceSize);
        $rootScope.isFirstIn = localStorageService.get("is_first_in", {"state":true});
        if( $rootScope.isFirstIn.state ){
            $state.go("tab.home");
            $rootScope.showGuide();
            timeout = 3000;
            //$state.go("guide");
            //localStorageService.update("is_first_in", true);
            //isFirstIn = false;
        }else{

        //var isFirstIn = false;
        /////从ready函数迁移
            if (ionic.Platform.isAndroid()) {  //android 下
                   $rootScope.deRegisterBackBtn();
            }
            var isLogin = localStorageService.get("isLogin",{"state":false});
            console.log("login state:"+isLogin.state);
            if(!isLogin.state)
            {
                //$state.go("login");
                $state.go("welcome");
            }else
            {
                if( $rootScope.pushData.push_type == 'progress'){
                    $state.go("tab.progress");
                }else{
                    $state.go("tab.home");
                }

            }
        }
       
        setTimeout(function () {
            ionic.Platform.fullScreen(false,true);
            navigator.splashscreen.hide();
        }, timeout);
    	console.log("device ready");
        
        ///////////////

      ////////Native To JavaScript
        /*window.broadcaster.addEventListener( "donate_success", function(data) {
                //log: didShow received! userInfo: {"data":"test"}
                console.log( "didShow received! userInfo: " +JSON.stringify(data));
                $rootScope.showTopMsg("发布成功");
                $rootScope.faBuDonatePopup();
        });*/
    });
});
