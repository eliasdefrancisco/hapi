const hapi = require('@hapi/hapi')
const path = require('path')
const inert = require('inert')

// Database
require('./database')
const User = require('./models/user')

const init = async () => {
    const server = new hapi.Server({
        port: 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    })

    await server.register(require('@hapi/vision'))
    await server.register(inert)

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates',
        isCached: process.env.NODE_ENV === 'production'
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

    server.route({
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return 'About'
        }
    })

    server.route({
        method: 'GET',
        path: '/hello/{user}',
        handler: (request, h) => {
            return `
                <h1>Hello ${request.params.user}!</h1>
                <p>que ase pare</p>
            `
        }
    })

    server.route({
        method: 'GET',
        path: '/text.txt',
        handler: (request, h) => {
            return h.file('./text.txt')
        }
    })

    server.route({
        method: 'GET',
        path: '/page',
        handler: (request, h) => {
            return h.view('index')
        }
    })

    server.route({
        method: 'GET',
        path: '/namepage',
        handler: (request, h) => {
            return h.view('namepage', {
                name: 'Elaya'
            })
        }
    })

    server.route({
        method: 'GET',
        path: '/products',
        handler: (request, h) => {
            return h.view('products', {
                products: [
                    { name: 'laptop' },
                    { name: 'mouse' },
                    { name: 'keyboard' },
                    { name: 'monitor' },
                ]
            })
        }
    })

    server.route({
        method: 'GET',
        path: '/users',
        handler: async (request, h) => {
            const users = await User.find()
            return h.view('users', { users })
        }
    })

    server.route({
        method: 'POST',
        path: '/users',
        handler: async (request, h) => {
            const newUser = new User({ username: request.payload.username })
            await newUser.save()
            return h.redirect().location('users')
        }
    })

}

init()