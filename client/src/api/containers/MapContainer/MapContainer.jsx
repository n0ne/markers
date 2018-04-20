import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
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
import { setBounds } from '../../actions/map'
import PrivateRoute from '../../routes/PrivateRoute'

const markers = graphql(MARKERS_QUERY, {
	options: ({ NELat, NELng, SWLat, SWLng }) => {
		// console.log(NELng)

		return {
			variables: { NELat, NELng, SWLat, SWLng },
			// pollInterval: 60000,
		}
	},
	skip: ({ location }) => {
		const loc = location.pathname.split('/')

		// console.log(loc)

		// if (loc[1] && loc[1] === 'extra') {
		// 	return true
		// } else {
		// 	return false
		// }
		return loc[1] && loc[1] === 'extra' //? true : false
	},
})

const markersExtra = graphql(MARKERS_EXTRA_QUERY, {
	options: ({ NELat, NELng, SWLat, SWLng, location }) => {
		// console.log(NELng)
		const loc = location.pathname.split('/')
		let query = ''
		if (loc.length !== 2) {
			query = loc[2]
		} else {
			query = 'schools'
		}
		return {
			variables: { NELat, NELng, SWLat, SWLng, query },
			// pollInterval: 60000,
		}
	},
	skip: ({ location }) => {
		const loc = location.pathname.split('/')

		// if (loc[1] && loc[1] === 'extra') {
		// 	return true
		// } else {
		// 	return false
		// }
		return !(loc[1] && loc[1] === 'extra') //? true : false
	},
})

const createMarker = graphql(CREATE_MARKER_MUTATION, {
	props: ({ ownProps, mutate }) => ({
		create: ({ lat, lng }) => {
			// console.log(values)
			// console.log(lat, lng)

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
		// console.log('dblClick()')
		// console.log(latLng.lat(), latLng.lng())
		// console.log(this.props)

		this.props.create({ lat: latLng.lat(), lng: latLng.lng() })
	}

	markerClick = marker => {}

	onIdle = bounds => {
		// console.log('Call onIdle')
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
		const { data, location } = this.props
		let image = 'default'
		const styles = reactCSS({
			default: {
				mapMontainer: {
					width: '100%',
					height: 'calc(100vh - 52px)',
					position: 'relative',
				},
			},
		})
		// console.log(this.props)
		const markers = (data && data.markersExtra) || (data && data.markers)
		const loc = location.pathname.split('/')
		// console.log(loc)
		// console.log(loc.length)

		if (loc.length === 2 && loc[1] === 'extra') {
			image = 'schools'
		} else {
			image = loc[2]
		}
		if (loc.length === 2 && loc[1] === '') {
			image = 'default'
		}

		// console.log(image)

		return (
			<div style={styles.mapMontainer}>
				<Fragment>
					<GMap
						markers={markers}
						dblClick={this.dblClick}
						markerClick={this.markerClick}
						onIdle={this.onIdle}
						pic={image}
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

// const UserWithData = () => (
// 	<Query query={MARKERS_QUERY}>
// 		{({ loading, data: { markers } }) => {
// 			if (loading) return <span>loading....</span>
// 			return <MapContainer me={me} />
// 		}}
// 	</Query>
// )

const mapStateToProps = state => {
	const {
		map: { NELat, NELng, SWLat, SWLng },
	} = state
	return { NELat, NELng, SWLat, SWLng }
}

const mapDispatchToProps = dispatch => {
	return {
		// fetchAddress: (lat, lng, locale) => {
		// dispatch(getAddress(lat, lng, locale))
		// },
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

// export default MapContainer

// <Query query={MARKERS_QUERY}>
// 					{({ loading, data: { markers } }) => {
// 						if (loading) return <span>loading....</span>
// 						return (
// 							<Fragment>
// 								<GMap markers={markers} dblClick={this.dblClick} markerClick={this.markerClick} onIdle={this.onIdle} />
// 								<Switch>
// 									<Route path="/extra" component={Extra} />
// 									<Route path="/" exact strict component={MarkersIndex} />
// 								</Switch>
// 							</Fragment>
// 						)
// 					}}
// 				</Query>
