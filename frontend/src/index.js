import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
//import * as serviceWorker from './serviceWorker';

import defaultReducer from './reducers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';

import { GoogleOAuthProvider } from '@react-oauth/google';

import './fonts/Limelight-Regular.ttf';
import './SCSS/main.scss';


const store = createStore(defaultReducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(
    <GoogleOAuthProvider clientId="941154439836-s6iglcrdckcj6od74kssqsom58j96hd8.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
  </Provider>
    </GoogleOAuthProvider>,
  document.getElementById('root')
);

//serviceWorker.unregister();
