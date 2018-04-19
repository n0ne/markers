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
			// console.log(user)

			console.log('call markers resolver')

			const markers = await Marker.find()
			return markers.map(marker => {
				marker._id = marker._id.toString()
				return marker
			})
		},
		markersExtra: async (_, args, { Marker, user }) => {
			// console.log(user)

			// console.log('call markers resolver')

			// const markers = await Marker.find()
			// return markers.map(marker => {
			// 	marker._id = marker._id.toString()
			// 	return marker
			// })

			return []
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
			console.log('Try to create marker')

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
			console.log('Try to upsert user!')

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
