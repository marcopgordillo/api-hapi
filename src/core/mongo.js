'use strict'

const { MongoClient, ObjectID } = require('mongodb');

class Mongo {
  constructor(url, dbName) {
    this.client = new MongoClient(url, {useUnifiedTopology: true, useNewUrlParser: true})
    this.dbName = dbName
  }

  async connect(callback) {
    try {
      this.client = await this.client.connect()
      const db = this.client.db(this.dbName)

      const result = await callback(db, () => {
        // this.client.close()
      })

      return result
    } catch(err) {
      console.error(err)
    }
  }

  async list(collection) {
    const result = await this.connect(async (db, callback) => {
        // Get the documents collection
      const _collection = db.collection(collection)
      // Find some documents
      try {
        const result = await _collection.find({}).toArray()
        // console.log(result)
        return result
      } catch(err) {
        console.error(err)
      } finally {
        callback()
      }
    })
    return result
  }

  async insert(collection, doc) {
    const result = await this.connect(async (db, callback) => {
        // Get the documents collection
      const _collection = db.collection(collection);
      // Insert a document
      try {
        const result = await _collection.insertOne(doc, {})
        // console.log(result)
        return result
      } catch(err) {
        console.error(err)
      } finally {
        callback()
      }
    })
    return result
  }

  static id (id) { return ObjectID(id) }
}

const db = async (dbName, callback) => {
  try {
    client = await client.connect()
    const db = client.db(dbName)

    const result = await callback(db, () => {
      client.close()
    })

    console.log(result)

    return result
  } catch(err) {
    console.error(err)
  }
}

const id = (id) => ObjectID(id)

const loadCollection = (db, name, callback) => {
  callback(collection(db, name))
}

const collection = async (db, collection) => await db.then(db => db.collection(collection))
                         .catch(err => console.error(err))

const list = (collection, cb, query = {}) => {
  collection
    .find(query, { sort: { _id: -1 } })
    .toArray(cb)
}
/*
const funcAsync = (msg) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(`{"message": "${msg}"}`), 1000)
})

const testCallback = async (msg) => {
  return await funcAsync(msg)
}
*/
module.exports = Mongo
