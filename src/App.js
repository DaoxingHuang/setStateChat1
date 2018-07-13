import React, { Component } from 'react';
import './App.css';
import Async from './component/Async';
import DidUpdateOrCallback from './component/DidUpdateOrCallback';
import ShouldComponentUpdate from './component/ShouldComponentUpdate';
import Parameter from './component/Parameter';


class App extends Component {
  render() {
    return (
      <div>
        <Async/>
        <DidUpdateOrCallback/>
        <ShouldComponentUpdate/>
        <Parameter/>
      </div>
    );
  }
}

export default App;
