const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const affairsRoute = require('./router/affairsRoutes');
const OAuth2Startegy = require('passport-google-oauth2').Strategy;
// const ejs = require('ejs');

const newsRoutes = require('./router/newsRoutes');
// const oauthRoutes = require('./router/oauthRoutes');
const testRoutes = require('./router/testRoutes');
const pdfRoutes = require('./router/pdfRoutes');
const adminRoutes = require('./router/adminRoutes');
const userRoutes = require('./router/userRoutes');
const paymentRoutes = require('./router/paymentRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const compression = require('compression');
const User = require('./models/userModal');
const authController = require('./controllers/authController');

const cors = require('cors');


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Development Logging || Global Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware
// app.use(cookieParser());
app.use(cookieParser('secret'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Security Middleware
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(mongoSanitize());
app.use(xss());

app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  max: 300,
  windowMS: 60 * 20 * 1000,
  message:
    'Too many requests from this IP address, Please try again after 20 minutes!',
});
app.use('/api', limiter);

// CORS Setup

app.use(cors({ credentials: true, origin: true, withCredentials: true }));

app.use(
  session({
    secret: '45875632155sdfds4545dsfsf5s',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Set to true for HTTPS
    },
  }),
);

//setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new OAuth2Startegy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/oauth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("🚀 ~ profile:", profile.givenname)
      
      const user = await User.findOne({ email: profile.emails[0].value });
      try {
        if (!user) {
          const user = await User.create({
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            googleId:profile.id,
            googleLogIn:true,
            password:`${process.env.googlePassword}`
            // phone: req.body.phone,
          });
          await user.save();
          return done(null, user);
        }
        user.googleLogIn=true
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

///initalize google aoth login
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
app.get(
  '/api/oauth/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.FRONTEND_URL}/user`,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  }),
);
app.get('/api/login/success',async(req,res)=>{

  if (req.user){
    res.status(200).json({
      message:"user login",
      user:req.user,
      isAuthorized: true
    })
  }
  else{
    res.status(400).json({
      message:"Not Authorize"
    })
  }
})
app.post("/api/logout",async(req,res,next)=>{
 
  // console.log(email,"sdfdsfdsfdsfdsfds")
  const user = await User.findOne({ email: req.body.email });
  user.googleLogIn = false;
  await user.save();
  
 
})
app.get("/api/logout",async(req,res,next)=>{
  req.logout(function(err){
    if(err){return next(err)}
    res.redirect(`${process.env.FRONTEND_URL}`)
  })
})

app.use('/api/currentaffairs', affairsRoute);
app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/test', testRoutes);
// app.use('/api/oauth/google/callback', oauthRoutes);


// Error Handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
