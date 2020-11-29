const express = require('express')
const app = express()
var path = require('path')
const port = 8000

app.get('/', (req, res) => {
	res.status(404)
	res.sendFile(path.join(__dirname + '/test/index.html'))
})
app.get('/about', (req, res) => {
	res.sendFile(path.join(__dirname + '/test/about/index.html'))
})
app.get('/hello.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/hello.js'))
})

app.listen(port, () => {
	console.log(`Test available at http://localhost:${port}`)
	console.log(`Client script available at http://localhost:${port}/hello.js`)
})
