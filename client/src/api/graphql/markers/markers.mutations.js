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
