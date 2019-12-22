const path = require('path')
const { escapeHtml } = require('@hapi/hoek')
const Boom = require('@hapi/boom')
const HttpStatus = require('http-status-codes')
const Mongo = require(path.join(__dirname, './mongo'))

module.exports = (mongoC) => [
  {
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.response(Mongo.statusResponse('Select a collection, e.g., /collections/messages', HttpStatus.OK))
    }
  },
  {
    method: 'GET',
    path: '/collections/{collectionName}',
    handler: async (req, h) => {
      const result = await mongoC.list(escapeHtml(req.params.collectionName))
      return h.response(result).code(HttpStatus.OK)
    }
  },
  {
    method: 'POST',
    path: '/collections/{collectionName}',
    handler: async (req, h) => {
      const result = await mongoC.insert(escapeHtml(req.params.collectionName), req.payload)
      return h.response(result).code(HttpStatus.CREATED)
    }
  },
  {
    method: 'GET',
    path: '/collections/{collectionName}/{id}',
    handler: async (req, h) => {
      const result = await mongoC.findOne(escapeHtml(req.params.collectionName), escapeHtml(req.params.id))
      if (result) {
        return h.response(result).code(HttpStatus.OK)
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
        if (result.result.nModified === 1) {
          return h.response(Mongo.statusResponse('doc updated successfully', HttpStatus.OK))
        }
        return Boom.badRequest('doc not updated')
      }
      throw Boom.notFound(`Not Found ${req.params.id}`)
    }
  },
  {
    method: 'DELETE',
    path: '/collections/{collectionName}/{id}',
    handler: async (req, h) => {
      const result = await mongoC.deleteById(escapeHtml(req.params.collectionName), escapeHtml(req.params.id))
      if (result.result.n === 1) {
        return h.response(Mongo.statusResponse('doc deleted successfully', HttpStatus.OK))
      }
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
