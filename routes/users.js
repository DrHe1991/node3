const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');


// Bring in Models
let User = require('../models/user');

router.get('/register', function (req, res) {
    res.render('register');

});

// Register Process

const { check, validationResult } = require('express-validator/check');
// const { body } = require('express-validator/check');

// router.post('/register', body('password2').custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error('Password confirmation does not match password');
//     }
//   }), (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {


//     res.render('register',{
//         errors:errors.array()
//     });
//     }
// });

router.post('/register', [
    check('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
    //     // check('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
    //     // // password must be at least 5 chars long
    check('email').isLength({ min: 1 }).withMessage('Email is required'),

    check('email').isEmail().withMessage('Email is not valid'),

    check('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    check('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('password does not match');
        }
        else {
            return value;
        }
    })


    // check('password2').equals(req.body.password).withMessage('Passwords do not match')

], function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {


        res.render('register', {
            errors: errors.array()
        });
    }
    else {

        let newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

// Login Form

router.get('/login', function (req, res) {
    res.render('login');

});

// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    // res.render('add_article',{

    //     title:'Add Article',
    //     user:user
    // });
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});



module.exports = router;