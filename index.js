const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// Instance of Express
const app = express();

// DB setup
// -------------------
mongoose.connect('mongodb://localhost:auth/auth');

// App setup
// -------------------

// Middleware
// morgan logging framework
// body-pasrer - parses as json
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Sever setup
// -------------------

// If environment var already defined use it
// otherwise use 3090
const port = process.env.PORT || 3090;

// http - native node lib
const server = http.createServer(app);
server.listen(port);

console.log('Server listening on: ', port);