const hapi = require('@hapi/hapi')

const init = async () => {
    const server = new hapi.Server({
        port: 3000,
        host: 'localhost'
    })
    await server.start()
    console.log('Server running on: ', server.info.uri)

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return '<h1>Hello world</h1>'
        }
    })
}

init()