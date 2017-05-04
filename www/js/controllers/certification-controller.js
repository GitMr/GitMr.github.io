
/*****实名认证
        写的有点混乱
        重构的空间很大。。。。
*****/
angular.module('afu.certification-controller', ['ngCordova'])
.controller('certificationCtrl', function($scope,$rootScope,$state,$ionicModal,$stateParams,$ionicLoading,
	$cordovaImagePicker,$cordovaCamera,$ionicActionSheet,$cordovaFile,localStorageService,certificationService ) {  // 实名认证controller
    $scope.userID = localStorageService.get("userID","");
    $scope.certificationInfo = localStorageService.get($scope.userID + 'certification-info',{identity_realname:'',identity_gender:'',identity_address:'',identity_content:'',identity_num:''});
    $scope.imagesInfo = localStorageService.get( $scope.userID + 'images-info',{id_image:'img/card.png',other_image:'img/other.png'});
    $rootScope.globalAddress = localStorageService.get($scope.userID + 'pro-city-county-info',{totalProCityCounty:'选择地区',province:'',city:'',county:''}); /////为神马用rootScope，因为￥scope数据绑定页面不更新啊啊

    $scope.$on("$ionicView.beforeEnter",function(){
        $rootScope.log("$ionicView.beforeEnter");
        /*window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
                          console.log( "event fired!" );
                          } );*/
        $scope.identity_state = $stateParams.identity_state;

        if( 'none' == $scope.identity_state ){
            $scope.btn_string = "提交信息";
        }else if('checking' == $scope.identity_state){
            $scope.btn_string = "信息审核中，暂时不能修改";
        }else if('pass' == $scope.identity_state){
            $scope.btn_string = "实名认证已通过";
        }else if('refuse' == $scope.identity_state){
            $scope.btn_string = "未通过，再次提交";
        }

        if('checking' == $scope.identity_state || 'pass' == $scope.identity_state || 'refuse' == $scope.identity_state ){
            certificationService.getAuthenticateInfo().then(
                function(data){

                    $rootScope.log('certificationService.getAuthenticateInfo',JSON.stringify(data));
                    $scope.identity_state = data.identity_state;
                    if( 'none' == $scope.identity_state ){
                        $scope.btn_string = "提交信息";
                    }else if('checking' == $scope.identity_state){
                        $scope.btn_string = "信息审核中，暂时不能修改";
                    }else if('pass' == $scope.identity_state){
                        $scope.btn_string = "实名认证已通过";
                    }else if('refuse' == $scope.identity_state){
                        $scope.btn_string = "未通过，再次提交";
                    }

                    if( 'checking' == $scope.identity_state || 'pass' == $scope.identity_state || 'refuse' == $scope.identity_state  ){
                        $scope.certificationInfo.identity_realname = data.identity_realname;
                        $scope.certificationInfo.identity_gender = data.identity_gender;
                         if( $scope.certificationInfo.identity_gender == 'male' )
                        {
                            $scope.tempGender =  { name: '男',value:"male" };

                        }else if( $scope.certificationInfo.identity_gender == 'female' ){
                            $scope.tempGender =  {  name: '女',value:"female" };

                        }
                        var pr_city_county_detail = data.identity_address.split("|");
                        var pr_city_county = pr_city_county_detail[0].split(",");
                        $rootScope.globalAddress.province = pr_city_county[0];
                        $rootScope.globalAddress.city = pr_city_county[1];
                        $rootScope.globalAddress.county = pr_city_county[2];
                        $rootScope.globalAddress.totalProCityCounty = $rootScope.globalAddress.province +','+ $rootScope.globalAddress.city + ','+$rootScope.globalAddress.county ;
                        $scope.certificationInfo.identity_address = pr_city_county_detail[1];
                        $scope.certificationInfo.identity_num = data.identity_num;
                        $scope.id_image = $rootScope.basePicUrl + data.identity_cardimg;
                        $scope.other_image = $rootScope.basePicUrl + data.identity_otherimg;

                    }
                },function(data){
                    $rootScope.log('certificationService.getAuthenticateInfo',"error");
                    $rootScope.showTopMsg(data.toast+",请重试！");
                }
            );
        }

    });
    if( 'none' == $scope.identity_state ){
        $scope.certificationInfo = localStorageService.get($scope.userID + 'certification-info',{identity_realname:'',identity_gender:'',identity_address:'',identity_content:'',identity_num:''});
        $scope.imagesInfo = localStorageService.get( $scope.userID + 'images-info',{id_image:'img/card.png',other_image:'img/other.png'});
        $rootScope.globalAddress = localStorageService.get($scope.userID + 'pro-city-county-info',{totalProCityCounty:'选择地区',province:'',city:'',county:''}); /////为神马用rootScope，因为￥scope数据绑定页面不更新啊啊

    }



    //地址
    var vm=$scope.vm={};
    
    vm.cb = function () {
      console.log(vm.CityPickData.areaData)
    }

    vm.CityPickData = {
      areaData: ['请选择城市'],
      title: '地区',
      hardwareBackButtonClose: false,
      buttonClicked: function () {
	      vm.cb()
	    }
    }
    ///////////////////////原生pickcity
    $scope.pickCity = function(){
        console.log("demo function");
        if (ionic.Platform.isAndroid())
        { //android 下
            window.broadcaster.addEventListener( "pick_city_success", function(e){
                ////////为毛通过$rootScope周转一边
                $rootScope.globalAddress.province = e.province;
                $rootScope.globalAddress.city = e.city;
                $rootScope.globalAddress.county = e.county;
                $rootScope.globalAddress.totalProCityCounty = $rootScope.globalAddress.province + ',' + $rootScope.globalAddress.city + ',' + $rootScope.globalAddress.county;
                $rootScope.log("data",JSON.stringify($rootScope.globalAddress.totalProCityCounty));
                $rootScope.showUpdateTransparent();
            });
            window.plugins.webintent.startActivity({
                action: 'com.afu.pick_city',
                url:'afu://pick_city?from=certification&city='+$rootScope.globalAddress.city+'&county='+ $rootScope.globalAddress.county},
                function() {console.log("open success");},
                function() {
                console.log("open failed");
                alert('Failed to open URL via Android Intent')}
            );
        }else if(ionic.Platform.isIOS()){
            //$rootScope.showTopMsg("please wait ios");
            window.broadcaster.addEventListener( "update_pick_city_success", function(e){
                    ////////为毛通过$rootScope周转一边
                    $rootScope.globalAddress.province = e.province;
                    $rootScope.globalAddress.city = e.city;
                    $rootScope.globalAddress.county = e.county;
                    $rootScope.globalAddress.totalProCityCounty = $rootScope.globalAddress.province + ',' + $rootScope.globalAddress.city + ',' + $rootScope.globalAddress.county;
                    $rootScope.log("data",JSON.stringify($rootScope.globalAddress.totalProCityCounty));
                    $rootScope.showUpdateTransparent();
                 });
            window.broadcaster.fireNativeEvent( "pick_city", { province:$rootScope.globalAddress.province,city:$rootScope.globalAddress.city,county:$rootScope.globalAddress.county}, function() {
                        console.log( "pick city fired!" );
                } );

        }
    };




    /*****************************编辑真实姓名*************************************/
    $ionicModal.fromTemplateUrl('templates/personal/edit-realname.html', {
	   scope: $scope,
	   animation: 'slide-in-up'
	 }).then(function(modal) {
	   $scope.realnameModal = modal;
	 });
	 $scope.openSexModal = function() {
	   $scope.realnameModal.show();
	 };
	 $scope.closeSexModal = function() {
	   $scope.realnameModal.hide();
	 };
	 // Cleanup the modal when we're done with it!
	 $scope.$on('$destroy', function() {
	   $scope.realnameModal.remove();
	 });

	 /*****************************编辑身份证号码*************************************/
	    $ionicModal.fromTemplateUrl('templates/personal/edit-num.html', {
		   scope: $scope,
		   animation: 'slide-in-up'
		 }).then(function(modal) {
		   $scope.numModal = modal;
		 });
		 $scope.openSexModal = function() {
		   $scope.numModal.show();
		 };
		 $scope.closeSexModal = function() {
		   $scope.numModal.hide();
		 };
		 // Cleanup the modal when we're done with it!
		 $scope.$on('$destroy', function() {
		   $scope.numModal.remove();
		 });

    /*****************************编辑详细地址*************************************/
    $ionicModal.fromTemplateUrl('templates/personal/edit-address.html', {
		   scope: $scope,
		   animation: 'slide-in-up'
		 }).then(function(modal) {
		   $scope.addressModal = modal;
		 });
		 $scope.openSexModal = function() {
		   $scope.addressModal.show();
		 };
		 $scope.closeSexModal = function() {
		   $scope.addressModal.hide();
		 };
		 // Cleanup the modal when we're done with it!
		 $scope.$on('$destroy', function() {
		   $scope.addressModal.remove();
		 });

    
    
  
/*****************************性别选择器*************************************/
	  $ionicModal.fromTemplateUrl('templates/sex-choice.html', {
		   scope: $scope,
		   animation: 'slide-in-up'
		 }).then(function(modal) {
		   $scope.sexModal = modal;
		 });
		 $scope.openSexModal = function() {
		   $scope.sexModal.show();
		 };
		 $scope.closeSexModal = function() {
		   $scope.sexModal.hide();
		 };
		 // Cleanup the modal when we're done with it!
		 $scope.$on('$destroy', function() {
		   $scope.sexModal.remove();
		 });

    
    $scope.openSex = function(){
	    $scope.openSexModal();
    }   
    //为了能记住填写记录！！！多写了多少代码。。。越来越乱、、、、
    $scope.sexs = [
            { name: '男',value:"male" ,selected:true},
            { name: '女',value:"female",selected:false }
	    ];
	$scope.tempGender = { name: '性别',value:"" };
    if( $scope.certificationInfo.identity_gender == 'male' )
    {
        $scope.tempGender =  { name: '男',value:"male" };
        $scope.sexs = [
                    { name: '男',value:"male" ,selected:true},
                    { name: '女',value:"female",selected:false }
        	    ];

    }else if( $scope.certificationInfo.identity_gender == 'female' ){
        $scope.tempGender =  {  name: '女',value:"female" };
        $scope.sexs = [
                    { name: '男',value:"male" ,selected:false},
                    { name: '女',value:"female",selected:true }
        	    ];
    }

    $scope.certificationInfo.identity_gender = $scope.tempGender.value;
    //选择性别，打开modal选择器
    $scope.chooseSex = function(sex)
    {
	console.log("[chooseSex]:");
	console.log("[chooseSex]:==name:"+sex.name+"==value:"+sex.value);
	$scope.tempGender = sex;
	$scope.certificationInfo.identity_gender = sex.value;
    };
     //取消选择性别，关闭modal选择器
    $scope.cancelSex = function(sex)
    {
    console.log("[sex-choice.html modal]:Close");
    $scope.closeSexModal();
    };
    
    //完成选择性别，关闭modal选择器
    $scope.doneSex = function()
    {	
	console.log("[sex-choice.html modal]:Close");
	$scope.closeSexModal();
    };
    ////////////sumit certification
    $scope.submitCertification = function(){
        if( 'none' == $scope.identity_state ){

        }else if('checking' == $scope.identity_state){
            $scope.showTopMsg("审核中，请耐心等待！");
            return false;
        }else if('pass' == $scope.identity_state){
             $scope.showTopMsg("已通过！");
             return false;
        }else if('refuse' == $scope.identity_state){
            $scope.imageState.id_image = true;
            $scope.imageState.other_image = true;
        }
        $rootScope.log('certificationInfo',JSON.stringify($scope.certificationInfo));
        if( $scope.certificationInfo.identity_realname == '' ||
            $scope.certificationInfo.identity_gender == '' ||
            $scope.certificationInfo.identity_address == '' ||
            $scope.certificationInfo.identity_num == ''){

            $rootScope.showTopMsg("信息填写不完整！");
            return false;
         }
        $rootScope.log("身份证号码长度","length "+$scope.certificationInfo.identity_num.length);
        if( $scope.certificationInfo.identity_num.length != 18 ){
            $rootScope.showTopMsg("请填写正确身份证号！");
            return false;
        }

        if ( !$scope.imageState.id_image ) {
            $rootScope.showTopMsg("请上传身份照片！");
            return false;
        }
        if ( !$scope.imageState.other_image ) {
             $rootScope.showTopMsg("请上传相关证明！");
             return false;
         }

        //$scope.certificationInfo.identity_address = vm.CityPickData.areaData + $scope.certificationInfo.identity_address;
        if( $scope.certificationInfo.identity_address.indexOf("|") < 0 ){
            $scope.certificationInfo.identity_address = $rootScope.globalAddress.province +","+ $rootScope.globalAddress.city +","+ $rootScope.globalAddress.county + "|" +$scope.certificationInfo.identity_address;
        }
        certificationService.authenticate($scope.certificationInfo).then(
            function(data){
                console.log("[submitCertification]:success");
                $scope.saveAndBack("实名认证提交成功，请耐心等待审核！");
                ///$rootScope.showTopMsg("提交成功，请等待审核");
                //$rootScope.goBack();

            },
            function(data){
                console.log("[submitCertification]:fail");
                $rootScope.showTopMsg(data.toast+",请重试！");
            });


    };
    $scope.imageState = {id_image:false,other_image:false};
    $scope.id_image = $scope.imagesInfo.id_image;
    $scope.other_image =  $scope.imagesInfo.other_image;

    if( $scope.id_image == 'img/card.png'){
        $scope.imageState.id_image = false;
    }else{
        $scope.imageState.id_image = true;
    }

    if( $scope.other_image == 'img/other.png'){
        $scope.imageState.other_image = false;
    }else{
        $scope.imageState.other_image = true;
    }

    ///upload
    var uploadImg = function(imagePath,imageType){

        var success = function (r) {
            $ionicLoading.hide();
            console.log("[result]:"+JSON.stringify(r));
            $rootScope.showTopMsg("上传成功！");
            var res = JSON.parse(r.response);
            if(res.result == "ok"){
                console.log("result code:"+res.result);
                if( "identitycard" == imageType ){
                    $scope.imageState.id_image = true;
                    $scope.imagesInfo.id_image = imagePath;
                }else if( "identityother" == imageType ){
                    $scope.imageState.other_image = true;
                    $scope.imagesInfo.other_image = imagePath;
                }
            }
            console.log("["+imageType+"upload]:上传成功! Code = " + r.responseCode);
            //$scope.saveAndBack("实名认证提交成功，请耐心等待审核！");
        }

        //上传失败
        var fail = function (error) {
            $ionicLoading.hide();
            $rootScope.showTopMsg("上传失败！");
           console.log("["+imageType+"upload]:上传失败! Code = " + error.code);

           if( "identitycard" == imageType ){
               $scope.imageState.id_image = false;
               $scope.id_image =  'img/card.png';
           }else if( "identityother" == imageType ){
               $scope.imageState.other_image = false;
               $scope.other_image =  'img/other.png';
           }

        }

        var optionss = new FileUploadOptions();
        optionss.fileKey = "picture";
        optionss.fileName =  $scope.id_image.substring( imagePath.lastIndexOf('/') + 1,imagePath .length ).split('?')[0];
        optionss.mimeType = "image/jpeg";

        //上传参数
        var params = {pic_type:imageType};
        optionss.params = params;

        var ft = new FileTransfer();
        $ionicLoading.show({
             template: '<p>上传中...</p><ion-spinner class="spinner-assertive"></ion-spinner>',
                });
        ft.upload(imagePath, encodeURI($rootScope.baseUrl+"auth/authenticate/picture"), success, fail, optionss);
    };
    
    
    
    //选择照片的配置项
/*    var myOptions = {
	    maximumImagesCount: 1,
	    width: 0,
	    height: 0,
	    quality: 0
	   };*/


    var options = {
         quality:100,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: Camera.PictureSourceType.CAMERA,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: screen.width*2,
         targetHeight: screen.height*2,
         popoverOptions: CameraPopoverOptions,
         saveToPhotoAlbum: false,
         correctOrientation:true
       };

    var startCamera = function(){

           options.sourceType = Camera.PictureSourceType.CAMERA;
           $cordovaCamera.getPicture(options).then(function(imageData) {
             console.log('Image URI: ' + imageData);
             $scope.id_image = imageData;
             uploadImg($scope.id_image,"identitycard");
           }, function(err) {
             console.log("error getting photos");
           });
        };
    var startAlbum = function(){

           options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
           $cordovaCamera.getPicture(options).then(function(imageData) {
             console.log('Image URI: ' + imageData);
             $scope.id_image = imageData;
             uploadImg($scope.id_image,"identitycard");
           }, function(err) {
             console.log("error getting photos");
           });
    };

    $scope.pickIdImage = function()
    {
	    console.log("[pickImages]");

	    if( $scope.id_image != 'img/card.png'){
                $scope.showSlideImage($scope.id_image);
                $scope.removeType = "id";
        }else{
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

        }

    };
    
    ////其他证明
    var optionss = new FileUploadOptions();
   optionss.fileKey = "picture";
   optionss.fileName =  $scope.other_image.substring( $scope.other_image.lastIndexOf('/') + 1,$scope.other_image .length ).split('?')[0];
   optionss.mimeType = "image/jpeg";

   //上传参数
   var params = {pic_type:"identityother"};
   optionss.params = params;

    var startOtherCamera = function(){
       options.sourceType = Camera.PictureSourceType.CAMERA;
       $cordovaCamera.getPicture(options).then(function(imageData) {
         console.log('Image URI: ' + imageData);
         $scope.other_image = imageData;
         uploadImg($scope.other_image,"identityother");
       }, function(err) {
         console.log("error getting photos");
       });
    };
    var startOtherAlbum = function(){
       options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
       $cordovaCamera.getPicture(options).then(function(imageData) {
         console.log('Image URI: ' + imageData);
         $scope.other_image = imageData;
         uploadImg($scope.other_image,"identityother");
       }, function(err) {
         console.log("error getting photos");
       });
    };


    $scope.pickOtherImage = function()
    {

        if( $scope.other_image != 'img/other.png'){
            $scope.showSlideImage($scope.other_image);
            $scope.removeType = "other";
        }else{
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
                    startOtherAlbum();

                    break;
                    }
                    case 1:
                    {
                    startOtherCamera();

                    break;
                    }
                }
                return true;
             }
           });
    }

	 
    };
    ///////保存编辑过的数据
    $scope.saveAndBack = function(msg){
        if(
            $scope.certificationInfo.identity_realname != '' ||
            $scope.certificationInfo.identity_gender != '' ||
            $scope.certificationInfo.identity_address != '' ||
            $scope.certificationInfo.identity_num != '' ||
            $scope.id_image != '' ||
            $scope.other_image != ''
        )
        {
            if( 'none' == $scope.identity_state || 'refuse' == $scope.identity_state){
                localStorageService.update($scope.userID+ "certification-info",$scope.certificationInfo);
                localStorageService.update($scope.userID+"images-info",$scope.imagesInfo)
                localStorageService.update($scope.userID+"pro-city-county-info",$rootScope.globalAddress);
                $rootScope.goBack();
                $rootScope.showTopMsg(msg);
            }else if('checking' == $scope.identity_state){
                $rootScope.goBack();
            }else if('pass' == $scope.identity_state){
                $rootScope.goBack();
            }

        }
       else{
            $rootScope.goBack();
        }
    };



    //////////查看demo
     $ionicModal.fromTemplateUrl('templates/personal/certification-example.html', {
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.demoModal = modal;
     });
     $scope.openDemoModal = function() {
       $scope.demoModal.show();
     };
     $scope.closeDemoModal = function() {
       $scope.demoModal.hide();
     };

    $scope.$on("get_backbutton",function(){
        $scope.saveAndBack("系统已保存您填写的内容！");
    });
     /////////重写android返回硬件按钮
     /*$ionicPlatform.registerBackButtonAction(function (e) {
        console.log("certificate backbutton");
         if ($location.path() == '/personal/certification') {
             console.log("click back in index");
             $scope.saveAndBack();
         }
         e.preventDefault();
         return false;
     }, 102);*/
    //////查看大图
    $scope.viewIdImage = function(){
            var srcArr = new Array($scope.id_image);
            $rootScope.log('src',$scope.id_image);
            $rootScope.slideIndex = 0;
            $rootScope.showSlideImages(srcArr);
        };
	$scope.viewOtherImage = function(){
            var srcArr = new Array($scope.other_image);
            $rootScope.log('src',$scope.other_image);
            $rootScope.slideIndex = 0;
            $rootScope.showSlideImages(srcArr);


        };

    /***图片预览轮播***/
    $ionicModal.fromTemplateUrl('templates/personal/certification-modal-image.html', {
        scope: $scope,
        animation: 'slide-in-down'
      }).then(function(modal) {
          $scope.removeSlide = modal;
      });

    $scope.hideAndRemoveModal = function(){
        $scope.removeSlide.hide();
        //$scope.removeSlide.remove();
    };

    $scope.showSlideImage = function(image) {
        console.log("[showSlideImage]:"+JSON.stringify(image));
        $scope.slideImage = image;
        $scope.removeSlide.show();
    };

    //////////查看大图看删除
    $scope.removeImage = function(){
        if( $scope.removeType == "other"){
            $scope.other_image = 'img/other.png'
            $scope.imageState.other_image = false;
        }else if($scope.removeType == "id"){
            $scope.id_image = 'img/card.png'
            $scope.imageState.id_image = false;
        }
        $scope.hideAndRemoveModal();

    };

})


