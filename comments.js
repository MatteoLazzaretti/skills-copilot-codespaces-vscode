// Create web server
// Define routes
// Start web server

// Import express
const express = require('express');

// Import path
const path = require('path');

// Import express-handlebars
const exphbs = require('express-handlebars');

// Import method-override
const methodOverride = require('method-override');

// Import session
const session = require('express-session');

// Import flash
const flash = require('connect-flash');

// Import passport
const passport = require('passport');

// Import mongoose
const mongoose = require('mongoose');

// Import body-parser
const bodyParser = require('body-parser');

// Import Handlebars helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// Load keys
const keys = require('./config/keys');

// Load passport
require('./config/passport')(passport);

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Create express app
const app = express();

// Connect to mongoose
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Handlebars middleware
app.engine('.hbs', exphbs({
  helpers: {
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select
  },
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', index);