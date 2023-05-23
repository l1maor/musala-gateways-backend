const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const setupRoutes = require('./routes')

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(cors())
app.use(morgan('combined'))

app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({
    message: 'Healthy!',
  })
})

setupRoutes(app)

module.exports = app
