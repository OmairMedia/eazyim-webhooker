const express = require('express');

const emojis = require('./emojis');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});


// Catch Eazy.im Message event
router.get('/catch-message', (req,res) => {
  let body = req.body;
  let query = req.query;
  let params = req.params;

  console.log('get /catch-message api ran!')
  res.json({
    status: 'A New Message Received!',
    data: {
      body: body,
      query: query,
      params: params
    }
  })
})



router.use('/emojis', emojis);

module.exports = router;
