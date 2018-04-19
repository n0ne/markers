import { MAP_BOUNDS_WAS_CHANGED_CONSTANT } from '../constants/map'

export function setBounds(data) {
	return {
		type: MAP_BOUNDS_WAS_CHANGED_CONSTANT,
		payload: data,
	}
}
