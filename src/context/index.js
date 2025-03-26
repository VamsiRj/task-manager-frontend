import { createContext, useContext, useState } from 'react';

// Create context with default values, useful for when no provider is wrapped
const UserContext = createContext({
  userId: null,
  name: '',
  role: '',
  setId: () => {},
  setName: () => {},
  setRole: () => {},
});

function UserProvider({ children }) {
  const [userId, setId] = useState(null); // Initial state is null, indicating no user by default
  // const [name, setName] = useState('');
  const [role, setRole] = useState('');

  return (
    <UserContext.Provider value={{ userId, role, setId, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to access user details from context
function useUserDetails() {
  const details = useContext(UserContext);
  return details;
}

export { UserProvider, useUserDetails };
