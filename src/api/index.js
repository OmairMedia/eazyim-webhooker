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
  console.log('get /catch-message api ran !')
  res.json('get /catch-message running!')

  res.json({
    status: 'A New Message Received!',
    body: req.body,
    query: req.query,
    params: req.params
  })
})



router.use('/emojis', emojis);

module.exports = router;
