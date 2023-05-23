require('./config/env')
const mongoose = require('mongoose')
const seedDatabase = require('./scripts/seeddb')
const { port } = require('./config/env')

const app = require('./app')

const initMongo = require('./config/mongodb')

initMongo()
  .then(() => {
    const server = app.listen(port, async () => {
      console.log(`App listening at http://localhost:${port}`)
      if (process.argv.includes('--seeddb')) {
        await seedDatabase()
        mongoose.connection.close()
        server.close()
      }
    })
  })
  .catch((err) => {
    console.error('Error connecting to mongo\n', err)
  })
