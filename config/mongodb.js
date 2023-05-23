const mongoose = require('mongoose')
const env = require('./env')
// const { mongodb } = require('../configurations/config')

// eslint-disable-next-line func-names
module.exports = async function (dbName) {
  try {
    await mongoose.connect(env.mongodbUri, {
      dbName: dbName || env.mongodbDb,
    })
    console.log('MongoDB connection established')
  } catch (err) {
    console.log('MongoDB connection error', JSON.stringify(err, null, 2))
    process.exit(1)
  }

  return mongoose.connection
}
