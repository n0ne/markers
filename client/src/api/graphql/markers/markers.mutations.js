import gql from 'graphql-tag'

export const CREATE_MARKER_MUTATION = gql`
	mutation createMarker($lat: Float!, $lng: Float!) {
		createMarker(lat: $lat, lng: $lng) {
			_id
			location {
				type
				coordinates
			}
		}
	}
`

export const ADD_MARKERS_MUTATION = gql`
	mutation addMarkers($lats: [Float]!, $lngs: [Float]!) {
		addMarkers(lats: $lats, lngs: $lngs) {
			_id
			location {
				type
				coordinates
			}
		}
	}
`
