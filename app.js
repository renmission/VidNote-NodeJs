const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);

const app = express();

// DB config
const { mongoURI } = require('./config/database');

// mongoose db conection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// flash message
app.use(flash());
// global 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

const { generateDate } = require('./helpers/auth');
// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: { generateDate: generateDate } }));
app.set('view engine', 'handlebars');

// routes init
app.use('/', require('./routes'));
app.use('/ideas', require('./routes/ideas'));
app.use('/users', require('./routes/auth'));

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server started on port ${port}...`) });