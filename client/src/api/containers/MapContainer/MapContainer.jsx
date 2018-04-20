import React, { Component, Fragment } from 'react'
import { graphql, withApollo } from 'react-apollo'
import { Switch, Route, withRouter } from 'react-router-dom'
import { compose, pure, defaultProps } from 'recompose'
import { connect } from 'react-redux'

import reactCSS from 'reactcss'

import GMap from '../../../ui/dumb/Google.Map/GoogleMap'
import MarkersIndex from '../../../ui/components/Markers.Index/MarkersIndex'
import Extra from '../../../ui/components/Extra/Extra'
import Profile from '../Profile/Profile'

import { MARKERS_QUERY, MARKERS_EXTRA_QUERY } from '../../graphql/markers/markers.queries'
import { CREATE_MARKER_MUTATION } from '../../graphql/markers/markers.mutations'
import { setBounds, addMarker } from '../../actions/map'
import PrivateRoute from '../../routes/PrivateRoute'

const markers = graphql(MARKERS_QUERY, {
	options: ({ NELat, NELng, SWLat, SWLng }) => {
		return {
			variables: { NELat, NELng, SWLat, SWLng },
		}
	},
	skip: ({ location }) => {
		const loc = location.pathname.split('/')

		return loc[1] && loc[1] === 'extra'
	},
})

const markersExtra = graphql(MARKERS_EXTRA_QUERY, {
	options: ({ NELat, NELng, SWLat, SWLng, location }) => {
		const loc = location.pathname.split('/')
		let query = ''
		if (loc.length !== 2) {
			query = loc[2]
		} else {
			query = 'schools'
		}
		return {
			variables: { NELat, NELng, SWLat, SWLng, query, regionId: localStorage.getItem('regionID') },
		}
	},
	skip: ({ location }) => {
		const loc = location.pathname.split('/')
		if (localStorage.getItem('regionID') === -1) {
			return true
		}
		return !(loc[1] && loc[1] === 'extra')
	},
})

const createMarker = graphql(CREATE_MARKER_MUTATION, {
	props: ({ ownProps, mutate }) => ({
		create: ({ lat, lng }) => {
			mutate({
				variables: { lat: lat, lng: lng },
				update: (proxy, { data: { createMarker } }) => {
					const { NELat, NELng, SWLat, SWLng } = ownProps

					const markersFromProxy = proxy.readQuery({
						query: MARKERS_QUERY,
						variables: { NELat, NELng, SWLat, SWLng },
					})

					markersFromProxy.markers.push(createMarker)

					proxy.writeQuery({
						query: MARKERS_QUERY,
						variables: { NELat, NELng, SWLat, SWLng },
						data: {
							markers: markersFromProxy.markers,
						},
					})
				},
			})
		},
	}),
})

class MapContainer extends Component {
	dblClick = latLng => {
		this.props.create({ lat: latLng.lat(), lng: latLng.lng() })
	}
	snglClick = latLng => {
		const loc = this.props.location.pathname.split('/')

		if (loc.length === 2 && loc[1] === '') {
			const marker = {
				_id:
					Math.random()
						.toString(36)
						.substring(2) + new Date().getTime().toString(36),
				location: {
					type: 'Point',
					coordinates: [latLng.lng(), latLng.lat()],
				},
			}

			this.props.newMarker(marker)
		}
	}

	markerClick = marker => {
		console.log(marker)
	}

	onIdle = bounds => {
		const NELat = bounds.getNorthEast().lat()
		const NELng = bounds.getNorthEast().lng()
		const SWLat = bounds.getSouthWest().lat()
		const SWLng = bounds.getSouthWest().lng()

		this.props.newBounds({
			NELat,
			NELng,
			SWLat,
			SWLng,
		})
	}

	render() {
		let allMarkers = []

		const { data, location, markers, show } = this.props

		let image = ''
		const styles = reactCSS({
			default: {
				mapMontainer: {
					width: '100%',
					height: 'calc(100vh - 52px)',
					position: 'relative',
				},
			},
		})
		const loc = location.pathname.split('/')

		if (!data.loading) {
			if (loc.length === 2 && loc[1] === 'extra') {
				image = 'schools'
			} else {
				image = loc[2]
			}
			allMarkers = data && data.markersExtra
			if ((loc.length === 2 && loc[1] === '') || (loc.length === 2 && loc[1] === 'profile')) {
				image = 'default'
				allMarkers = [...markers, ...data.markers]
			}
		}

		return (
			<div style={styles.mapMontainer}>
				<Fragment>
					<GMap
						markers={allMarkers}
						dblClick={this.dblClick}
						snglClick={this.snglClick}
						markerClick={this.markerClick}
						onIdle={this.onIdle}
						pic={image}
						show={show}
					/>
					<Switch>
						<Route path="/extra" component={Extra} />
						<PrivateRoute path="/profile" component={Profile} />
						<Route path="/" exact strict component={MarkersIndex} />
					</Switch>
				</Fragment>
			</div>
		)
	}
}

const mapStateToProps = state => {
	const {
		map: { NELat, NELng, SWLat, SWLng, markers, show },
	} = state
	return { NELat, NELng, SWLat, SWLng, markers, show }
}

const mapDispatchToProps = dispatch => {
	return {
		newMarker: marker => {
			dispatch(addMarker(marker))
		},
		newBounds: bounds => {
			dispatch(setBounds(bounds))
		},
	}
}

export default compose(
	defaultProps({
		NELat: 52,
		NELng: 39,
		SWLat: 46,
		SWLng: 24,
		markers: [],
	}),
	withApollo,
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
	markers,
	markersExtra,
	createMarker,
	pure
)(MapContainer)
