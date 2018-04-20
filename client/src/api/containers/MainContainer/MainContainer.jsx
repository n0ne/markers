import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Auth0Lock from 'auth0-lock'
import moment from 'moment'

import { graphql, withApollo } from 'react-apollo'
import { compose } from 'recompose'

import NavigationBar from '../../../ui/dumb/Navigation.Bar/NavigationBar.jsx'
import MapContainer from '../MapContainer/MapContainer'

import { ME_QUERY } from '../../graphql/users/users.queries'
import { UPSERT_USER_MUTATION } from '../../graphql/users/users.mutations'

let options = {
	allowedConnections: ['google-oauth2'],
	auth: {
		redirect: false,
		sso: false,
		responseType: 'token id_token',
		params: {
			scope: 'openid profile email',
			audience: 'https://none.eu.auth0.com/userinfo',
		},
	},
	loginAfterSignup: false,
	primaryColor: '#31324F',
	languageDictionary: {
		title: 'Markers App',
	},
	theme: {
		logo: '/logo.png',
	},
}

class MainContainer extends Component {
	constructor(props) {
		super(props)

		this.lock = null
	}

	componentDidMount() {
		if (moment(new Date().setTime(localStorage.getItem('expiresAt'))).isBefore(new Date())) {
			localStorage.removeItem('expiresAt')
			localStorage.removeItem('accessToken')
			localStorage.removeItem('idToken')
		}

		this.lock = new Auth0Lock('q7ghJIRemSuGPRIlVOz26JZBTU6HhrBs', 'none.eu.auth0.com', {
			...options,
			language: 'en',
		})

		this.lock.on('authenticated', authResult => {
			this.lock.getUserInfo(authResult.accessToken, async (error, profile) => {
				if (error) {
					console.log(error)
					return
				}

				let expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())

				localStorage.setItem('expiresAt', expiresAt)
				localStorage.setItem('accessToken', authResult.accessToken)
				localStorage.setItem('idToken', authResult.idToken)

				this.props
					.mutate()
					.then(({ data }) => {
						this.props.data.refetch()
					})
					.catch(error => {
						console.log('there was an error sending the query', error)
					})
			})

			this.lock.hide()
		})
	}

	componentWillUnmount() {
		if (this.lock) {
			this.lock.removeAllListeners()
		}
	}

	handleLogin = () => {
		if (this.lock) {
			this.lock.show()
		}
	}

	handleLogout = () => {
		localStorage.removeItem('expiresAt')
		localStorage.removeItem('accessToken')
		localStorage.removeItem('idToken')

		this.props.client.resetStore()
	}

	render() {
		return (
			<Fragment>
				<NavigationBar user={this.props.data.me} login={this.handleLogin} logout={this.handleLogout} />
				<MapContainer />
			</Fragment>
		)
	}
}

MainContainer.propTypes = {
	data: PropTypes.object.isRequired,
	mutate: PropTypes.func.isRequired,
	client: PropTypes.object.isRequired,
}

const meQuery = graphql(ME_QUERY)
const upsertUserMutation = graphql(UPSERT_USER_MUTATION)

export default compose(withApollo, meQuery, upsertUserMutation)(MainContainer)
