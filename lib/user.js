var api = require('./api'),
  uuid = require('node-uuid'),
  Deferred = require('Deferred');

var Session = api.Object.extend("Session");
var Person = api.Object.extend("Person");

function resolver(dfd) {
  return {
    success: function(obj) {
      dfd.resolve(obj);
    },
    error: function(obj, error) {
      console.error("Problem::"+JSON.stringify(error), obj);
      dfd.reject(error);
    }
  };
}

function save(model) {
  var dfd = Deferred();
  model.save(null, resolver(dfd));
  return   dfd.promise();
}

function get(model, id) {
  var dfd = Deferred();
  model.get(id, resolver(dfd));
  return dfd.promise();
}

function find(query) {
  var dfd = Deferred();
  query.find(resolver(dfd));
  return dfd.promise();
}

module.exports = {
  createUser : function(userJSON, cb) {
    var dfd = Deferred();

    var query = new api.Query(Person);
    query.equalTo("fb_user_id", "10152017615725566");
    find(query).done(function(results) {

      if (results.length ===0) {
        var user = new Person();
        user.set(userJSON);

        save(user).done(dfd.resolve.bind(dfd));
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

    return save(session);
  },

  getUserFromSession : function(sessionId) {
    console.log("Looking up sesssion: " , sessionId)
    var query = new api.Query(Session);
    return get(query, sessionId).pipe(function(sessionModel) {
      console.log("Found session::" + sessionModel.get('userId'), sessionModel)
      var personQuery = new api.Query(Person);
      return get(personQuery, sessionModel.get('userId'));
    });
  }
};