import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'react-toastify/dist/ReactToastify.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import PWAPrompt from 'react-ios-pwa-prompt'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /><PWAPrompt copyTitle="Warehouse"/>
  </React.StrictMode>
);
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
