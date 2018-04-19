import React from 'react'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

// import createHistory from 'history/createBrowserHistory'

import rootReducer from '../reducers/rootReducer'

// export const history = createHistory()

const enhancer = compose(applyMiddleware(thunk, logger))

export default function configureStore() {
	const store = createStore(rootReducer, enhancer)

	return store
}
