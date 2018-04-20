export default `

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
  markers(NELat: Float!, NELng: Float!, SWLat: Float!, SWLng: Float!): [Marker]!
  markersExtra(NELat: Float!, NELng: Float!, SWLat: Float!, SWLng: Float!, query: String!, regionId: Int!): [Marker]!
  me: User
}

type Mutation {
  createMarker(lat: Float!, lng: Float!): Marker
  addMarkers(lats: [Float]!, lngs: [Float]!): [Marker]
  upsertUser:  User
}
`
