import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';

function LoginUser() {
  const { login, isNurse } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const didLogIn = await login(email, password);
    if (didLogIn) {
      navigate(isNurse ? '/dashboard/nurse' : '/dashboard/patient');
    } else {
      setIsError(true);
    }
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg px-8 py-8">
        {/* Logo & App Name */}
        <div className="flex flex-col items-center justify-center mb-8 space-y-2">
          <img src="/healthlogo.png" alt="Your Health Logo" className="w-24 h-24" />
          <h1 className="text-3xl font-bold text-blue-600 tracking-wide">YOUR HEALTH</h1>
        </div>

        {/* Login Heading */}
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Login to Your Health
        </h2>

        {/* Error Message */}
        {isError && (
          <div className="mb-4 text-red-600 text-sm text-center">
            Email or password couldn’t be found!
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginUser;
