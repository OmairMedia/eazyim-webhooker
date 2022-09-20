const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
var NameGenerator = require('nodejs-randomnames');
const middlewares = require('./middlewares');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


// RingCentral
const functions = require('./functions/index')

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


// Catch Eazy.im Message event
app.post('/catch-message', (req,res) => {
  let body = req.body;
  let query = req.query;
  let params = req.params;

  try {
    console.log('post /catch-message api ran ! ================================')

  
  // EAZY.IM EVENT RESPONSE
  // contextInfo: { conversation: [Object], metadata: [Object], originator: null },
  //  direction: 'received',
  //  from: {
  //    jid: '3ecce6e1-3c6a-4aeb-a837-1822c4f6bcad@apple.eazy.im',
  //    locale: 'en_US',
  //    name: null,
  //    picture: null
  //  },
  //  message: {
  //    body: 'Thank you ',
  //    id: '26145a84-49f3-4c3c-a99b-98f932cae585',
  //    type: 'text'
  //  },
  //  timestamp: 1663619718,
  //  to: '7dd751fa-1ed7-4382-9ce0-0e0baf01d9c7@apple.eazy.im',
  //  type: 'message',
  //  version: 2

    if(body.to === '7dd751fa-1ed7-4382-9ce0-0e0baf01d9c7@apple.eazy.im') {
      let fromJid = body.from.jid;
      console.log('fromJid -> ',fromJid)
      let config = {
        headers: { Authorization: `Bearer qJu2jBh6aimNOheoNKRhs6Dj1MKG0am8UlWGbDtD` }
      }

      axios.get(`https://api.eazy.im/v3/channels/7dd751fa-1ed7-4382-9ce0-0e0baf01d9c7@apple.eazy.im/contacts/${fromJid}`,config).then(async (response)=>{
        console.log('res -> ',response.data)
        if(response.status === 200) {
          let data = response.data;
          console.log('data -> ',data);
          let fullname = data.name.fullName;
          let email = data.email;
          let phone = data.phone;

          let user = {
            jid: fromJid,
            fullname,
            email,
            phone
          }

          let message = body.message;

          if(user.fullname === null) {
            user.fullname = await NameGenerator.getRandomName();
          }

          console.log('user -. ',user)

          functions.getAllTeam(user,message);
          functions.createNewTeam2(user,message)
          // functions.createNewTeam(user,message)
          
        } 
      }).catch((err)=>{
        console.log('err -> ',err.message);
        res.json({
          status:false,
          error:err
        })
      })
      
    }

    let data = {
      conversation: body?.contextInfo?.conversation,
      body: body,
      query: query,
      params: params
    };
    console.log('new message catched -> ',data)
    res.json({
      status: 'A New Message Received!',
      data: data
    })
  } catch (err) {
    console.log('err ->',err)
    res.json({
      status:false,
      error:err
    })
  }
})



// app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
