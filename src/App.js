import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {value : ''}
  } 
  handleChange = (e) => {
    this.setState({value: e.target.value});
  }
  render() {
    return (
      
      <div className="App">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js"></script>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <input type="text" value={this.state.value} onChange={this.handleChange}/>
          <div>{this.state.value}</div>
        </div>
      </div>
      
    );
  }
}

export default App;
