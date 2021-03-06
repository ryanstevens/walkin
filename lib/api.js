var Parse = require('./parse-lib').Parse,
  Deferred = require('Deferred'),
  _ = require('underscore');

Parse.initialize(process.env.WALKUP_PARSE_APPID, process.env.WALKUP_PARSE_JSKEY);

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

_.extend(Parse, {

  save : function save(model) {
    var dfd = Deferred();
    model.save(null, resolver(dfd));
    return   dfd.promise();
  },

  get : function get(model, id) {
    var dfd = Deferred();
    model.get(id, resolver(dfd));
    return dfd.promise();
  },

  find : function find(query) {
    var dfd = Deferred();
    query.find(resolver(dfd));
    return dfd.promise();
  }

});

module.exports = Parse;