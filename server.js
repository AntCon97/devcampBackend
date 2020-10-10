const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')


// route files
const bootcamps = require('./routes/bootcamps');
const { connect } = require('mongoose');

//Loade env vars
dotenv.config({
  path: './config/config.env',
});

//connect to database
connectDB();


const app = express();

//Body Parser
app.use(express.json())

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold)
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promis) => {
  console.log(`Error: ${err.message}`.red.bold);
  //close sever and exit process
  server.close(() => process.exit(1))
})