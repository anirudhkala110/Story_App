import { createContext, useEffect, useState } from 'react';
import './App.css';
import LoginRegister from './UserDataAndAuthorization/LoginRegister';
import Navbar from './Utils/Navbar';
import Footer from './Utils/Footer';
import Home from './Component/Home';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfile from './UserDataAndAuthorization/UserProfile';
import StoryWriting from './Component/StoryWriting';
import ReadPost from './Assest/ReadPost';
import EditUser from './UserDataAndAuthorization/EditUser';

export const userContext = createContext()


function App() {
  axios.defaults.withCredentials = true
  axios.defaults.withCredentials = true
  const [user, setUser] = useState({})
  useEffect(() => {
    axios.get('http://localhost:8095/logged-in')
      .then(res => {
        setUser(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  })
  // console.log(user)
  return (
    <userContext.Provider value={user}>
      <div className="w-100 backi">
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path='/login' element={<LoginRegister />} />
            {
              user.email?<Route exact path="/auth=1/userProfile" element={<UserProfile />} />:<Route exact path="/auth=0/userProfile" element={<UserProfile />} />
            }
            <Route exact path="/auth=1/create" element={<StoryWriting />} />
            <Route exact path='/auth=1/user/edit-profile' element={<EditUser/>} />
            <Route exact path='/read-story/:id' element={<ReadPost />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </userContext.Provider>
  );
}

export default App;
