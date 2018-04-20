import React from 'react'
import PropTypes from 'prop-types'

import { Navbar, Nav } from 'react-bootstrap'

import HeaderLink from '../../components/Header.Link/HeaderLink'
import UserManagement from '../../components/User.Management/UserManagement'

import './NavigationBar.css'

const NavigationBar = ({ user, login, logout }) => {
	return (
		<Navbar collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>
					<a>Test Markers App</a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav>
					<HeaderLink section="markers" to="/" />
					<HeaderLink section="extra" to="/extra" />
				</Nav>
				<Nav pullRight>
					<UserManagement user={user} login={login} logout={logout} />
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}

NavigationBar.propTypes = {
	user: PropTypes.object.isRequired,
	login: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
}

export default NavigationBar
