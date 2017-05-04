angular.module('afu.settings-controllers', ['ngCordova'])
////反馈
.controller('settingCtrl', function($scope,$rootScope, $state,$ionicPopup,commonService,localStorageService,
$cordovaAppVersion,$ionicLoading,$ionicHistory,$cordovaFileTransfer,$cordovaFileOpener2,$timeout,popupService) {  //
    console.log("settingCtrl");

    $scope.$on("$ionicView.beforeEnter", function(){
               console.log("$ionicView.beforeEnter");
               /*window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
                  console.log( "event fired!" );
                  } );*/
        });
    $scope.goAboutAFu = function(){
    	$state.go("about_afu");
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

    	    if(ionic.Platform.isAndroid()){
    	       platform = 'android';
    	    }

    	    commonService.checkUpdate({platform:platform}).then(
    	        function(data){
    	            $rootScope.log("checkUpdate",JSON.stringify(data));
    	            $scope.updateData = data;
    	            $cordovaAppVersion.getVersionCode().then(

    	                function(versionCode){
    	                    $rootScope.log("local version",JSON.stringify(versionCode));
                            if(versionCode < data.version_code){
                                showUpdateConfirm(data.version_code)
                            }else{
                                $scope.showTopMsg("已是最新版本！");
                            }
    	                }
    	            );
    	        },function(data){
    	            $rootScope.log("checkUpdate","error");
    	            $rootScope.showTopMsg(data.toast+",请重试！");
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
       
})

////关于阿福
.controller('aboutAFuCtrl', function($scope,$rootScope,$stateParams,$state,$ionicPopup,addressService) {  // 
    console.log("aboutAFuCtrl");
        
    
})

