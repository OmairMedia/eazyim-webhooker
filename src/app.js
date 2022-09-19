const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});


// Catch Eazy.im Message event
app.get('/catch-message', (req,res) => {
  let body = req.body;
  let query = req.query;
  let params = req.params;

  console.log('get /catch-message api ran ! ================================')
  let data = {
    body: body,
    query: query,
    params: params
  };
  console.log('new message catched -> ',data)
  res.json({
    status: 'A New Message Received!',
    data: data
  })
})



// app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
