'use strict'

const Boom = require('@hapi/boom')
const { escapeHtml } = require('@hapi/hoek')

const list = (req) => {
  const db = req.mongo.db
  const collectionName = escapeHtml(req.params.collectionName)
  try {
    return db.collection(collectionName)
      .find({}).toArray()
  } catch (err) {
    console.error(err)
    throw Boom.internal()
  }
}

const insert = (req) => {
  const db = req.mongo.db
  const doc = req.payload
  const collectionName = escapeHtml(req.params.collectionName)
  try {
    return db.collection(collectionName)
      .insertOne(doc, {})
  } catch (err) {
    console.error(err)
    throw Boom.internal()
  }
}

const findOne = (req) => {
  const db = req.mongo.db
  const ObjectID = req.mongo.ObjectID
  const id = escapeHtml(req.params.id)
  const collectionName = escapeHtml(req.params.collectionName)
  try {
    return db.collection(collectionName)
      .findOne({ _id: new ObjectID(id) })
  } catch (err) {
    console.error(err)
    throw Boom.internal()
  }
}

const updateOne = (req) => {
  const db = req.mongo.db
  const ObjectID = req.mongo.ObjectID
  const id = escapeHtml(req.params.id)
  const collectionName = escapeHtml(req.params.collectionName)
  try {
    return db.collection(collectionName)
      .updateOne(
        { _id: new ObjectID(id) },
        { $set: req.payload },
        { safe: true, multi: false })
  } catch (err) {
    console.error(err)
    throw Boom.internal()
  }
}

const deleteById = (req) => {
  const db = req.mongo.db
  const ObjectID = req.mongo.ObjectID
  const id = escapeHtml(req.params.id)
  const collectionName = escapeHtml(req.params.collectionName)
  try {
    return db.collection(collectionName)
      .deleteOne({ _id: new ObjectID(id) })
  } catch (err) {
    console.error(err)
    throw Boom.internal()
  }
}

module.exports = {
  list, insert, findOne, updateOne, deleteById
}
