import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import SignUp from './component/Signup';
import { UserProvider } from './context';
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Home />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
