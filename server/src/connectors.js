import mongoose from 'mongoose'

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/markers')

const Schema = mongoose.Schema
const geoSchema = new Schema({
	type: {
		type: String,
		default: 'Point',
	},
	coordinates: {
		type: [Number],
	},
})

const MarkerSchema = new Schema({
	location: {
		type: geoSchema,
		index: '2dsphere',
	},
})

const Marker = mongoose.model('Marker', MarkerSchema)

const userSchema = new Schema({
	email: String,
	family_name: String,
	gender: String,
	given_name: String,
	name: String,
	picture: String,
})

const User = mongoose.model('User', userSchema)

export { Marker, User }
