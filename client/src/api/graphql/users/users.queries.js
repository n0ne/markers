import gql from 'graphql-tag'

export const ME_QUERY = gql`
	query User {
		me {
			_id
			email
			name
			picture
		}
	}
`
