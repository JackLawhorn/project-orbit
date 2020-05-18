import React from "react";
import $ from "jquery";

import AddPanel from "./AddPanel.js";
import Panel from "./Panel.js";
import TabPanel from "./TabPanel.js";

class PanelGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      panelLayout: [],
      baseKey: Math.random(),
    }

    this.onChangeLayout = this.onChangeLayout.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
    this.addPanel = this.addPanel.bind(this);
    this.getDragHandles = this.getDragHandles.bind(this);
    this.saveState = this.saveState.bind(this);
    this.newPanelKey = this.newPanelKey.bind(this);
    this.newBaseKey = this.newBaseKey.bind(this);
    this.handleTabOpen = this.handleTabOpen.bind(this);
  }

  
  componentDidMount() {
    var newLayout = [];
    var ls = JSON.parse(localStorage.getItem("panelLayout"));
    
    newLayout = (ls !== null) ? ls : [
      { name: "Shortwave", key: 0, row: 0, col: 1, width: 2, height: 1, },
      
      { name: ["Inventory", "Ship"], openPanel: "Inventory", key: 0, row: 0, col: 0, width: 2, height: 1, },
      { name: ["Orbit",   "System"], openPanel: "Orbit",     key: 1, row: 2, col: 0, width: 1, height: 2, },
    ];
    
    this.setState({
      panelLayout: newLayout,
    });
  }

  saveState() {
    // console.log(this.state.panelLayout);
    localStorage.setItem("panelLayout", JSON.stringify(this.state.panelLayout));
  }

  addPanel(panel) {
    panel.key = this.newPanelKey();
    if(Array.isArray(panel.name) && panel.name.length === 2)
      panel.openPanel = panel.name[0]

    this.setState({
      panelLayout: this.state.panelLayout.concat([panel]),
      baseKey: this.newBaseKey(),
    },() => {
      this.saveState();
    });
  }

  newPanelKey(oldKey) {
    var state = this.state;
    var newKey = Math.floor(Math.random()*100);
    var checkingUnique = true;

    while(checkingUnique) {
      if(newKey === oldKey) {
        newKey = Math.floor(Math.random()*100);
      }
      $(state.panelLayout).each(function(i, panel) {
        if(panel.key === newKey) {
          newKey = Math.floor(Math.random()*100);
          return;
        }
        else {
          if(i === state.panelLayout.length - 1 && newKey !== oldKey) checkingUnique = false;
        }
      })
    }
    return newKey;
  }

  newBaseKey() {
    var newKey = Math.random();
    while(this.state.baseKey === newKey) {
      newKey = Math.random();
    }
    return newKey;
  }

  validLayout(layout) {
    var map = {}, result = true;
    $(layout).each(function(i, panel) {
      if(panel.row + panel.width > 3 || panel.col + panel.height > 3)
        result = false;

      if(map[panel.row + ", " + panel.col] === undefined)
         map[panel.row + ", " + panel.col] = true;
      else result = false;

      if(panel.width > 1) {
        if(map[(panel.row+1) + ", " + panel.col] === undefined)
           map[(panel.row+1) + ", " + panel.col] = true;
        else result = false;
      }

      if(panel.height > 1) {
        if(map[panel.row + ", " + (panel.col+1)] === undefined)
           map[panel.row + ", " + (panel.col+1)] = true;
        else result = false;
      }

      if(panel.width > 1 && panel.height > 1) {
        if(map[(panel.row+1) + ", " + (panel.col+1)] === undefined)
           map[(panel.row+1) + ", " + (panel.col+1)] = true;
        else result = false;
      }

      if(result === false) return false;
    });
    return result;
  }

  getDragHandles(panel) {
    const layout = this.getLayout();
    var result = [];

    // Add WEST resize handle
    if(panel.width === 2 ||
       (panel.width === 1 && (
          panel.row !== 0 && layout.filledSpaces.indexOf((panel.row-1) + ", " + panel.col) < 0 &&
          !(panel.height === 2 && layout.filledSpaces.indexOf((panel.row-1) + ", " + (panel.col+1)) >= 0))
       ))
      result.push("w");

    // Add SOUTH resize handle
    if(panel.height === 2 ||
      (panel.height === 1 && (
         panel.col !== 2 && layout.filledSpaces.indexOf(panel.row + ", " + (panel.col+1)) < 0 &&
         !(panel.width === 2 && layout.filledSpaces.indexOf((panel.row+1) + ", " + (panel.col+1)) >= 0))
      ))
      result.push("s");
    
    // Add EAST resize handles
    if(panel.width === 2 ||
      (panel.width === 1 && (
         panel.row !== 2 && layout.filledSpaces.indexOf((panel.row+1) + ", " + panel.col) < 0 &&
         !(panel.height === 2 && layout.filledSpaces.indexOf((panel.row+1) + ", " + (panel.col+1)) >= 0))
      ))
      result.push("e");

    return result;
  }

  getLayout() {
    var y = [], n = [];
    const layout = this.state.panelLayout;
    var coords = {
      "0, 0": 0, "1, 0": 0, "2, 0": 0,
      "0, 1": 0, "1, 1": 0, "2, 1": 0,
      "0, 2": 0, "1, 2": 0, "2, 2": 0,
    };
    
    $(layout).each(function(i, panel) {
      coords[panel.row + ", " + panel.col]++;

      if(panel.width > 1)
        coords[(panel.row+1) + ", " + panel.col]++;
      
      if(panel.height > 1)
        coords[panel.row + ", " + (panel.col+1)]++;
      
      if(panel.width > 1 && panel.height > 1)
        coords[(panel.row) + ", " + (panel.col)]++;
    });

    $(Object.keys(coords)).each(function(i, posn) {
      if(coords[posn] === 0) n.push(posn);
      else y.push(posn);
    })
    return { filledSpaces: y, emptySpaces: n };
  }

  onChangeLayout(key, panelDeltas) {
    const newPanelKey = this.newPanelKey;
    var newLayout = JSON.parse(JSON.stringify(this.state.panelLayout));
    $(newLayout).each(function(i, panel) {
      if(JSON.stringify(panel.key) === JSON.stringify(key)) {
        panel.row += Math.max(-1*panel.row, Math.round(panelDeltas.x/324));
        panel.col += Math.max(-1*panel.col, Math.round(panelDeltas.y/324));
        panel.key  = newPanelKey(panel.key);
      }
    });

    if(this.validLayout(newLayout)) {
      this.setState({
        panelLayout: newLayout,
        baseKey: this.newBaseKey(),
      },() => {
        this.saveState();
      });
    }
    else {
      $(".panel").css({transform: "translate(0px, 0px)"});
      window.setTimeout(() => {
        newLayout = JSON.parse(JSON.stringify(this.state.panelLayout));
        $(newLayout).each(function(i, panel) {
          if(JSON.stringify(panel.key) === JSON.stringify(key)) {
            panel.key = newPanelKey(panel.key);
          }
        });
        this.setState({
          panelLayout: newLayout,
        });
      }, 200);
    }
  }

  onResize(key, panelSize, handle) {
    const newPanelKey = this.newPanelKey;
    var newLayout = JSON.parse(JSON.stringify(this.state.panelLayout));
    $(newLayout).each(function(i, panel) {
      if(JSON.stringify(panel.key) === JSON.stringify(key)) {
        // Row correction for left resize handle
        if(handle === "w") {
          var oldW = panel.width + 0;
          var newW = Math.floor(panelSize.width/300);
          
          if(newW > oldW) panel.row -= 1;      // Expanding left
          else if(newW < oldW) panel.row += 1; // Shrinking right
        }

        panel.width  = Math.floor(panelSize.width/300);
        panel.height = Math.floor(panelSize.height/300);
        panel.key    = newPanelKey(panel.key);
      }
    });

    if(this.validLayout(newLayout)) {
      this.setState({
        panelLayout: newLayout,
        baseKey: this.newBaseKey(),
      },() => {
        this.saveState();
      });
    }
  }

  handleTabOpen(key, open) {
    const newPanelKey = this.newPanelKey;
    var newLayout = JSON.parse(JSON.stringify(this.state.panelLayout));
    $(newLayout).each(function(i, panel) {
      if(JSON.stringify(panel.key) === JSON.stringify(key)) {  
        panel.openPanel = open;
        panel.key       = newPanelKey(panel.key);
      }
    });

    if(this.validLayout(newLayout)) {
      this.setState({
        panelLayout: newLayout,
      },() => {
        this.saveState();
      });
    }
  }

  onClosePanel(key) {

    var newLayout = [];
    $(this.state.panelLayout).each(function(i, panel) {
      if(panel.key !== key) newLayout.push(panel);
    });

    if(this.validLayout(newLayout)) {
      this.setState({
        panelLayout: newLayout,
        baseKey: this.newBaseKey(),
      },() => {
        this.saveState();
      });
    }
  }

  render() {
    
    return (
      <div className="grid" editingenabled={this.props.editingEnabled === true ? "enabled" : undefined}>
        {
          this.props.editingEnabled &&
            this.getLayout().filledSpaces.map((coords, key) => {
              var x = parseInt(coords.substring(0, coords.indexOf(", "))),
                  y = parseInt(coords.substring(coords.indexOf(", ") + 2));

              return (
                <AddPanel panel={{ name: "", row: x, col: y, width: 1, height: 1, }}
                          addPanel={this.addPanel} key={this.state.baseKey + key} />
              );
            })
        }
        {
          this.state.panelLayout.map((panel, key) => (
            !Array.isArray(panel.name) &&
              <Panel panel={panel} id={panel.key} key={panel.key}
                editingEnabled={this.props.editingEnabled}
                resizeHandles={this.getDragHandles(panel)}
                onChangeLayout={this.onChangeLayout}
                onResize={this.onResize}
                onClosePanel={this.onClosePanel} />
          ))
        }
        {
          this.state.panelLayout.map((panel, key) => (
            Array.isArray(panel.name) &&
              <TabPanel panel={panel} id={panel.key} key={panel.key}
                openPanel={panel.openPanel}
                handleTabOpen={this.handleTabOpen}
                resizeHandles={this.getDragHandles(panel)}
                editingEnabled={this.props.editingEnabled}
                onChangeLayout={this.onChangeLayout}
                onResize={this.onResize}
                onClosePanel={this.onClosePanel} />
          ))
        }
        {
          this.props.editingEnabled &&
            this.getLayout().emptySpaces.map((coords, key) => {
              var x = parseInt(coords.substring(0, coords.indexOf(", "))),
                  y = parseInt(coords.substring(coords.indexOf(", ") + 2));

              return (
                <AddPanel panel={{ name: "", row: x, col: y, width: 1, height: 1, }}
                          addPanel={this.addPanel} key={this.state.baseKey + key} />
              );
            })
        }
      </div>
    )
  }
}

export default PanelGrid;