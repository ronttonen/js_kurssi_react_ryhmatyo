import React, { Component } from 'react';
import './App.css';
import data from './luonastiedot.json';

const lounasData = data;

class Home extends Component {
  constructor() {
    super();
    this.state = {queryKeyword : '',
       formattedResult: []
    };
    this.searchableItems = ''; 
    this.results = {};
    
  }
  //localissa oleva json tiedosto vaain, helpointa, mountissa lisätään json:in data
  componentDidMount() {
    this.searchableItems = lounasData;
  }
  
  //paskaa "algoritmii"
  handleQuery = (e) => {
    this.results = {};
    this.setState({queryKeyword : e.target.value});
    console.log(this.state.queryKeyword);
    console.log(e.target.value);
    this.searchItems(e.target.value);
  }
  searchItems = (e) => {
    console.log(this.results);
    let object = this.searchableItems;
    for (let ravintola in object) {
      for (let paiva in object[ravintola]) {
      if (object[ravintola][paiva].includes(e) && e !== '' && e.length > 3) {
        this.results[ravintola] = object[ravintola][paiva];
      }
      }
    }
    this.formatResult(this.results);
  }
 formatResult = (e) => {
   let resultHTML = [];
   for (let ravintola in e) {
     resultHTML.push(<li className="ravintola-match" key={ravintola} id={ravintola}>Löytyy ravintolasta: {ravintola}</li>);
   }
   this.setState({formattedResult : resultHTML});
 } 
 
  render() {
    return (
      <div className="App">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js"></script>
        <input type="text" value={this.state.queryKeyword} onChange={this.handleQuery}/>
        <p>Hakusana: {this.state.queryKeyword}</p>
        
        <ul>{this.state.formattedResult}</ul>
        
      </div>
    );
  }
}

export default Home;