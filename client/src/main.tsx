import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store, { persister } from './store/Store.js'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persister}>
      <React.StrictMode>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </React.StrictMode>
      </PersistGate>
    </Provider>
)
