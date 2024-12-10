const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const { webhookCheckout } = require('./controllers/bookingController');

const app = express();

// app.enable('trust proxy');
app.set('trust proxy', false);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middlewares
// Implement CORS

app.use(cors());
app.options('*', cors());

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP, please try again later!'
});

app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com', // Allow Mapbox scripts
        'https://cdnjs.cloudflare.com', // Allow CDN scripts
        'https://js.stripe.com' // Allow Stripe scripts
      ],
      styleSrc: [
        "'self'",
        'https://api.mapbox.com', // Allow Mapbox styles
        'https://fonts.googleapis.com' // Allow Google Fonts styles
      ],
      connectSrc: [
        "'self'",
        'https://api.mapbox.com', // Allow Mapbox API connections
        'https://events.mapbox.com', // Allow Mapbox events
        'ws://127.0.0.1:50766', // Allow WebSocket connection for local development
        'https://api.stripe.com', // Allow Stripe API connections
        'https://js.stripe.com' // Allow Stripe connections
      ],
      frameSrc: [
        "'self'", // Allow framing from own domain
        'https://js.stripe.com' // Allow Stripe frames
      ],
      imgSrc: ["'self'", 'https://api.mapbox.com', 'data:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      workerSrc: ["'self'", 'blob:'], // Allow Web Workers from self and blob URLs
      objectSrc: ["'none'"], // Disallow object elements
      mediaSrc: ["'self']"] // Define media sources if needed
    }
  })
);

app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 2) Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
