import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Contracts from './pages/contracts/Contracts';
import Annexes from './pages/annexes/Annexes';
import { useSnackbar } from 'notistack';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Contacts from './pages/contacts/Contacts';
import Banks from './pages/banks';
import Login from './pages/login';
import { LoginService } from './services/LoginService';

import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css";


const App = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [isUserLoaded, toggleIsUserLoaded] = useState(false);

  const { enqueueSnackbar } = useSnackbar();



  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(JSON.parse(user));
    toggleIsUserLoaded(true);
  }, [])

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
              localStorage.removeItem("user")
              if (!dontRedirectToLoginOnAuthError) {
                history.push("/login");
              }
              break;
            default:
              if (!suppressGlobalErrorToast)
                enqueueSnackbar("Xəta baş verdi!", { variant: "error", anchorOrigin: {vertical: 'top', horizontal: 'right' }});
              break;
          }
          reject(response);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    handleRequest(LoginService.logout())
  }



  const props = {
    loading,
    user,
    handleRequest,
    enqueueSnackbar
  }

  const unauthorizedProps = {
    ...props,
    setUser,
  }


  const routes = [
    { url: "/login", component: <Login />, unauthorized: true},
    { url: "/contracts", component: <Contracts /> },
    { url: "/annexes", component: <Annexes /> },
    { url: "/contacts", component: <Contacts /> },
    { url: "/banks", component: <Banks /> },
  ]

  return (
    <Router>
      <Switch>
        {
          isUserLoaded ? (
            !user ? (
              <>
              {routes.filter(route => route.unauthorized)
                .map(route => (
                      <Route  exact key={route.url} path={route.url}>
                        {React.cloneElement(
                          route.component,
                          { ...unauthorizedProps }
                        )}
                      </Route>
                    ))}
                    <Redirect exact  to="/login" />
                  </>
          ): (
            <Layout user={user} removeUser={handleLogout}>
            {routes
            .filter(route => !route.unauthorized )
            .map(route => (
              <Route exact key={route.url} path={route.url}>
                {React.cloneElement(
                  route.component,
                  { ...props }
                )}
              </Route>
            ))}
             <Redirect exact  to="/contracts" />
            </Layout>
          )
          ) : null
        }
       
      </Switch>
    </Router>
  );
}

export default App;
