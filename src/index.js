const path = require('path')

const { init, Mongo, util, router } = require(path.join(__dirname, './core'))

const {
  DATABASE_URL,
  DATABASE_NAME,
  PORT,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET
} = require(path.join(__dirname, './constants'))

// Connect to mongo DB
const mongoC = new Mongo(DATABASE_URL, DATABASE_NAME)

// Initialize server
const server = init.create(PORT)

// Listen events of server
init.eventListeners(server, mongoC)

// Declare routes
server.route(router(mongoC))

if (require.main === module) {
  console.info('Running app as a standalone')
  init.boot(server)
} else {
  console.info('Running app as a module')
  module.exports = {
    server, PORT
  }
}