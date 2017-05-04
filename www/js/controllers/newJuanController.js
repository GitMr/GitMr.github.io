//////废弃不用
angular.module('afu.new-controllers', ['ngCordova'])
.controller('newJuanCtrl', function($scope,$rootScope,$state,$ionicModal,$cordovaImagePicker,$cordovaCamera,$cordovaFile,localStorageService ) {  // 新建捐助需求controller
    
  //根据dpr选择不同的图片尺寸
    $scope.myImgSize = (lib.flexible.dpr == '3') ? '3' : '2';
  
    console.log("newJuanCtrl");
    $scope.juanData = {"title":"","w_type":{name:"类别",value:""},"content":""};
    //选择类别modal
    $scope.openWtype = function(){
	$scope.openTypeModal();
    }   
    //
    $scope.wtypes = localStorageService.get("getwtype",null);
    console.log("storedWtypes:"+JSON.stringify( $scope.wtypes));
    $scope.wtypes.shift();
    $scope.juanData.w_type.wtype_name = "类别";
    /*$scope.wtypes =
    [
            { name: '衣服',value:"yifu" },
	    { name: '家电',value:"jiadian" },
	    { name: '数码1',value:"shuma" },
	    { name: '数码2',value:"shuma" },
	    { name: '数码3',value:"shuma" },
	    { name: '数码4',value:"shuma" }
	    ];*/
    
    //选择类别，打开modal选择器
    $scope.chooseWtype = function(wtype)
    {
	console.log("[chooseWtype]:");
	console.log("[chooseWtype]:==name:"+wtype.wtype_name+"==value:"+wtype.wtype_id);
	$scope.juanData.w_type = wtype;//{ name: wtype_name,value:wtype_value };
    };
    
    //完成选择类别，关闭modal选择器
    $scope.doneWtype = function()
    {	
	console.log("[w-type.html modal]:Close");
	$scope.closeTypeModal();
	
    };
   //取消选择类别
    $scope.doneWtype = function()
    {	
	console.log("[w-type.html modal]:Close");
	$scope.closeTypeModal();
    };
    
    
    //选择照片的配置项
    var myOptions = {
	    maximumImagesCount: 9,
	    width: 0,
	    height: 0,
	    quality: 0
	   };
     
    var selectorImgSrc = 'img/pick_image@' + $scope.myImgSize + 'x.png';
    $scope.images = [selectorImgSrc];
    $scope.pickImages = function(options)
    {
	console.log("[pickImages]");	    
	$cordovaImagePicker.getPictures(options)		  
	.then(function (results) {	
	    
	    $scope.images.pop();  //删除数组最后元素，也就是选择的的那个“十字”图片
	    
	    for (var i = 0; i < results.length; i++) {		      
		console.log('[Image URI]: ' + results[i]);
		$scope.images.push(results[i]);
		
		var dir = results[i].substring(0, results[i].lastIndexOf('/')+1 );
		var filename = results[i].substring( results[i].lastIndexOf('/') + 1,results[i].length );
		console.log("[dir and filename]:"+dir + "==" + filename);
		

		
		/*$cordovaFile.readAsText(dir, filename)
		.then(function (success) {
		        // success
		    console.log("[readAsText]:success"+JSON.stringify(success));
		      }, function (error) {
		        // error
			  console.log("[readAsText]:error"+JSON.stringify(error));
		      });
		
		$cordovaFile.readAsArrayBuffer(dir, filename)
		.then(function (success) {
		        // success
		    console.log("[readAsArrayBuffer]:success"+JSON.stringify(success));
		      }, function (error) {
		        // error
			  console.log("[readAsArrayBuffer]:error"+JSON.stringify(error));
		      });*/
		
		$cordovaFile.readAsDataURL(dir, filename).then(function (success) {
		        // success
		    console.log("[readAsDataURL]:success"+JSON.stringify(success));
		    dataURLtoBlob(JSON.stringify(success));
		      }, function (error) {
		        // error
			  console.log("[readAsDataURL]:error"+JSON.stringify(error));
		      });
		
		
		function dataURLtoBlob(dataurl) {
		    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		    while(n--){
		        u8arr[n] = bstr.charCodeAt(n);
		    }
		    return new Blob([u8arr], {type:mime});
		}
		
		/*$cordovaFile.readAsBinaryString(dir, filename)
		.then(function (success) {
		        // success
		    console.log("[readAsBinaryString]:success"+JSON.stringify(success));
		 
		    
		      }, function (error) {
		        // error
			  console.log("[readAsBinaryString]:error"+JSON.stringify(error));
		      });*/
		 /*$cordovaFile.checkFile(dir, filename)
		      .then(function (success) {
		        // success
			  console.log("[checkFile]:success"+JSON.stringify(success));
		      }, function (error) {
		        // error
			  console.log("[checkFile]:error"+JSON.stringify(error));
		      });*/
	    }	
	   
	    $scope.images.push(selectorImgSrc);  //数组的最后总是放入选择的的那个“十字”图片
	}, function(error) {		   
	    // error getting photos
	    //$scope.images = [];
	    console.log("[pickImages error]:error getting photos");
		 
	});
	 
    };
    
    /***
     * 根据【imgSrc】点击小图片预览图片或者继续选择
     * param imgSrc   文件的路径
     * Author WangYong
     * ***/
    $scope.clickImg = function(imgSrc)
    {
	myOptions.maximumImagesCount = 9 - ( $scope.images.length - 1 ); //一共最多选择9张，每次选择减去已有的张数
	console.log("[clickImg]:click");
	if(selectorImgSrc == imgSrc)
	{
	    console.log("[clickImg 选择]:"+imgSrc);
	    $scope.pickImages(myOptions); 
	}else {
	    console.log("[clickImg 预览]:"+imgSrc);
	    
	    $rootScope.showSlideImages($scope.images);
	}
    };
	   /* var options = {
		      quality: 50,
		      destinationType: Camera.DestinationType.DATA_URL,
		      sourceType: Camera.PictureSourceType.CAMERA,
		      allowEdit: true,
		      encodingType: Camera.EncodingType.JPEG,
		      targetWidth: 100,
		      targetHeight: 100,
		      popoverOptions: CameraPopoverOptions,
		      saveToPhotoAlbum: false,
		      correctOrientation:true
		    };
	    
	    $scope.pickCamera = function(){
		console.log("pickCamera");
		$cordovaCamera.getPicture(options).then(function(imageData) {
		      //var image = document.getElementById('myImage');
		      //image.src = "data:image/jpeg;base64," + imageData;
		    }, function(err) {
		      // error
		    });
	    }
	    
	    var options = {
		      destinationType: Camera.DestinationType.FILE_URI,
		      sourceType: 2,//Camera.PictureSourceType.CAMERA,
		    };

		   
	    $scope.pickCameraPic = function()
	    {
		 $cordovaCamera.getPicture(options).then(function(imageURI) {
		     console.log("imageURI:"+imageURI);
		    }, function(err) {
		      console.log(" pickCameraPic error");
		    });
	    }*/
	 
	  //首页右下角的悬浮按钮点击的弹出层
	  $ionicModal.fromTemplateUrl('templates/w-types.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.typeModal = modal;
		  });
		  $scope.openTypeModal = function() {
		    $scope.typeModal.show();
		  };
		  $scope.closeTypeModal = function() {
		    $scope.typeModal.hide();
		  };
		  // Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.typeModal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('modal.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove modal
		  $scope.$on('modal.removed', function() {
		    // Execute action
		  });	    
	    
})


