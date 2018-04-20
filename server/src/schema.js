export default `
type Cat {
  _id: String!
  name: String!
}

type Location {
  type: String!,
  coordinates: [Float]!
}

type Marker {
  _id: String!,
  location: Location!
}

type User {
  _id:					String
  email:        String
  family_name:  String
  gender:       String
  given_name:   String
  name:         String
  picture:      String
}


type Query {
  allCats: [Cat!]!
  markers(NELat: Float!, NELng: Float!, SWLat: Float!, SWLng: Float!): [Marker]!
  markersExtra(NELat: Float!, NELng: Float!, SWLat: Float!, SWLng: Float!, query: String!): [Marker]!
  me: User
}

type Mutation {
  createCat(name: String!): Cat!
  createMarker(lat: Float!, lng: Float!): Marker
  addMarkers(lats: [String]!, lngs: [String]!): [Marker]
  upsertUser:  User
}
`
