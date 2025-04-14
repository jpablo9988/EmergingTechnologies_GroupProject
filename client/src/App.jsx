import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './auth/AuthContext';
import AppRouter from './router/AppRouter';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

// App component
function App() {
  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }
  return (
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
  );
}
//
export default App;