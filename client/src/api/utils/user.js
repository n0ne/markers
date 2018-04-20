import moment from 'moment'

export function isLogged() {
	if (localStorage.getItem('idToken')) {
		if (
			localStorage.getItem('expiresAt') &&
			moment(new Date().setTime(localStorage.getItem('expiresAt'))).isBefore(new Date())
		) {
			// console.log('Expired')

			localStorage.removeItem('expiresAt')
			localStorage.removeItem('accessToken')
			localStorage.removeItem('idToken')
			// localStorage.removeItem('profile')

			// apolloClient.resetStore()

			return false
		} else {
			return true
		}
	} else {
		// apolloClient.resetStore()
		return false
	}
}
