import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

import { capitalize } from 'lodash'

import reactCSS from 'reactcss'

import BoxHeader from '../../dumb/Box.Header/BoxHeader'
import BoxContainer from '../../dumb/Box.Container/BoxContainer'

class Extra extends Component {
	constructor(props) {
		super(props)
	}

	render() {
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

		// console.log(this.props)

		const loc = this.props.location.pathname.split('/')
		if (loc.length === 2) {
			loc[2] = 'schools'
		}

		return (
			<div
				style={styles.mainDiv}
				ref={div => {
					this.myDiv = div
				}}
			>
				<BoxHeader title="Extra Markers" />
				<BoxContainer>
					{links.map(link => {
						return (
							<Row>
								<Col xs={12}>
									{link === loc[2] ? capitalize(link) : <Link to={`/extra/${link}`}>{capitalize(link)}</Link>}
								</Col>
							</Row>
						)
					})}
				</BoxContainer>
			</div>
		)
	}
}

Extra.propTypes = {}

const mapStateToProps = state => {
	const {
		locale: { lang },
	} = state
	return {
		currentLocale: lang,
	}
}

// export default compose(withRouter, connect(mapStateToProps, null))(Extra)
export default Extra
