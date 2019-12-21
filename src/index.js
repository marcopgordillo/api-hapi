const path = require('path')
const { escapeHtml } = require('@hapi/hoek')
const { init, Mongo, util } = require(path.join(__dirname, './core'))

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

// Declare routes
server.route([
  {
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.response('{"message": "Select a collection, e.g., /collections/messages"}').code(200)
    }
  },
  {
    method: 'GET',
    path: '/collections/{collectionName}',
    handler: async (req, h) => {
      
      const result = await mongoC.list(escapeHtml(req.params.collectionName))

      return h.response(result).code(200)
      //return h.response('{"message": "Get collections"}').code(200)
    }
  },
  {
    method: 'POST',
    path: '/collections/{collectionName}',
    handler: async (req, h) => {
      const result = await mongoC.insert(escapeHtml(req.params.collectionName), req.payload)

      return h.response(result).code(201)
    }
  }
])



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