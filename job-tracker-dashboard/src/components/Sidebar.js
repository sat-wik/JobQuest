import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig'; // Ensure this path is correct

const Sidebar = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="sidebar bg-white h-full shadow-lg flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold px-6 py-4">Job Tracker</h2>
        <ul className="px-4">
          <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/dashboard')}>
            Dashboard
          </li>
          <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/applications')}>
            Applications
          </li>
          <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/profile')}>
            Profile
          </li>
        </ul>
      </div>
      <div className="p-4">
        <div className="border-t pt-4">
          <p className="text-gray-700">Account</p>
          <p className="text-gray-500">{userEmail}</p>
          <button className="text-blue-500 mt-2" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
