import React from "react";

class OrbitPanelContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    };
  }

  componentDidMount() {

  }
  
  render() {
    return (
      <div className="panel__contents">
        
        <ul className="stats-list stats-list--orbit">
          <li className="stats-list__item">
            <div>NAME</div>
            <div>Earth 2</div>
          </li>
          <li className="stats-list__item">
            <div>CODE</div>
            <div>O7SH3X</div>
          </li>
          <li className="stats-list__item">
            <div>SIZE</div>
            <div>Medium</div>
          </li>
          <li className="stats-list__item">
            <div>ENVI</div>
            <div>Livable</div>
          </li>
          <li className="stats-list__item">
            <div>FACT</div>
            <div>Unclaimed</div>
          </li>
          
          <br />
          <li className="stats-list__item">
            <div>Gold</div>
            <div>{Math.ceil(Math.random()*4) + "/sec."}</div>
          </li>
          <li className="stats-list__item">
            <div>Iron</div>
            <div>{Math.ceil(Math.random()*4) + "/sec."}</div>
          </li>
          <li className="stats-list__item">
            <div>Coal</div>
            <div>{Math.ceil(Math.random()*4) + "/sec."}</div>
          </li>
          <br />
        </ul>

      </div>
    );
  }
}

export default OrbitPanelContent;