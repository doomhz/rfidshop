require('coffee-script').register();

var express           = require('express');
var bodyParser        = require('body-parser');
var methodOverride    = require('method-override');
var cookieParser      = require('cookie-parser');
var compression       = require('compression');
var errorhandler      = require('errorhandler');
var http              = require('http');
var environment       = process.env.NODE_ENV || 'development';


// Configure globals
GLOBAL.appConfig = require("./config/config");

require('date-utils');

// Setup express
var app = express();
var cookieParser  = cookieParser(GLOBAL.appConfig().session.cookie_secret);
app.enable("trust proxy");
app.disable('x-powered-by');
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser);
app.use(express.static(__dirname + '/public', {maxAge: 2592000000})); // 30 days
app.use(function(err, req, res, next) {
  if (err.status === 400) {
    res.statusCode = 404;
    res.render("errors/404");
  } else {
    console.appLog("503 - [" + req.method + "] " + req.originalUrl + " - " + err + " - " + JSON.stringify(req.headers) + " " + JSON.stringify(req.body), "error", {rollbar: false, console: false, file: true});
    res.statusCode = 503;
    res.render("errors/500");
  }
});


// Routes
require('./routes/site')(app);
require('./routes/reader')(app);
require('./routes/errors')(app);


// Configuration
if (environment === "dev") {
  app.use(errorhandler({ dumpExceptions: true, showStack: true }));
};
if (environment === "production") {
  app.use(errorhandler());
}

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("RFID Shop is running on port " + app.get("port") + " in " + app.settings.env + " mode", "info");
});
