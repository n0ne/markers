import gql from 'graphql-tag'

export const MARKERS_QUERY = gql`
	query markersQuery($NELat: Float!, $NELng: Float!, $SWLat: Float!, $SWLng: Float!) {
		markers(NELat: $NELat, NELng: $NELng, SWLat: $SWLat, SWLng: $SWLng) {
			_id
			location {
				type
				coordinates
			}
		}
	}
`

export const MARKERS_EXTRA_QUERY = gql`
	query markersExtraQuery($NELat: Float!, $NELng: Float!, $SWLat: Float!, $SWLng: Float!, $query: String!) {
		markersExtra(NELat: $NELat, NELng: $NELng, SWLat: $SWLat, SWLng: $SWLng, query: $query) {
			_id
			location {
				coordinates
			}
		}
	}
`

// export const MARKERS_QUERY = gql`
// 	query markersQuery($section: String!, $NELat: Int!, $NELng: Int!, $SWLat: Int!, $SWLng: Int!) {
// 		markers(section: $section, NELat: $NELat, NELng: $NELng, SWLat: $SWLat, SWLng: $SWLng) {
// 			_id
// 			location {
// 				type
// 				coordinates
// 			}
// 		}
// 	}
// `
