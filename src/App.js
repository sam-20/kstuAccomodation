import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter, Route, Switch } from "react-router-dom"
import Landing from './components/Landing/Landing'
import Studentlogin from './components/Studentlogin/Studentlogin'
import Adminlogin from './components/Adminlogin/Adminlogin'
import Dashboard from './components/Dashboard/Dashboard'
import Adminpanel from './components/Adminpanel/Adminpanel'
// import Testpage from './components/Testpage/Testpage'



class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/* <Route path="/" exact component={Testpage} /> */}
          <Route path="/" exact component={Landing} />
          <Route path="/student" exact component={Studentlogin} />
          <Route path="/admin" exact component={Adminlogin} />
          <Route path="/student/dashboard" exact component={Dashboard} />
          <Route path="/admin/adminpanel" exact component={Adminpanel} />
          <Route path="/" render={() => <div>404</div>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
