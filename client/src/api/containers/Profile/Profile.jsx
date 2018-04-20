import React, { Component } from 'react'
// import PropTypes from 'prop-types'

// import { compose } from 'recompose'
// import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'

import { Row, Col, Image } from 'react-bootstrap'

import reactCSS from 'reactcss'

import BoxHeader from '../../../ui/dumb/Box.Header/BoxHeader'
import BoxContainer from '../../../ui/dumb/Box.Container/BoxContainer'

import { ME_QUERY } from '../../graphql/users/users.queries'

class Profile extends Component {
	constructor(props) {
		super(props)
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

		// console.log(this.props)

		const { email, family_name, gender, given_name, name, picture } = this.props.user

		return (
			<div
				style={styles.mainDiv}
				ref={div => {
					this.myDiv = div
				}}
			>
				<BoxHeader title="User profile" />
				<BoxContainer>
					<Row>
						<Col xs={2}>
							<Image src={picture} circle style={{ width: '52px' }} />
						</Col>
						<Col xs={10}>First name: {given_name}</Col>
						<Col xs={10}>Last name: {family_name}</Col>
					</Row>
					<Row>
						<Col xs={12}>E-mail: {email}</Col>
					</Row>
					<Row>
						<Col xs={12}>Gender: {gender}</Col>
					</Row>
					<Row>
						<Col xs={12}>City: {localStorage.getItem('city')}</Col>
					</Row>
					<Row>
						<Col xs={12}>Country: {localStorage.getItem('country_name')}</Col>
					</Row>
					<Row>
						<Col xs={12}>Region ID: {localStorage.getItem('regionID')}</Col>
					</Row>
				</BoxContainer>
			</div>
		)
	}
}

Profile.propTypes = {}

// const mapStateToProps = state => {
// 	const {
// 		locale: { lang },
// 	} = state
// 	return {
// 		currentLocale: lang,
// 	}
// }

// export default compose(withRouter, connect(mapStateToProps, null))(Extra)

const ProfileWithData = () => (
	<Query query={ME_QUERY}>
		{({ loading, data: { me } }) => {
			if (loading) return <span>loading....</span>
			return <Profile user={me} />
		}}
	</Query>
)

export default ProfileWithData

// {/* <Query query={EXTRA_QUERY}>
//                 {({ loading, data: { extra } }) => {
//                         if (loading) return <span>loading....</span>
//                         return (
// 													<div
// 														style={styles.mainDiv}
// 														ref={div => {
// 															this.myDiv = div
// 														}}
// 													>
// 														<BoxHeader title="User profile" />
// 														<BoxContainer>
// 															<div>Profile</div>
// 															<div>Profile</div>
// 														</BoxContainer>
// 													</div>
// 												)
//                 }}
//         </Query> */}
