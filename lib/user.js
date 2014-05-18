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

module.exports = {
  createUser : function(userJSON, cb) {
    var user = new Person();
    user.set(userJSON);
     
    return save(user);
  },

  makeSession : function(userId) {
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
    return get(query, sessionId);
  }
};