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

    let object = this.searchableItems;
    for (let ravintola in object) {
      for (let paiva in object[ravintola]) {
      if (object[ravintola][paiva].includes(e) && e !== '' && e.length > 3) {
                if (typeof this.results[paiva] === "undefined") {
          this.results[paiva] = {};
        }
        this.results[paiva][ravintola] = object[ravintola][paiva];
      }
    }
    this.formatResult(this.results);
  }
  }

 formatResult = (e) => {
   let resultHTML = [];
   console.log(e);
   for (let paiva in e){
     var i = 0;
     for (let ravintola in e[paiva]) {
       var click = "onClick={openInfo}";
       var url = 'https://www.lounaat.info/lounas/'+ ravintola +'/turku';
       resultHTML.push(<li className="ravintola-match" key={ravintola} id={ravintola}>Löytyy ravintolasta: <a href={url} >{ravintola}</a>, Päivänä: {paiva}</li>);
       i++;
     }
   }

   this.setState({formattedResult : resultHTML});
 } 
 
  render() {
    return (
      <div className="App">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js"></script>
        <input type="text" value={this.state.queryKeyword} onChange={this.handleQuery} autoFocus/>
        <p>Hakusana: {this.state.queryKeyword}</p>
        
        <ul>{this.state.formattedResult}</ul>
        
      </div>
    );
  }
}

export default Home;