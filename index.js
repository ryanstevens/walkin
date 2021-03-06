// buildstrap demo server.
var http = require('http'),
    consolidate = require('consolidate'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    swig = require('swig'),
    passport = require('passport'),
    BeatsMusicStrategy = require('passport-beatsmusic').Strategy,
    api = require('./lib/api'),
    beats = require('./lib/beats'),
    host = process.env.HOST || 'www.spotilocal.com',
    port = Number(process.env.PORT || 3000),
    beatsClientId = process.env.BEATS_CLIENTID,
    beatsSecret = process.env.BEATS_SECRET,
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

passport.use(new BeatsMusicStrategy({
  clientID: beatsClientId,
  clientSecret: beatsSecret,
  callbackURL: 'http://' + host + ((host.indexOf('local')>0) ? (port > 80 ? ':' + port : '') : '') + '/auth/beatsmusic/callback'
}, function(accessToken, refreshToken, profile, done) {
  done(null, {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.locals({
  templateMap: {
    'home': 'desktop/home.html',
    'signup': 'desktop/signup.html',
    'walkup': 'desktop/walkup.html',
    'room': 'desktop/room.html',
    'rooms': 'desktop/rooms.html',
    'create': 'desktop/create.html'
  }
});

app.use(cookieParser());
app.use('/css', express.static(__dirname + '/build/css'));
app.use('/js', express.static(__dirname + '/build/js'));
app.use('/img', express.static(__dirname + '/src/img'));
app.use('/fonts', express.static(__dirname + '/src/fonts'));
app.use(express.favicon(__dirname + '/src/img/favicon.v2.png'));

app.use(express.session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/build/html');
swig.setDefaults({ cache: false });

app.get('/user', function(req, res) {
  console.log(':: user ::', req.user)
  res.end(JSON.stringify(req.user));
})

app.get('/login', passport.authenticate('beatsmusic'));

app.get('/auth/beatsmusic/callback', passport.authenticate('beatsmusic', {
  failureRedirect: '/login/failed'
}), function(req, res) {
  console.log('ON CALLBACK')
  // Successful authentication, redirect home.
  // Ideally we want to be able to redirect user to the page where he came from
  res.redirect('/');
});

app.get('/ajax/:action', function (req, res) {
  require('./controllers/ajax').call(app, req, res);
});

app.get('/test/:video', function (req, res) {
  require('./controllers/test').call(app, req, res);
});

app.get('/room/:name', ensureAuthenticated, function (req, res) {
  require('./controllers/room').call(app, req, res);
});

app.get('/walkup', function (req, res) {
  require('./controllers/walkup').call(app, req, res);
});

app.get('/:route?', function (req, res) {
  require('./controllers/static').call(app, req, res);
});

server.listen(port);

console.log('Running walkup server on port ' + port);

io.sockets.on('connection', function (socket) {
  socket.emit('connect', { state: 'ready' });

  socket.on('enterRoom', function(val) {
    socket.broadcast.emit('play', val);
  })
});
