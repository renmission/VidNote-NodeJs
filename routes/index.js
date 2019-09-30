const router = require('express').Router();
const Idea = require('../models/Ideas');
const { ideaValidation } = require('../validation');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => res.render('ideas/index', {
            ideas
        }));
});

router.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

router.get('/ideas/edit/:id', (req, res) => {
    Idea.findById({ _id: req.params.id })
        .then(idea => res.render('ideas/edit', { idea }))
        .catch(err => console.log(err));
});

router.post('/ideas/add', (req, res) => {
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
            details: req.body.details
        });

        newIdea.save()
            .then(() => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            });
    }
});

router.put('/ideas/edit/:id', (req, res) => {
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

router.delete('/ideas/delete/:id', (req, res) => {
    Idea.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        })
});


module.exports = router;