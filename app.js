const express = require('express')
const app = express()
const path = require("path");
const port = 3000



var mydir = path.resolve(__dirname) + '/public'

app.use('/favicon.ico', express.static('favicon.ico'));

app.use(express.static(mydir));

app.get('/', (req, res) => res.sendFile(path.join(mydir, 'index.html')))

// Left as an example
// app.get('/users', (req, res) => res.sendFile(path.join(mydir, 'users.html')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))