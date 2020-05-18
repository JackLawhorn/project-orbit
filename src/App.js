import React, { Component} from "react";
import "./App.css";

import "./style/main.css";

import PanelGrid from "./components/PanelGrid.js"

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      editingEnabled: false,
    }

    this.handleEditButton = this.handleEditButton.bind(this)
  }
  
  componentDidMount() {
    
  }

  handleEditButton() {
    this.setState({
      editingEnabled: !this.state.editingEnabled,
    })
  }

  render(){
    return(
      <div className="container">
        <header className="header">
          <h1>Project Orbit Operating System</h1>
          <button className="button button--inverted" onClick={this.handleEditButton}>
            { this.state.editingEnabled &&  "Lock Layout" }
            { !this.state.editingEnabled && "Unlock Layout" }
          </button>
        </header>
        <PanelGrid editingEnabled={this.state.editingEnabled} />
      </div>
    );
  }
}

export default App;