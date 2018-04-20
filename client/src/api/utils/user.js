import moment from 'moment'

export function isLogged() {
	if (localStorage.getItem('idToken')) {
		if (
			localStorage.getItem('expiresAt') &&
			moment(new Date().setTime(localStorage.getItem('expiresAt'))).isBefore(new Date())
		) {
			localStorage.removeItem('expiresAt')
			localStorage.removeItem('accessToken')
			localStorage.removeItem('idToken')

			return false
		} else {
			return true
		}
	} else {
		return false
	}
}
