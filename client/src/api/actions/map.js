import {
	MAP_BOUNDS_WAS_CHANGED_CONSTANT,
	ADD_MARKER_CONSTANT,
	REMOVE_ALL_MARKERS_CONSTANT,
	CHANGE_MARKERS_VISABILITY_CONSTANT,
} from '../constants/map'

export function setBounds(data) {
	return {
		type: MAP_BOUNDS_WAS_CHANGED_CONSTANT,
		payload: data,
	}
}

export function addMarker(marker) {
	return {
		type: ADD_MARKER_CONSTANT,
		payload: marker,
	}
}

export function clearMarkers() {
	return {
		type: REMOVE_ALL_MARKERS_CONSTANT,
	}
}

export function changeVisability() {
	return {
		type: CHANGE_MARKERS_VISABILITY_CONSTANT,
	}
}
