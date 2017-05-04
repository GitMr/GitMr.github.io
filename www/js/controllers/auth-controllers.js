angular.module('afu.auth-controllers', ['ngCordova'])

.controller('registerCtrl', function($scope,$rootScope,$cordovaToast,$cordovaFileTransfer,$cordovaCamera,$ionicLoading,$ionicActionSheet,$cordovaFile,$state,$location,$timeout, $interval,$cordovaImagePicker,$cordovaCamera,localStorageService,registerService,utilsService,loginService) {  //
    console.log("registerCtrl");
  
    //根据dpr选择不同的图片尺寸
    $scope.myImgSize = (lib.flexible.dpr == '3') ? '3' : '2';

    var loaclRegister = localStorageService.get("register",{phonenum:"",vcode:"",password:"",nick_name:""});
    $scope.register = loaclRegister; //{phonenum:"",vcode:"",password:"",nick_name:"",avater:{} };
    
    $scope.isVcodeDisabled = true;  //获取验证码按钮默认禁用，填写正确的手机号后可用
    $scope.isVcodeNextDisabled = true;  //下一步码按钮默认禁用，填写正确的手机号后可用
    $scope.phonenumVal=function(){  
        return  $scope.register.phonenum;
    };  
    $scope.$watch($scope.phonenumVal,function(newValue,oldValue){  //监控电话号码输入
	
	console.log("[register.phonenum input]:"+newValue);
	console.log("[register.phonenum input length]:"+newValue.length);
	
	if(utilsService.testPhonenum(newValue))
	{
	    $scope.isVcodeDisabled=false;   
	    $scope.isVcodeNextDisabled = false; 
	}else {
	    $scope.isVcodeDisabled=true; 
	}
    });
    /** 
     * TODO 获取验证码 
     * Params phonenum(Object)
     * return null
     * Author WangYong
     * Date 2016-08-05
     *  */
    $scope.timePromise = undefined;
    $scope.vcodeBtnString = "获取验证码";
    $scope.countSeconds = 60;
    $scope.getVcode = function(){
	console.log("getVcode");
	var isSuccess = registerService.getVcode({"phonenum":$scope.register.phonenum,from:'register'});
	console.log("getVcode:"+JSON.stringify(isSuccess));
	isSuccess.then(
		
	function(result){
	    
	    $rootScope.log('getvcode successed');
	    $rootScope.log("getVcode:",JSON.stringify(result));
	    $rootScope.showTopMsg("验证码已发送！");
	    $scope.isVcodeDisabled = true;
	    //验证码倒计时
	    $scope.timePromise = $interval(function() {
		
		if( $scope.countSeconds <= 0 ){  
	            $interval.cancel($scope.timePromise);  
	            $scope.timePromise = undefined;  
	            $scope.countSeconds = 60;  
	            $scope.vcodeBtnString = "重获验证码";
	            $scope.isVcodeDisabled = false;
	            
	          }else{  
	            $scope.vcodeBtnString = "重获验证码(" + $scope.countSeconds + "秒)" ;  
	            $scope.countSeconds--;     
	          }  //end if
		
	    	}, 1000);
	    
	    },
	    
	 function(data){
		$rootScope.showTopMsg("发送失败！"+data.toast);
	   
	    });
	 
		
    };
    
    
    $scope.vcodeVal = function(){  
        return  $scope.register.vcode;
    };  
    $scope.$watch($scope.vcodeVal,function(newValue,oldValue){  //监控验证码输入
	console.log("[vcode input]:"+newValue);
	console.log("[vcode input length]:"+newValue.length);
	$scope.error_note = '';
        /*if( newValue.length >= 1 ){  

            $scope.isVcodeNextDisabled = false; 
            
        }else{  
            $scope.isVcodeNextDisabled = true;
        }  */
    }); 
    
    $scope.testVcode = function(){
	if(registerService.testVcode( $scope.vcodeVal() ))
	{
	    console.log("[testVcode]:succeed");
	    
	    localStorageService.update("register",$scope.register);
	    $state.go("register2");
	}else {
	    console.log("[testVcode]:failed");
	    $scope.error_note = '验证码错误';	
	}
	
    } ;
    
    
    /************设置密码页面 *******************/
    
    $scope.isPasswordDisabled = true;  //填写密码页面“下一步”按钮默认不可用，两次输入的密码符合要求且一直后可用

    $scope.temp = {"password":"","repassword":""};
	
    $scope.passwordVal = function(){  
        return  $scope.temp.password;
    };  
    $scope.$watch($scope.passwordVal,function(newValue,oldValue){  //监控密码
	$scope.error_note = "";
	console.log("[password input]:"+newValue);
	console.log("[repassword input]:"+$scope.temp.repassword);
        if( newValue.length >= 6 && $scope.temp.repassword.length >= 6){  

            $scope.isPasswordDisabled = false; 
            
        }else{  
            $scope.isPasswordDisabled = true;
        }  
    });  
    
    $scope.repasswordVal = function(){  
        return  $scope.temp.repassword;
    };  
    $scope.$watch($scope.repasswordVal,function(newValue,oldValue){  //监控密码
	$scope.error_note = "";
	console.log("[repassword input]:"+$scope.temp.password);
	console.log("[repassword input]:"+newValue);
        if( newValue.length >= 6 && $scope.temp.password.length >= 6){  

            $scope.isPasswordDisabled = false; 
            
        }else{  
            $scope.isPasswordDisabled = true;
        }  
    });  
    
    $scope.checkTwoPwds = function()
    {
	if( $scope.passwordVal() == $scope.repasswordVal() )
	{
	    console.log("[checkTwoPwds]:succeed");
	    $scope.register.password = $scope.passwordVal();
	    localStorageService.update("register",$scope.register);
	    $state.go("polishinfo");
	}else
	{
	    console.log("[checkTwoPwds]:failed");
	    $scope.error_note = "两次密码不一致";
	    return;
	}
    };
    /***************************完善信息*****************************/
    
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
    
    
    $scope.avatar = "img/addHead@"+$scope.myImgSize+"x.png";

    var startCamera = function(){

               options.sourceType = Camera.PictureSourceType.CAMERA;
               $cordovaCamera.getPicture(options).then(function(imageData) {
                 console.log('Image URI: ' + imageData);
                 $scope.avatar = imageData;
               }, function(err) {
                 console.log("error getting photos");
               });
        };
var startAlbum = function(){

               options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
               $cordovaCamera.getPicture(options).then(function(imageData) {
                 console.log('Image URI: ' + imageData);
                 $scope.avatar = imageData;
               }, function(err) {
                 console.log("error getting photos");
               });
        };

    $scope.pickAvatar = function()
    {
	 console.log("pickImages");
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
    
    $scope.doneRegister = function()
    {
	console.log("[avatar]:"+JSON.stringify($scope.avatar));
	if( "img/addHead@"+$scope.myImgSize+"x.png" == $scope.avatar )
	{
	    $cordovaToast.showLongCenter("请选择头像");
	    return;
	}
	if( "" == $scope.register.nick_name )
	{
	    $cordovaToast.showLongCenter("请输入昵称");
	    return;
	}
	console.log("[register]:"+JSON.stringify($scope.register));
	/*var dir = $scope.avatar.substring(0, $scope.avatar.lastIndexOf('/')+1 );
	var filename = $scope.avatar.substring( $scope.avatar .lastIndexOf('/') + 1,$scope.avatar .length );
	console.log("[dir and filename]:"+dir + "==" + filename);*/
	
	 //上传成功
        var success = function (r) {
            $ionicLoading.hide();
            $rootScope.log("response",JSON.stringify(r));
            var res = JSON.parse(r.response);
            if( res.result == 'ok'){

                console.log("[Register]:上传成功! Code = " + r.responseCode);
                var loginReturn = loginService.login($scope.register);
                loginReturn.then(
                function(result){

                    loginService.getUserid({phonenum:$scope.register.phonenum}).then(
                          function(data){
                            console.log("[getuserid datas]"+JSON.stringify(data));
                            localStorageService.update("userID",data.userid);//保存用户user_id
                            window.plugins.jPushPlugin.resumePush();
                            window.plugins.jPushPlugin.setAlias(data.userid);
                          },function(){
                            console.log("[getuserid datas]:error");
                          }
                            );

                    localStorageService.update("isLogin",{"state":true});///ceshihshsihs
                    console.log("login success");
                    $state.go("tab.home",{'from':'login'});
                },
                function(){
                    console.log("login error");
                });

            }else{
                $rootScope.showDebugToast(JSON.stringify(r));
                $rootScope.showTopMsg(res.message);
            }

        }

        //上传失败
        var fail = function (error) {
            $ionicLoading.hide();
            $rootScope.log('response error',JSON.stringify(error));
            console.log("[Register]:上传失败! Code = " + error.code);
            $rootScope.showTopMsg("注册失败，请重试！");
        }

        var optionss = new FileUploadOptions();
        optionss.fileKey = "avatar";
        optionss.fileName =  $scope.avatar.substring( $scope.avatar .lastIndexOf('/') + 1,$scope.avatar .length ).split('?')[0];
        optionss.mimeType = "image/jpeg";

        //上传参数
        var params = $scope.register;
        optionss.params = params;
        console.log("[auth request params]:" + JSON.stringify(params));
        var ft = new FileTransfer();
        $ionicLoading.show({
         template: '<p>注册中...</p><ion-spinner class="spinner-assertive"></ion-spinner>'
            });
        ft.upload($scope.avatar, encodeURI($rootScope.baseUrl+"auth/register"), success, fail, optionss);

	console.log("doneRegister");
    };
    
    
    
})
//////////////login
.controller('loginCtrl', function($state,$scope,$rootScope, $timeout, $location,loginService,utilsService,localStorageService) {

    $scope.$on("$ionicView.afterEnter", function(){
        console.log("$ionicView.beforeEnter");
        $scope.error_note = "";
        $scope.user = localStorageService.get("loginData",{"phonenum":"","password":""}); //{"phonenum":"","password":""};
    });

    
    $scope.user = localStorageService.get("loginData",{"phonenum":"","password":""}); //{"phonenum":"","password":""};
    console.log("[local login data]:" + JSON.stringify($scope.user) );
    $scope.isPhonenum = false;  
    $scope.isPassword = false; 
/*    $scope.user.phonenum = "";  
    $scope.user.password = "";  */
    
    $scope.phonenumCount = 0;
    //计算手机号输入框失去焦点的次数，以此来区分是否为第一次输入号码，第一次输入号码的时候  
    //不进行实时的号码规则正确与否的输入反馈
    $scope.phonenumCountBlur = function()  						
    {
	$scope.phonenumCount ++;
    }
    
    $scope.phonenumVal=function(){  //返回当前输入的手机号码
        return  $scope.user.phonenum;
    };  
    $scope.$watch($scope.phonenumVal,function(newValue,oldValue){  //监控电话号码输入
	
	console.log("oldValue:"+oldValue+"-"+"\nnewValue:"+newValue);
	
        if( utilsService.testPhonenum(newValue) )  //手机号码正则校验
        {   
            $scope.isPhonenum = true; 
            $scope.error_note = "";
            
        }else{  
            console.log("phonenum watch:"+$scope.phonenumCount);
            if( $scope.phonenumCount != 0 )
            {
                $scope.error_note = "手机号码格式有误";
            }           
            $scope.isPhonenum = false;   
        }  
        
        
    });  
    
    $scope.passwordVal = function(){  
        return  $scope.user.password;
    };  
    $scope.$watch($scope.passwordVal,function(newValue,oldValue){  //监控密码输入
	
	if ( $scope.phonenumCount != 0 && !utilsService.testPhonenum( $scope.phonenumVal() ) ) //输入密码的时候，如果输入的手机号格式不匹配给出提示
	{
	    $scope.error_note = "手机号码格式有误";
	}
	console.log("[password input]:"+newValue);
	console.log("[password input length]:"+newValue.length);
        if( newValue.length >= 6 ){  
            //$scope.isDisabled=false; 
            $scope.isPassword = true;  
        }else{  
            $scope.isPassword = false; 
            //$scope.isDisabled=true;  
        }  
    });  
    
    
  //登录按钮事件--------------------------------------------
   $scope.login = function(user) {
             
	if(typeof(user)=='undefined'){
	    $scope.error_note = '请输入用户名、密码！';	
	    return false;
	}
	var loginReturn = loginService.login(user);
	loginReturn.then(
    		function(result){
    		localStorageService.update("user",user);//保存用户user 登录信息
    
    		console.log("[result datas]"+JSON.stringify(result)); 
    		
    		loginService.getUserid({phonenum:user.phonenum}).then(
		  function(data){
		    console.log("[getuserid datas]"+JSON.stringify(data)); 
		    localStorageService.update("userID",data.userid);//保存用户user_id
		    window.plugins.jPushPlugin.resumePush();
		    window.plugins.jPushPlugin.setAlias(data.userid);
		  },function(){
		    console.log("[getuserid datas]:error");     
		  }
    		);
    		
    		localStorageService.update("isLogin",{"state":true});///ceshihshsihs
    		console.log("login success");
    		$state.go("tab.home",{'from':'login'});
    		
    		},
    		function(toast){
    		    //$rootScope.showDebugToast(data.message);
    		    console.log("login error");
    		    console.log("login fail");
    		    //$scope.error_note = '用户名或密码错误';	
    		    $scope.error_note = toast;
    		});

	   
  };
  //--------------------------------------------
  $scope.logout = function() {   $location.path('/app/login');   };
  //--------------------------------------------
   // An alert dialog
	 $scope.showAlert = function(msg) {
	   var alertPopup = $ionicPopup.alert({
		 title: '提示',
		 template: msg
	   });
	 };
  //--------------------------------------------
})

//////////////resetPasswordCtrl
//Added by WangYong
.controller('resetPasswordCtrl', function($state,$scope,$rootScope, $timeout, $interval,$location,passwordService,registerService,utilsService,localStorageService) {

    
    $scope.error_note = "";
  //根据dpr选择不同的图片尺寸
    $scope.myImgSize = (lib.flexible.dpr == '3') ? '3' : '2';
    
    $scope.resetPassword = {"phonenum":"","vcode":"","password":""};
    
    $scope.isSubmitDisabled = true;  //获取验证码按钮默认禁用，填写正确的手机号后可用
    $scope.phonenumVal=function(){  
        return  $scope.resetPassword.phonenum;
    };  
    $scope.$watch($scope.phonenumVal,function(newValue,oldValue){  //监控电话号码输入
	
	console.log("[register.phonenum input]:"+newValue);
	console.log("[register.phonenum input length]:"+newValue.length);
	
	if(utilsService.testPhonenum(newValue))
	{
	    $scope.isVcodeDisabled=false;   
	    $scope.isVcodeNextDisabled = false; 
	}else {
	    $scope.isVcodeDisabled=true; 
	}
    });
    /** 
     * TODO 获取验证码 
     * Params phonenum(Object)
     * return null
     * Author WangYong
     * Date 2016-08-05
     *  */
    $scope.timePromise = undefined;
    $scope.vcodeBtnString = "获取验证码";
    $scope.countSeconds = 60;
    $scope.getVcode = function(){
	console.log("getVcode");
	var isSuccess = registerService.getVcode({"phonenum":$scope.resetPassword.phonenum,from:'reset_password'});
	console.log("getVcode:"+isSuccess);
	isSuccess.then(
		
		function(result){
		    
		    console.log('getvcode successed');
		    console.log("getVcode:"+JSON.stringify(result));
		    $rootScope.showTopMsg("验证码已发送！");
		    $scope.isVcodeDisabled = true;
		    //验证码倒计时
		    $scope.timePromise = $interval(function() {
			
			if( $scope.countSeconds <= 0 ){  
		            $interval.cancel($scope.timePromise);  
		            $scope.timePromise = undefined;  
		            $scope.countSeconds = 60;  
		            $scope.vcodeBtnString = "重获验证码";
		            $scope.isVcodeDisabled = false;
		            
		          }else{  
		            $scope.vcodeBtnString = "重获验证码(" + $scope.countSeconds + "秒)" ;  
		            $scope.countSeconds--;     
		          }  //end if
			
		    	}, 1000);
		    
		    },
		    
		 function(data){
			$rootScope.showTopMsg("发送失败！"+data.toast);
		   
		    });
		
    };
    
    
    $scope.vcodeVal = function(){  
        return  $scope.resetPassword.vcode;
    };  
    $scope.$watch($scope.vcodeVal,function(newValue,oldValue){  //监控验证码输入
	console.log("[vcode input]:"+newValue);
	console.log("[vcode input length]:"+newValue.length);
	$scope.error_note = '';
        /*if( newValue.length >= 1 ){  

            $scope.isVcodeNextDisabled = false; 
            
        }else{  
            $scope.isVcodeNextDisabled = true;
        }  */
    }); 
    
    $scope.testVcode = function(){
	if(registerService.testVcode( $scope.vcodeVal() ))
	{
	    console.log("[testVcode]:succeed");
	    return true;
	}else {
	    console.log("[testVcode]:failed");
	    $scope.error_note = '验证码错误';	
	    return false;
	}
	
    } ;
    
    ////两次密码
    $scope.temp = {"password":"","repassword":""};
	
    $scope.passwordVal = function(){  
        return  $scope.temp.password;
    };  
    $scope.$watch($scope.passwordVal,function(newValue,oldValue){  //监控密码
	$scope.error_note = "";
	console.log("[password input]:"+newValue);
	console.log("[repassword input]:"+$scope.temp.repassword);
        if( newValue.length >= 6 && $scope.temp.repassword.length >= 6){  

            $scope.isPasswordDisabled = false; 
            
        }else{  
            $scope.isPasswordDisabled = true;
        }  
    });  
    
    $scope.repasswordVal = function(){  
        return  $scope.temp.repassword;
    };  
    $scope.$watch($scope.repasswordVal,function(newValue,oldValue){  //监控密码
	$scope.error_note = "";
	console.log("[repassword input]:"+$scope.temp.password);
	console.log("[repassword input]:"+newValue);
        if( newValue.length >= 6 && $scope.temp.password.length >= 6){  

            $scope.isPasswordDisabled = false; 
            
        }else{  
            $scope.isPasswordDisabled = true;
        }  
    });  
    
    $scope.checkTwoPwds = function()
    {
	if( $scope.passwordVal() == $scope.repasswordVal() )
	{
	    console.log("[checkTwoPwds]:succeed");
	    $scope.resetPassword.password = $scope.passwordVal();
	    return true;
	   
	}else
	{
	    console.log("[checkTwoPwds]:failed");
	    $rootScope.showTopMsg("两次密码不一致");
	    $scope.error_note = "两次密码不一致";
	    return false;
	}
    };
    
    
    ///http
    var resetPassWordRequest = function(){
	passwordService.resetPassword($scope.resetPassword).then(
		function(data){
		    console.log("[resetPassWordRequest]:succeed");
		    $rootScope.showTopMsg("重置密码成功！");
		    //$rootScope.goBack();
		    $scope.user = localStorageService.update("loginData",{"phonenum":"","password":""});
		    $state.go("login");
		},function(){
		    console.log("[resetPassWordRequest]:failed");
		    $rootScope.showTopMsg("重置密码失败！");
		});
    };
    
    $scope.doneResetPassword = function(){
	if( $scope.testVcode()){
	    if( $scope.checkTwoPwds() ){
		resetPassWordRequest();
	    }     
	} 	
    };
    
})
