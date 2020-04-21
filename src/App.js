import React, { Component } from 'react'
import PrivateRoute from './components/PrivateRoute'
import { Route, Switch } from 'react-router-dom'
import Login from './pages/Login/index'
import ForgotPassword from './pages/Login/ForgotPassword'
import Index from './pages/Index/index'
import './App.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <PrivateRoute path="/" component={Index} />
      </Switch>
    )
  }
}

export default App
