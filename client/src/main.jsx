import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
//
const link = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});
//
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>

    <App />

  </ApolloProvider>
)

