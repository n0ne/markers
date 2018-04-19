import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

// import { pure, compose } from 'recompose'
import UserLoggedIn from '../User.LoggedIn/UserLoggedIn'

class UserManagement extends Component {
	handleLogin = e => {
		e.preventDefault()

		this.props.login()
	}

	render() {
		const { user, logout } = this.props
		if (user) {
			return <UserLoggedIn user={user} logout={logout} />
		} else {
			return (
				<li>
					<Link to="/" onClick={this.handleLogin}>
						Login
					</Link>
				</li>
			)
		}
	}
}
//
UserManagement.propTypes = {
	user: PropTypes.object,
	login: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
}

export default UserManagement
