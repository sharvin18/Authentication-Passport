const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');

// DB configuration
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected')) 
    .catch(err => console.log(err));

// EJS middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Router
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

