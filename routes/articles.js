const express = require('express');
const router = express.Router();

// Bring in Models
let Article = require('../models/article');
let User = require('../models/user');



//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        console.log(article.author);
        console.log(req.user.username);
        if (article.author != req.user.username) {
            console.log('not equal');
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        else {
            res.render('edit_article', {
                article: article
            });

        }

    });
});


//Add Route
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Add Submit POST Route

const { check, validationResult } = require('express-validator/check');

router.post('/add', [
    // username must be an email
    check('title').isLength({ min: 5 }).withMessage('title require at least 5 characters'),
    // password must be at least 5 chars long
    // check('author').isLength({ min: 5 }).withMessage('author require at least 5 characters'),

    check('body').isLength({ min: 5 }).withMessage('body require at least 5 characters')
], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {


        res.render('add_article', {

            title: 'Add Article',
            errors: errors.array()
        });
    }
    else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user.username;
        article.body = req.body.body;
        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }
});


// Update Submit POST Route

router.post('/edit/:id', [
    // username must be an email
    check('title').isLength({ min: 5 }).withMessage('title require at least 5 characters'),
    // password must be at least 5 chars long
    //   check('author').isLength({ min: 5 }).withMessage('author require at least 5 characters'),

    check('body').isLength({ min: 5 }).withMessage('body require at least 5 characters')
], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add_article', {

            title: 'Add Article',
            errors: errors.array()
        });
    }
    else {
        let article = {};
        article.title = req.body.title;
        article.author = req.user.username;
        article.body = req.body.body;
        let query = { _id: req.params.id };

        Article.update(query, article, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                req.flash('success', 'Article Updated');
                res.redirect('/');
            }
        });
    }
});


// Delete Route


router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id };
    console.log(query);

    Article.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('success');
    });
});

//Load Article
router.get('/:id', function (req, res) {
    // Article.findById(req.params.id,function(err,article){
    //     console.log(article);
    // });

    Article.findById(req.params.id, function (err, article) {
        User.find({ username: article.author }, function (err, user) {
            // console.log(user);
            res.render('article', {

                article: article,
                author: user[0].name
            });

        });

    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;