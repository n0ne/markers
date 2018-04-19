import { combineReducers } from 'redux'

import mapReduser from './map'

const rootReducer = combineReducers({
	map: mapReduser,
})

export default rootReducer
