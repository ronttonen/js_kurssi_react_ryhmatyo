import React, { Component } from 'react';
import { Nav, Navbar, NavItem} from 'react-bootstrap';
import {Route, NavLink, HashRouter} from 'react-router-dom';
import About from './about';
import Guide from './guide';
import Home from './home';
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>
      <div className="App">
      
      <Navbar>
      <Navbar.Header>
      <Navbar.Brand>
      
      <NavLink to="/">App</NavLink>
      </Navbar.Brand>
      </Navbar.Header>

      <Nav pullRight>
      <NavItem>
      <NavLink className="btn btn-default" to="/about">About</NavLink>
      </NavItem>
      <NavItem>
      <NavLink className="btn btn-default" to="/guide">Guide</NavLink>
      </NavItem>
      
      </Nav>
    </Navbar>;
    
    <div className="content">
          <div>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/guide" component={Guide}/>
          </div>
     </div>
     </div>
    </HashRouter> 
    );
  }
}

export default App;
