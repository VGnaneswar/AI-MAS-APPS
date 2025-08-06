import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

// 🔁 Replace with your real client ID
const clientId = '564442321016-tq2rb4o7tp5mk381krqgnnb7f8sed2v9.apps.googleusercontent.com';
//<GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
