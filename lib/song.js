var api = require('./api'),
  uuid = require('node-uuid'),
  Deferred = require('Deferred');

var Song = api.Object.extend("Song");

module.exports = {
  save : function(songJSON) {
    var song = new Song();
    song.set(songJSON);
    return api.save(song);
  }
};