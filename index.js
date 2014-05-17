// buildstrap demo server.

var consolidate = require('consolidate'),
    express = require('express'),
    swig = require('swig'),

    app = express();

app.locals({
  templateMap: {
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

app.get('/:route?', function (req, res) {
  require('./controllers/static').call(app, req, res);
});

app.listen(3000);

console.log('Running buildstrap demo server on port 3000.');
