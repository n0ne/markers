import React from 'react'
import PropTypes from 'prop-types'

import reactCSS from 'reactcss'
import { compose, pure, defaultProps } from 'recompose'

const BoxHeader = ({ title }) => {
	const styles = reactCSS({
		default: {
			boxHeaderStyle: {
				borderRadius: '10px 10px 0px 0px',
				border: '1px solid rgb(179, 179, 179)',
				padding: '8px 10px 0px 15px',
				width: '100%',
				height: '40px',
				paddingTop: '8px',
				fontSize: '18px',
				paddingLeft: '15px',
				color: '#999',
				background: 'white',
			},
			boxHeaderPStyle: {
				marginBottom: '0px',
				width: '90%',
				float: 'left',
			},
		},
	})

	return (
		<div style={styles.boxHeaderStyle}>
			<p style={styles.boxHeaderPStyle}>{title}</p>
		</div>
	)
}

BoxHeader.propTypes = {
	title: PropTypes.string,
}

export default compose(defaultProps({ title: 'Test header' }), pure)(BoxHeader)
