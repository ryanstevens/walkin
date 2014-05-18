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

passport.use(new BeatsMusicStrategy({
  clientID: beatsClientId,
  clientSecret: beatsSecret,
  callbackURL: 'http://' + host + (port > 80 ? ':' + port : '') + '/auth/beatsmusic/callback'
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
    'rooms': 'desktop/rooms.html',
    'create': 'desktop/create.html'
  }
});

app.use(cookieParser());
app.use('/css', express.static(__dirname + '/build/css'));
app.use('/js', express.static(__dirname + '/build/js'));
app.use('/img', express.static(__dirname + '/src/img'));
app.use('/fonts', express.static(__dirname + '/src/fonts'));
app.use(express.favicon(__dirname + '/src/img/favicon.png'));

app.use(express.cookieParser());
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
// app.get('/auth/beatsmusic', passport.authenticate('beatsmusic'));

app.get('/auth/beatsmusic/callback', passport.authenticate('beatsmusic', {
  failureRedirect: '/login/failed'
}), function(req, res) {
  console.log('ON CALLBACK')
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.get('/ajax/:action', function (req, res) {
  require('./controllers/ajax').call(app, req, res);
});

app.get('/test/:video', function (req, res) {
  require('./controllers/test').call(app, req, res);
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
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
