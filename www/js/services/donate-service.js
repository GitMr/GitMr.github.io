/*
 * FileName:donate-service.js
 * TODO:捐助者service
 * Author：yangxiaoyu
 * Date:
 */

/*module中ng-app的名字应该在html中标明*/
angular.module('afu.donate-service',[])
.factory("donateService",function($q,$http,$rootScope,localStorageService){
    
    return{
        /*
         * 下列方法
        */
        sendDonateInfo:function(donateInfo){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/send_info",donateInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("donateInfo",{"value":data.donateInfo});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject();
            });
            return deferred.promise;
        },//sendDonateInfo end
        ////我发布的捐助信息   --献爱心信息
        viewMyDonateInfoList:function(page){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/my_donate_info_list",page)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("page",{"value":data.page});
                deferred.resolve(data);
            },
            
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//viewMyDonateInfoList end
        
    /*  我帮助的求助信息 donate/my_recipient_info_list*/
        myRecipientInfoList:function(page){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/my_recipient_info_list",page)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("page",{"value":data.page});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//myRecipientInfoList  end


         /* donate/get_express_address*/
        getExpressAddress:function(xid){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/get_express_address",xid)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//getExpressAddress  end


         /*  donate/get_thanks_letter */
        viewThanksLetter:function(xid){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/get_thanks_letter",xid)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("xid",{"value":data.xid});
                deferred.resolve(data);
            }, 
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//viewThanksLetter  end


        /* donate/confirm_help_recipient_info */
        conformHelp:function(xid){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/confirm_help_recipient_info",xid)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("xid",{"value":data.xid});
                deferred.resolve(data);
            }, 
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//conformHelp  end


         /* donate/add_express_info */
        addExpress:function(expressInfo){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/add_express_info",expressInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            }, 
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//addExpress  end  


         /* donate/confirm_recipient_user */
        conformRecipientUser:function(related_id){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/confirm_recipient_user",related_id)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            }, 
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//conformRecipientUser  end
        
        /* donate/view_claims_list */
        viewClaimsList:function(xid){
            var deferred =$q.defer();
            $http.post($rootScope.baseUrl+"donate/view_claims_list",xid)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                
                deferred.resolve(data);
            }, 
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//view_claims_list  end
    };
    
})
