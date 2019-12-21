const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

class Mongo {
  constructor(url, dbName) {
    this.client = new MongoClient(url, {useUnifiedTopology: true, useNewUrlParser: true})
    this.dbName = dbName
  }

  async connect(callback) {
    try {
      this.client = await this.client.connect()
      const db = this.client.db(dbName)

      const result = await callback(db, () => {
        this.client.close()
      })

      console.log(result)

      return result
    } catch(err) {
      console.error(err)
    }
  }

  async findDocuments() {
    const result = await this.connect(async (db, callback) => {
        // Get the documents collection
      const collection = db.collection('documents');
      // Find some documents
      try {
        const result = await collection.find({}).toArray()
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
}

// Create a new MongoClient
//let client = new MongoClient(url, {useUnifiedTopology: true, useNewUrlParser: true});

const connect = async (dbName, callback) => {
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

const findDocuments = async (db, callback) => {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  try {
    const result = await collection.find({}).toArray()
    // console.log(result)
    return result
  } catch(err) {
    console.error(err)
  } finally {
    callback()
  }
}

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

//connect(dbName, findDocuments)
const mongo = new Mongo(url, dbName)
mongo.findDocuments()
