import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import SignUp from './component/Signup';
import AdminDashBoard from './component/AdminDashBoard';
import ProtectedRoute from './component/ProtectedRoute';
import CreateTask from './component/CreateTask';
import { UserProvider } from './context';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-task'
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
