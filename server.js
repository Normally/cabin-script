const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 8000

app.engine('html', function (filePath, options, callback) {
	fs.readFile(filePath, function (err, content) {
		if (err) return callback(err)
		// this is an extremely simple template engine
		var rendered = content
			.toString()
			.replace(/{title}/g, options.title)
			.replace(/{linkTo}/g, options.linkTo)
		return callback(null, rendered)
	})
})
app.set('views', './views')
app.set('view engine', 'html')

app.get('/', function (req, res) {
	res.render('tests', { title: '/', linkTo: 'about' })
})
app.get('/about', function (req, res) {
	res.render('tests', { title: 'about', linkTo: '/' })
})
app.get('/hello.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/hello.js'))
})

app.listen(port, () => {
	console.log(`Test available at http://localhost:${port}`)
	console.log(`Client script available at http://localhost:${port}/hello.js`)
})
