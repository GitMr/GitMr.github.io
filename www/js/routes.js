angular.module('afu.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state("welcome", {
            url: "/welcome",
            //abstract: true,
            templateUrl: "templates/welcome.html",
            controller: "welcomeCtrl"
        })
	.state("login", {
	     url: "/login",
	     params: {'from': 'normal'},
	     templateUrl: "templates/login/login.html",
	     controller: "loginCtrl" 
	})
	  
	.state("register", {
	     url: "/register",
	     templateUrl: "templates/login/register.html",
	     controller: "registerCtrl" 
	})
	
	.state("register2", {
	     url: "/register2",	      
	     templateUrl: "templates/login/register2.html",
	     controller: "registerCtrl" 
	})
	
	.state("polishinfo", {
	     url: "/register2",	      
	     templateUrl: "templates/login/polish-info.html",
	     controller: "registerCtrl" 
	})
	
	///重置密码
	.state("resetpassword", {
	     url: "/resetpassword",	      
	     templateUrl: "templates/login/reset-password.html",
	     controller: "resetPasswordCtrl" 
	})
	
	
        .state("tab", {
            url: "/tab",
            //abstract: true,
            templateUrl: "templates/tabs.html",
            controller: "tabCtrl" 
        })
        
        .state('tab.home', {
            url: '/home',
            params: {'from': 'normal'},
            views: {
                'tab-home': {
                    templateUrl: 'templates/home/tab-home.html',
                    controller: "homeCtrl"   //具体的controller定义见controller.js  下同
                }
            }
        })
        
        .state('tab.progress', {
            url: '/progress',
            params: {tab: '',subtab:''},
            views: {
                'tab-progress': {
                    templateUrl: 'templates/progress/tab-progress.html',
                    controller: "progressCtrl"
                }
            }
        })
        
/*//        ///爱心进展  献爱心
//        .state('tab.progress.myjuan', {
//            url: '/myjuan',
//            templateUrl: 'templates/home/tab-my-juan.html',
//            controller: "tabJuanCtrl"
//            
//        })
//        .state('tab.progress.myqiu', {
//            url: '/myqiu',            
//            templateUrl: 'templates/home/tab-my-qiu.html',
//            controller: "tabJuanCtrl"
//            
//        })
*/         ///查看申请人
        .state('choose_help_who', {
            url: '/choose_help_who',
            params:{info_type:'donate',xid:''},
            templateUrl: 'templates/progress/choose-help-who.html',
            controller: "chooseHelpWhoCtrl"
            
        })
        
        .state('tab.personal', {
            url: '/personal',
            params: {'from': 'normal'},
            views: {
                'tab-personal': {
                    templateUrl: 'templates/personal/tab-personal.html',
                    controller: "personalCtrl"
                }
            },
        })

        //我的发布
       .state('my_fabu', {
            url: '/my_fabu',
            templateUrl: 'templates/personal/my-fabu.html',
            controller: "myFaBuCtrl"

        })
         //我的收藏
       .state('my_collection', {
            url: '/my_collection',
            templateUrl: 'templates/personal/my-collection.html',
            controller: "collectionCtrl"
            
        })
        
         //更新个人信息
       .state('change_personal', {
            url: '/change_personal',
            templateUrl: 'templates/personal/change-personal-info.html',
            controller: "changePersonalCtrl"
            
        })
        
        //反馈
       .state('feedback', {
            url: '/feedback',
            templateUrl: 'templates/personal/feedback.html',
            controller: "feedbackCtrl"
            
        })
        
         //关于阿福
       .state('about_afu', {
            url: '/about_afu',
            templateUrl: 'templates/personal/about-afu.html',
            controller: "aboutAFuCtrl"
            
        })

        //设置相关
       .state('settings', {
            url: '/settings',
            templateUrl: 'templates/personal/settings.html',
            controller: "settingCtrl"

        })
        
       /* ///首页捐助
        .state('tab.home.juan', {
            url: '/juan',
            params: {'from': 'normal'},
            views:{
        	'tab-home-juan3':{
        	    templateUrl: 'templates/home/tab-juan.html',
                    controller: "tabJuanCtrl" 
        	}
            },
            
            
        })
        //首页求助----------quit this
        .state('tab.home.qiu', {
            url: '/qiu',
            views:{
        	'tab-home-qiu3':{
        	    templateUrl: 'templates/home/tab-qiu.html',
                    controller: "tabJuanCtrl"
        	}
            },
            
            
        })*/
        
         /*//首页求助/捐助----------quit this
        .state('tab.home.juanqiu', {
            url: '/juanqiu',
            views:{
        	'tab-home-juan':{
        	    templateUrl: 'templates/home/tab-juan.html',
                    controller: "tabJuanCtrl"
        	},
        	'tab-home-qiu':{
        	    templateUrl: 'templates/home/tab-qiu.html',
                    controller: "tabJuanCtrl"
        	}
            },
            
            
        })*/
        
        //捐助需求详情
        .state('juan_detail', {
            cache: true,
            url: '/juan-detail',
            params: {'xid': '123'},
            templateUrl: 'templates/home/juan-detail.html',
            controller: "homeJuanItemCtrl"
            
        })
        //求助需求详情
        .state('qiu_detail', {
            cache: true,
            url: '/qiu-detail',
            params: {'xid': '123'},
            templateUrl: 'templates/home/qiu-detail.html',
            controller: "homeQiuItemCtrl"
            
        })
        .state('new_juan', {
            url: '/new/juan',
            templateUrl: 'templates/home/create-juan.html',
            controller: "newJuanCtrl"
            
        })
    
        .state('certification', {
            url: '/personal/certification',
            params:{identity_state:'none'},
            templateUrl: 'templates/personal/certification.html',
            controller: "certificationCtrl"
            
        })
        .state('choose_help', {
            url: '/choose_help',
            templateUrl: 'templates/home/choose-help.html',
            controller: "chooseHelpCtrl"
            
        })
        
        ///我需要-填写详细信息
         .state('need_detail', {
            url: '/need_detail',
            params: {'xid': '123'},
            templateUrl: 'templates/home/need-detail.html',
            controller: "needDetailCtrl"
            
        })
        ///选择快递
         .state('choose_express', {
            url: '/choose_express',
            params: {'info_type': '123','xid':'123'},
            templateUrl: 'templates/choose-express.html',
            controller: "chooseExpressCtrl"
            
        })
        ///自助快递
         .state('self_express', {
            url: '/self_express',
            params: {'info_type': '123','xid':'123'},
            templateUrl: 'templates/self-express.html',
            controller: "selfExpressCtrl"
            
        })
       ///个人中心 ---我的地址
         .state('my_addresses', {
            url: '/my_addresses',
            templateUrl: 'templates/personal/my-addresses.html',
            controller: "myAddressCtrl"
            
        })
        //更新我的地址
       .state('update_my_address', {
            url: '/update_my_address',
            params: {'address_id': '123','realname':'','phonenum':'','province':'','city':'','county':'','detail_address':'','postcode':''},
            templateUrl: 'templates/personal/update-my-address.html',
            controller: "updateAddressCtrl"
            
        })
         ///编辑感谢信
        .state('edit_thanks_letter', {
            cache: false,
            url: '/edit_thanks_letter',
            params:{xid:'',info_type:'',donate_nickname:''},
            templateUrl: 'templates/edit-thanks-letter.html',
            controller: "editThanksLetterCtrl"
            
        })
        
        ///预览感谢信
        .state('preview_thanks_letter', {
            url: '/preview_thanks_letter',
            params:{xid:'',info_type:'',donate_nickname:'', image:"img/thanks_pick_image.png",thanks_content:''},
            templateUrl: 'templates/preview-thanks-letter.html',
            controller: "previewThanksLetterCtrl"
            
        })
        
        ///捐助者查看感谢信
        .state('view_thanks_letter', {
            url: '/view_thanks_letter',
            params:{info_type:'',xid:''},
            templateUrl: 'templates/view-thanks-letter.html',
            controller: "viewThanksLetterCtrl"
            
        })
        
         ///爱心邮寄中--收件人视角
        .state('express_mailing', {
            url: '/express_mailing',
            params: {info_type:'',xid: '123',from:''},
            templateUrl: 'templates/progress/express-mailing.html',
            controller: "expressMailingCtrl"
            
        })

        ///爱心邮寄中--寄件人视角
        .state('myactive_express_mailing', {
            url: '/myactive_express_mailing',
            params: {info_type:'',xid: '123',from:''},
            templateUrl: 'templates/progress/myactive-express-mailing.html',
            controller: "myActiveExpressMailingCtrl"

        })

        ///查看某个求捐人
        .state('watch_user', {
            url: '/watch_user',
            params: {avatar:'',xid: '123',user_id:'',real_name:'',nick_name:'',comment:'',province:'',city:'',county:'',is_mypay:false,donateusers_id:'',signature:''},
            templateUrl: 'templates/progress/watch-user.html',
            controller: "watchUserCtrl"
            
        })

        ///已有捐助者，等待邮寄
        .state('wait_express', {
            url: '/wait_express',
            params: {donate_nick_name:'xx',donate_avatar:'img/icon.png'},
            templateUrl: 'templates/progress/wait-express.html',
            controller: "waitExpressCtrl"

        })

        ///guide
        /*.state('guide', {
            url: '/guide',
            templateUrl: 'templates/guide/guide.html',
            controller: "guideCtrl"

        })*/

        ;

    $urlRouterProvider.otherwise("tab/home");
    //$urlRouterProvider.otherwise("welcome");
});