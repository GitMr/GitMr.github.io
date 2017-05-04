/***
 * FileName:auth-services.js
 * TODO:身份验证相关
 * Author：WangYong
 * Date 
 * ***/


angular.module('afu.auth-services', [])

.factory("registerService",function($q,$http,$rootScope,localStorageService) {

    return {
         getVcode: function(vcode) {
             
             var deferred = $q.defer();
             $http.post($rootScope.baseUrl+"auth/vcode",vcode)
            .then( function(data) { //success
            console.log("[response datas]:"+JSON.stringify(data));
            console.log("[vcode_value]:"+data.vcode);
            localStorageService.update("vcode",{"vcode":data.vcode});
            console.log("[localStorage Vcode]:"+localStorageService.get("vcode",null).vcode );
            deferred.resolve(data);
            
            },
             function(data){  //error
            console.log("[response error datas]:"+JSON.stringify(data));
            
            $rootScope.showDebugToast(data.message);
            deferred.reject(data);//执行失败
            }
            );
            return deferred.promise;
        }, //getVcode end
        
        
        
        testVcode: function(vcode) {   //验证验证码是否正确，本地只做验证码匹配性校验，不做验证码有效期校验
            var loaclVcode = localStorageService.get("vcode",null);
            console.log("[input Vcode]:"+vcode );
            console.log("[localStorage Vcode]:"+localStorageService.get("vcode",null).vcode );
            if(loaclVcode.vcode == vcode)
            {
            return true;
            }else
            {
            return false;
            }
        }, //testVcode end
        
        register: function(registerData) {
            var deferred = $q.defer();
            if(typeof(FormData) == 'undefined'){
            console.log("[FOrmData not support]");
            }
            
            if (!("FormData" in window)) {
                // FormData is not supported; degrade gracefully/ alert the user as appropiate
            console.log("[window FOrmData not support]");
            }
            
            console.log("[registerData.avatar]:"+registerData.avatar);
            if (registerData.avatar == undefined) {
            
            console.log("[registerData.avatar not support]");
            }
            
            
            var fd = new FormData();
            console.log("[FormData fd before]"+ JSON.stringify(registerData) );
            fd.append('phonenum',registerData.phonenum);
            fd.append('vcode',registerData.vcode);
            fd.append('password',registerData.password);
            fd.append('nick_name',registerData.nick_name);
            //fd.append('nick_name',"sad");
            fd.append('avatar',registerData.avatar,"filena");
            console.log("[FormData fd after]"+ JSON.stringify(fd) );
            $http.post($rootScope.baseUrl+"auth/register",fd, { 
            
            headers: {'Content-Type':undefined},
                transformRequest: angular.identity 
            })
           .then( function(data) { //success
            
            console.log("[response success datas]:"+JSON.stringify(data));
            deferred.resolve(jobs);
        
           },
            function(data){  //error
            console.log("[response error datas]:"+JSON.stringify(data));
            
            $rootScope.showDebugToast(data.message);
            deferred.reject();//执行失败
           }
           );
           return deferred.promise;
        } //register end
        
    };
})
/////////////////////////////////////////////////////////////////////////
.factory("loginService",function($q,$http,$rootScope,localStorageService) {

    return {
        login: function(loginData) {
            
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/login",loginData)
            .then(function(data) {  //result:ok 回调函数            
            console.log("response datas:"+JSON.stringify(data));
            localStorageService.update("isLogin",{"state":true});
            localStorageService.update("loginData",loginData);
            deferred.resolve(data);

            },
            function(data) {    //失败回调函数
            console.log("response error datas:"+JSON.stringify(data));
            $rootScope.showDebugToast(data.message);
            deferred.reject(data.toast);//执行失败

            }
           
            );
            return deferred.promise;
        }, //login end
        
        updateLoginState: function(isLogin) {
            window.localStorage.setItem("isLogin",isLogin);
        //return isLogin;
        },
        getLoginState: function() {
            console.log("getLoginState function");      
            if ( null == window.localStorage["isLogin"] )
            {
                var isLogin = false;
            }else
            {
                isLogin = localStorage.getItem("isLogin");
            }
            //var isLogin = false;
            return isLogin;
        },//getLoginState End
        
        getUserid: function(phonenum) {   //获得userid
            
            console.log("[request phonenum]:"+phonenum );
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/getuserid",phonenum,
            {
               headers : {'isShowLoading' : false}
            }
            )
            .then( function(data) { //success
            console.log("[response datas]:"+JSON.stringify(data));
            
            localStorageService.update("userID",data.userid);//保存用户user_id
            console.log("[localStorage userID]:"+localStorageService.get("userID",null) );
            deferred.resolve(data);
            
            },
            function(data){  //error
            console.log("[response error datas]:"+JSON.stringify(data));
            
            $rootScope.showDebugToast(data.message);
            deferred.reject(data);//执行失败
            }
            );
            return deferred.promise;
            
         }//getUserid end
        
    };
})
////////////////////////////////////////////////////////////////
//添加者：杨晓宇 
//updated by WangYong 2016-09-13
.factory("passwordService",function($q,$http,$rootScope,localStorageService){
    
    return{
         resetPassword:function(resetInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/reset_password",resetInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("loginData",{phonenum:resetInfo.phonenum,password:''});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                $rootScope.showDebugToast(data.message);
                deferred.reject();
            });
            return deferred.promise;
        },//resetPassword  end

         changePassword:function(newPassInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/change_password",newPassInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("newPassInfo",{"value":data.newPassInfo});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject();
            });
            return deferred.promise;
        },//changePassword  end

        
    };
    
})
/////////////////////////////////////////////////////////////////////////
//added by WangYong
.factory("certificationService",function($q,$http,$rootScope,localStorageService) {

    return {
	authenticate:function(identityInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/authenticate",identityInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("identityInfo",{"value":data.identityInfo});
                deferred.resolve(data);
            },
                        
            function (data){
        	$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject();
            });
            return deferred.promise;
        },//authenticate  end

        viewAuthenticateState: function() {
            
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/view_authenticate_state",null)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("authenticateState",{"value":data.data});
                deferred.resolve(data);
            },
                        
            function (data){
        	//$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject();
            });
            return deferred.promise;

        },//viewAuthenticateState End

        viewAuthenticatePic: function(requestData) {

            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/view_authentic_pic",requestData)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            function (data){
            //$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject();
            });
            return deferred.promise;

        },//viewAuthenticatePic End
        ////get_authentic_info
        getAuthenticateInfo: function(requestData) {

            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"auth/get_authentic_info",requestData)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            function (data){
            //$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject();
            });
            return deferred.promise;

        }//viewAuthenticatePic End
        
    };
})



