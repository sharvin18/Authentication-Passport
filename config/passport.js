const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/// Get the user model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

            /// Check is user email exists
            User.findOne({ email: email})
                .then(user => {
                    if(!user){
                        return done(null, false, {message: 'The user does not exist'});
                    }

                    /// Match the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user)
                        }else{
                            return done(null, false, {message: 'Incorrect Email Id of Password'});
                        }

                    })
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}