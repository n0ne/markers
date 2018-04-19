import React from 'react'
import PropTypes from 'prop-types'

import { Image } from 'react-bootstrap'

const UserAvatar = ({ user }) => {
	if (user.picture) {
		return <Image src={user.picture} circle style={{ width: '36px' }} />
	}
}

UserAvatar.propTypes = {
	user: PropTypes.object,
	size: PropTypes.number,
}

export default UserAvatar
