import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { pure, compose } from 'recompose'
import { Link, withRouter } from 'react-router-dom'
import { capitalize } from 'lodash'

class HeaderLink extends Component {
	render() {
		// let url = ''
		// let title = ''
		let background = '#f8f8f8'

		const { section, location, to } = this.props

		const loc = location.pathname.split('/')

		if (loc[1] === '' && section === 'markers') {
			background = '#d7d7d7'
		}
		if (loc[1] === section) {
			background = '#d7d7d7'
		}
		return (
			<li role="presentation" style={{ color: '#888', background }}>
				<Link to={`${to}`} role="button">
					{capitalize(section)}
				</Link>
			</li>
		)
	}
}
//
HeaderLink.propTypes = {
	section: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
}

export default compose(withRouter, pure)(HeaderLink)
