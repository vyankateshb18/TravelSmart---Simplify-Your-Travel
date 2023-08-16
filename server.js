if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} //  check before deploying
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')

let Email;

mongoose.connect('mongodb+srv://onki0436:lawiLo5YModeLYNE@cluster0.fbbtqyc.mongodb.net/Around-the-world-in-18-stops?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  currentTripPath: {

  },
  currentTripCoordinates: {

  }
});

const user = mongoose.model('user', userSchema);

initializePassport(
  passport,
  async function getUserByEmail(email) {
    let ans = await user.findOne({ 'email': email });
    Email = email;
    return ans;
  },
  async function getUserById(id) {
    let ans = await user.findOne({ 'id': id });
    return ans;
  }
)

app.use(express.static(path.join(__dirname, 'views/public')));
app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const curr_user = new user({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      currentTripPath: [],
      currentTripCoordinates: [[]]
    });
    curr_user.save();
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})


app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/createTrip.html',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/index1', checkAuthenticated, (req, res) => {
  res.render('index1.ejs', { name: req.user.name })
})

app.delete('/logout', (req, res) => {
  req.logOut(function (err) {
    console.log(err);
  });
  res.redirect('/login')
})

app.get('/createTrip.html', checkAuthenticated, (req, res) => {
  res.render('createTrip.ejs');
});

app.post('/createTrip.html', checkAuthenticated, async (req, res) => {

  let path = JSON.parse(req.body.PATH);
  let coordinates = JSON.parse(req.body.COORDINATES);
  let temp = await user.findOneAndUpdate({ 'email': Email }, { 'currentTripPath': path, 'currentTripCoordinates': coordinates });
  console.log("temp" + temp);
  let Coordinates = await user.findOne({ 'email': Email }, 'currentTripCoordinates');
  let Path = await user.findOne({ 'email': Email }, 'currentTripPath');
  console.log("coordinates" + Coordinates);
  console.log("path" + Path);
  res.redirect('/currentTrip.html');
});

app.get('/currentTrip.html', checkAuthenticated, async (req, res) => {
  console.log("hi");
  let coordinates = await user.findOne({ 'email': Email }, 'currentTripCoordinates');
  let path = await user.findOne({ 'email': Email }, 'currentTripPath');
  console.log("coordinates" + coordinates);
  console.log("path" + path);
  let route = [];
  route.push(coordinates.currentTripCoordinates);
  route.push(path.currentTripPath);
  let Route = JSON.stringify(route);
  res.render('currentTrip.ejs', { route: Route });
});

app.get('/HowToUse.html', checkAuthenticated, (req, res) => {
  res.render('HowToUse.ejs');
})

app.get('/About.html', checkAuthenticated, (req, res) => {
  res.render('About.ejs');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/createTrip.html')
  }
  next()
}

app.listen(8080);
