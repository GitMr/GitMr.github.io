angular.module('afu.directives', [])
    .directive('rjHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
        function($ionicGesture, $timeout, $ionicBackdrop) {
            return {
                scope: false,
                restrict: 'A',
                replace: false,
                link: function(scope, iElm, iAttrs, controller) {
                    $ionicGesture.on("hold", function() {
                        iElm.addClass('active');
                        $timeout(function() {
                            iElm.removeClass('active');
                        }, 300);
                    }, iElm);
                }
            };
        }
    ])
    .directive('rjCloseBackDrop', [function() {
        return {
            scope: false,
            restrict: 'A',
            replace: false,
            link: function(scope, iElm, iAttrs, controller) {
                var htmlEl = angular.element(document.querySelector('html'));
                htmlEl.on("click", function(event) {
                    if (event.target.nodeName === "HTML" &&
                        scope.popup.optionsPopup &&
                        scope.popup.isPopup) {
                        scope.popup.optionsPopup.close();
                        scope.popup.isPopup = false;
                    }
                });
            }
        };
    }])
    .directive('resizeFootBar', ['$ionicScrollDelegate', function($ionicScrollDelegate){
        // Runs during compile
        return {
            replace: false,
            link: function(scope, iElm, iAttrs, controller) {
                scope.$on("taResize", function(e, ta) {
                    if (!ta) return;
                    var scroll = document.body.querySelector("#message-detail-content");
                    var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
                    // console.log(scroll);
                    var taHeight = ta[0].offsetHeight;
                    var newFooterHeight = taHeight + 10;
                    newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                    iElm[0].style.height = newFooterHeight + 'px';
                    scroll.style.bottom = newFooterHeight + 'px';
                    scrollBar.scrollBottom();
                });
            }
        };
    }])
    .directive('rjPositionMiddle', ['$window', function($window){
        return{
            replace: false,
            link: function(scope, iElm, iAttrs, controller){
                var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
                if (height >= 0) {
                    iElm[0].style.top = (height / 2 + 44) + 'px';
                }else{
                    iElm[0].style.top = 44 + 'px';
                }
            }
        }
    }])
/////////////////////////////////////added by WangYong
.directive('tabRedPoint', function($compile, $timeout){
   return {
      restrict: 'A',
      replace: false,
      link: function(scope, element, attrs, controller) {
          var key = attrs.tabRedPoint || false;
          var template ="<span ng-class={true:'tabs-red-point',false:''}["+key+"]></span>";
          var $class = 'a.'+attrs.class;
          var html = $compile(template)(scope);
          $timeout(function() {
              $($class).css({
                  "position":'relative',
              }).append(html);

          },100);

       }
   };
})

/////
.directive('headRedPoint', function($compile, $timeout){
   // Runs during compile
   return {
      restrict: 'A',
      replace: false,
      link: function(scope, element, attrs, controller) {
          var key = attrs.headRedPoint || false;
          var template ="<span ng-class={true:'tabs-red-point',false:''}["+key+"]></span>";
          var html = $compile(template)(scope);
          $timeout(function() {
            var test = angular.element(element).parent().append(html)
          },100)

       }
   };
})
.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover',
                'background-position' : 'center'
            });
        });
    };
})