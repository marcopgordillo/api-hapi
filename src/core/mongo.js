'use strict'

const { MongoClient, ObjectID } = require('mongodb')

class Mongo {
  constructor (url, dbName) {
    this.connDB = Mongo.open(url)
    this.dbName = dbName
  }

  static open (url) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
        if (err) {
          reject(err)
        } else {
          resolve(client)
        }
      })
    })
  }

  list (collection) {
    return this.connDB
      .then((client) => {
        try {
          return client
            .db(this.dbName)
            .collection(collection)
            .find({}).toArray()
        } catch (err) {
          console.error('list error', err)
        }
      })
  }

  insert (collection, doc) {
    return this.connDB
      .then((client) => {
        try {
          return client
            .db(this.dbName)
            .collection(collection)
            .insertOne(doc, {})
        } catch (err) {
          console.error(err)
        }
      })
  }

  findOne (collection, id) {
    return this.connDB
      .then((client) => {
        try {
          return client
            .db(this.dbName)
            .collection(collection)
            .findOne({ _id: ObjectID(id) })
        } catch (err) {
          console.error(err)
        }
      })
  }

  updateOne (collection, id, payload) {
    return this.connDB
      .then((client) => {
        try {
          return client
            .db(this.dbName)
            .collection(collection)
            .updateOne(
              { _id: ObjectID(id) },
              { $set: payload },
              { safe: true, multi: false })
        } catch (err) {
          console.error(err)
        }
      })
  }

  deleteById (collection, id) {
    return this.connDB
      .then((client) => {
        try {
          return client
            .db(this.dbName)
            .collection(collection)
            .deleteOne({ _id: ObjectID(id) })
        } catch (err) {
          console.error(err)
        }
      })
  }

  close () {
    this.connDB
      .then((client) => {
        client.close()
      })
  }

  static id (id) { return ObjectID(id) }

  static statusResponse (message, statusCode) {
    return { statusCode, message }
  }
}

module.exports = Mongo
