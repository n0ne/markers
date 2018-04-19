import React from 'react'

import { Navbar, Nav } from 'react-bootstrap'
// import { Link } from 'react-router-dom'

import HeaderLink from '../../components/Header.Link/HeaderLink'
import UserManagement from '../../components/User.Management/UserManagement'

import './NavigationBar.css'

const NavigationBar = ({ user, login, logout }) => {
	return (
		<Navbar collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>
					<a>Curriculum Vitae</a>
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

export default NavigationBar
