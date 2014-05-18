var api = require('./api'),
  uuid = require('node-uuid'),
  Deferred = require('Deferred');

var Room = api.Object.extend("Room");
var roomQuery = new api.Query(Room);


module.exports = {
  save : function(roomJSON) {
    var room = new Room();
    room.set(roomJSON);
    return api.save(room);
  },
  all : function() {

    return api.find(roomQuery);

  }
};