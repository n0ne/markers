import React from 'react'
import { Route, Redirect } from 'react-router-dom'
// import { connect } from 'react-redux';
import { isLogged } from '../utils/user'

const PrivateRoute = ({ component: Component, ...rest }) => {
	// console.log(isLogged())

	return <Route {...rest} render={props => (isLogged() ? <Component {...props} /> : <Redirect to="/" />)} />
}

export default PrivateRoute

// function mapStateToProps(state) {
//   const { reduxTokenAuth: { currentUser: { attributes: { role }, isSignedIn } } } = state;
//   return {
//     isAdmin: role === 'Admin' || role === 'SuperAdmin' || !role,
//     isSignedIn,
//   };
// }
// export default withRouter(connect(mapStateToProps)(AdminRouter));
