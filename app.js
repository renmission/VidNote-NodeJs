const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// mongoose db conection
mongoose.connect('mongodb://localhost/vidnote-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// method override
app.use(methodOverride('_method'));

// session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// flash message
app.use(flash());
// global 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// routes init
app.use('/', require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server started on port ${port}...`) });