import { useUserDetails } from '../../context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const { userId, name, role } = useUserDetails();
  const navigate = useNavigate();

  // Redirect to login if userId is null, but only when the component mounts
  useEffect(() => {
    if (userId === null) {
      navigate('/login', { replace: true });
    }
  }, [userId, navigate]); // Add userId and navigate as dependencies to ensure it only runs when userId changes

  return <h1>Home Component</h1>;
}

export default Home;
