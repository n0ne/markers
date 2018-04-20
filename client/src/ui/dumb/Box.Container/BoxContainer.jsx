import React from 'react'
import PropTypes from 'prop-types'

import reactCSS from 'reactcss'

import { compose, pure } from 'recompose'

const BoxContainer = props => {
	const styles = reactCSS({
		default: {
			boxContainerStyle: {
				borderRadius: '0px 0px 10px 10px',
				border: '1px solid rgb(179, 179, 179)',
				borderTop: 'none',
				padding: '8px 10px 0px 15px',
				width: '100%',
				minHeight: '30vh',
				paddingTop: '8px',
				fontSize: '18px',
				paddingLeft: '15px',
				color: '#999',
				background: 'white',
			},
		},
	})

	return <div style={styles.boxContainerStyle}>{props.children}</div>
}

BoxContainer.propTypes = {
	children: PropTypes.any,
}

export default compose(pure)(BoxContainer)
