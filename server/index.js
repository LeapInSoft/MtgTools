const express = require('express')
const app = express()
const port = 3669
const path = require('path')
const options = { root: path.join(__dirname, 'public') }

app.get('/', (req, res) => res.sendFile('index.html', options))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))