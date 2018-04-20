import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Query } from 'react-apollo'

import { Row, Col, Image } from 'react-bootstrap'

import reactCSS from 'reactcss'

import BoxHeader from '../../../ui/dumb/Box.Header/BoxHeader'
import BoxContainer from '../../../ui/dumb/Box.Container/BoxContainer'

import { ME_QUERY } from '../../graphql/users/users.queries'

class Profile extends Component {
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

		const { email, family_name, gender, given_name, picture } = this.props.user

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
						<Col xs={10}>
							<Row>
								<Col xs={4}>
									<strong>First name:</strong>
								</Col>
								<Col xs={8}>{given_name}</Col>
							</Row>
							<Row>
								<Col xs={4}>
									<strong>Last name:</strong>
								</Col>
								<Col xs={8}>{family_name}</Col>
							</Row>
						</Col>
					</Row>

					<hr />

					<Row>
						<Col xs={4}>
							<strong>E-mail:</strong>
						</Col>
						<Col xs={8}>{email}</Col>
					</Row>
					<Row>
						<Col xs={4}>
							<strong>Gender:</strong>
						</Col>
						<Col xs={8}>{gender}</Col>
					</Row>
					<Row>
						<Col xs={4}>
							<strong>City:</strong>
						</Col>
						<Col xs={8}>{localStorage.getItem('city')}</Col>
					</Row>
					<Row>
						<Col xs={4}>
							<strong>Country:</strong>
						</Col>
						<Col xs={8}>{localStorage.getItem('country_name')}</Col>
					</Row>

					<Row>
						<Col xs={4}>
							<strong>Region ID:</strong>
						</Col>
						<Col xs={8}>{localStorage.getItem('regionID')}</Col>
					</Row>
				</BoxContainer>
			</div>
		)
	}
}

Profile.propTypes = {
	user: PropTypes.object.isRequired,
}

const ProfileWithData = () => (
	<Query query={ME_QUERY}>
		{({ loading, data: { me } }) => {
			if (loading) return <span>loading....</span>
			return <Profile user={me} />
		}}
	</Query>
)

export default ProfileWithData
