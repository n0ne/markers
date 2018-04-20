import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

import { capitalize } from 'lodash'

import reactCSS from 'reactcss'

import BoxHeader from '../../dumb/Box.Header/BoxHeader'
import BoxContainer from '../../dumb/Box.Container/BoxContainer'

class Extra extends Component {
	render() {
		let showInfo = ''
		const styles = reactCSS({
			default: {
				mainDiv: {
					position: 'absolute',
					zIndex: '2',
					width: '28%',
					minHeight: '500px',
					top: '25px',
					right: '25px',
				},
			},
		})
		const links = ['schools', 'gas', 'pharmacies', 'restaurants']

		const loc = this.props.location.pathname.split('/')
		if (loc.length === 2) {
			loc[2] = 'schools'
		}

		if (localStorage.getItem('regionID') === -1) {
			showInfo = (
				<Row>
					<Col xs={12}>No data for your region</Col>
				</Row>
			)
		} else {
			showInfo = (
				<Fragment>
					<Row>
						<Col xs={12}>
							<p>Some additional information about your region.</p>
						</Col>
						<Col xs={12}>
							<p>Please, select category:</p>
						</Col>
					</Row>
					<ul>
						{links.map((link, index) => {
							return (
								<li key={`${link}-${index}`}>
									{link === loc[2] ? capitalize(link) : <Link to={`/extra/${link}`}>{capitalize(link)}</Link>}
								</li>
							)
						})}
					</ul>
				</Fragment>
			)
		}

		return (
			<div
				style={styles.mainDiv}
				ref={div => {
					this.myDiv = div
				}}
			>
				<BoxHeader title="Extra Information Markers" />
				<BoxContainer>{showInfo}</BoxContainer>
			</div>
		)
	}
}

Extra.propTypes = {
	location: PropTypes.object.isRequired,
}
export default Extra
