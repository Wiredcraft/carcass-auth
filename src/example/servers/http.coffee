debug = require('debug')('carcass:server:http')

lib = require('../')
http = require('http')
express = require('express')
bodyParser = require('body-parser')

###*
 * HTTP server.
 *
 * Just an example.
###
module.exports = server = lib.getConsumer('Server', 'http')

###*
 * Start.
###
server.start = (program, done) ->
    config = @config()
    process = program.process()
    # Port.
    port = config?.port ? 3000
    # HTTP server.
    server = http.createServer(@app())
    # Listen.
    debug('starting http server on %s.', port)
    server.on('listening', ->
        # Send a message to parent process.
        process?.send?({
            listening: true
        })
        done()
    )
    server.listen(port)

###*
 * Helper.
###
server.app = ->
    app = express()
    config = @config()
    manager = @configManager()

    # Basics.
    app.use(bodyParser())

    # Just an example.
    app.use(lib.applications.session(manager.get('session')))

    return app
