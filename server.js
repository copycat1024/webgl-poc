const Bundler = require('parcel-bundler')
const express = require('express')

const bundler = new Bundler('./src/*.html')
const app = express()
const port = Number(process.env.PORT || 1234)

app.use(bundler.middleware())

app.get('/', function (req, res) {
  res.redirect('/login.html')
})

app.listen(port, ()=>{
  console.log()
  console.log(`Server is running on port ${port}`)
})
