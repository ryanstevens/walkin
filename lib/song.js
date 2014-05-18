var api = require('./api'),
  uuid = require('node-uuid'),
  Deferred = require('Deferred');

var Person = api.Object.extend("Person");
var Song = api.Object.extend("Song");

var songQuery = new api.Query(Song);

module.exports = {
  save : function(songJSON, personModel) {
    var song = new Song();
    song.set(songJSON);
    song.set('person', personModel);
    return api.save(song);
  },
  allByUser : function(personModel) {

    var person = new Person();
    person.id = personModel.id;

    songQuery.matchesQuery("person", person);
    return api.find(songQuery);

  }
};