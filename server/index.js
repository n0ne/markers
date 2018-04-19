import express from 'express'

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
// import { ApolloEngine } from 'apollo-engine'
import bodyParser from 'body-parser'
import cors from 'cors'

import { makeExecutableSchema } from 'graphql-tools'

import mongoose from 'mongoose'

// import { schema } from '../schema/buildSchema'
// import { context } from '../middleware/context'

import typeDefs from './src/schema'
import resolvers from './src/resolvers'

import { Marker, User } from './src/connectors'

import { context } from './src/middleware'

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
})

// mongoose.connect('mongodb://localhost/test')

// const Cat = mongoose.model('Cat', { name: String })

const PORT = 3022

const server = express()

server.use(
	'/graphql',
	cors(),
	bodyParser.json(),
	graphqlExpress(async request => {
		const user = await context(request.headers)

		return {
			schema,
			context: {
				...user,
				// Cat,
				Marker,
				User,
			},
		}
	})
)

server.use(
	'/graphiql',
	graphiqlExpress({
		endpointURL: '/graphql',
	})
)

server.listen(PORT, () => {
	console.log(`GraphQL Server is now runninig on http://localhost:${PORT}/graphql`)
	console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`)
})
