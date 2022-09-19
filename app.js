
const express = require('express');

const app = express();

const port = 5000;


app.post('/', (req,res) => {
    res.send('running!')
})

// Catch Eazy.im Message event
app.post('/catch-message', (req,res) => {
    console.log('/catch-message api ran !')
})


app.listen(port,() => {
    console.log(`Server running on http://localhost:${port}`);
})

