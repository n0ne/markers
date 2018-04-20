import express from 'express'

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { makeExecutableSchema } from 'graphql-tools'

import mongoose from 'mongoose'

import typeDefs from './src/schema'
import resolvers from './src/resolvers'

import { Marker, User } from './src/connectors'

import { context } from './src/middleware'

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
})

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
