import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { NavDropdown, MenuItem, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import UserAvatar from '../../dumb/User.Avatar/UserAvatar'
import FaCogs from 'react-icons/lib/fa/cogs'
import FaSignOut from 'react-icons/lib/fa/sign-out'

class UserLoggedIn extends Component {
	handleLogout = e => {
		e.preventDefault()

		this.props.logout()
	}

	render() {
		const { user } = this.props
		return (
			<Fragment>
				<NavItem eventKey={3} href="#" className="userAvatarLi">
					<UserAvatar user={user} />
				</NavItem>
				<NavDropdown eventKey="8" title={user.name} id="nav-dropdown">
					<LinkContainer to={{ pathname: '/profile' }}>
						<MenuItem eventKey="8.1">
							Profile
							<FaCogs className="pull-right" />
						</MenuItem>
					</LinkContainer>

					<MenuItem divider />

					<LinkContainer to={{ pathname: '/#' }} onClick={this.handleLogout}>
						<MenuItem eventKey="8.5">
							Logout
							<FaSignOut className="pull-right" />
						</MenuItem>
					</LinkContainer>
				</NavDropdown>
			</Fragment>
		)
	}
}
//
UserLoggedIn.propTypes = {
	user: PropTypes.object,
	logout: PropTypes.func.isRequired,
}

export default UserLoggedIn
