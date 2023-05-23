const dotenv = require('dotenv')

dotenv.config()

const vars = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  mongodbDb: process.env.MONGODB_DB || 'gateways',
  port: process.env.PORT || 3000,
}
console.log('🚀 ~ file: env.js:9 ~ vars:', vars)

module.exports = vars
