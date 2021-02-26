import React from 'react';
import './App.css';
import Header from './components/pages/header';


class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      currentPage: "home"
    }
  }

render () {
    return <div className="App">
      <Header
        title = {this.state.currentPage}
      />
    </div>
  }
}

function App() {
  return (
      <Main/>
  );
}

export default App;
