var api = require('./api');


module.exports = {
  createUser : function(userJSON, cb) {
    var user = new api.User();
    user.set("username", "my name");
    user.set("password", "my pass");
    user.set("email", "email@example.com");
     
    // other fields can be set just like with Parse.Object
    user.set("phone", "415-392-0202");
     
    return user.signUp(null, {
      success: function(user) {
        cb(null, user);
        // Hooray! Let them use the app now.
      },
      error: function(user, error) {
        cb(error);
      }
    });
  }
};