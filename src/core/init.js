const Hapi = require('@hapi/hapi')

const create = (port) => Hapi.server(
  {
    port: port,
    host: 'localhost'
  }
)

const boot = async (server) => {
  try {
    await server.start()
    console.log('Server running on %s', server.info.uri);
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

module.exports = {
  create, boot, shutdown
}