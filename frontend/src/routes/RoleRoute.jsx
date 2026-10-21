import { canAccess, pageByName } from './navigation';
import PlaceholderPage from '../components/PlaceholderPage';

/**
 * RoleRoute — renders children only if the user's role may open the page.
 * UX only: the backend still enforces every permission on the API.
 */
function RoleRoute({ user, name, children }) {
  const page = pageByName(name);
  if (!canAccess(user, page)) return <PlaceholderPage page={page} forbidden />;
  return children ?? <PlaceholderPage page={page} />;
}

export default RoleRoute;
