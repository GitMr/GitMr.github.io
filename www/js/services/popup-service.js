/*
 * FileName:popup-service.js
 * TODO:弹窗service
 * Author：WY
 * Date:
 */

/*module中ng-app的名字应该在html中标明*/
angular.module('afu.popup-service',[])
.factory('popupService', [
    '$ionicPopup',
    '$q',
    function ($ionicPopup, $q) {

        var firstDeferred = $q.defer();
        firstDeferred.resolve();

        var lastPopupPromise = firstDeferred.promise;

        // Change this var to true if you want that popups will automaticly close before opening another
        //false 不关闭之前的popup就打开新的  ； true关闭之前的再打开
        var closeAndOpen = true;

        return {
            'show': function (method, object) {
                var deferred = $q.defer();
                var closeMethod = null;
                deferred.promise.isOpen = false;
                deferred.promise.close = function () {
                    if (deferred.promise.isOpen && angular.isFunction(closeMethod)) {
                        closeMethod();
                    }
                };

                if (closeAndOpen && lastPopupPromise.isOpen) {
                    lastPopupPromise.close();
                }

                lastPopupPromise.then(function () {
                    deferred.promise.isOpen = true;
                    var popupInstance = $ionicPopup[method](object);

                    closeMethod = popupInstance.close;
                    popupInstance.then(function (res) {
                        deferred.promise.isOpen = false;
                        deferred.resolve(res);
                    });
                });

                lastPopupPromise = deferred.promise;

                return deferred.promise;
            }
        };
    }
])