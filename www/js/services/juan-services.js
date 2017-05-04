/***
 * FileName:juan-services.js
 * TODO:捐助者视角
 * Author：WangYong
 * Date 
 * ***/


angular.module('afu.juan-services', [])

.factory("newJuanService",function($q,$http,$rootScope,localStorageService) {

    return {
        getWtypes: function(vcode) {
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"auth/vcode",vcode)
            .then(function(data) { //success
            console.log("response datas:"+JSON.stringify(data));
            localStorageService.update("vcode",{"value":data.vcode});
            deferred.resolve(data);
            
            },
            function(data){  //error
            console.log("response error datas:"+JSON.stringify(data));
            deferred.reject(data);
            }
            );
            return deferred.promise;
        }, //getVcode end
        
        getJuanInfoList: function(vcode) {
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"auth/vcode",vcode)
            .then(function(data) { //success
            console.log("response datas:"+JSON.stringify(data));
            localStorageService.update("vcode",{"value":data.vcode});
            deferred.resolve(data);
            
            },
            function(data){  //error
            console.log("response error datas:"+JSON.stringify(data));
            deferred.reject(data);
            }
            );
            return deferred.promise;
        }, //getVcode end
    };
})
/////////////////////////////////////////////////////////////////////////
