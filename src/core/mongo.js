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

  async findOne(collection, id) {
    const result = await this.connect(async (db, callback) => {
      // Get the documents collection
      const _collection = db.collection(collection)
      // Find one document
      try {
        const data = await _collection.findOne({ _id: Mongo.id(id) })
        
        return data ? { data, code: 200 } : { data: Mongo.notFound(id), code: 404 }
      } catch(err) {
        console.error(err)
      } finally {
        callback()
      }
    })
    return result
  }

  async updateOne(collection, id, payload) {
    const result = await this.connect(async (db, callback) => {
      // Get the documents collection
      const _collection = db.collection(collection)
      // Find one document
      try {
        const result = await _collection.updateOne(
          { _id: Mongo.id(id) },
          { $set: payload },
          { safe: true, multi: false })

        return result
      } catch(err) {
        console.error(err)
      } finally {
        callback()
      }
    })
    return result
  }

  async deleteById(collection, id) {
    const result = await this.connect(async (db, callback) => {
      // Get the documents collection
      const _collection = db.collection(collection)
      // Find one document
      try {
        const result = await _collection.deleteOne({ _id: Mongo.id(id) })
        return result
      } catch(err) {
        console.error(err)
      } finally {
        callback()
      }
    })
    return result
  }

  close() { this.client.close() }

  static notFound(id) {
    return `{"error": "Not Found ${id}"}`
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
