import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './css/themed_bootstrap.css';
import { CookiesProvider } from 'react-cookie';
import './i18n';
import passport from 'passport'
import SteamStrategy from 'passport-steam'

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/',
  realm: 'http://localhost:3000/',
  apiKey: process.env.REACT_APP_STEAM_API_KEY
},
function(identifier, profile, done) {
  console.log(identifier)
  console.log(profile)
}
));

ReactDOM.render(
  <CookiesProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </CookiesProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
