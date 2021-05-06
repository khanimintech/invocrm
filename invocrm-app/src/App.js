import './App.scss';
import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import Contracts from './pages/contracts/Contracts';
import {  useSnackbar } from 'notistack';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css";


const App = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const handleRequest = (
    promise,
    suppressGlobalErrorToast,
    dontRedirectToLoginOnAuthError
  ) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      promise
        .then((response) => {
          resolve(response);
        })
        .catch((response) => {
          switch (true) {
            case response.statusCode === 401 || response.statusCode === 403:
              setUser(undefined);
              if (!dontRedirectToLoginOnAuthError) {
                history.push("/login");
              }
              break;
            default:
              if (!suppressGlobalErrorToast)
                enqueueSnackbar("Xeta bash verdi!", { variant: "error" });
          }
          reject(response);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return (
    <Layout user={user}>
        <Router>
          <Switch>
            <Route path="/contracts">
              <Contracts loading={loading} user={user} handleRequest={handleRequest} />
            </Route>
            </Switch>
          </Router>
    </Layout>
  );
}

export default App ;
