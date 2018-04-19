import gql from 'graphql-tag'

export const UPSERT_USER_MUTATION = gql`
	mutation upsertUser {
		upsertUser {
			_id
			email
			name
			picture
		}
	}
`
