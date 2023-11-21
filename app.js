const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

/// Passport config
require('./config/passport')(passport);
var userProfile; 

/// DB configuration
const db = require('./config/keys').MongoURI;

/// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected')) 
    .catch(err => console.log(err));

/// EJS middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');

/// Express body parser
app.use(express.urlencoded({ extended: true }));

/// Express Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

/// Passport middleware
app.use(passport.initialize());
app.use(passport.session());   

/// Flash middleware
app.use(flash());

/// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

/// Router
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

