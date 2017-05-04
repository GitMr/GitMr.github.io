/*
 * FileName:person-service.js
 * TODO:个人信息service
 * Author：yangxiaoyu
 * Date:
 */

/*module中ng-app的名字应该在html中标明*/
angular.module('afu.person-service',[])
.factory("personService",function($q,$http,$rootScope,localStorageService){
    
    return{
        /*
         * 下列方法
        */
        getUserInfo:function(){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"userinfo/get",null,
            {
               headers : {'isShowLoading' : false}
            })
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("userInfo",data);
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//getUserInfo end
        
        ///////这个接口不要了、、、
        updateUserInfoAvatar:function(avatar){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"userinfo/update_avatar",avatar)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("avatar",{"value":data.avatar});
                deferred.resolve(data);
            },
            
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject();
            });
            return deferred.promise;
        },//updateUserInfoAvatar end
        
    /*  userinfo/update_name_sign_avatar */
        updateUserInfo:function(name_sign_avatar){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"userinfo/update",name_sign_avatar)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("upNameSign",{"value":data.upNameSign});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//updateUserInfo  end

    };
    
})
