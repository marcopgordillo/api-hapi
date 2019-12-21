const path = require('path')
const { escapeHtml } = require('@hapi/hoek')
const Boom = require('@hapi/boom')
const HttpStatus = require('http-status-codes')

module.exports = (mongoC) => [
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
]