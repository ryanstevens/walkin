// buildstrap demo server.
var http = require('http'),
    consolidate = require('consolidate'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    swig = require('swig'),
    api = require('./lib/api'),
    port = Number(process.env.PORT || 3000),
    app = express(),
    server = http.createServer(app);

    io = require('socket.io').listen(server);

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

app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/build/html');
swig.setDefaults({ cache: false });

app.get('/ajax/:action', function (req, res) {
  require('./controllers/ajax').call(app, req, res);
});

app.get('/test/:video', function (req, res) {
  require('./controllers/test').call(app, req, res);
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
