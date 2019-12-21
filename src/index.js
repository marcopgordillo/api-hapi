const path = require('path')
const { escapeHtml } = require('@hapi/hoek')
const Boom = require('@hapi/boom')
const HttpStatus = require('http-status-codes')
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

// Listen events of server
init.eventListeners(server, mongoC)

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
  },
  {
    method: 'GET',
    path: '/collections/{collectionName}/{id}',
    handler: async (req, h) => {
      const result = await mongoC.findOne(escapeHtml(req.params.collectionName), escapeHtml(req.params.id))
      if (result) {
        return h.response(result.data).code(result.code)  
      }
      throw Boom.notFound(`Not Found ${req.params.id}`)
    }
  },
  {
    method: 'PUT',
    path: '/collections/{collectionName}/{id}',
    handler: async (req, h) => {
      const result = await mongoC.updateOne(
        escapeHtml(req.params.collectionName),
        escapeHtml(req.params.id),
        req.payload)
      
      if (result.result.n === 1) {
        if (result.result.nModified === 1)
          return h.response(Mongo.statusResponse("doc updated successfully", HttpStatus.OK))

        return Boom.badRequest("doc not updated")
      }
      throw Boom.notFound(`Not Found ${req.params.id}`)
    }
  },
  {
    method: 'DELETE',
    path: '/collections/{collectionName}/{id}',
    handler: async (req, h) => {
      const result = await mongoC.deleteById(escapeHtml(req.params.collectionName), escapeHtml(req.params.id))
      if (result.result.n === 1)
          return h.response(Mongo.statusResponse("doc deleted successfully", HttpStatus.OK))

      throw Boom.notFound(`Not Found ${req.params.id}`)
    }
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (req, h) => {
      throw Boom.notFound('Page Not Found!')
    }
  }
])

if (require.main === module) {
  console.info('Running app as a standalone')
  init.boot(server)
} else {
  console.info('Running app as a module')
  module.exports = {
    server, PORT
  }
}