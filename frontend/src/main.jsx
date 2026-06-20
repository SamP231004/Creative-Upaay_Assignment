import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './store/index.js';
import { ClerkProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = "pk_test_Y29tcGxldGUtbWFzdG9kb24tNDIuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key Token Exception Map");
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <Provider store={store}>
                <App />
            </Provider>
        </ClerkProvider>
    </React.StrictMode>,
)