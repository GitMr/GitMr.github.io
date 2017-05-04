angular.module('afu.services', [])

.factory('httpInterceptor', [ '$q', '$injector','localStorageService',function($q, $injector,localStorageService) {
    var httpInterceptor = { 
      'responseError' : function(response) { 
	  
	  //console.log("[response origins]:"+JSON.stringify(response));
	  $injector.get('$ionicLoading').hide();
	  
	 // console.log("[response origins data]:"+JSON.stringify(response.data));
	  if( JSON.stringify( response.data ).substring(0,9) == '{"result"')
	  {  
        	/*if (response.status === 302) { 
                 
                  console.log("\n url:"+response.config.url+"\n responseError:302-->redirect");
                } else if (response.status === 404) { 
                 
                	console.log("\n url:"+response.config.url+ "\n responseError:404-->not found");
                	
                } else if (response.status === 500){
                	console.log("\n url:"+response.config.url+ "\n responseError:500-->server inner error");
                	 
                }else{
                	console.log("\n url:"+response.config.url+ "\n responseError other response code:"+response.status);
                }
        	*/
	      	var toast = "服务器不在状态，请稍后再试~";
        	var serverCatchedErrorData = {result:response.data.result,toast:toast,message:"[result]:"+response.data.result+
        		"\n[code]:"+response.data.code+
        		"\n[message]:"+response.data.message+
        		"\n[url]:"+response.config.url};
        	$injector.get('$rootScope').showDebugToast(JSON.stringify(serverCatchedErrorData));
        	return $q.reject(serverCatchedErrorData); 
	  }else 
	  {
	      var toast = "服务器飞走了，请稍后再试~";
	      var serverUncatchErrorData = {result:"fail_server",toast:toast,message:"!!![serverUncatchError]:serverUncatchError"+
		      "\n[response code]:"+response.status+
		      "\n[response datas]:"+JSON.stringify( response.data )+
		      "\n[url]:"+response.config.url};
	      $injector.get('$rootScope').showDebugToast(JSON.stringify(serverUncatchErrorData));
	      return $q.reject(serverUncatchErrorData); 
	  }
    	
        
      }, 
      'response' : function(response) {  
       /* console.log("response headers:"+response.headers("Content-Type"));
        console.log("response headers Set-Cookie:"+response.headers("Set-Cookie"));
        console.log("response headers Cookies:"+response.headers("Cookies"));
        console.log("response headers Date:"+response.headers("Date"));
        console.log("response headers JSESSIONID:"+JSON.stringify(response.headers()));*/
        //return response;
        $injector.get('$ionicLoading').hide();
        if( response.config.url.substring(0,4) == "http" )//&& response.config.method == "POST" )
        {

            //console.log("[response origins]:"+JSON.stringify(response));
            if(response.data.result == 'ok')
            {
        	return response.data.data;
            }else {

            if(response.data.result == "invalid"){
                localStorageService.update("isLogin",{"state":false});
            }
        	console.log("[response error]:"+JSON.stringify(response));
        	var serverCatchedErrorData = {result:response.data.result,toast:response.data.message,message:"[result]:"+response.data.result+
        		"\n[code]:"+response.data.code+
        		"\n[message]:"+response.data.message+
        		"\n[url]:"+response.config.url};
        	return $q.reject(serverCatchedErrorData);     //为神马要在这返回完整的
	    }
            
        }
        return response;
      }, 
      'request' : function(config) { 
	  //config.timeout = 1000 * 60; 
	  //config.withCredentials = true;
	   console.log("[original request]:"+JSON.stringify(config));
	 if( config.url.substring(0,4) == "http")// && config.method == "POST" )
	 {
	    //$injector.get('$ionicLoading').hide();
	    if( config.headers.isShowLoading == false ){   //默认是显示loading的，只有设置了isShowLoading = false才不显示

	    }else{

	        $injector.get('$ionicLoading').show({
        		 template: '<p>加载中..</p><ion-spinner class="spinner-assertive"></ion-spinner>',
        		 noBackdrop:true,
                 hideOnStateChange:true,
        		 duration:15000
                     });
	    }

	     //console.log("[request]:"+JSON.stringify(config));
	    
	 }
    	//console.log("request:"+JSON.stringify(config));
        return config; 
      }, 
      'requestError' : function(config){ 
    	 console.log("[requestError]:"+JSON.stringify(config));
    	 $injector.get('$ionicLoading').hide();
        return $q.reject(config); 
      } 
    } 
   
  return httpInterceptor; 
}])


.factory("userService", function($http) {
    var users = [];
    return {
        getUsers: function() {
            return $http.get("https://randomuser.me/api/?results=10").then(function(response) {
                users = response.data.results;
                return response.data.results;
            });
        },
        getUser: function(index) {
            return users[index];
        }
    };
})

.factory('localStorageService', [function() {
        return {
            get: function localStorageServiceGet(key, defaultValue) {
        	console.log("[localStorageServiceGet]:"+key+":"+defaultValue);
                var stored = localStorage.getItem(key);
                try {
                    stored = angular.fromJson(stored);
                } catch (error) {
                    stored = null;
                }
                if (defaultValue && stored === null) {
                    stored = defaultValue;
                }
                return stored;
            },
            update: function localStorageServiceUpdate(key, value) {
        	console.log("localStorageServiceUpdate"+key+":"+value);
                if (value) {
                    localStorage.setItem(key, angular.toJson(value));
                }
            },
            clear: function localStorageServiceClear(key) {
        	console.log("localStorageServiceClear"+key);
                localStorage.removeItem(key);
            }
        };
    }])
    .factory('dateService', [function() {
        return {
            handleMessageDate: function(messages) {
                var i = 0,
                    length = 0,
                    messageDate = {},
                    nowDate = {},
                    weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                    diffWeekValue = 0;
                if (messages) {
                    nowDate = this.getNowDate();
                    length = messages.length;
                    for (i = 0; i < length; i++) {
                        messageDate = this.getMessageDate(messages[i]);
                        if(!messageDate){
                            return null;
                        }
                        if (nowDate.year - messageDate.year > 0) {
                            messages[i].lastMessage.time = messageDate.year + "";
                            continue;
                        }
                        if (nowDate.month - messageDate.month >= 0 ||
                            nowDate.day - messageDate.day > nowDate.week) {
                            messages[i].lastMessage.time = messageDate.month +
                                "月" + messageDate.day + "日";
                            continue;
                        }
                        if (nowDate.day - messageDate.day <= nowDate.week &&
                            nowDate.day - messageDate.day > 1) {
                            diffWeekValue = nowDate.week - (nowDate.day - messageDate.day);
                            messages[i].lastMessage.time = weekArray[diffWeekValue];
                            continue;
                        }
                        if (nowDate.day - messageDate.day === 1) {
                            messages[i].lastMessage.time = "昨天";
                            continue;
                        }
                        if (nowDate.day - messageDate.day === 0) {
                            messages[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                            continue;
                        }
                    }
                    // console.log(messages);
                    // return messages;
                } else {
                    console.log("messages is null");
                    return null;
                }

            },
            getNowDate: function() {
                var nowDate = {};
                var date = new Date();
                nowDate.year = date.getFullYear();
                nowDate.month = date.getMonth();
                nowDate.day = date.getDate();
                nowDate.week = date.getDay();
                nowDate.hour = date.getHours();
                nowDate.minute = date.getMinutes();
                nowDate.second = date.getSeconds();
                return nowDate;
            },
            getMessageDate: function(message) {
                var messageDate = {};
                var messageTime = "";
                //2015-10-12 15:34:55
                var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
                var result = new Array();
                if (message) {
                    messageTime = message.lastMessage.originalTime;
                    result = reg.exec(messageTime);
                    if (!result) {
                        console.log("result is null");
                        return null;
                    }
                    messageDate.year = parseInt(result[1]);
                    messageDate.month = parseInt(result[2]);
                    messageDate.day = parseInt(result[3]);
                    messageDate.hour = parseInt(result[4]);
                    messageDate.minute = parseInt(result[5]);
                    messageDate.second = parseInt(result[6]);
                    // console.log(messageDate);
                    return messageDate;
                } else {
                    console.log("message is null");
                    return null;
                }
            }
        };
    }])
    .factory('messageService', ['localStorageService', 'dateService',
        function(localStorageService, dateService) {
            return {
                init: function(messages) {
                    var i = 0;
                    var length = 0;
                    var messageID = new Array();
                    var date = null;
                    var messageDate = null;
                    if (messages) {
                        length = messages.length;
                        for (; i < length; i++) {
                            messageDate = dateService.getMessageDate(messages[i]);
                            if(!messageDate){
                                return null;
                            }
                            date = new Date(messageDate.year, messageDate.month,
                                messageDate.day, messageDate.hour, messageDate.minute,
                                messageDate.second);
                            messages[i].lastMessage.timeFrome1970 = date.getTime();
                            messageID[i] = {
                                id: messages[i].id
                            };

                        }
                        localStorageService.update("messageID", messageID);
                        for (i = 0; i < length; i++) {
                            localStorageService.update("message_" + messages[i].id, messages[i]);
                        }
                    }
                },
                getAllMessages: function() {
                    var messages = new Array();
                    var i = 0;
                    var messageID = localStorageService.get("messageID");
                    var length = 0;
                    var message = null;
                    if (messageID) {
                        length = messageID.length;

                        for (; i < length; i++) {
                            message = localStorageService.get("message_" + messageID[i].id);
                            if(message){
                                messages.push(message);
                            }
                        }
                        dateService.handleMessageDate(messages);
                        return messages;
                    }
                    return null;

                },
                getMessageById: function(id){
                    return localStorageService.get("message_" + id);
                },
                getAmountMessageById: function(num, id){
                    var messages = [];
                    var message = localStorageService.get("message_" + id).message;
                    var length = 0;
                    if(num < 0 || !message) return;
                    length = message.length;
                    if(num < length){
                        messages = message.splice(length - num, length); 
                        return messages;  
                    }else{
                        return message;
                    }
                },
                updateMessage: function(message) {
                    var id = 0;
                    if (message) {
                        id = message.id;
                        localStorageService.update("message_" + id, message);
                    }
                },
                deleteMessageId: function(id){
                    var messageId = localStorageService.get("messageID");
                    var length = 0;
                    var i = 0;
                    if(!messageId){
                        return null;
                    }
                    length = messageId.length;
                    for(; i < length; i++){
                        if(messageId[i].id === id){
                            messageId.splice(i, 1);
                            break;
                        }
                    }
                    localStorageService.update("messageID", messageId);
                },
                clearMessage: function(message) {
                    var id = 0;
                    if (message) {
                        id = message.id;
                        localStorageService.clear("message_" + id);
                    }
                }
            };
        }
    ])
  
/****************utilsService************************/
.factory("utilsService", function() {
    return {
        testPhonenum: function(phonenum) {
            var regex = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;  
            if(regex.test(phonenum)){  
               return true; 
                
            }else{   
        	return false; 
            }  
        }, //testPhonenum End
        testPassword: function(password) {
            if( password.length >= 6 )
            {
        	return true; 
            }else {
        	return false; 
	    }
        }, //testPassword End
        slideImages:function()
        {
            
        } //slideImages End
        
    };
})

