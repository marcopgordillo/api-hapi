const path = require('path')

const { init } = require(path.join(__dirname, './core'))

const {
  DATABASE_URL,
  DATABASE_NAME,
  PORT,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET
} = require(path.join(__dirname, './constants'))

// Initialize server
const server = init.create(PORT)



process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

process.on('SIGINT', () => {  
  init.shutdown(server)
})

if (require.main === module) {
  console.info('Running app as a standalone')
  init.boot(server)
} else {
  console.info('Running app as a module')
  module.exports = {
    server, PORT
  }
}