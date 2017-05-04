/*
 * FileName:address-service.js
 * TODO:地址信息service
 * Author：yangxiaoyu
 * Date:
 */

/*module中ng-app的名字应该在html中标明*/
angular.module('afu.address-service',[])
.factory("addressService",function($q,$http,$rootScope,localStorageService){
    
    return{
      
        /*add address*/
        addAddress:function(address){
             var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/address/add",address)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("address_id",{"value":data.address_id});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//add address end
        
        updateAddress:function(address){
             var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/address/update",address)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//updateAddress end
        
         /*  common/address/set_default*/
        setDefaultAddress:function(addressId){
             var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/address/set_default",addressId)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("addressId",{"value":data.addressId});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//setDefaultAddress  end

        /*common/address/delete*/
         deleteAddress:function(addressId){
             var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/address/delete",addressId)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//deleteAddress end
        
        /*common/address/list */
        addressList:function(){
             var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/address/list",null)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("acode",{"value":data.acode});
                deferred.resolve(data);
            },
            
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//addressList end

        /*common/address/getAddressById */
        getAddressById:function(address_id){
             var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/address/get",address_id)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("acode",{"value":data.acode});
                deferred.resolve(data);
            },
            
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//getAddressById end
    };
    
})
