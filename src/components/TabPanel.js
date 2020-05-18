import React from "react";
import $ from "jquery";
import Draggable from "react-draggable";

import InventoryPanelContent from './PanelContent/InventoryPanelContent.js';
import ShortwavePanelContent from './PanelContent/ShortwavePanelContent.js';
import OrbitPanelContent     from './PanelContent/OrbitPanelContent.js';

var {Resizable} = require("react-resizable");

class TabPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dragPosn: null,
      activeDrags: 0,
      deltaPosition: {
        x: 0, y: 0
      },
    };

    this.handleClickTab = this.handleClickTab.bind(this);
  }

  componentDidMount() {
    
  }

  handleClickTab(e) {
    this.props.handleTabOpen(this.props.panel.key, $(e.target).text());
  }

  handleDrag = (e, ui) => {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  onStart = (e) => {
    $(e.target).closest(".grid").addClass("sortable-dragging-within");
    this.setState({
      dragPosn: null,
      activeDrags: this.state.activeDrags + 1,
    });
  };
  
  onStop = (e) => {
    $(".grid.sortable-dragging-within").removeClass("sortable-dragging-within");
    this.props.onChangeLayout(this.props.panel.key, this.state.deltaPosition);
    this.setState({
      dragPosn: {x: 0, y: 0},
      activeDrags: this.state.activeDrags - 1,
    });
  };
  
  onResize = (event, {element, size, handle}) => {
    this.props.onResize(this.props.panel.key, size, handle);
  };

  onClose = () => {
    this.props.onClosePanel(this.props.panel.key);
  };
  
  render() {
    const dragHandlers = {onDrag: this.handleDrag, onStart: this.onStart, onStop: this.onStop};
    
    // Panel orientation to be sent to PanelContent
    let o = this.props.panel;
         if(o.width*o.height === 1) o = "1x1";
    else if(o.width*o.height === 2) o = (o.width === 1) ? "1x2" : "2x1";
    else if(o.width*o.height === 4) o = "2x2";

    // Editing is enabled in the PanelGrid component
    // (allows dragging and resizing of Panels)
    if(this.props.editingEnabled) return (
      <Draggable handle=".panel__bar" cancel=".panel__bar > *"
                 grid={[324, 324]} bounds="parent" position={this.state.dragPosn} {...dragHandlers} >
        
        <Resizable height={this.props.panel.height*324 - 24} width={this.props.panel.width*324 - 24} minConstraints={[300, 300]} maxConstraints={[624, 624]}
                  onResize={this.onResize} draggableOpts={{grid: [324, 324]}} resizeHandles={this.props.resizeHandles}>
          
          <div className="panel panel--tab-panel" id={this.props.panel.name} orientation={o}
                style={{gridArea: (this.props.panel.col + 1) + " / " + (this.props.panel.row + 1) + " / span " + this.props.panel.height + " / span " + this.props.panel.width}}>
            <div className="panel__bar">
              <span className="panel__bar__title">
                {
                  this.props.panel.name.map((n, key) =>
                  <span key={key}
                        className={n === this.props.openPanel ? "selected" : undefined}
                        onClick={this.handleClickTab}>
                    { n }
                  </span>
                  )
                }
              </span>
              <span className="panel__bar__close" onClick={this.onClose} > X </span>
            </div>
            
            { this.props.openPanel === "Inventory" && <InventoryPanelContent orientation={o}/> }
            { this.props.openPanel === "Shortwave" && <ShortwavePanelContent orientation={o}/> }
            { this.props.openPanel === "Orbit" &&     <OrbitPanelContent     orientation={o}/> }
          </div>
          
        </Resizable>

      </Draggable>
    )

    // Editing is disabled in the PanelGrid component
    else return (
      <div className="panel panel--tab-panel" id={this.props.panel.name} orientation={o}
            style={{gridArea: (this.props.panel.col + 1) + " / " + (this.props.panel.row + 1) + " / span " + this.props.panel.height + " / span " + this.props.panel.width}}>
        <div className="panel__bar">
          <span className="panel__bar__title">
            {
              this.props.panel.name.map((n, key) =>
                <span key={key}
                      className={n === this.props.openPanel ? "selected" : undefined}
                      onClick={this.handleClickTab}>
                  { n }
                </span>
              )
            }
          </span>
        </div>
        
        { this.props.openPanel === "Inventory" && <InventoryPanelContent orientation={o}/> }
        { this.props.openPanel === "Shortwave" && <ShortwavePanelContent orientation={o}/> }
        { this.props.openPanel === "Orbit" &&     <OrbitPanelContent     orientation={o}/> }
      </div>
    )
  }
}

export default TabPanel;