const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { userValidation } = require('../validation');

require('../config/passport')(passport);

// GET login
router.get('/login', (req, res) => {
    res.render('users/login');
});
// GET register
router.get('/register', (req, res) => {
    res.render('users/register');
});

// POST login + Passport Authentication
router.post('/login', passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
})
);

// POST register
router.post('/register', (req, res) => {
    // validate
    let errors = [];

    const { error } = userValidation(req.body);
    if (error) {
        errors.push({ text: error.details[0].message })
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });

    } else {
        User.findOne({ email: req.body.email })
            .then(user => {

                if (user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                } else {


                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registed and can login');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                            return;
                        });
                    });

                }
            })


    }

});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});




module.exports = router;