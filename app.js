const express = require('express');
const path = require('path');
const mongoose = require ('mongoose');
const bodyParser =  require('body-parser');
const expressValidator = require('express-validator');
const flash = require ('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

mongoose.connect(config.database);

// mongoose.connect('mongodb://localhost/chris1');
let db = mongoose.connection;

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
    console.log(err);
});

// Init app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

// Express Validator Middleware
// const { check, validationResult } = require('express-validator/check');
// const { matchedData, sanitize } = require('express-validator/filter');
 
// Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.get('*',function(req,res,next){

    res.locals.user = req.user || null;
    next();
})


// Bring in Models
let Article = require('./models/article');


// Load View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');


//Home Route
app.get('/', function(req,res){
    Article.find({}, function(err,articles){
        if(err){
            console.log(err);
        }else
        {
            res.render('index',{
                title:'Articles!!',
                articles:articles
            });
        }
    });
}); 

// Route Files
const articles = require('./routes/articles');
const users = require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);


//Start Server
app.listen(3000,function(){
 console.log('Sever Start on 3000');
});
