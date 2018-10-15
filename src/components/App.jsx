import React from 'react'
import { hot } from 'react-hot-loader'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

import PasswordsFiles from './PasswordsFiles'
import Passwords from './Passwords'

const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/passwords" component={PasswordsFiles} />
      <Route
        path="/passwords/:id/(Recycle Bin)?/:group*"
        component={Passwords}
      />
      <Redirect from="/" to="/passwords" />
      <Redirect from="*" to="/passwords" />
    </Switch>
  </HashRouter>
)

/*
  Enable Hot Module Reload using `react-hot-loader` here
  We enable it here since App is the main root component
  No need to use it anywhere else, it sould work for all
  child components
*/
export default hot(module)(App)
