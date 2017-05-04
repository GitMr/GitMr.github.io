angular.module('afu.address-controllers', ['ngCordova'])
////我的地址
.controller('myAddressCtrl', function($scope,$rootScope, $state,$ionicPopup,addressService) {  // 
    console.log("myAddressCtrl");

    $scope.$on("$ionicView.beforeEnter", function(){
           console.log("$ionicView.beforeEnter");
          /* window.broadcaster.fireNativeEvent( "set.statusbar", { item:'white' }, function() {
              console.log( "event fired!" );
              } );*/
    });
    $scope.doRefreshAddresses = function(){
	addressService.addressList().then(
		    function(data){
			console.log("[addressList]:"+JSON.stringify(data));
			$scope.myAddresses = data;
			$scope.$broadcast('scroll.refreshComplete');
		    },function(data){
			console.log("[addressList]:error");
			$rootScope.showTopMsg(data.toast+",请重试！");
			$scope.$broadcast('scroll.refreshComplete');
		    });
    };
    $scope.doRefreshAddresses();
       

    ///////删除提示框
    //////弹出窗
    $scope.popupOptions = function() {
       
	$scope.popup = $ionicPopup.show({
            cssClass:'er-popup',
            templateUrl: "templates/personal/delete-address-popup.html",
            scope: $scope
        });
       
    };
    
    //////关闭弹出窗
    $scope.cancel = function(){
	$scope.popup.close();
    };
    /////确认删除
    $scope.confirm = function(address_id,deleteIndex){
	$rootScope.showDebugToast("delete");
	
	addressService.deleteAddress({address_id:address_id}).then(
		function(data){
		    console.log("[deleteAddress]:"+JSON.stringify(data));
		    $rootScope.showTopMsg("删除成功！");
		    $scope.myAddresses.splice(deleteIndex,1);
		},function(data){
		    console.log("[deleteAddress]:delete failed");
		    $rootScope.showTopMsg("删除失败！"+ data.toast);
		});
	$scope.cancel();
    };
    
    $scope.updateAddress = function(address){
	//$rootScope.showDebugToast(address_id);
	$state.go("update_my_address",address);
    };
    
    
    $scope.deleteAddress = function(address_id,deleteIndex){
	//$rootScope.showDebugToast(address_id);
	 $scope.deleteAddressId = address_id;
	 $scope.deleteIndex = deleteIndex;
	 $scope.popupOptions();
    };
})

////更新我的地址
.controller('updateAddressCtrl', function($scope,$rootScope,$stateParams,$state,$ionicPopup,addressService,utilsService) {  //
    console.log("updateAddressCtrl");

    $scope.myAddress = $stateParams;
    console.log("[myAddress]:"+JSON.stringify($stateParams));
    $rootScope.globalAddress = {totalProCityCounty:'',province:'',city:'',county:''};
    $rootScope.globalAddress.province = $scope.myAddress.province;
    $rootScope.globalAddress.city = $scope.myAddress.city;
    $rootScope.globalAddress.county = $scope.myAddress.county;
    $rootScope.globalAddress.totalProCityCounty = $scope.myAddress.province + ',' + $scope.myAddress.city + ',' + $scope.myAddress.county;
  //地址
    var vm=$scope.vm={};
    
    vm.cb = function () {
      console.log(vm.CityPickData.areaData)
      console.log(JSON.stringify( vm.CityPickData) );
      //$scope.addressData.pro_city_county = vm.CityPickData.areaData;
      var pro_city_county = vm.CityPickData.areaData;
      /////普通省和直辖市
      if(pro_city_county.length == 3){
      $scope.myAddress.province = pro_city_county[0];
      $scope.myAddress.city = pro_city_county[1];
      $scope.myAddress.county = pro_city_county[2];
      }else if(pro_city_county.length == 2){
      $scope.myAddress.province = pro_city_county[0];
      $scope.myAddress.city = pro_city_county[0];
      $scope.myAddress.county = pro_city_county[1];
      }
      
    }
    
    vm.CityPickData = {
	      areaData: ['湖北-武汉-江岸区'],
	      defaultAreaData: ['江苏', '无锡', '江阴市'],
	      title: '地区',
	      tag: '，',
	      hardwareBackButtonClose: false,
	      buttonClicked: function () {
	          vm.cb()
	        }
	    }
    if($scope.myAddress.province == $scope.myAddress.city)
    {
    vm.CityPickData.defaultAreaData = [$scope.myAddress.city,$scope.myAddress.county];
    }else{
    vm.CityPickData.defaultAreaData = [$scope.myAddress.province,$scope.myAddress.city,$scope.myAddress.county];
    }

     ///////////////////////原生pickcity
     var callBackUpdate = function(e){
        ////////为毛通过$rootScope周转一边
        $rootScope.globalAddress.province = e.province;
        $rootScope.globalAddress.city = e.city;
        $rootScope.globalAddress.county = e.county;
        $rootScope.globalAddress.totalProCityCounty = $rootScope.globalAddress.province + ',' + $rootScope.globalAddress.city + ',' + $rootScope.globalAddress.county;
        $rootScope.log("data",JSON.stringify($rootScope.globalAddress.totalProCityCounty));
        $rootScope.showUpdateTransparent();
     };

    $scope.pickUpdateCity = function(){
        console.log("pickCity");
        if (ionic.Platform.isAndroid())
        { //android 下
            window.broadcaster.addEventListener( "update_pick_city_success", callBackUpdate);
            window.plugins.webintent.startActivity({
                action: 'com.afu.pick_city',
                url:'afu://pick_city?from=update&city='+$rootScope.globalAddress.city +'&county='+ $rootScope.globalAddress.county},
                function() {console.log("open success");},
                function() {
                console.log("open failed");
                alert('Failed to open URL via Android Intent')}
            );
        }else if(ionic.Platform.isIOS()){
            //$rootScope.showTopMsg("please wait ios");
            window.broadcaster.addEventListener( "update_pick_city_success", callBackUpdate);
            window.broadcaster.fireNativeEvent( "pick_city",
                { province:$rootScope.globalAddress.province,city:$rootScope.globalAddress.city,county:$rootScope.globalAddress.county},
                 function() {
                    console.log( "pick city fired!" );
            });
        }
    };



    var address_id = $stateParams.address_id;
    console.log("[address id]:"+address_id);
    var getAddresses = function(address_id){
	addressService.getAddressById(address_id).then(
		    function(data){
			console.log("[getAddressById]:"+JSON.stringify(data));
			$scope.myAddress = data;
			if($scope.myAddress.province == $scope.myAddress.city)
		         {
		         vm.CityPickData.defaultAreaData = [$scope.myAddress.city,$scope.myAddress.county];
		         }else{
		         vm.CityPickData.defaultAreaData = [$scope.myAddress.province,$scope.myAddress.city,$scope.myAddress.county];
		         }
		    },function(data){
			console.log("[getAddressById]:error");
			$rootScope.showTopMsg(data.toast+",请重试！");
		    });
    };
    //$scope.myAddress = {};
    //getAddresses({address_id:address_id});
    /////验证输入框是否都已经完整输入
    var validateSubmitForm = function(){
        //$scope.addressData = {phonenum:null,realname:null,province:null,city:null,county:null,detail_address:null,is_default:false,postcode:'123456'};
        //$scope.needData = {xid:xid,is_mypay:null,comment:null,address_id:null};
        $scope.myAddress.province = $rootScope.globalAddress.province;
        $scope.myAddress.city = $rootScope.globalAddress.city;
        $scope.myAddress.county = $rootScope.globalAddress.county;

        if( $scope.myAddress.phonenum != '' && $scope.myAddress.realname !='' &&
            $scope.myAddress.province != '' && $scope.myAddress.city != '' &&
            $scope.myAddress.county != '' && $scope.myAddress.detail_address != '' )
        {
            if( utilsService.testPhonenum($scope.myAddress.phonenum) ){
                console.log("[validateSubmitForm]:OK");
                return true;

            }else{
                $rootScope.showTopMsg("手机号码格式不正确！");
                return false;
            }

        }else {
            console.log("[validateSubmitForm]:不完整");
            $rootScope.showTopMsg("信息填写不完整，请填写完整再申请！");
            console.log( $scope.myAddress.phonenum +  $scope.myAddress.realname +
                                    $scope.myAddress.province + $scope.myAddress.city +
                                    $scope.myAddress.county + $scope.myAddress.detail_address);

            return false;

        }
    };

    $scope.saveAddress = function(){
        validateSubmitForm();
        $rootScope.log("updated myAddress",JSON.stringify($scope.myAddress));
        addressService.updateAddress($scope.myAddress).then(
            function(data){
            if(validateSubmitForm() == true){

                console.log("[addressService.updateAddress]:"+JSON.stringify(data));
                $rootScope.showTopMsg("更新成功！");
                 }
            },function(){
                console.log("[addressService.updateAddress]:Error");
                $rootScope.showTopMsg("更新失败！");
            });
    };
    
    
})

