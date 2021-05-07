import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import Contracts from './pages/contracts/Contracts';
import Annexes from './pages/annexes/Annexes';
import { useSnackbar } from 'notistack';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Contacts from './pages/contacts/Contacts';
import Banks from './pages/banks';

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
                enqueueSnackbar("Xəta baş verdi!", { variant: "error" });
          }
          reject(response);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const props = {
    loading,
    user,
    handleRequest,
    enqueueSnackbar
  }

  const routes = [
    { url: "/contracts", component: <Contracts /> },
    { url: "/annexes", component: <Annexes /> },
    { url: "/contacts", component: <Contacts /> },
    { url: "/banks", component: <Banks /> },
  ]

  return (
    <Router>
      <Layout user={user}>
        <Switch>
          {routes.map(route => (
            <Route key={route.url} path={route.url}>
              {React.cloneElement(
                route.component,
                { ...props }
              )}
            </Route>
          ))}
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
