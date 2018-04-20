import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { isLogged } from '../utils/user'

const PrivateRoute = ({ component: Component, ...rest }) => {
	return <Route {...rest} render={props => (isLogged() ? <Component {...props} /> : <Redirect to="/" />)} />
}

PrivateRoute.propTypes = {
	component: PropTypes.func.isRequired,
}

export default PrivateRoute
