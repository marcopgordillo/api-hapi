const path = require('path')
const Boom = require('@hapi/boom')
const HttpStatus = require('http-status-codes')
const { list, insert, findOne, updateOne, deleteById } = require(path.join(__dirname, './mongo'))

const statusResponse = (message, statusCode) => ({ statusCode, message })

module.exports = () => [
  {
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.response(statusResponse('Select a collection, e.g., /collections/messages', HttpStatus.OK))
    }
  },
  {
    method: 'GET',
    path: '/collections/{collectionName}',
    handler: async (req, h) => {
      const result = await list(req)
      return h.response(result).code(HttpStatus.OK)
    }
  },
  {
    method: 'POST',
    path: '/collections/{collectionName}',
    handler: async (req, h) => {
      const result = await insert(req)
      return h.response(result).code(HttpStatus.CREATED)
    }
  },
  {
    method: 'GET',
    path: '/collections/{collectionName}/{id}',
    handler: async (req, h) => {
      const result = await findOne(req)
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
      const result = await updateOne(req)
      if (result.result.n === 1) {
        if (result.result.nModified === 1) {
          return h.response(statusResponse('doc updated successfully', HttpStatus.OK))
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
      const result = await deleteById(req)
      if (result.result.n === 1) {
        return h.response(statusResponse('doc deleted successfully', HttpStatus.OK))
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
