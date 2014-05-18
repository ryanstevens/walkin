// buildstrap demo server.
var consolidate = require('consolidate'),
    express = require('express'),
    swig = require('swig'),
    api = require('./lib/api'),
    app = express(),
    port = Number(process.env.PORT || 3000);

app.locals({
  templateMap: {
    'home': 'desktop/home.html',
    'signup': 'desktop/signup.html',
    'walkup': 'desktop/walkup.html',
    'rooms': 'desktop/rooms.html',
    'create': 'desktop/create.html'
  }
});

app.use('/css', express.static(__dirname + '/build/css'));
app.use('/js', express.static(__dirname + '/build/js'));
app.use('/img', express.static(__dirname + '/src/img'));
app.use('/fonts', express.static(__dirname + '/src/fonts'));
app.use(express.favicon(__dirname + '/src/img/favicon.png'));

app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/build/html');
swig.setDefaults({ cache: false });

app.get('/ajax', function (req, res) {
  require('./controllers/ajax').call(app, req, res);
});

app.get('/:route?', function (req, res) {
  require('./controllers/static').call(app, req, res);
});

app.listen(port);

console.log('Running walkup server on port ' + port);
