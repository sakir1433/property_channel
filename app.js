var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var path = require("path");
var favicon = require('serve-favicon');
var cookieParser = require("cookie-parser");
var session = require("express-session");
var multiparty = require('connect-multiparty');
var MongoStore = require("connect-mongo")(session);
var config = require("./configs/configCommon");
var db = require("./configs/ConfigDB");
var httpMsg = require('./core/httpMsg');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(db.localDB, function(err) {
    if (err) {
        return err;
    } else {
        console.log('Successfully Connect to ' + db.localDB);
    }
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true
}));

app.use(multiparty());


app.set('views', path.join(__dirname, 'clients'));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/cms', express.static(path.join(__dirname, 'cms')));


// Add headers
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

var api = express.Router();
require("./api/config")(api);
app.use('/api', api);

// module.exports = app;

app.listen(config.PORT, function() {
    console.log('Express server listening on port %d in %s mode', config.PORT, app.settings.env);
});