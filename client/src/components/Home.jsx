import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <img
        src="/healthlogo.png"
        alt="Your Health Logo"
        className="w-24 h-24 mb-4"
      />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Welcome to Your Health</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        A platform designed to connect patients and nurse practitioners during recovery. Track vitals, get guidance, and stay supported.
      </p>

      <div className="flex gap-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Log In
          </button>
        </Link>
        <Link to="/register">
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
