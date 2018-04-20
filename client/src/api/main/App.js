import React from 'react'

import moment from 'moment'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'

import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import MainContainer from '../containers/MainContainer/MainContainer'
import configureStore from '../store/configureStore'

const history = createHistory()
export const store = configureStore()

const httpLink = new HttpLink({ uri: 'http://localhost:3022/graphql' })

const middlewareLink = new ApolloLink((operation, forward) => {
	let token = null

	if (
		localStorage.getItem('expiresAt') &&
		moment(new Date().setTime(localStorage.getItem('expiresAt'))).isBefore(new Date())
	) {
		localStorage.removeItem('expiresAt')
		localStorage.removeItem('accessToken')
		localStorage.removeItem('idToken')
		localStorage.removeItem('profile')
	} else {
		token = localStorage.getItem('idToken')
	}

	const authorizationHeader = token ? `Bearer ${token}` : null
	operation.setContext({
		headers: {
			authorization: authorizationHeader,
		},
	})
	return forward(operation)
})

const cache = new InMemoryCache()

const link = ApolloLink.from([middlewareLink, httpLink])

const client = new ApolloClient({
	link,
	cache,
})

const App = () => (
	<ApolloProvider client={client}>
		<Provider store={store}>
			<Router history={history}>
				<MainContainer />
			</Router>
		</Provider>
	</ApolloProvider>
)

export default App
