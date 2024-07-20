const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRoutes = require('./router/authRoutes');
const affairsRoute = require('./router/affairsRoutes');
const newsRoutes = require('./router/newsRoutes');
const testRoutes = require('./router/testRoutes');
const dailyTestRoutes = require('./router/dailyTestRoutes');
const pdfRoutes = require('./router/pdfRoutes');
const adminRoutes = require('./router/adminRoutes');
const paymentRoutes = require('./router/paymentRoutes');
const userRoutes = require('./router/userRoutes');
const User = require("./models/userModal");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser('secret'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(mongoSanitize());
app.use(xss());
app.use(compression());

const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 20 * 1000,
  message: 'Too many requests from this IP address, Please try again after 20 minutes!',
});
app.use('/api', limiter);

app.use(cors({ credentials: true, origin: true }));

app.use(
  session({
    secret: '45875632155sdfds4545dsfsf5s',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/api/oauth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            googleLogIn: true,
            password: `${process.env.GOOGLE_PASSWORD}`, // Ensure this variable is correctly set
          });
        } else {
          user.googleLogIn = true;
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id); // Store only the user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

app.get(
  '/api/oauth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    const token = signToken(req.user._id);

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    };

    res.cookie('jwt', token, cookieOptions);

    req.user.password = undefined; // Hide password from the response

    res.setHeader('Authorization', `Bearer ${token}`);
    res.redirect(`${process.env.FRONTEND_URL}/user/${token}`);
  }
);

app.get('/api/login/success', async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in",
      user: req.user,
      isAuthorized: true
    });
  } else {
    res.status(400).json({
      message: "Not Authorized"
    });
  }
});

app.post("/api/logout", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.googleLogIn = false;
      await user.save();
    }
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(`${process.env.FRONTEND_URL}`);
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/currentaffairs', affairsRoute);
app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/test', testRoutes);
app.use('/api/dailytest', dailyTestRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
