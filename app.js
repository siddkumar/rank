const express = require('express')
const app = express()
const path = require("path");
const port = 3000



var mydir = path.resolve(__dirname)

app.get('/', (req, res) => res.sendFile(path.join(mydir, 'index.html')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))