import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'

import reactCSS from 'reactcss'

import { Row, Col, Button } from 'react-bootstrap'

import BoxHeader from '../../dumb/Box.Header/BoxHeader'
import BoxContainer from '../../dumb/Box.Container/BoxContainer'

import { changeVisability, clearMarkers } from '../../../api/actions/map'

import { ADD_MARKERS_MUTATION } from '../../../api/graphql/markers/markers.mutations'
import { MARKERS_QUERY } from '../../../api/graphql/markers/markers.queries'

const addMarkers = graphql(ADD_MARKERS_MUTATION, {
	props: ({ ownProps, mutate }) => ({
		add: ({ lats, lngs }) => {
			console.log(lats, lngs)

			mutate({
				variables: { lats: lats, lngs: lngs },
				update: (proxy, { data: { addMarkers } }) => {
					const { NELat, NELng, SWLat, SWLng } = ownProps

					const markersFromProxy = proxy.readQuery({
						query: MARKERS_QUERY,
						variables: { NELat, NELng, SWLat, SWLng },
					})

					markersFromProxy.markers = [...markersFromProxy.markers, ...addMarkers]

					proxy.writeQuery({
						query: MARKERS_QUERY,
						variables: { NELat, NELng, SWLat, SWLng },
						data: {
							markers: markersFromProxy.markers,
						},
					})
				},
			})
				.then(() => {
					ownProps.clearMarkers()
				})
				.catch(error => {
					console.log('there was an error in mutation execution: ', error)
				})
		},
	}),
})
class MarkersIndex extends Component {
	toggleMarkers = () => {
		this.props.hide()
	}

	saveMarkers = () => {
		let lats = []
		let lngs = []

		this.props.markers.map(marker => {
			lats = [...lats, marker.location.coordinates[1]]
			lngs = [...lngs, marker.location.coordinates[0]]
			return { lats, lngs }
		})
		console.log(lats)
		console.log(lngs)
		this.props.add({ lats, lngs })
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

		const { markers, show } = this.props

		return (
			<div
				style={styles.mainDiv}
				ref={div => {
					this.myDiv = div
				}}
			>
				<BoxHeader title="User's Markers" />
				<BoxContainer>
					<Row>
						<Col xs={12}>
							<p>Click, please, on the Map, where you want to add Marker.</p>
						</Col>
						<Col xs={12}>
							<p>Markers will not be added automatically into DB, you have to press the button "Save Markers"</p>
						</Col>
						<Col xs={12}>
							<p>Another button 'Hide/Show Markers' only change visibility of user's markers</p>
						</Col>
					</Row>

					<Row>
						<Col xs={6}>
							<Button style={{ width: '100%' }} disabled={markers.length === 0} onClick={this.saveMarkers}>
								Save Markers
							</Button>
						</Col>
						<Col xs={6}>
							<Button style={{ width: '100%' }} onClick={this.toggleMarkers}>
								{show ? 'Hide Markers' : 'Show Markers'}
							</Button>
						</Col>
					</Row>
				</BoxContainer>
			</div>
		)
	}
}

MarkersIndex.propTypes = {
	hide: PropTypes.func.isRequired,
	markers: PropTypes.array.isRequired,
	add: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
}

const mapStateToProps = state => {
	const {
		map: { NELat, NELng, SWLat, SWLng, markers, show },
	} = state
	return { NELat, NELng, SWLat, SWLng, markers, show }
}
const mapDispatchToProps = dispatch => {
	return {
		clearMarkers: () => {
			dispatch(clearMarkers())
		},
		hide: () => {
			dispatch(changeVisability())
		},
	}
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps), addMarkers)(MarkersIndex)
// export default MarkersIndex
