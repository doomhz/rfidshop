import React from 'react'
import ReactDOM from 'react-dom'
import RFIDReader from './RFIDReader';

class App extends React.Component {
  render(){
    return <RFIDReader />
  }
}

if (document.getElementById('app')) ReactDOM.render(<App />, document.getElementById('app'))