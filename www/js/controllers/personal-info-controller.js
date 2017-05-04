angular.module('afu.personal-info-controller', ['ngCordova'])
////个人信息修改
.controller('changePersonalCtrl', function($scope,$rootScope,$cordovaImagePicker,$cordovaCamera,$state,$ionicPopup,$ionicActionSheet,localStorageService,personService) {  //
    console.log("changePersoanlCtrl");
    $scope.userInfo = localStorageService.get("userInfo",null);
    console.log("localStorageService userInfo:"+JSON.stringify($scope.userInfo));
   ////////初始化数据
       $scope.$on("$ionicView.beforeEnter", function(){
       console.log("$ionicView.beforeEnter");
       	//$state.go("login");
        $scope.userInfo = localStorageService.get("userInfo",null);
        console.log("localStorageService userInfo:"+JSON.stringify($scope.userInfo));
        $scope.userInfo.avatar = $rootScope.basePicUrl + $scope.userInfo.avatar;
       });

       $scope.$on('$ionicView.afterEnter', function(scopes, states ) {
             console.log("$ionicView.afterEnter");
             //$scope.checkCertification();
               $scope.isChangeAvatar = false;
           });

   $scope.isChangeAvatar = false;
    var options = {
             quality: 100,
             destinationType: Camera.DestinationType.FILE_URI,
             sourceType: Camera.PictureSourceType.CAMERA,
             allowEdit: true,
             encodingType: Camera.EncodingType.JPEG,
             targetWidth: 100,
             targetHeight: 100,
             popoverOptions: CameraPopoverOptions,
             saveToPhotoAlbum: false,
       	     correctOrientation:true
           };

    //选自相册
    $scope.pickAvatar = function()
    {
        options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        $cordovaCamera.getPicture(options).then(function(imageData) {
             console.log('Image URI: ' + imageData);
             $scope.userInfo.avatar = imageData;
             $scope.isChangeAvatar = true;
           }, function(err) {
             console.log("error getting photos");
           });
	/*var options = {
		maximumImagesCount: 1,
		width: 0,
		height: 0,
		quality: 0
		};

	console.log("pickImages");
	$cordovaImagePicker.getPictures(options)
	.then(function (results) {
	    console.log("[succeed getting photos]:"+JSON.stringify(results) );
	    for (var i = 0; i < results.length; i++) {
		console.log('Image URI: ' + results[i]);
		$scope.userInfo.avatar = results[0];
	    }

	}, function(error) {
	    // error getting photos
	    console.log("error getting photos");
	});*/
    };

    var startCamera = function(){

           options.sourceType = Camera.PictureSourceType.CAMERA;
           $cordovaCamera.getPicture(options).then(function(imageData) {
             console.log('Image URI: ' + imageData);
             $scope.userInfo.avatar = imageData;
             $scope.isChangeAvatar = true;
           }, function(err) {
             console.log("error getting photos");
           });
    };


    $scope.showSheet = function() {
           // 显示操作表
           $ionicActionSheet.show({
             buttons: [
               { text: '相册' },
               { text: '拍照' },
             ],
             titleText: '选择',
             cancelText: '取消',

             buttonClicked: function(index) {
                switch (index){
                //相册
                    case 0:
                    {

                    $scope.pickAvatar();
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
    
  //上传成功
    var success = function (r) {
        console.log("[Register]:上传成功! Code = " + r.responseCode);

        personService.getUserInfo();
        $state.go("tab.personal",{from:'update'});
        $rootScope.showTopMsg("修改成功！");
        //$rootScope.goBack();
    }

    //上传失败
    var fail = function (error) {
        console.log("[Register]:上传失败! Code = " + error.code);
        $rootScope.showTopMsg("修改失败！请重试");
    }

    var optionss = new FileUploadOptions();
    optionss.fileKey = "avatar";
    optionss.fileName =  $scope.userInfo.avatar.substring( $scope.userInfo.avatar.lastIndexOf('/') + 1,$scope.userInfo.avatar.length );
    optionss.mimeType = "image/jpeg";

    var ft = new FileTransfer();
    
    
    
    $scope.done = function(){
    if( $scope.isChangeAvatar ){
        //上传参数
        if( $scope.userInfo.nick_name == "" ){
            $rootScope.showTopMsg("昵称不可为空");
            return false;
        }else if( $scope.userInfo.nick_name.length > 8 ){
            $rootScope.showTopMsg("昵称长度限制为8个字符");
            return false;
        }
        var params = $scope.userInfo;
        optionss.params = params;

        console.log("[request params]:" + JSON.stringify(params));
        ft.upload($scope.userInfo.avatar, encodeURI($rootScope.baseUrl+"userinfo/update"), success, fail, optionss);

    }else{
        console.log("[userINfo]"+JSON.stringify($scope.userInfo));
        if( $scope.userInfo.nick_name == "" ){
            $rootScope.showTopMsg("昵称不可为空");
            return false;
        }else if( $scope.userInfo.nick_name.length > 8 ){
            $rootScope.showTopMsg("昵称长度限制为8个字符");
            return false;
        }
        personService.updateUserInfo({nick_name:$scope.userInfo.nick_name,signature:$scope.userInfo.signature}).then(
            function(data){
                $rootScope.log("personService.updateUserInfo",JSON.stringify(data));

                personService.getUserInfo();
                $state.go("tab.personal",{from:'update'});
                $rootScope.showTopMsg("修改成功！");
            },function(data){
                $rootScope.log("personService.updateUserInfo","error");
                $rootScope.showTopMsg(data.toast+",请重试！");
            }
        );
    } // end if


    };

    
})


