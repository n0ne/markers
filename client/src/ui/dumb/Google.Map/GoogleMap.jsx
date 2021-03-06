/*global google */

import React from 'react'

import { compose, withProps, lifecycle, defaultProps, withState } from 'recompose'
import { withRouter } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'

import axios from 'axios'
import { default as _ } from 'lodash'

function getUserCoordinates() {
	return axios.get('http://freegeoip.net/json/')
}

function getRegionIDs() {
	return axios.get('https://catalog.api.2gis.ru/2.0/region/list?key=rutnpt3272')
}

const GMap = compose(
	withProps({
		googleMapURL: 'https://maps.googleapis.com/maps/api/js?v=3.31&key=${YOU_NEED_YOUR_KEY_HERE}',
		loadingElement: <div style={{ height: '100%' }}>Loading...</div>,
		containerElement: <div style={{ height: '100%', position: 'relative' }} />,
		mapElement: <div style={{ height: '100%' }} />,
	}),
	defaultProps({
		markers: [],
		center: { lat: 50.4438, lng: 30.5784 },
	}),
	withRouter,
	withScriptjs,
	withGoogleMap,
	withState('zoom', 'onZoomChange', ({ zoom }) => zoom),
	withState('center', 'setCenter', ({ center }) => center),
	lifecycle({
		componentWillMount() {
			const refs = {}

			this.setState({
				onMapMounted: ref => {
					refs.map = ref
					window.map = ref
				},
				onZoomChanged: () => {
					this.props.onZoomChange(refs.map.getZoom())
				},
				mapIdle: () => {
					this.props.setCenter({
						lat: refs.map.getCenter().lat(),
						lng: refs.map.getCenter().lng(),
					})

					if (this.props.onIdle) {
						this.props.onIdle(refs.map.getBounds())
					}
				},

				onMapClick: event => {
					console.log('Map click!')
					if (this.props.snglClick) {
						this.props.snglClick(event.latLng)
					}
				},
				onClucterClick: cluster => {
					this.props.setCenter({
						lat: cluster.center_.lat(),
						lng: cluster.center_.lng(),
					})
				},
				onMarkerClick: marker => {
					this.props.onZoomChange(18)
					refs.map.panTo({
						lat: marker.location.coordinates[1],
						lng: marker.location.coordinates[0],
					})
					refs.map.panBy(parseInt(document.documentElement.clientWidth * 0.16, 10), 0)
				},
			})
		},
		componentDidMount() {
			if (!localStorage.getItem('latitude') && !localStorage.getItem('longitude')) {
				axios.all([getUserCoordinates(), getRegionIDs()]).then(
					axios.spread((coords, regions) => {
						const { latitude, longitude, city, ip, country_name } = coords.data

						localStorage.setItem('latitude', latitude)
						localStorage.setItem('longitude', longitude)
						localStorage.setItem('city', city)
						localStorage.setItem('ip', ip)
						localStorage.setItem('country_name', country_name)

						this.props.setCenter({
							lat: latitude,
							lng: longitude,
						})
						this.props.onZoomChange(12)

						const region = regions.data.result.items.find(x => x.name === city)

						if (region) {
							localStorage.setItem('regionID', region.id)
						} else {
							localStorage.setItem('regionID', -1)
						}
					})
				)
			} else {
				this.props.setCenter({
					lat: parseFloat(localStorage.getItem('latitude')),
					lng: parseFloat(localStorage.getItem('longitude')),
				})
				this.props.onZoomChange(12)
			}
		},
		componentWillReceiveProps(nextProps) {},
	})
)(props => {
	return (
		<GoogleMap
			zoom={props.zoom}
			center={{ lat: props.center.lat, lng: props.center.lng }}
			ref={props.onMapMounted}
			options={{
				disableDoubleClickZoom: true,
				minZoom: props.minZoom,
				fullscreenControl: false,
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google && google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google && google.maps.ControlPosition.LEFT_TOP,
				},
				zoomControl: true,
				zoomControlOptions: {
					position: google && google.maps.ControlPosition.LEFT_BOTTOM,
				},
				streetViewControl: true,
				streetViewControlOptions: {
					position: google && google.maps.ControlPosition.LEFT_BOTTOM,
				},
			}}
			onDblClick={props.onDoubleClick}
			onClick={props.onMapClick}
			onZoomChanged={props.onZoomChanged}
			onIdle={_.debounce(props.mapIdle, 500)}
		>
			<MarkerClusterer noRedraw averageCenter enableRetinaIcons gridSize={60} onClick={props.onClucterClick}>
				{props.show &&
					props.markers.map(marker => (
						<Marker
							position={{
								lat: marker.location.coordinates[1],
								lng: marker.location.coordinates[0],
							}}
							key={marker._id}
							_id={marker._id}
							icon={`/${props.pic}.png`}
							option={{ id: marker._id }}
							onClick={() => props.onMarkerClick(marker)}
						/>
					))}
			</MarkerClusterer>
		</GoogleMap>
	)
})

export default GMap
