/*
 * FileName:recipient-service.js
 * TODO:受捐者service
 * Author：yangxiaoyu
 * Date:
 */

/*module中ng-app的名字应该在html中标明*/
angular.module('afu.recipient-service',[])
.factory("recipientService",function($q,$http,$rootScope,localStorageService){
    
    return{
        /*
         * 下列方法
        */
        sendRecipientInfo:function(recipientInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/send_info",recipientInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//sendRecipientInfo end
        
        viewMyRecipientInfoList:function(page){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/my_recipient_info_list",page)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                
                deferred.resolve(data);
            },
            
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//sendrecipientInfoList end
        
    /*  recipient/my_claimdonate_info_list */
        myCliamDonateInfoList:function(page){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/my_claimdonate_info_list",page)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },// myCliamDonateInfoList  end


         /* recipient/confirm_claim_donate_info*/
        confirmClaim:function(confirmClaimInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/confirm_claim_donate_info",confirmClaimInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },// confirmClaim end
        
        /* recipient/get_express_address*/
        getExpressAddress:function(xid){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/get_express_address",xid)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
               
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },// getExpressAddress end
        
        /* recipient/sign_for*/
        signFor:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/sign_for",requestData)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },// sign_for end
        
        /* recipient/send_thanks*/
        sendThanks:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/send_thanks",requestData)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },// sendThanks end

        /* recipient/get/absentcount/claim*/
        getLeftClaimCount:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/get/absentcount/claim",requestData,{
               headers : {'isShowLoading' : false}
              })
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },

            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },// recipient/get/absentcount/claim end

        /* recipient/get/absentcount/request*/
        getLeftQiuFaBuCount:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"recipient/get/absentcount/request",requestData,{
                 headers : {'isShowLoading' : false}
              })
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },

            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },// recipient/get/absentcount/request end
        
    };
    
})
