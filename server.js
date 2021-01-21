const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 8000

const render = (filePath, options, callback) => {
	fs.readFile(filePath, function (err, content) {
		if (err) return callback(err)
		// this is an extremely simple template engine
		var rendered = content
			.toString()
			.replace(/{title}/g, options.title)
			.replace(/{linkTo}/g, options.linkTo)
		if (options.host) {
			rendered = rendered.replace(/{{.Host}}/g, options.host)
		}
		return callback(null, rendered)
	})
}
app.engine('html', render)
app.engine('js', render)

app.set('views', './')
app.set('view engine', 'html')

app.get('/', function (req, res) {
	res.render('tests.html', { title: '/', linkTo: 'about' })
})
app.get('/about', function (req, res) {
	res.render('tests.html', { title: 'about', linkTo: '/' })
})
app.get('/hello.js', (req, res) => {
	res.render('hello.js', { host: req.query.host })
})

app.listen(port, () => {
	console.log(`Test available at http://localhost:${port}`)
	console.log(`Client script available at http://localhost:${port}/hello.js`)
})
