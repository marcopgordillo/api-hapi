const path = require('path')
const Hapi = require('@hapi/hapi')

const router = require(path.join(__dirname, './router'))

const {
  DATABASE_URL,
  DATABASE_NAME,
  PORT
} = require(path.join(__dirname, '../constants'))

const create = () => Hapi.server(
  {
    port: PORT,
    host: 'localhost'
  }
)

const boot = async (server) => {
  try {
    const dbOps = {
      url: `${DATABASE_URL}/${DATABASE_NAME}`,
      settings: {
        poolSize: 10,
        useUnifiedTopology: true,
        useNewUrlParser: true
      },
      decorate: true
    }
    await server.register(
      {
        plugin: require('hapi-mongodb'),
        options: dbOps
      }
    )

    // Listen events of server
    eventListeners(server)

    // Declare routes
    server.route(router())

    await server.start()
    console.log('Server running on %s', server.info.uri)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const shutdown = (server) => {
  console.log('stopping hapi server')

  server.stop({ timeout: 10000 }).then((err) => {
    console.log('hapi server stopped')
    process.exit((err) ? 1 : 0)
  })
}

const eventListeners = (server) => {
  process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
  })

  process.on('SIGINT', () => {
    shutdown(server)
  })
}

module.exports = {
  create, boot, shutdown, eventListeners
}
