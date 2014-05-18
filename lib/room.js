var api = require('./api'),
  uuid = require('node-uuid'),
  Deferred = require('Deferred');

var Room = api.Object.extend("Room");


module.exports = {
  save : function(roomJSON) {
    return this.getBySlug(roomJSON.slug).pipe(function(room) {
      if (room === null) {
        var room = new Room();
        room.set(roomJSON);
        return api.save(room);
      } else return room;
    });
    
  },
  all : function() {
    var roomQuery = new api.Query(Room);
    return api.find(roomQuery);

  },
  getBySlug : function(slug) {
    console.log("Looking up by slug:" + slug)
    var roomQuery = new api.Query(Room);
    roomQuery.equalTo("slug", slug);
    return api.find(roomQuery).pipe(function(results) {
      if (results.length===1) {
        return results[0]
      }
      else return null;
    });
  }
};