import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import reactCSS from 'reactcss'

import BoxHeader from '../../dumb/Box.Header/BoxHeader'
import BoxContainer from '../../dumb/Box.Container/BoxContainer'

class MarkersIndex extends Component {
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

		return (
			<div
				style={styles.mainDiv}
				ref={div => {
					this.myDiv = div
				}}
			>
				<BoxHeader title="Markers" />
				<BoxContainer>
					<div>Test Marker Index</div>
					<div>Test Marker Index</div>
					<div>Test Marker Index</div>
					<div>Test Marker Index</div>
					<div>Test Marker Index</div>
				</BoxContainer>
			</div>
		)
	}
}

MarkersIndex.propTypes = {}

const mapStateToProps = state => {
	const {
		locale: { lang },
	} = state
	return {
		currentLocale: lang,
	}
}

// export default compose(withRouter, connect(mapStateToProps, null))(MarkersIndex)
export default MarkersIndex
