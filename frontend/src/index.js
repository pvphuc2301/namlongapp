import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import MyApp from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { App } from 'antd';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
// Name: Nam Long Group
// Domain: dev-76dn6oon53yq6nbm.us.auth0.com
// Client ID:  OYqPhNdA3iA9M4bamfJTcg37kIjTvyw4
// Client Secret: GnmSKDpp-c3sAPfsowNZvBuv2dHspiqy8G1l2cvvWh0-OoZwZKCPGcEmVQVPnw0R
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App>
        <MyApp />
      </App>
    </BrowserRouter>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
