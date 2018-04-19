import gql from 'graphql-tag'

export const MARKERS_QUERY = gql`
	query markersQuery {
		markers {
			_id
			location {
				type
				coordinates
			}
		}
	}
`

export const MARKERS_EXTRA_QUERY = gql`
	query markersExtraQuery {
		markersExtra {
			_id
			location {
				type
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
