import { createContext, useContext, useState } from 'react';

// Create context with default values, useful for when no provider is wrapped
let lsid = localStorage.getItem('userId');

if (lsid) {
  lsid = parseInt(lsid);
}
const lsrole = localStorage.getItem('userRole');
console.log(lsid, lsrole);
const UserContext = createContext({
  userId: lsid,
  name: '',
  role: lsrole ? lsrole : '',
  setId: () => {},
  // setName: () => {},
  setRole: () => {},
});

function UserProvider({ children }) {
  const [userId, setId] = useState(lsid); // Initial state is null, indicating no user by default
  // const [name, setName] = useState('');
  const [role, setRole] = useState(lsrole ? lsrole : '');

  const setUserId = (id) => {
    localStorage.setItem('userId', id); //userid is storing in local storage
    setId(id);
  };
  const setUserRole = (role) => {
    localStorage.setItem('userRole', role); //user role is storing in local storage
    setRole(role);
  };

  return (
    <UserContext.Provider value={{ userId, role, setUserId, setUserRole }}>
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
