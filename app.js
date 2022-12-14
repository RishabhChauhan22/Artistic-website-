var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  Comment = require('./models/comments'),
  mongoose = require('mongoose'),
  art = require('./models/arts'),
  User = require('./models/user');
//seedDB          = require("./seed")

var commentRoutes = require('./routes/comments'),
  artRoutes = require('./routes/arts'),
  indexRoutes = require('./routes/index');

const dotenv = require('dotenv');

dotenv.config();

//console.log(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true, useUnifiedTopology:true});
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to database');
  })
  .catch((err) => {
    console.log('error', err.message);
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

//seedDB();
app.use(
  require('express-session')({
    secret: 'Rusty is the best and cutest dog in the world',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/arts', artRoutes);
app.use('/arts/:id/comments', commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3000, function () {
  console.log('Artify Server has started');
});
