const path = require('path')

const { init, util } = require(path.join(__dirname, './core'))

const {
  DATABASE_URL,
  DATABASE_NAME,
  PORT,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET
} = require(path.join(__dirname, './constants'))

// Initialize server
const server = init.create()

if (require.main === module) {
  console.info('Running app as a standalone')
  init.boot(server)
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
} else {
  console.info('Running app as a module')
  /*module.exports = {
    server
  }*/
}
