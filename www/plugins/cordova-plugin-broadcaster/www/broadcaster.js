cordova.define("cordova-plugin-broadcaster.broadcaster", function(require, exports, module) {

var exec = require('cordova/exec');
var channel = require('cordova/channel');

module.exports = {

  _channels: {},
  createEvent: function(type, data) {
      var event = document.createEvent('Event');
      event.initEvent(type, false, false);
      if (data) {
          for (var i in data) {
              if (data.hasOwnProperty(i)) {
                  event[i] = data[i];
              }
          }
      }
      return event;
  },
  fireNativeEvent: function (eventname, data, success, error) {
     exec(success, error, "broadcaster", "fireNativeEvent", [ eventname, data ]);
  },
  fireEvent: function (type, data) {
     var event = this.createEvent( type, data );
     if (event && (event.type in this._channels)) {
         this._channels[event.type].fire(event);
     }
  },
  /*removeChannel: function( eventname ) {
    delete this._channels[eventname];
  },*/
  addEventListener: function (eventname,f) {
     if (!(eventname in this._channels)) {
         var me = this;
         exec( function() {
           me._channels[eventname] = channel.create(eventname);
           me._channels[eventname].subscribe(f);
           console.log("create subscribe");
         }, function(err)  {
           console.log( "ERROR addEventListener: " + err)
         }, "broadcaster", "addEventListener", [ eventname ]);
     }
     else {
       //this._channels[eventname].subscribe(f);   ///注释掉不执行，就不会出现重复subscribe，因为removeEventListener也不用了，所以不会出现unsubscribe
       console.log("again subscribe");
     }
  },
  ///////此函数存在bug，unsubscribe之后再次subscribe无效果，不在调用此函数
  removeEventListener: function(eventname, f) {
     if (eventname in this._channels) {
        var me = this;
        exec( function() {
          me._channels[eventname].unsubscribe(f);
          console.log("unsubscribe");
          //removeChannel(eventname);   /////add by WangYong
        }, function(err)  {
          console.log( "ERROR removeEventListener: " + err)
        }, "broadcaster", "removeEventListener", [ eventname ]);
     }
  }

};

});
