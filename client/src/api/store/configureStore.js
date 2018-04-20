import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import rootReducer from '../reducers/rootReducer'

const enhancer = compose(applyMiddleware(thunk, logger))

export default function configureStore() {
	const store = createStore(rootReducer, enhancer)

	return store
}
