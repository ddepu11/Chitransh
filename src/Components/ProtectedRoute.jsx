import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ isAuthenticated, component: Component, path }) => (
  <Route
    path={path}
    render={({ location }) => {
      if (isAuthenticated) {
        return <Component />;
      } else {
        return (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }
    }}
  />
);

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

// ProtectedRoute.defaultProps = {};

export default ProtectedRoute;
