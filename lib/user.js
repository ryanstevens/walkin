var api = require('./api'),
  uuid = require('node-uuid'),
  Deferred = require('Deferred');

var Session = api.Object.extend("Session");
var Person = api.Object.extend("Person");

module.exports = {
  createUser : function(userJSON, cb) {
    var dfd = Deferred();

    var query = new api.Query(Person);
    query.equalTo("fb_user_id", userJSON.fb_user_id);
    api.find(query).done(function(results) {

      if (results.length ===0) {
        var user = new Person();
        user.set(userJSON);

        api.save(user).done(dfd.resolve.bind(dfd));
      }
      else dfd.resolve(results[0]);
       
    });

    return dfd.promise();
  },

  makeSession : function(userId) {
    console.log("Creating session for::", userId)
    var session = new Session();
    session.set({
      userId: userId,
      valid : true
    });

    return api.save(session);
  },

  getUserFromSession : function(sessionId) {
    console.log("Looking up sesssion: " , sessionId)
    var query = new api.Query(Session);
    return api.get(query, sessionId).pipe(function(sessionModel) {
      console.log("Found session::" + sessionModel.get('userId'), sessionModel)
      var personQuery = new api.Query(Person);
      return api.get(personQuery, sessionModel.get('userId'));
    });
  }
};