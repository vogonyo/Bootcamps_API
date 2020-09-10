const express = require('express');
const dotenv = require('dotenv');
//Route files
const bootcamps = require('./routes/bootcamps');
const connectDB = require('./config/db');
const colors= require('colors');
const errorHandler = require('./middleware/error');
//load env vars
dotenv.config({ path: './config/config.env'})


//Connect DB
connectDB();

const app = express();

app.use(express.json());

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')} ${req.originalUrl}`);
    next();
}

app.use(logger);

//Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.cyan.bold)
);

process.on('unhandledRejection', (error, promise) => {
    console.log(`The error is ${error}`);
    
    //CLose server && exit process
    server.close(() => process.exit(1));
});