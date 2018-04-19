import { MAP_BOUNDS_WAS_CHANGED_CONSTANT } from '../constants/map.js'

const initialState = {
	NELat: 51,
	NELng: 31,
	SWLat: 50,
	SWLng: 30,
	zoom: 8,
	center: { lat: 51.4438, lng: 31.5784 },
	minZoom: 8,
	markers: [],
}
export const mapReducer = (state = initialState, action) => {
	// console.log(action.payload)

	switch (action.type) {
		case MAP_BOUNDS_WAS_CHANGED_CONSTANT:
			return {
				...state,
				NELat: action.payload.NELat,
				NELng: action.payload.NELng,
				SWLat: action.payload.SWLat,
				SWLng: action.payload.SWLng,
			}
			break
		default:
			return state
	}
}

export default mapReducer
