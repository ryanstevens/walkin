$(function (argument) {

  function tryLogin (response) {
    if (response && response.status == 'connected') {
      FB.api('me', function (user) {
        user.authData = response.authResponse;
        console.log('Got /me data:', user);
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
