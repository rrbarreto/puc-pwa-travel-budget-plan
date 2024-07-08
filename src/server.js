const express = require('express')
const path = require('path')

const httpPort = 3000

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

const app = express()

app.use(express.static(path.join(__dirname, '/public')))

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})
 
// app.post('/', function(req,res) {
//   //console.log(req.body);
//   res.redirect("/")
// })

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`)
})