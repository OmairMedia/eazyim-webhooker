const express = require('express');

const emojis = require('./emojis');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});


// Catch Eazy.im Message event
router.post('/catch-message', (req,res) => {
  console.log('post /catch-message api ran !')
  res.json('post /catch-message running!')
})
router.get('/catch-message', (req,res) => {
  console.log('get /catch-message api ran !')
  res.json('get /catch-message running!')
})



router.use('/emojis', emojis);

module.exports = router;
