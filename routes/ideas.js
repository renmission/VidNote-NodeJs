const router = require('express').Router();
const Idea = require('../models/Ideas');
const { ideaValidation } = require('../validation');
const { ensureAuthenticated } = require('../helpers/auth');



// GET ideas by user id
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id }) // user access control
        .sort({ date: 'desc' })
        .then(ideas => res.render('ideas/index', {
            ideas
        }));
});


// GET add idea
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// GET edit by id
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findById({ _id: req.params.id })
        .then(idea => {

            //check if user is owner
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', { idea })
            }

        })
        .catch(err => console.log(err));
});

// POST add idea
router.post('/add', ensureAuthenticated, (req, res) => {
    let errors = [];

    // validate first
    const { error } = ideaValidation(req.body);
    if (error) {
        errors.push({ text: error.details[0].message })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newIdea = new Idea({
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        });

        newIdea.save()
            .then(() => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            });
    }
});

// PUT or POST edit idea by id
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findById({ _id: req.params.id })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save().then(() => {
                req.flash('success_msg', 'Video idea updated');
                res.redirect('/ideas')
            });
        })
        .catch(err => console.log(err))
});


// DELETE idea by id
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    Idea.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        })
});


module.exports = router;