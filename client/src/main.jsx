import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import { LightModeProvider } from './lightModeContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
   <LightModeProvider>
    <App/>
   </LightModeProvider>
  </Provider>
)

