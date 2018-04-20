import {
	MAP_BOUNDS_WAS_CHANGED_CONSTANT,
	ADD_MARKER_CONSTANT,
	REMOVE_ALL_MARKERS_CONSTANT,
	CHANGE_MARKERS_VISABILITY_CONSTANT,
} from '../constants/map.js'

const initialState = {
	NELat: 51,
	NELng: 31,
	SWLat: 50,
	SWLng: 30,
	zoom: 8,
	center: { lat: 51.4438, lng: 31.5784 },
	minZoom: 8,
	markers: [],
	show: true,
}
export const mapReducer = (state = initialState, action) => {
	switch (action.type) {
		case MAP_BOUNDS_WAS_CHANGED_CONSTANT:
			return {
				...state,
				NELat: action.payload.NELat,
				NELng: action.payload.NELng,
				SWLat: action.payload.SWLat,
				SWLng: action.payload.SWLng,
			}
		case ADD_MARKER_CONSTANT:
			return {
				...state,
				markers: [...state.markers, action.payload],
			}
		case REMOVE_ALL_MARKERS_CONSTANT:
			return {
				...state,
				markers: [],
			}
		case CHANGE_MARKERS_VISABILITY_CONSTANT:
			return {
				...state,
				show: !state.show,
			}
		default:
			return state
	}
}

export default mapReducer
