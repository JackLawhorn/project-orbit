import React from "react";
import $ from "jquery";

class AddPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      panel: {},
      multi: null,
      panelTypes: [],
    }
  }
  
  componentDidMount() {
    var panelTypes = [
      "Inventory",
      "Orbit",
      "Ship",
      "Shortwave",
      "System",
    ];
    
    this.setState({
      panel: this.props.panel,
      panelTypes: panelTypes,
    });
    this.handleSelectMultiple = this.handleSelectMultiple.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.init = this.init.bind(this);
  }

  init() {
    if(this.state.multi === null)
      this.setState({
        multi: [],
      })
  }

  handleSelectMultiple(e) {
    if(this.state.multi.length === 2) return;

    this.setState({
      multi: this.state.multi.concat($(e.target).children("option:selected").val()),
    });
  }

  handleConfirm(e) {
    var multi = this.state.multi.concat([]);
    var newPanel = this.state.panel;
    newPanel.name =  multi.length === 2 ? multi : multi[0];

    this.setState({
      panel: newPanel,
    }, () => {
      this.props.addPanel(this.state.panel);
    });
  }
  
  render() {
    return (
      <div className="panel panel--add-panel" inprocess={this.state.multi != null ? "inprocess" : undefined}
           style={{gridArea: (this.props.panel.col + 1) + " / " + (this.props.panel.row + 1) + " / span " + this.props.panel.height + " / span " + this.props.panel.width}}
           onClick={this.init} >
        {
          this.state.multi !== null && (
            <label>
              <div>Select up to two:</div>
              <select className="select select__multiple"
                      multiple="multiple" value={this.state.multi}
                      onChange={() => {}} onInput={this.handleSelectMultiple}>
                {
                  this.state.panelTypes.map((panel, key) => {
                    return (
                      <option className="select__option" value={panel} key={key}>{panel}</option>
                    )
                  })
                }
              </select>
              <button className="button" onClick={this.handleConfirm}
                      disabled={this.state.multi != null && this.state.multi.length === 0 ? "disabled" : undefined}>
                Confirm
              </button>
            </label>
          )
        }
      </div>
    )
  }
}

export default AddPanel;