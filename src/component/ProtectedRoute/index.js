import { useUserDetails } from '../../context';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { userId, role } = useUserDetails();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else if (role === 'TeamMember' && location.pathname === '/create-task') {
      navigate('/');
    }
  }, [userId, role, location.pathname, navigate]);

  return children;
}

export default ProtectedRoute;
