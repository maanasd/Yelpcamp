if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// dbUrl = process.env.DB_URL;
dbUrl = 'mongodb://localhost:27017/yelp-camp';

const express = require('express');
const app = express();
const path= require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');


app.use(express.urlencoded({ extended : true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// 'mongodb://localhost:27017/yelp-camp'

async function main() {
    await mongoose.connect(dbUrl);
    console.log('mongo connected')
  };

main().catch(err => console.log(err));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function(e){
    console.log('session store error',e)
})

const sessionConfig = {
    store,
    name: "session",
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 *60*24*7,
        maxAge: 1000 * 60 *60*24*7
    }
  }

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/fakeUser', async(req,res) =>{
    const user = new User({email: 'maanas@gmail.com', username: 'maanas'});
    const newUser = await User.register(user, 'lmao');
    res.send(newUser);
})

app.use((req,res,next) => {
    // console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
});

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req,res)=> {
    res.render('home')
})

app.all('*',(req,res,next) =>{
    next(new ExpressError('page not found', 404));
})

app.use((err, req, res, next)=>{
    const { statusCode=500 } = err;
    if(!err.message) err.message ='something went wrong';
    res.status(statusCode).render('error.ejs', { err });
})

app.listen(3000, ()=>{
    console.log('serving on port 3000')
})