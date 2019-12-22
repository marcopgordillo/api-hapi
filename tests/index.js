const path = require('path')
const superagent = require('superagent')
const expect = require('expect.js')
const { before, after, describe, it } = require('mocha')

const { init } = require(path.join(__dirname, '../src/core'))
const { PORT } = require(path.join(__dirname, '../src/constants'))

let server

before(async () => {
  server = init.create()
  await init.boot(server).catch((err) => {
    console.error(err)
    process.exit(1)
  })
})

describe('express rest api server', () => {
  let id

  it('post object', (done) => {
    superagent.post(`http://localhost:${PORT}/collections/test`)
      .send({ name: 'John', email: 'john@rpjs.co' })
      .end((e, res) => {
        expect(e).to.eql(null)
        expect(res.body.ops.length).to.eql(1)
        expect(res.body.ops[0]._id.length).to.eql(24)
        id = res.body.ops[0]._id
        done()
      })
  })

  it('retrieves an object', (done) => {
    superagent.get(`http://localhost:${PORT}/collections/test/${id}`)
      .end((e, res) => {
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)
        expect(res.body._id).to.eql(id)
        done()
      })
  })

  it('retrieves a collection', (done) => {
    superagent.get(`http://localhost:${PORT}/collections/test`)
      .end((e, res) => {
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body.map(function (item) { return item._id })).to.contain(id)
        done()
      })
  })

  it('updates an object', (done) => {
    superagent.put(`http://localhost:${PORT}/collections/test/${id}`)
      .send({ name: 'Peter', email: 'peter@yahoo.com' })
      .end((e, res) => {
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.message).to.eql('doc updated successfully')
        done()
      })
  })

  it('checks an updated object', (done) => {
    superagent.get(`http://localhost:${PORT}/collections/test/${id}`)
      .end((e, res) => {
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)
        expect(res.body._id).to.eql(id)
        expect(res.body.name).to.eql('Peter')
        done()
      })
  })

  it('removes an object', (done) => {
    superagent.del(`http://localhost:${PORT}/collections/test/${id}`)
      .end((e, res) => {
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.message).to.eql('doc deleted successfully')
        done()
      })
  })
})

after(() => {
  init.shutdown(server)
})
