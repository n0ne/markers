import axios from 'axios'

export default {
	Query: {
		markers: async (_, args, { Marker, user }) => {
			const { NELat, NELng, SWLat, SWLng } = args

			const markers = await Marker.find({ location: { $geoWithin: { $box: [[SWLng, SWLat], [NELng, NELat]] } } })

			return markers.map(marker => {
				marker._id = marker._id.toString()
				return marker
			})
		},
		markersExtra: async (_, args, { Marker, user }) => {
			const { NELat, NELng, SWLat, SWLng, query, regionId } = args
			let markers = []

			const queries = {
				schools: 'школа',
				gas: 'заправка',
				pharmacies: 'аптека',
				restaurants: 'ресторан',
			}

			const url = `https://catalog.api.2gis.ru/3.0/items?viewpoint1=${SWLng}%2C${NELat}&viewpoint2=${NELng}%2C${SWLat}&page=1&page_size=50&q=${encodeURIComponent(
				queries[query]
			)}&region_id=${regionId}&type=street%2Cbranch%2Cstation&fields=items.point&key=rutnpt3272`
			markers = await axios
				.get(url)
				.then(response => {
					return response.data.result.items.map(item => {
						return {
							_id: item.id,
							location: {
								type: 'Point',
								coordinates: [item.point.lon, item.point.lat],
							},
						}
					})
				})
				.catch(error => {
					console.warn(error)
				})
			return markers
		},

		me: async (_, args, { user, User }) => {
			if (!!user) {
				const contextUser = user
				const dbUser = await User.find({ email: contextUser.email }).exec()
				const me = dbUser[0]

				me._id = me._id.toString()

				return me
			} else {
				return null
			}
		},
	},
	Mutation: {
		createMarker: async (_, { lat, lng }, { Marker }) => {
			const marker = {
				location: {
					type: 'Point',
					coordinates: [lng, lat],
				},
			}

			const newMarker = await new Marker(marker).save()
			newMarker._id = newMarker._id.toString()

			return newMarker
		},

		addMarkers: async (_, { lats, lngs }, { Marker }) => {
			let markers = []

			for (let index = 0; index < lats.length; index++) {
				const marker = {
					location: {
						type: 'Point',
						coordinates: [lngs[index], lats[index]],
					},
				}

				const newMarker = await new Marker(marker).save()
				newMarker._id = newMarker._id.toString()

				markers = [...markers, newMarker]
			}

			return markers
			// return []
		},
		upsertUser: async (_, args, { user, User }) => {
			if (user) {
				const contextUser = user
				const updatedUser = await User.findOneAndUpdate(
					{ email: contextUser.email },
					{
						$set: {
							family_name: contextUser.family_name,
							gender: contextUser.gender,
							given_name: contextUser.given_name,
							name: contextUser.name,
							picture: contextUser.picture,
							sub: contextUser.sub,
						},
					},
					{ new: true, upsert: true }
				)
					.exec()
					.then(user => {
						user._id = user._id.toString()
						return {
							user,
						}
					})
				return updatedUser.user
			} else {
				return null
			}
		},
	},
}
