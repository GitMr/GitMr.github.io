/*
 * FileName:common-service.js
 * TODO:捐助和受捐共有功能service
 * Author：yangxiaoyu
 * Date:
 */

/*module中ng-app的名字应该在html中标明*/
angular.module('afu.common-service',[])
.factory("commonService",function($q,$http,$rootScope,localStorageService){
    
    return{
        /*
         * 下列方法
        */
        /*info_list
         * 首页获得捐助，求助信息,由info_type区分。
     * wtype_id区分物品类别
         * */
    
        infoList:function(infoList){
            var deferred = $q.defer();
            
            $http.post($rootScope.baseUrl+"common/info_list",infoList,
            {
               headers : {'isShowLoading' : true}
            }
            )
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data.data));
                //localStorageService.update("infoList",data.data);
                
                deferred.resolve(data.data);
            },
                        
            function (data){
        	//$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//infoList end
        
        getwtype:function(){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/wtype_list",null,{
               headers : {'isShowLoading' : false}
           })
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("getwtype",data);
                deferred.resolve(data);
            },
            
            function (data){
        	//$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//getwtype end
        
    /*  common/get_info */
        getInfo:function(wInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/get_info",wInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("wInfo",{"value":data.wInfo});
                deferred.resolve(data);
            },
                        
            function (data){
        	$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
            
        },//getInfo  end

         addCollection:function(collectionInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/add_collection",collectionInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                
                deferred.resolve(data);
            },
                        
            function (data){
        	$rootScope.showDebugToast(data.message);
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },//addCollection end
        
        /*common/view_recipient_collection*/
        viewRecipientCollection:function(page){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/view_recipient_collection",page)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
            
        },//view_recipient_collection end

        /*common/view_donate_collection*/
        viewDonateCollection:function(page){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/view_donate_collection",page)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },

            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;

        },//view_donate_collection end



    /*  common/search_info */
        searchInfo:function(searchInfo){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/search_info",searchInfo)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                //localStorageService.update("searchInfo",{"value":data.searchInfo});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
            
        },//searchInfo  end


        ////??????????????????????what is
        share:function(shareInfoCode){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/share",shareInfoCode)
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("shareInfoCode",{"value":data.shareInfoCode});
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);

            });
            return deferred.promise;
            
        },//share  end

        /*  common/poster  */
        poster:function(){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/poster",null,
            {
               headers : {'isShowLoading' : false}
            }
            )
            .then(function(data){
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("poster",data);
                deferred.resolve(data);
            },
                        
            function (data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);

            });
            return deferred.promise;
            
        },//poster  end
        
        //feedback
        feedback:function(content){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/feedback",content)
            .then(function (data) {
                console.log("response datas:"+JSON.stringify(data));
                localStorageService.update("feedback",data);
                deferred.resolve(data);
            },
            function(data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },
         //feedback end
        
        //view express info
        viewExpressInfo:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/view_express_info",requestData)
            .then(function (data) {
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            function(data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        },
         //view express info
         //检查更新 common/check_update
        checkUpdate:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/check_update",requestData)
            .then(function (data) {
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            function(data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        }, //end common/check_update

        //标志已读 common/mark_read {xid,info_type}
        markRead:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/mark_read",requestData,
            {
               headers : {'isShowLoading' : false}
            })
            .then(function (data) {
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            function(data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        }, //end common/mark_read

         //标志已读 common/delete_info {xid,info_type}
        deleteInfo:function(requestData){
            var deferred = $q.defer();
            $http.post($rootScope.baseUrl+"common/delete_info",requestData)
            .then(function (data) {
                console.log("response datas:"+JSON.stringify(data));
                deferred.resolve(data);
            },
            function(data){
                console.log("response error datas:"+JSON.stringify(data));
                deferred.reject(data);
            });
            return deferred.promise;
        }, //end common/delete_info
    };
    
})
