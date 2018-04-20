import axios from 'axios'

export default {
	Query: {
		allCats: async (_, args, { Cat }) => {
			const cats = await Cat.find()
			return cats.map(cat => {
				cat._id = cat._id.toString()
				return cat
			})
		},

		markers: async (_, args, { Marker, user }) => {
			// console.log(args)

			// console.log('call markers resolver')

			const { NELat, NELng, SWLat, SWLng } = args

			const markers = await Marker.find({ location: { $geoWithin: { $box: [[SWLng, SWLat], [NELng, NELat]] } } })
			// console.log(markers.length)

			return markers.map(marker => {
				marker._id = marker._id.toString()
				return marker
			})
		},
		markersExtra: async (_, args, { Marker, user }) => {
			// console.log(args)
			const { NELat, NELng, SWLat, SWLng, query, reqion } = args
			let markers = []

			const queries = {
				schools: 'школа',
				gas: 'заправка',
				pharmacies: 'аптека',
				restaurants: 'ресторан',
			}
			// console.log(queries[query])

			// console.log('call markers resolver')

			// const markers = await Marker.find()
			// return markers.map(marker => {
			// 	marker._id = marker._id.toString()
			// 	return marker
			// })
			// https://catalog.api.2gis.ru/3.0/items?viewpoint1=30.230254980468747%2C46.49697467409132&viewpoint2=31.202545019531247%2C46.44921284688416&page=1&q=%D1%88%D0%BA%D0%BE%D0%BB%D0%B0&region_id=14&type=street%2Cbranch%2Cstation&fields=items.point&typekey=rutnpt3272
			// const url = `https://catalog.api.2gis.ru/3.0/items?viewpoint1=${SWLng}%2${SWLat}&viewpoint2=${NELng}%2C${NELat}&page=1&q=${encodeURIComponent(
			// 	queries[query]
			// )}&region_id=14&type=street%2Cbranch%2Cstation&fields=items.point&typekey=rutnpt3272`

			const url = `https://catalog.api.2gis.ru/3.0/items?viewpoint1=${SWLng}%2C${NELat}&viewpoint2=${NELng}%2C${SWLat}&page=1&page_size=50&q=${encodeURIComponent(
				queries[query]
			)}&region_id=14&type=street%2Cbranch%2Cstation&fields=items.point&key=rutnpt3272`
			// const url = `https://catalog.api.2gis.ru/3.0/items`
			markers = await axios
				.get(url)
				.then(response => {
					// console.log(response)
					// console.log(response.data.result.items)
					// console.log(response.data.result.items.length)

					return response.data.result.items.map(item => {
						// console.log(item.point.lon)

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
			// axios
			// 	.get(url, {
			// 		params: {
			// 			viewpoint1: `${SWLng}%2C${NELat}`,
			// 			viewpoint2: `${NELng}%2C${SWLat}`,
			// 			page: 1,
			// 			q: encodeURIComponent(queries[query]),
			// 			region_id: 14,
			// 			type: 'street%2Cbranch%2Cstation',
			// 			fields: 'items.point',
			// 			key: 'rutnpt3272',
			// 		},
			// 	})
			// 	.then(response => {
			// 		console.log(response)
			// 	})
			// 	.catch(error => {
			// 		console.warn(error)
			// 	})
			// console.log(markers[0])

			return markers
		},

		me: async (_, args, { user, User }) => {
			// console.log(user)

			if (!!user) {
				// console.log(context.user)
				const contextUser = user
				const dbUser = await User.find({ email: contextUser.email }).exec()
				const me = dbUser[0]

				// console.log(me)

				me._id = me._id.toString()

				return me
			} else {
				return null
			}
		},
	},
	Mutation: {
		createCat: async (_, args, { Cat }) => {
			const cat = await new Cat(args).save()
			cat._id = cat._id.toString()
			return cat
		},
		createMarker: async (_, { lat, lng }, { Marker }) => {
			// console.log('Try to create marker')

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
		},
		upsertUser: async (_, args, { user, User }) => {
			// console.log('Try to upsert user!')

			// console.log(user)

			if (user) {
				const contextUser = user
				// await User.update(
				// 	{ email: contextUser.email },
				// 	{
				// 		family_name: contextUser.family_name,
				// 		gender: contextUser.gender,
				// 		given_name: contextUser.given_name,
				// 		name: contextUser.name,
				// 		picture: contextUser.picture,
				// 		sub: contextUser.sub,
				// 	},
				// 	{ upsert: true }
				// ).exec()

				// const userUpd = await User.find({ email: contextUser.email })[0]
				// console.log(userUpd)

				// userUpd._id = userUpd._id.toString()

				// return userUpd

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
						// console.log(user)

						user._id = user._id.toString()

						// console.log(user)

						return {
							user,
						}
					})

				// console.log(updatedPlot.user)

				return updatedUser.user
			} else {
				return null
			}
		},
	},
}

// return User
//        .findOneAndUpdate({email: contextUser.email}, {$set:{family_name: contextUser.family_name,
// 				gender: contextUser.gender,
// 				given_name: contextUser.given_name,
// 				name: contextUser.name,
// 				picture: contextUser.picture,
// 				sub: contextUser.sub,}}, { "new": true, upsert: true})
//        .exec()
//        .then(data=>{
// 				 console.log(data);

//         return {
//           data
//             }
//         })

//&q=%D1%88%D0%BA%D0%BE%D0%BB%D0%B0&region_id=14&type=street%2Cbranch%2Cstation&fields=items.point&key=rutnpt3272`
// axios
// 				.get(url, {
// 					params: {
// 						viewpoint1: `${SWLng}%2C${NELat}`,
// 						viewpoint2: `${NELng}%2C${SWLat}`,
// 						page: 1,
// 						q: encodeURIComponent(queries[query]),
// 						region_id: 14,
// 						type: encodeURIComponent('street,branch,station'),
// 						fields: 'items.point',
// 						key: 'rutnpt3272'

// 					},
// 				})
// 				.then(response => {
// 					console.log(response.data.result)
// 				})
// 				.catch(error => {
// 					console.warn(error)
// 				})
