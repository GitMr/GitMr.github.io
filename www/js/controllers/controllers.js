angular.module('afu.controllers', [])
.controller('tabJuanCtrl', function($scope, $state,$stateParams,$rootScope,personService) {  // 
    console.log("tabJuanCtrl");
    console.log("参数："+$stateParams.from);
    //personService.getUserInfo();
    $scope.goToDetail = function(xid){
	$state.go('detail',{'xid':xid});
    };

})

.controller('tabCtrl', function($scope, $state,$ionicPopup,$ionicHistory, localStorageService) {  // 
    console.log("tabCtrl");
	    
})


.controller('personalCtrl', function($ionicPlatform,$scope,$rootScope,$stateParams,$cordovaAppVersion,$ionicLoading,$cordovaStatusbar,
$state,$ionicHistory,$ionicPopup,$cordovaFileTransfer,$cordovaFileOpener2,$timeout,localStorageService,certificationService,popupService,personService,commonService) {  // 对应于个人中心页面
    console.log("personalCtrl");
    $scope.loginState = localStorageService.get("isLogin",{"state":false}).state;
    $scope.goToLogin = function(){
        setWhiteStatusBar();
        $state.go("welcome");
    };

    ////////状态栏白色 /////由于android平台特殊性，分开设置
    var setWhiteStatusBar = function(){
        if(ionic.Platform.isIOS()){
            if (window.StatusBar) {
                    $cordovaStatusbar.style(0);   ////状态栏字体黑色
                    $cordovaStatusbar.styleHex('#fff');
                    $cordovaStatusbar.overlaysWebView(false);
                    console.log("set status bar-----");

            }else{
            console.log("set status bar fail---");
            }
        }else if(ionic.Platform.isAndroid()){
            /////通过广播向原生代码发送改变状态栏颜色请求  见MainActivity.java
            window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
                                  console.log( "event fired!" );
              } );
        }
        };
    var setRedStatusBar = function(){
            if(ionic.Platform.isIOS()){
                if (window.StatusBar) {
                        $cordovaStatusbar.style(1);   ////状态栏字体黑色
                        $cordovaStatusbar.styleHex('#f3434b');
                        $cordovaStatusbar.overlaysWebView(false);
                        console.log("set status bar-----");

                }else{
                console.log("set status bar fail---");
                }
            }else if(ionic.Platform.isAndroid()){
                /////通过广播向原生代码发送改变状态栏颜色请求  见MainActivity.java
                window.broadcaster.fireNativeEvent( "set.statusbar", { item:'red' }, function() {
                                      console.log( "event fired!" );
                  } );
            }
    };

    $scope.$on("$ionicView.beforeEnter", function(){
           console.log("$ionicView.beforeEnter");
          /* window.broadcaster.fireNativeEvent( "set.statusbar", { item:'red' }, function() {
              console.log( "event fired!" );
              } );*/
              setRedStatusBar();
           //因为退出登录先看一看后可能出现缓存而不会重新加载controller的情况，这个函数保证每次进入页面下面语句每次都执行
           $scope.loginState = localStorageService.get("isLogin",{"state":false}).state;
           /*console.log("homectrl参数："+$stateParams.from);
           if( $stateParams.from == 'update')
           {
                personService.getUserInfo();
                $scope.userInfo = localStorageService.get("userInfo",null);
                console.log("localStorageService userInfo:"+JSON.stringify($scope.userInfo));
           }*/
    });

    $scope.$on("$ionicView.afterEnter", function(){

           console.log("$ionicView.afterEnter");

           console.log("参数："+$stateParams.from);
           if( $stateParams.from == 'update')
           {
                personService.getUserInfo().then(
                    function(data){
                    $scope.userInfo = localStorageService.get("userInfo",null);
                },function(){
                    $rootScope.log("localStorageService userInfo:","error");
                });

                console.log("localStorageService userInfo:"+JSON.stringify($scope.userInfo));
           }
    });
    $scope.$on("$ionicView.beforeLeave", function(){

       console.log("$ionicView.beforeLeave");
       setWhiteStatusBar();
//       window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
//                      console.log( "event fired!" );
//                      } );
        });



    ///获取个人信息
    $scope.userInfo = localStorageService.get("userInfo",null);
    console.log("localStorageService userInfo:"+JSON.stringify($scope.userInfo));
    //下拉刷新
    $scope.doRefresh = function(){
	personService.getUserInfo();
	$scope.userInfo = localStorageService.get("userInfo",null);
	console.log("localStorageService userInfo:"+JSON.stringify($scope.userInfo));
	    //获取认证状态
	    certificationService.viewAuthenticateState().then(
		    function(data){
			console.log("personalCtrl 认证状态:"+JSON.stringify(data));
			localStorageService.update("authenticateState",data);
			$scope.authState = localStorageService.get("authenticateState",null);
			if( null != $scope.authState)
			{
			    if("checking" == $scope.authState.identity_state)
			    {
				$scope.identityState = "审核中"; 
			    }else if("pass" == $scope.authState.identity_state){
				$scope.identityState = "审核通过";    
			    }else if("refuse" == $scope.authState.identity_state){
				$scope.identityState = "审核未通过";    
			    }else if("none" == $scope.authState.identity_state)
			    {
				$scope.identityState = "未认证"; 
			    }  	    
			}
			
			
			
		    },function(data){
			
		    });
	    $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();
    
    $scope.goCertification = function(){
        if( $scope.identityState == "未认证" ||  $scope.identityState == "审核未通过")
        {   $rootScope.personalActive = false; //认证小红点

        }else{

            $rootScope.personalActive = false; //认证小红点
            localStorageService.update("isPersonalActive",{value:$rootScope.personalActive});
            // console.log("redddddd:"+JSON.stringify(localStorageService.get("isPersonalActive",{value:false})));
            $rootScope.showTopMsg($scope.identityState);
            //$rootScope.showDebugToast($scope.identityState);
        }
        setWhiteStatusBar();
        $state.go('certification',{identity_state:$scope.authState.identity_state});
    };
    $scope.goMyAddresses = function(){
        setWhiteStatusBar();
	    $state.go('my_addresses');
    };
    
    $scope.onSwipeLeft = function() {
        //$state.go("tab.setting");
    };
    $scope.onSwipeRight = function() {
        $state.go("tab.progress");
    };
   
    $scope.changePersonal = function(){
        setWhiteStatusBar();
	    $state.go("change_personal");
    };
    $scope.goMyFabu = function(){
        setWhiteStatusBar();
        $state.go("my_fabu");
    };

   /* $scope.goAboutAFu = function(){
	    $state.go("about_afu");
    };*/
    $scope.goFeedback = function(){
        setWhiteStatusBar();
	    $state.go("feedback");
    };

    $scope.goCollection = function(){
        setWhiteStatusBar();
	    $state.go("my_collection");
    };

    ///////////手动检查更新,显示新版信息弹窗
    $scope.confirmUpdate = function(){
        if (ionic.Platform.isAndroid())
        { //android 下
            $scope.confirmPopup.close();
            $ionicLoading.show({
                template: "已经下载：0%"
            });
            var url = $rootScope.basePicUrl + $scope.updateData.update_url; //可以从服务端获取更新APP的路径
            var targetPath = cordova.file.externalRootDirectory + "/Download/AFuApp.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
            var trustHosts = true
            var options = {};
            $rootScope.log("download_dir",targetPath);
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                // 打开下载下来的APP
                $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                ).then(function () {
                        // 成功
                        $rootScope.log("安装成功");
                    }, function (err) {
                        $rootScope.log("安装失败");
                        // 错误
                    });
                $ionicLoading.hide();
            }, function (err) {
                console.log("err:"+JSON.stringify(err));
                $ionicLoading.show({template: '下载失败！可能是您没有给阿福访问本机存储权限！', noBackdrop: true, duration: 2000});
            }, function (progress) {
                //进度，这里使用文字显示下载百分比
                $timeout(function () {
                    var downloadProgress = (progress.loaded / progress.total) * 100;
                    $ionicLoading.show({
                        template: "已经下载：" + Math.floor(downloadProgress) + "%"
                    });
                    if (downloadProgress > 99) {
                        $ionicLoading.hide();
                    }
                })
            });
        }else if (ionic.Platform.isIOS()){
            /////ios
            //$rootScope.showTopMsg("please wait ios");
            $scope.confirmPopup.close();
            var options = {
                location: 'no',
                clearcache: 'no',
                toolbar: 'yes'
            };
            $cordovaInAppBrowser.open('https://appsto.re/cn/gNF3y.i', '_blank', options)
            .then(function(event) {
              // success
            }).catch(function(event) {

            //error
            });

        }
    };

    $scope.cancelUpdate = function(){
        $scope.confirmPopup.close();
    };

    function showUpdateConfirm(version) {
        $scope.confirmPopup = popupService.show('show',
        {
            cssClass:'er-popup',
            templateUrl: "templates/popup/check-update-popup.html",
            scope: $scope
         });
    }


    $scope.checkUpdate = function(){
	    $rootScope.log("检查更新");

	    ///var versionName = $cordovaAppVersion.getVersionNumber(); //获取版本名称
	    //var versionCode = //获取版本代码
	   // $rootScope.log("version code and name:",JSON.stringify(versionCode) +","+ JSON.stringify( versionName) );
	    //showUpdateConfirm(versionCode);
	    var platform = "android";
	    if(ionic.Platform.isIOS()){
            platform = 'ios';
	    }

	    if(ionic.Platform.isAndroid){
	       platform = 'android';
	    }

	    commonService.checkUpdate({platform:platform}).then(
	        function(data){
	            $rootScope.log("checkUpdate",JSON.stringify(data));
	            $scope.updateData = data;
	            $cordovaAppVersion.getVersionCode().then(

	                function(versionCode){
	                    $rootScope.log("local version",JSON.stringify(versionCode));
                        if(versionCode != data.version_code){
                            showUpdateConfirm(data.version_code)
                        }else{
                            $scope.showTopMsg("已是最新版本！");
                        }
	                }
	            );
	        },function(data){
	            $rootScope.log("checkUpdate","error");
	        }
	    );
    };

    //退出登录函数
    $scope.logout = function(){
        $scope.cancelLogout();
        localStorageService.update("isLogin",{"state":false});//
        window.plugins.jPushPlugin.stopPush();

        $ionicHistory.clearCache();
        //$state.go("login");
        $state.go("welcome");
    };
    //////弹出窗
    $scope.popupLogout = function() {
        $scope.popuplog = popupService.show('show',
            {
                cssClass:'er-popup',
                templateUrl: "templates/popup/confirm-logout-popup.html",
                scope: $scope
             });

    };
    $scope.cancelLogout = function(){
        $rootScope.log('logout cancel');
        $scope.popuplog.close();
    };
    ///////////////demo
    $scope.demo = function(){
        console.log("demo function");
       /* window.broadcaster.addEventListener( "pick_city_success", function(e){
            $rootScope.log("data",JSON.stringify(e));
        });
        window.plugins.webintent.startActivity({
            action: 'com.afu.pick_city',
            url:'afu://pick_city?user_id=111&wtypes=66'},
            function() {console.log("open success");},
            function() {
            console.log("open failed");
            alert('Failed to open URL via Android Intent')}
        );*/
    };

    $scope.goSettings = function(){
        setWhiteStatusBar();
        $state.go("settings");
    };
    
})

.controller('homeCtrl', function($ionicLoading,$scope,$window,$rootScope,$cookies,$ionicScrollDelegate,
$state, $ionicPopup,$stateParams, $timeout,$ionicModal,commonService,$ionicSlideBoxDelegate,$cordovaInAppBrowser,
certificationService,localStorageService, personService,popupService,recipientService) {

    console.log("homeCtrl");
    $scope.options = {
      loop:true,
      initialSlide:0,
      speed: 5000
    }

    $scope.loginState = localStorageService.get("isLogin",{"state":false}).state;
    $scope.goToLogin = function(){
            $scope.loginCancel();
            $state.go("welcome");
        };
    $scope.$on("$ionicView.beforeEnter", function(){
           console.log("$ionicView.beforeEnter");
           //因为退出登录先看一看后可能出现缓存而不会重新加载controller的情况，这个函数保证每次进入页面下面语句每次都执行
           $scope.loginState = localStorageService.get("isLogin",{"state":false}).state;
           /////////查看还能发多少个求捐信息
           $scope.leftCount = 1;
           recipientService.getLeftQiuFaBuCount(null).then(
               function(data){
                   $rootScope.log('commonService.leftCount',JSON.stringify(data));
                   $scope.leftCount = data.requestAbsentCount;
               },function(){
                   $rootScope.log('commonService.leftCount',"error");
               }

           );

    });

    // 对应于 首页 页面
    console.log("homectrl参数："+$stateParams.from);
    if( $stateParams.from == "login")
    {
        personService.getUserInfo();
        $rootScope.showTopMsg("登录成功");
        //获取认证状态
        certificationService.viewAuthenticateState().then(
            function(data){
                console.log("[authenricateState data]:"+JSON.stringify(data));
                localStorageService.update("authenticateState",data);
                $scope.checkCertification();
            },function(data){
                console.log("[authenricateState data]:error");
            });

    }
    
    //////弹出窗
    $scope.popupOptions = function() {
    $scope.popup = popupService.show('show',
        {
            cssClass:'er-popup',
            templateUrl: "templates/home/certification-popup.html",
            scope: $scope
         });
       
    };
    //////关闭弹出窗
    $scope.cancel = function(){
	$scope.popup.close();
    };

    //////提醒登录弹出窗
    $scope.alertLogin = function() {
        $scope.loginPopup = popupService.show('show',
             {
                 cssClass:'er-popup',
                 templateUrl: "templates/popup/go-login-popup.html",
                 scope: $scope
              });
       /* $scope.loginPopup = $ionicPopup.show({
            cssClass:'er-popup',
            templateUrl: "templates/popup/go-login-popup.html",
            scope: $scope
        });*/

    };

    //////关闭登录提醒弹出窗
    $scope.loginCancel = function(){
        $scope.loginPopup.close();
    };

    /////去认证
    $scope.goToCertification = function(){
	$scope.popup.close();
	$state.go('certification');
    };
    
    ////////初始化数据
    $scope.$on("$ionicView.beforeEnter", function(){
        console.log("tab.home before");
    	//$state.go("login");
           
    });
    
    $scope.$on('$ionicView.afterEnter', function(scopes, states ) {
          console.log("$ionicView.afterEnter");
          //$scope.checkCertification();
          
        });

    $scope.posters = localStorageService.get("poster",[]);
    if($scope.posters.length > 1){
        $scope.isShowDot = true;
    }else{
        $scope.isShowDot = false;
    }

    if($scope.posters.length <  3){
        $scope.doesContinue = false;
    }else{
        $scope.doesContinue = true;
    }
    /////首页广告位
    $scope.loadPoster = function(updateIndex){
        commonService.poster().then(
            function(data){
                console.log("[get poster datas]:"+JSON.stringify(data));
                localStorageService.update("poster",data.picture_urls);
                $scope.posters = data.picture_urls;
                //console.log("path:"+ImgCache.private.getCachedFilePath($scope.posters[0]));
                if($scope.posters.length > 1){
                    $scope.isShowDot = true;
                }else{
                    $scope.isShowDot = false;
                }

                if($scope.posters.length <  3){
                    $scope.doesContinue = false;
                }else{
                    $scope.doesContinue = true;
                }
                if( updateIndex == "juan"){
                    $ionicSlideBoxDelegate.$getByHandle('firstslide').update();
                }
                if( updateIndex == "qiu"){
                    $ionicSlideBoxDelegate.$getByHandle('secondslide').update();
                }


            },function(data){
                console.log("[get poster datas]:failed");
                $rootScope.showTopMsg("poster error");
            }
        );
    };

    $scope.loadPoster("juan");
    $scope.loadPoster("qiu");
    /////////////////poster跳转
    $scope.openLink = function(url){
        var reg='/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/';
        if(!reg.test(url)){

            return false;
        }
        var options = {
                        location: 'no',
                        clearcache: 'no',
                        toolbar: 'yes'
                    };
       $cordovaInAppBrowser.open(url, options)
           .then(function(event) {
             // success
             console.log("open "+ url +'success');
           }).catch(function(event) {
            console.log("open "+ url +'error');
           //error
           });

    };


    $scope.checkCertification = function(){
	//////检查实名认证状态
        $scope.authState = localStorageService.get("authenticateState",{identity_state:"none"});
        var isCheckCertification = localStorageService.get("iSCheckCertification",false);
        console.log("[authState]:"+JSON.stringify($scope.authState) );
        console.log("[isCheckCertification]:"+JSON.stringify(isCheckCertification));
        if( null != $scope.authState && isCheckCertification)
        {
        	if("checking" == $scope.authState.identity_state)
        	{
        	    
        	}else if("pass" == $scope.authState.identity_state){
        	   
        	}else if("refuse" == $scope.authState.identity_state){

        	}else if("none" == $scope.authState.identity_state)
        	{
        	    $scope.popupOptions(); 
        	}  	    
        }  
      //每次退出应用再次进入前会检查认证状态，所以每次初始化时将状态设为需要检查
       localStorageService.update("iSCheckCertification", false);
    };
    /*if( $scope.isQiuActive)
    {
	    $state.go("tab.home.qiu");
    }else{
	    $state.go("tab.home.juan");
    }*/
    
    /*****初始化物品类别********/
    var defaultWtypes = [{"wtype_id":"-1","wtype_name":"全部","is_select":true,"position":0}];
    $scope.wtypes = localStorageService.get("getwtype",defaultWtypes);
    if( defaultWtypes == $scope.wtypes || undefined == $scope.wtypes || null == $scope.wtypes ){

        commonService.getwtype().then(
            function(data){
                localStorageService.update("getwtype",data);
                $scope.wtypes = localStorageService.get("getwtype",defaultWtypes);
                $rootScope.showUpdateTransparent();
            },function(data){
                $rootScope.showTopMsg("初始化物品种类失败，请退出重试！");
            }

        );

    }else{
        console.log("localStorageService datas:"+JSON.stringify($scope.wtypes));
    }

    $scope.selectedWtype = {wtype_id:''};
    //捐助信息
    $scope.infos = localStorageService.get("juan_infoList",null);
    console.log("localStorageService juan infos datas:"+JSON.stringify($scope.infos));
    $scope.page_num = 2;
    //求助信息
    $scope.infos_qiu = localStorageService.get("qiu_infoList",null);
    console.log("localStorageService qiu infos datas:"+JSON.stringify($scope.infos_qiu));

    $scope.isJuanActive = true; //捐助信息tab true-被选中 false-未被选中
    $scope.isQiuActive = false; //求助信息tab true-被选中 false-未被选中

    $scope.isSecondSlide = false;
    /**
     * Todo: 首页顶部“捐助信息”、“求助信息”切换
     * Params tabs 捐助信息“juan” or 求助信息"qiu"
     * Author WangYong
     * Date 2016-08-02
     * **/
    $scope.clickJuanOrQiu = function(tabs){
        console.log("clickJuanOrQiu function");
        if( tabs == "juan" && $scope.isJuanActive == false)
        {
            $scope.isJuanMoreDataCanBeLoaded = true;
            $scope.isQiuMoreDataCanBeLoaded = false;
            $scope.isJuanActive = true;
            $scope.isQiuActive = false;
            //$scope.doRefreshJuan();
            //$scope.loadPoster("juan");
        }
        if(tabs == "qiu" && $scope.isQiuActive == false)
        {
            $scope.isJuanMoreDataCanBeLoaded = false;
             $scope.isQiuMoreDataCanBeLoaded = true;
            $scope.isJuanActive = false;
            $scope.isQiuActive = true;
            //$scope.doRefreshQiu();
            //$scope.loadPoster("qiu");
            if( !$scope.isSecondSlide ){
                $ionicSlideBoxDelegate.$getByHandle('secondslide').update();
                $scope.isSecondSlide = true;
            }

        }
        //$rootScope.showUpdateTransparent();
    };

   
    /**********************Juan 捐助 *******************************/
    $scope.isJuanMoreDataCanBeLoaded = false;
    ///////////////////捐助下拉刷新
    $scope.doRefreshJuan = function(){
        //$scope.loadPoster();
        //$ionicScrollDelegate.scrollTop();
        console.log("do juan refresh。。。");
        commonService.infoList({info_type:"donate",page_num:1,wtype_id:$scope.selectedWtype.wtype_id}).then(
            function(data){
                $scope.page_num = 2;
                $scope.infos = data;
                $scope.note = "";
                console.log("do refresh success");
                $scope.$broadcast('scroll.refreshComplete');
                if( $scope.infos.length == 0 ){
                    $scope.isJuanMoreDataCanBeLoaded = false;
                }else{
                    $scope.isJuanMoreDataCanBeLoaded = true;
                }

            },function(data){
                console.log("do refresh error");
                $scope.$broadcast('scroll.refreshComplete');
                $scope.isJuanMoreDataCanBeLoaded = false;
            });
	
    };
    
    ///////////////////捐助上拉加载更多
    $scope.loadMoreJuan = function(){
        console.log("do juan loadMore。。。");
        commonService.infoList({info_type:"donate",page_num:$scope.page_num,wtype_id:$scope.selectedWtype.wtype_id}).then(
            function(data){
                console.log("do loadMore success");
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if( 10 == data.length )
                {
                    $scope.note = "";
                    $scope.isJuanMoreDataCanBeLoaded = true;
                    $scope.page_num++;
                }else {
                    $scope.isJuanMoreDataCanBeLoaded = false;
                    $scope.note =  $rootScope.meiYouLe;
                }
                if( data.length >= 1)
                {
                    $scope.infos = $scope.infos.concat(data);
                }
                if($scope.infos.length == 0){
                    $scope.note = "";
                }

            },function(data){
                console.log("do loadMore error");
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.isJuanMoreDataCanBeLoaded = true;
            });
    };
    $scope.moreJuanDataCanBeLoaded = function(){
	    return $scope.isJuanMoreDataCanBeLoaded;
    };
    //$scope.doRefreshJuan();

    /**********************Qiu 求助*******************************/
    $scope.qiu_page_num = 2;
    $scope.isQiuMoreDataCanBeLoaded = false;
    ///////////////////求助下拉刷新
    $scope.doRefreshQiu = function(){
        //$scope.loadPoster();
        //$ionicScrollDelegate.scrollTop();///////fixme
        console.log("do qiu refresh。。。");
        commonService.infoList({info_type:"recipient",page_num:1,wtype_id:$scope.selectedWtype.wtype_id}).then(
            function(data){
                $scope.isQiuMoreDataCanBeLoaded = true;
                $scope.qiu_page_num = 2;
                $scope.note = "";
                console.log("do qiu refresh success");
                $scope.$broadcast('scroll.refreshComplete');
                $scope.infos_qiu = data;
                if( $scope.infos_qiu.length == 0 ){
                    $scope.isQiuMoreDataCanBeLoaded = false;
                }else{
                    $scope.isQiuMoreDataCanBeLoaded = true;
                }
            },function(data){
                $scope.isQiuMoreDataCanBeLoaded = false;
                console.log("do qiu refresh error");
                $scope.$broadcast('scroll.refreshComplete');
            });
	
    };
    
    ///////////////////求助上拉加载更多
    $scope.loadMoreQiu = function(){
        console.log("do qiu loadMore。。。");

        commonService.infoList({info_type:"recipient",page_num:$scope.qiu_page_num,wtype_id:$scope.selectedWtype.wtype_id}).then(
            function(data){
                console.log("do loadMore success");
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if( 10 == data.length )
                {
                $scope.note = "";
                $scope.isQiuMoreDataCanBeLoaded = true;
                $scope.qiu_page_num++;
                }else {
                $scope.isQiuMoreDataCanBeLoaded = false;
                $scope.note =  $rootScope.meiYouLe;
                }
                if( data.length >= 1)
                {
                    $scope.infos_qiu = $scope.infos_qiu.concat(data);
                }
                if($scope.infos_qiu.length == 0){
                    $scope.note = "";
                }
            },function(data){
                $scope.isQiuMoreDataCanBeLoaded = true;
                console.log("do qiu loadMore error");
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        $scope.moreQiuDataCanBeLoaded = function(){
        return $scope.isQiuMoreDataCanBeLoaded;
    };
    $scope.doRefreshJuan();
    //$scope.doRefreshQiu();
    
    
    
    /////////////////////////选择类别
    var ClearWtypeChosen = function(){
        for(var i = 0;i < $scope.wtypes.length ;i++){
            $scope.wtypes[i].is_select = false;
        }
	//l$scope.wtypes.unshift({});
    };
    //switch types
    $scope.typeIndex = 0;
    $scope.switchType = function(index){

        console.log("[wtype index]:"+index);
        $scope.typeIndex = index;
        ClearWtypeChosen();
        $scope.wtypes[index].is_select = true;
        $scope.selectedWtype = $scope.wtypes[index];
        $scope.note = "";
        if($scope.isJuanActive){
            $scope.doRefreshJuan();
        }else if($scope.isQiuActive){
            $scope.doRefreshQiu();
        }
        if( $scope.modalMoreTypes.isShown() ){
            $scope.closeMoreTypesModal();
        }; //

    };

    $scope.onDragLeft = function($event) {
           /*var el = $event.target,
           dx = $event.gesture.deltaX,
           dy = $event.gesture.deltaY;
           console.log("drag:"+dx+','+dy);
           if( Math.abs(dx) - Math.abs(dx) ){

           }*/

        };
    $scope.onDragRight = function($event) {
           /*var el = $event.target,
           dx = $event.gesture.deltaX,
           dy = $event.gesture.deltaY;
           console.log("drag:"+dx+','+dy);*/

        };

    $scope.onSwipeLeft = function($event) {
        var el = $event.target,
        dx = $event.gesture.deltaX,
        dy = $event.gesture.deltaY;
        //el.style.left = ox + dx + “px”;
        //el.style.top = oy + dy + “px”;
        console.log("swipe:"+dx+','+dy);
        var objDiv = document.body.querySelector("#types_scroll");
        //$ionicScrollDelegate.$getByHandle('my-handle').scrollTop();
        $rootScope.log("scroll",JSON.stringify(objDiv));
        var oneStepLength = objDiv.scrollWidth / $scope.wtypes.length;
        console.log("size:"+oneStepLength+","+objDiv.scrollWidth);
        var nextTypeIndex = $scope.typeIndex + 1;
        if(nextTypeIndex < $scope.wtypes.length  ){
            $scope.switchType(nextTypeIndex);
            console.log("size step:"+oneStepLength +","+ oneStepLength * nextTypeIndex);
            if(nextTypeIndex > 5){
                objDiv.scrollLeft = oneStepLength * nextTypeIndex;
            }
        }else{
            $state.go("tab.progress");
        }

    };

    $scope.onSwipeRight = function($event) {
        var objDiv = angular.element(document.getElementById("types_scroll"));
        var oneStepLength = objDiv.scrollWidth / $scope.wtypes.length;
        console.log("size:"+oneStepLength+","+objDiv.scrollWidth);
       var nextTypeIndex = $scope.typeIndex - 1;
               if( nextTypeIndex < 0  ){

               }else{
                   $scope.switchType(nextTypeIndex);
                   console.log(oneStepLength +","+ oneStepLength * nextTypeIndex);
                   objDiv.scrollLeft = oneStepLength * nextTypeIndex;
               }
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

    /////发布捐助成功回调
    var donateSuccessCallBack = function(data){
        console.log( "donate_success" +JSON.stringify(data));
        //$rootScope.showTopMsg("发布成功");

        $scope.faBuDonatePopup();
        $scope.doRefreshJuan();
    };

     //////////发布成功弹窗
    $scope.faBuDonatePopup = function(){
         $scope.donatepopup =  popupService.show('show',
         {
             cssClass:'surprise-er-popup',
             templateUrl: "templates/popup/donate-success-surprise-popup.html",
             scope: $scope
          });

         $scope.donatepopup.then(
             function(res){
                $rootScope.log("close popup callback","close popup callback");
                //window.broadcaster.removeEventListener( "donate_success", donateSuccessCallBack);
                //$rootScope.log("close popup callback succeed","close popup callback succeed");
             }
          );

     };
    //////////关闭发布成功弹窗
     $scope.cancelDonateSurprise = function(){
        $scope.donatepopup.close();

     };


    /////发布新的需求--捐助（juan）和求助（qiu）
    $scope.createNewInfo = function(info_type){

	    console.log("newJuan function"+info_type);
	    if (ionic.Platform.isAndroid()) { //android 下

        	    if(info_type == "juan")
        		{
        		    $scope.modal.hide();

        		    window.broadcaster.addEventListener( "donate_success", donateSuccessCallBack);

        		    var userID = localStorageService.get("userID");
        		    console.log("[local userID]"+userID);
        		    //$state.go("new_juan");
        		    window.plugins.webintent.startActivity({
        			    action: 'com.afu.new_donate_info',
        			    url:'afu_donate://new_info?user_id='+userID+"&wtypes="+ JSON.stringify($scope.wtypes)},
        			    function() {console.log("open success");},
        			    function() {
        				console.log("open failed");
        				alert('Failed to open URL via Android Intent')}
        			);

        		}else if(info_type == "qiu")
        		{
        		    $scope.modal.hide();
        		    $scope.checkCertification();
        		    if("checking" == $scope.authState.identity_state)
        	    	    {
                            $rootScope.showTopMsg("请等待实名认证审核通过！");
                            return false;
        	    	    }else if("pass" == $scope.authState.identity_state){

        	    	    }else if("refuse" == $scope.authState.identity_state){
                           $rootScope.showTopMsg("实名认证审核未通过！");
        	     	       return false;
        	    	    }else if("none" == $scope.authState.identity_state)
        	    	    {

        	    	       return false;
        	    	    }
                        if( $scope.leftCount <= 0 ){
                            $scope.modal.hide();
                            $scope.alertLeftCount();
                            return false;
                        }
        		    var userID = localStorageService.get("userID");
        		    var user = localStorageService.get("user");
        		    window.plugins.webintent.startActivity({
        			    action: 'com.afu.new_recipient_info',
        			    url:'afu_recipient://new_info?phonenum='+user.phonenum+'&password='+user.password+'&user_id='+userID+"&wtypes="+ JSON.stringify($scope.wtypes)},
        			    function() {console.log("open success");},
        			    function() {
        				console.log("open failed");
        				alert('Failed to open URL via Android Intent')}
        			);
        			}

        	  }else if(ionic.Platform.isIOS()){
        	      /////ios platform
        	      //$rootScope.showTopMsg("please wait ios");
        	      $scope.modal.hide();
                  var userID = localStorageService.get("userID");
                  console.log("[local userID]"+userID);
                  var user = localStorageService.get("user");
                  if(info_type == "juan")
                  {
                      window.broadcaster.addEventListener( "donate_success", donateSuccessCallBack);
                      window.broadcaster.fireNativeEvent( "test.event", { item:'juan',userID:userID,wtypes:JSON.stringify($scope.wtypes) }, function() {
                                                 console.log( "event fired!" );
                                                 } );

                  }else if(info_type == "qiu")
                  {

                    $scope.checkCertification();
                    if("checking" == $scope.authState.identity_state)
                        {
                            $rootScope.showTopMsg("请等待实名认证审核通过！");
                            return false;
                        }else if("pass" == $scope.authState.identity_state){

                        }else if("refuse" == $scope.authState.identity_state){
                           $rootScope.showTopMsg("实名认证审核未通过！");
                           return false;
                        }else if("none" == $scope.authState.identity_state)
                        {

                           return false;
                        }
                        if( $scope.leftCount <= 0 ){
                            $scope.modal.hide();
                            $scope.alertLeftCount();
                            return false;
                        }
                      window.broadcaster.fireNativeEvent( "test.event", { item:'qiu',userID:userID,wtypes:JSON.stringify($scope.wtypes) ,phonenum:user.phonenum,password:user.password}, function() {
                                                 console.log( "event fired!" );
                                                 } );

                  }


        	  }



    };
   
    
    //首页右下角的悬浮按钮点击的弹出层
    $ionicModal.fromTemplateUrl('templates/home/home-create-choice.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
        //发布需求前判断登录
	   if( $scope.loginState ){
	        $scope.modal.show();
	   }else{
            $scope.alertLogin();
	   }

	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  // Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });

	  
	  
	  //搜索弹出层
	  $ionicModal.fromTemplateUrl('templates/home/home-search.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modalSearch = modal;
		  });
		  $scope.openSearchModal = function() {
		  //搜索前判断登录
		    if( $scope.loginState ){
                $scope.modalSearch.show();
           }else{
                $scope.alertLogin();
           }

		  };
		  $scope.closeSearchModal = function() {
		    $scope.modalSearch.hide();
		  };
		  // Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.modalSearch.remove();
		  });

    
    ////进行搜索
    //$scope.
    $scope.isMoreSearchDataCanBeLoaded = false;
    $scope.searchInfo = {info_type:null,search_info:null,page_num:1};
    $scope.startSearch = function(){
        $scope.searchInfo.page_num = 1;
        console.log("[search info request]:"+JSON.stringify($scope.searchInfo ));
        commonService.searchInfo($scope.searchInfo).then(function(data){
            console.log("[search info datas] :"+JSON.stringify(data));
            $scope.searchInfos = data.data;
            $scope.searchInfo.page_num = 2;
            if($scope.searchInfos.length == 10){
                $scope.isMoreSearchDataCanBeLoaded = true;
            }

        },function(data){
            console.log("[ datas] :error");
            $rootScope.showTopMsg(data.toast+",请重试！");
            $scope.searchInfos = [];
        });
    };

    $scope.loadMoreSearch = function(){
        $rootScope.log("load more");
        commonService.searchInfo($scope.searchInfo).then(
            function(data){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if( 10 == data.data.length )
                {
                    $scope.searchNote = "";
                    $scope.isMoreSearchDataCanBeLoaded = true;
                    $scope.searchInfo.page_num++;
                }else {
                    $scope.isMoreSearchDataCanBeLoaded = false;
                    $scope.searchNote =  $rootScope.meiYouLe;
                }
                if( data.data.length >= 1)
                {
                    $scope.searchInfos = $scope.searchInfos.concat(data.data);
                }
                if($scope.searchInfos.length == 0){
                    $scope.searchNote = "";
                }

            },function(data){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $rootScope.showTopMsg(data.toast+",请重试！");
            }
        );
    };

    ///////切换搜索范围
    $scope.field = {all:true,juan:false,qiu:false};
    $scope.switchSearchField = function(searchField){
    $scope.isMoreSearchDataCanBeLoaded = false; ///////////
	if(searchField == "juan")
	{
	    $scope.field = {all:false,juan:true,qiu:false};
	    $scope.searchInfo.info_type = "donate";
	    $scope.startSearch();
	}else if(searchField == "qiu"){
	    $scope.field = {all:false,juan:false,qiu:true};
	    $scope.searchInfo.info_type = "recipient";
	    $scope.startSearch();
	}else{
	    $scope.field = {all:true,juan:false,qiu:false};
	    $scope.searchInfo.info_type = null;
	    $scope.startSearch();
	}
    };

  
    $scope.goToJuanDetail = function(xid){
     if( $scope.loginState ){
            $state.go('juan_detail',{'xid':xid});
       }else{
            $scope.alertLogin();
       }

    };
    $scope.goToQiuDetail = function(xid){
        if( $scope.loginState ){
            $state.go('qiu_detail',{'xid':xid});
       }else{
            $scope.alertLogin();
       }

    };
    $scope.goToDetail = function(info_type,xid){
	$scope.closeSearchModal();
	if(info_type=="donate")
	{
	    $state.go('juan_detail',{'xid':xid}); 
	}else if(info_type=="recipient"){
	    $state.go('qiu_detail',{'xid':xid}); 
	}
	
    };
    /////////////更多类型选择

    $scope.moreTypesIcon = ["arrow"];
  //搜索弹出层
  $ionicModal.fromTemplateUrl('templates/home-types-downside.html', {
        scope: $scope,
        animation: 'slide-in-down'
      }).then(function(modal) {
        $scope.modalMoreTypes = modal;
      });
      $scope.openMoreTypesModal = function() {
            $scope.modalMoreTypes.show();
      };
      $scope.closeMoreTypesModal = function() {
        $scope.modalMoreTypes.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modalMoreTypes.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });


    $scope.showMoreTypes = function(){
        $scope.openMoreTypesModal();

    };
    $scope.closeMoreTypes = function(){
        $scope.closeMoreTypesModal();

    };

})

.controller('progressCtrl', function($scope,$rootScope,$state,$ionicScrollDelegate,donateService,$stateParams,
localStorageService,recipientService,popupService,commonService) { //对应于爱心进展页面
    
    console.log("progressCtrl");
    $scope.loginState = localStorageService.get("isLogin",{"state":false}).state;
    $scope.goToLogin = function(){
        $state.go("welcome");
    };
    $scope.$on("$ionicView.beforeEnter", function(){
           console.log("$ionicView.beforeEnter");
           //因为退出登录先看一看后可能出现缓存而不会重新加载controller的情况，这个函数保证每次进入页面下面语句每次都执行
           $scope.loginState = localStorageService.get("isLogin",{"state":false}).state;


    });

    var refreshReadPoint = function(){
       var hasUnread = false;
       for(var i=0;i<$scope.myDonateInfos.length;i++){
            if($scope.myDonateInfos[i].is_read == false){
                hasUnread = true;
                break;
            }
       }

       for(var i=0;i<$scope.myRecipientInfos.length;i++){
           if($scope.myRecipientInfos[i].is_read == false){
               hasUnread = true;
               break;
           }
      }

       if(hasUnread){
            $rootScope.progressActive = true;
       }else{
            $rootScope.progressActive = false;
            localStorageService.update("isProgressActive",{value:$rootScope.progressActive});
       }
    };
    $scope.$on("$ionicView.afterEnter", function(){
           console.log("$ionicView.afterEnter");
            $scope.clickJuanOrQiu($stateParams.tab);
            $scope.switchSubTab($stateParams.subtab);
           //$rootScope.progressActive = false;    //点进去小红点取消
           //localStorageService.update("isProgressActive",{value:$rootScope.progressActive});
           // console.log("redddddd afterEnter:"+JSON.stringify(localStorageService.get("isProgressActive",{value:false})));
        });


    $scope.$on("$ionicView.leave", function(){
       console.log("$ionicView.leave");
       $scope.canLoadMoreJuan = false;
       $scope.canLoadMoreQiu = false;
    });

    $scope.$on("progressData", function (event, data) {
            console.log("当前节点收到消息："+JSON.stringify(data));
            /*if(data.info_type == "donate"){
                for(var i = 0; i < $scope.myDonateInfos.length; i++){
                    if($scope.myDonateInfos[i].xid == data.xid){
                        $rootScope.log('get_data_xid',data.xid);
                        $rootScope.log('$scope.myDonateInfos_xid',$scope.myDonateInfos[i].xid);
                        var updateItem = $scope.myDonateInfos[i];
                        updateItem.updateTag = true;
                        $rootScope.log("updateItem",JSON.stringify(updateItem));
                        $scope.myDonateInfos.splice(i, 1);
                        $scope.myDonateInfos.unshift(updateItem);
                        break;
                    }
                }
            }else if(data.info_type == "recipient"){
                for(var i = 0; i < $scope.myRecipientInfos.length; i++){
                    if($scope.myRecipientInfos[i].xid == data.xid){
                        $rootScope.log('get_data_xid',data.xid);
                        $rootScope.log('$scope.myRecipientInfos_xid',$scope.myRecipientInfos[i].xid);
                        var updateItem = $scope.myRecipientInfos[i];
                        updateItem.updateTag = true;
                        $rootScope.log("updateItem",JSON.stringify(updateItem));
                        $scope.myRecipientInfos.splice(i, 1);
                        $scope.myRecipientInfos.unshift(updateItem);
                        break;
                    }
                }

            }*/
    });

    $scope.isJuanActive = true; //捐助信息tab true-被选中 false-未被选中
    $scope.isQiuActive = false; //求助信息tab true-被选中 false-未被选中
    
    /**
     * Todo: 爱心进展页顶部“献爱心”、“求帮助”切换
     * Params tabs 捐助信息“juan” or 求助信息"qiu"
     * Author WangYong
     * Date 2016-08-02  && $scope.isJuanActive == false   && $scope.isQiuActive == false
     * **/
    $scope.clickJuanOrQiu = function(tabs){
	console.log("clickJuanOrQiu function");
	if( tabs == "juan" )
	{
	    $scope.juanZhuOrRenLing = "我捐助的";
	    $scope.isJuanActive = true;
	    $scope.isQiuActive = false;
	} 
	if(tabs == "qiu")
	{
	    $scope.juanZhuOrRenLing = "我认领的";
	    $scope.isJuanActive = false;
	    $scope.isQiuActive = true;
	}
	     
    };
    
    //////点subtab
    var juan_page_num = 1;
    var qiu_page_num = 1;
    $scope.isMyFaBuDonate = true;
    $scope.isMyJuanZhu = false;
    $scope.isMyFaBuRecipient = true;
    $scope.isMyRenLing = false;
    $scope.switchSubTab = function(subTab){
         $scope.note = "";
        if($scope.isJuanActive )
        {

            if(subTab == "fabu_donate")
            {
                juan_page_num = 1;
                $scope.fromXianAiXin = "my_juan";
                $scope.isMyFaBuDonate = true;
                $scope.isMyJuanZhu = false;
                $scope.loadMyDonateInfoList(juan_page_num);
                $ionicScrollDelegate.scrollTop();
            }else if(subTab == "my_juan"){

                juan_page_num = 1;
                $scope.fromXianAiXin = "my_help";
                $scope.isMyFaBuDonate = false;
                $scope.isMyJuanZhu = true;
                $scope.loadMyHelpRecipientInfoList(juan_page_num);
                $ionicScrollDelegate.scrollTop();
            }

        }

        if($scope.isQiuActive )
        {

            if(subTab == "fabu_recipient")
            {
                qiu_page_num = 1;
                $scope.fromQiuBangZhu = "my_qiu";
                $scope.isMyFaBuRecipient = true;
                $scope.isMyRenLing = false;
                $scope.loadMySendRecipientInfoList(qiu_page_num);
            }else if(subTab == "my_ren"){
                qiu_page_num = 1;
                $scope.fromQiuBangZhu = "my_renling";
                $scope.isMyFaBuRecipient = false;
                $scope.isMyRenLing = true;
                $scope.loadMyCliamDonateInfoList(qiu_page_num);
            }
            $ionicScrollDelegate.scrollTop();
        }
	
    };
    
    ///////////需要判断是不是自己发的，文案不同
    $scope.fromXianAiXin = "my_juan";  //my_juan my_help my_qiu my_renling
    $scope.fromQiuBangZhu = "my_qiu";
    $scope.canLoadMoreJuan = false;
    $scope.canLoadMoreQiu = false;
    $scope.myDonateInfos = [];
    $scope.myRecipientInfos = [];
    /////获得进程信息   
    $scope.loadMyDonateInfoList = function(page_num){
	///我发布的捐助信息------献爱心
	donateService.viewMyDonateInfoList({page_num:page_num}).then(
		    function(data){
			console.log("[viewMyDonateInfoList]:success");
			console.log("[viewMyDonateInfoList datas]:"+JSON.stringify(data));
			$scope.myDonateInfos = data.data;
			juan_page_num = 2;
			$scope.note = "";
			if( 0 == $scope.myDonateInfos.length )
            {
                $scope.canLoadMoreJuan = false;

            }else {
                $scope.canLoadMoreJuan = true;
            }

			$scope.fromXianAiXin = "my_juan";
			refreshReadPoint();     ////////fixme??
		    },function(data){
			console.log("[viewMyDonateInfoList]:fail");
			$scope.myDonateInfos = [];
		    });
    };
    ////上拉加载更多---为了便于code和理解分开为两个函数
    $scope.loadMoreMyDonateInfoList = function(page_num){
    	///我发布的捐助信息------献爱心
    	donateService.viewMyDonateInfoList({page_num:page_num}).then(
    		    function(data){
    			console.log("[load more viewMyDonateInfoList]:success");
    			console.log("[viewMyDonateInfoList datas]:"+JSON.stringify(data));

    			if( 10 == data.data.length )
                {
                    $scope.note = "";
                    $scope.canLoadMoreJuan = true;
                    juan_page_num++;
                }else {
                    $scope.canLoadMoreJuan = false;
                    $scope.note =  $rootScope.meiYouLe;
                }
                if( data.data.length >= 1)
                {
                    $scope.myDonateInfos = $scope.myDonateInfos.concat(data.data);
                }
                if( $scope.myDonateInfos.length == 0 ){
                    $scope.note = "";
                }

    			$scope.fromXianAiXin = "my_juan";
    			refreshReadPoint();     ////////fixme??
    		    },function(data){
    			console.log("[viewMyDonateInfoList]:fail");

    		    });
        };
    
    $scope.loadMyHelpRecipientInfoList = function(page_num){
	/////我帮助的求助信息------献爱心
	donateService.myRecipientInfoList({page_num:page_num}).then(
		    function(data){
			console.log("[myHelpRecipientInfoList]:success");
			console.log("[myHelpRecipientInfoList datas]:"+JSON.stringify(data));
			$scope.myDonateInfos = data;
			juan_page_num = 2;
			$scope.note = "";
			if( 0 == $scope.myDonateInfos.length )
            {
                $scope.canLoadMoreJuan = false;
            }else {
                $scope.canLoadMoreJuan = true;
            }

			$scope.fromXianAiXin = "my_help";
			refreshReadPoint();     ////////fixme??
		    },function(data){
			console.log("[myHelpRecipientInfoList]:fail");
			$scope.myDonateInfos = [];
		    });
    };

    /////上拉加载更多
    $scope.loadMoreMyHelpRecipientInfoList = function(page_num){
    	/////我帮助的求助信息------献爱心
    	donateService.myRecipientInfoList({page_num:page_num}).then(
    		    function(data){
    			console.log("[myHelpRecipientInfoList]:success");
    			console.log("[myHelpRecipientInfoList datas]:"+JSON.stringify(data));
    			if( 10 == data.length )
                {
                    $scope.note = "";
                    $scope.canLoadMoreJuan = true;
                    juan_page_num++;
                }else {
                    $scope.canLoadMoreJuan = false;
                    $scope.note =  $rootScope.meiYouLe;
                }

                if( data.length >= 1)
                {
                    $scope.myDonateInfos = $scope.myDonateInfos.concat(data);
                }
                if($scope.myDonateInfos.length == 0){
                    $scope.note = "";
                }

    			$scope.fromXianAiXin = "my_help";
    			refreshReadPoint();     ////////fixme??
    		    },function(data){
    			console.log("[myHelpRecipientInfoList]:fail");
    		    });
        };


    $scope.loadMySendRecipientInfoList = function(page_num){
        ///我发布的求助信息------求帮助
        recipientService.viewMyRecipientInfoList({page_num:page_num}).then(
                function(data){
                console.log("[viewMyRecipientInfoList]:success");
                console.log("[viewMyRecipientInfoList datas]:"+JSON.stringify(data));
                $scope.myRecipientInfos = data.data;
                $scope.note = "";
                qiu_page_num = 2;
                if( 0 == $scope.myRecipientInfos.length )
                {
                    $scope.canLoadMoreQiu = false;
                }else {
                    $scope.canLoadMoreQiu = true;
                }

                $scope.fromQiuBangZhu = "my_qiu";
                refreshReadPoint();     ////////fixme??
                },function(data){
                $scope.myRecipientInfos = [];
                console.log("[viewMyRecipientInfoList]:fail");
                });
        };

    //上拉加载更多
    $scope.loadMoreMySendRecipientInfoList = function(page_num){
	///我发布的求助信息------求帮助
	recipientService.viewMyRecipientInfoList({page_num:page_num}).then(
		    function(data){
			console.log("[viewMyRecipientInfoList]:success");
			console.log("[viewMyRecipientInfoList datas]:"+JSON.stringify(data));

            if( 10 == data.data.length )
            {
                $scope.note = "";
                $scope.canLoadMoreQiu = true;
                qiu_page_num++;
            }else {
                $scope.canLoadMoreQiu = false;
                $scope.note =  $rootScope.meiYouLe;

            }

            if( data.data.length >= 1)
            {
                $scope.myRecipientInfos = $scope.myRecipientInfos.concat(data.data);
            }

            if($scope.myRecipientInfos.length == 0){
                $scope.note = "";
            }


			$scope.fromQiuBangZhu = "my_qiu";
			refreshReadPoint();     ////////fixme??
		    },function(data){
			console.log("[viewMyRecipientInfoList]:fail");
		    });
    };


    $scope.loadMyCliamDonateInfoList = function(page_num){
	///我认领的捐助信息------求帮助
	recipientService.myCliamDonateInfoList({page_num:page_num}).then(
		    function(data){
			console.log("[myCliamDonateInfoList]:success");
			console.log("[myCliamDonateInfoList datas]:"+JSON.stringify(data));
			$scope.myRecipientInfos = data.data;
			$scope.note = "";
            qiu_page_num = 2;
			if( 0 == $scope.myRecipientInfos.length )
            {
                $scope.canLoadMoreQiu = false;
            }else {
                $scope.canLoadMoreQiu = true;
            }
			$scope.fromQiuBangZhu = "my_renling";
			refreshReadPoint();     ////////fixme??
		    },function(data){
		    $scope.myRecipientInfos = [];
			console.log("[myCliamDonateInfoList]:fail");
		    });
    };

    //上拉加载更多
    $scope.loadMoreMyCliamDonateInfoList = function(page_num){
    	///我认领的捐助信息------求帮助
    	recipientService.myCliamDonateInfoList({page_num:page_num}).then(
    		    function(data){
    			console.log("[myCliamDonateInfoList]:success");
    			console.log("[myCliamDonateInfoList datas]:"+JSON.stringify(data));
    			if( 10 == data.data.length )
                {
                    $scope.note = "";
                    $scope.canLoadMoreQiu = true;
                    qiu_page_num++;
                }else {
                    $scope.canLoadMoreQiu = false;
                    $scope.note =  $rootScope.meiYouLe;
                }

                if( data.data.length >= 1)
                {
                    $scope.myRecipientInfos = $scope.myRecipientInfos.concat(data.data);
                }

                if($scope.myRecipientInfos.length == 0 ){
                    $scope.note = "";
                }

    			$scope.fromQiuBangZhu = "my_renling";
    			refreshReadPoint();     ////////fixme??
    		    },function(data){
    			console.log("[myCliamDonateInfoList]:fail");
    		    });
        };

    ////默认加载献爱心---我发布的
    $scope.loadMyDonateInfoList(juan_page_num);
    $scope.loadMySendRecipientInfoList(qiu_page_num);
    
    $scope.doRefresh = function(from,isFaBu){
	$scope.note = "";
	console.log("[from and isFaBu]:"+from + "and" + isFaBu);
	if( from == 'juan_or_help')
	{
	    juan_page_num = 1;
	    if(isFaBu){
            $scope.loadMyDonateInfoList(juan_page_num);
	    }else{
            $scope.loadMyHelpRecipientInfoList(juan_page_num);
	    }
	    
	    
	}
	if( from == 'qiu_or_need')
	{
	    
	    qiu_page_num = 1;
	    if(isFaBu){
		$scope.loadMySendRecipientInfoList(qiu_page_num);
	    }else{
		$scope.loadMyCliamDonateInfoList(qiu_page_num);
	    }
	}
	$scope.$broadcast('scroll.refreshComplete');
    };
    //////
    $scope.loadMore = function(from,isFaBu){
        $scope.note = "";
    	console.log("[load more from and isFaBu]:"+from + "and" + isFaBu);
    	if( from == 'juan_or_help')
    	{
    	    if(isFaBu){
    		$scope.loadMoreMyDonateInfoList(juan_page_num);
    	    }else{
    		    $scope.loadMoreMyHelpRecipientInfoList(juan_page_num);
    	    }


    	}
    	if( from == 'qiu_or_need'){

    	    if(isFaBu){
    		$scope.loadMoreMySendRecipientInfoList(qiu_page_num);
    	    }else{
    		$scope.loadMoreMyCliamDonateInfoList(qiu_page_num);
    	    }
    	}
    	$scope.$broadcast('scroll.infiniteScrollComplete');
    };
    
    $scope.onSwipeLeft = function() {
        $state.go("tab.personal");
        loginService.getUsers();
    };
    $scope.onSwipeRight = function() {
        $state.go("tab.home");
    };
    
    $scope.goToJuanDetail = function(xid){
	$state.go('juan_detail',{'xid':xid});
    };
    
    $scope.goToQiuDetail = function(xid){
	$state.go('qiu_detail',{'xid':xid});
    };

    ////////
    //////申请失败彩蛋
   $scope.beRejectedPopupSurprise = function() {
        $scope.rejectedPopupSurprise = popupService.show('show',
         {
             cssClass:'surprise-er-popup',
             templateUrl: "templates/popup/be-rejected-surprise-popup.html",
             scope: $scope
          });

    };
    //////关闭申请失败彩蛋出窗
   $scope.cancelBeRejectedPopupSurprise = function(){
        $scope.rejectedPopupSurprise.close();
   };

    $scope.markRead = function(info_type,xid){
        commonService.markRead({xid:xid,info_type:info_type}).then(
            function(data){
                $rootScope.log("mark read response",JSON.stringify(data));
            },function(data){
                $rootScope.log("mark read response","error");
            }
        );
    };

    $scope.goToDetail = function(info_type,xid,progress_state){  //查看详细
        console.log("gotoDetail");
        //var arrayPushData = localStorageService.get("arrayPushData",[]);
        if("refuse" == progress_state){
            //$rootScope.showTopMsg("有更需要这件物品的人，感谢您的理解与支持");
            $scope.beRejectedPopupSurprise();
            return false;
        }
        $scope.markRead(info_type,xid);
        if(info_type=="donate")
        {
            $state.go('juan_detail',{'xid':xid});
        }else if(info_type=="recipient"){
            $state.go('qiu_detail',{'xid':xid});
        }

    };
    
    ///献爱心中的我发布的
    $scope.my_juanProgressAction = function(state,xid){
    var info_type = "donate";
	switch(state){
	    case "wait":
		$rootScope.showDebugToast("等待认领");
		$rootScope.showTopMsg("等待认领");
		break;
	    case "recipient":
		$rootScope.showDebugToast("已有人求捐 --->查看");
		$scope.markRead(info_type,xid);
		$state.go("choose_help_who",{info_type:info_type,xid:xid});
		break;
	    case "before_mail":
	    $scope.markRead(info_type,xid);
		$state.go("choose_express",{info_type:info_type,xid:xid});
		break;
	    case "mail":
		$rootScope.showDebugToast("爱心邮寄中");
		$scope.markRead(info_type,xid);
		$state.go("myactive_express_mailing",{info_type:info_type,xid:xid,from:'other'});
		break;
	    case "signfor":
		$rootScope.showTopMsg("您的爱心已被签收！");
		$scope.markRead(info_type,xid);
		$rootScope.showDebugToast( "爱心已签收");
		break;
	    case "thanks":
		$rootScope.showDebugToast("爱心已签收--->查看感谢信");
		$scope.markRead(info_type,xid);
		$state.go("view_thanks_letter",{info_type:info_type,xid:xid});
		break;
	    default:
	
	}
    };
  ///献爱心中的我帮助的
    $scope.my_helpProgressAction = function(state,xid){
    var info_type = "recipient";
	switch(state)
	    {
	    case "wait":	
		break;
	    case "donate":
	    $scope.markRead(info_type,xid);
		$state.go("choose_express",{info_type:info_type,xid:xid});
		break;
	    
	    case "mail":
		$rootScope.showDebugToast("邮寄中");
		$scope.markRead(info_type,xid);
		$state.go("myactive_express_mailing",{info_type:info_type,xid:xid,from:'other'});
		break;
	    case "signfor":
		$rootScope.showDebugToast("已签收 ");
		$scope.markRead(info_type,xid);
		$rootScope.showTopMsg("您的爱心已被签收！");
		break;
	    case "thanks":
		$rootScope.showDebugToast("已签收 --->查看感谢信");

		$state.go("view_thanks_letter",{info_type:info_type,xid:xid});
		$scope.markRead(info_type,xid);
		break;
	    default:
	    }
	
    };
    
  ///求帮助中我发布的
    $scope.my_qiuProgressAction = function(state,xid,info_item){
    var info_type = "recipient";
	switch(state)
	    {
	    case "wait":
		$rootScope.showDebugToast("等待捐助 ");
		$rootScope.showTopMsg("请耐心等待捐助！");
		break;
	    case "donate":
	    $state.go("wait_express",{donate_nick_name:info_item.donate_nick_name,donate_avatar:info_item.donate_avatar});
	    $scope.markRead(info_type,xid);
		$rootScope.showDebugToast("已获捐 等待邮寄 ");
		break;
	    
	    case "mail":
		$rootScope.showDebugToast("邮寄中");
		$scope.markRead(info_type,xid);
		$state.go("express_mailing",{info_type:info_type,xid:xid,from:'my'});
		break;
	    case "signfor":
		$rootScope.showDebugToast("已签收 --->填写感谢信 ");
		$scope.markRead(info_type,xid);
		$state.go("edit_thanks_letter", {info_type:info_type,xid:xid});
		break;
	    case "thanks":
		$rootScope.showDebugToast("完成");
		$scope.markRead(info_type,xid);
		$state.go("view_thanks_letter",{info_type:info_type,xid:xid});
		break;
	    default:
	    }
	
    };
    
  ///求帮助中我认领的
    $scope.my_renProgressAction = function(state,xid,info_item){
    var info_type = "donate";
	switch(state)
	    {
	    case "wait":
		$rootScope.showDebugToast("我需要 "); //不会出现
		break;
	    case "recipient":
		$rootScope.showDebugToast("待确认 ");
		$scope.markRead(info_type,xid);
		$rootScope.showTopMsg("请耐心等待确认通过！");
		break;
	    case "before_mail":
		$rootScope.showDebugToast("已通过--->等待邮寄 ");
		$scope.markRead(info_type,xid);
		$state.go("wait_express",{donate_nick_name:info_item.donate_nick_name,donate_avatar:info_item.donate_avatar});
		break;
	    case "mail":
		$rootScope.showDebugToast("邮寄中 ");
		$scope.markRead(info_type,xid);
		$state.go("express_mailing",{info_type:info_type,xid:xid,from:'my'});
		break;
		case "refuse":
		$scope.beRejectedPopupSurprise();
		$scope.markRead(info_type,xid);
        //$rootScope.showTopMsg("有更需要这件物品的人，感谢您的理解与支持");
        //$state.go("express_mailing",{info_type:'donate',xid:xid,from:'my'});
        break;
	    case "signfor":
		$rootScope.showDebugToast("已签收  填写感谢信 ");
		$scope.markRead(info_type,xid);
		$state.go("edit_thanks_letter", {info_type:info_type,xid:xid});
		break;
	    case "thanks":
		$rootScope.showDebugToast("完成");
		$scope.markRead(info_type,xid);
		$state.go("view_thanks_letter",{info_type:info_type,xid:xid});
		break;
	    default:
	    }
	
    };
    
    
})

//////引导页
.controller('guideCtrl', function($scope,$rootScope, $state,$ionicPopup,$ionicHistory, localStorageService) {  //
    console.log("guideCtrl");

})