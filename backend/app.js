const express = require("express");
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const projectRouter = require('./routes/projectRoutes');
const userRouter = require('./routes/userRoutes');
const cartItemRouter = require('./routes/cartItemRoutes');
const documentTypeRouter = require('./routes/documentTypeRoutes');
const documentRouter = require('./routes/documentRoutes');
const customerRouter = require('./routes/customerRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const requestRouter = require('./routes/requestRoutes');
const soldItemRouter = require('./routes/soldItemRoutes');
const authRouter = require('./routes/authRoutes');
const errorController = require("./controllers/errorController");
const AppError = require('./utils/appError');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');
const app = express();

app.use(cors());
// 1. GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
app.use(cookieParser());
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit request from same API
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // mongo sanitize will remove $ sign and dot from query 

// Data sanitization against XSS
app.use(xss()); // xss will remove any html tag from query

// Prevent parameter pollution
app.use(hpp({ whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price'] }));

// Serve static files
app.use(express.static(`${__dirname}/public`));

// 3. ROUTES
app.use('/api/v1/documentTypes', documentTypeRouter);
app.use('/api/v1/requests', requestRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/cartItems', cartItemRouter);
app.use('/api/v1/soldCartItems', soldItemRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/transactions', transactionRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {

}

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;