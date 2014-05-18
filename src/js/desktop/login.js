
function getMe() {
  return $.ajax({url : '/ajax/me'}).pipe(function(result) {
    return result.value;
  });
}

$(function (argument) {

  getMe().done(function(user) {
    console.log(user);
  });

  function tryLogin (response) {
    if (response && response.status == 'connected') {
      FB.api('me', function (user) {
        user.authData = response.authResponse;
        var id = user.id;
        user.fb_user_id = user.id;
        delete user.id;

        $.ajax({
          url : '/ajax/register',
          data : {
            obj: JSON.stringify(user)
          }
        }).done(function(result) {
          console.log('Got data:', result.value);
          if (!result.error) {
            getMe().done(function(user){
              console.log(user);
              window.location.href = '/walkup';
            });
          }else {console.error("WUT", result);}
        });
      });
    } else {
      FB.login(tryLogin, {
        scope : 'email',
        return_scopes: true
      });
    }
  }

  FB.init({
    appId: '1504962113057983',
    status: true,
    cookie: true,
    xfbml: false
  });

  $('.login').click(function (e) {
    FB.getLoginStatus(tryLogin);
  });

});
