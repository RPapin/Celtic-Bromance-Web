import React from 'react';

import './index.css';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    let adminLocal = localStorage.getItem('admin')
    if(adminLocal){
      if (this.state.selectedItem === null ) {
        const selectedItem = this.props.determinedWinner === false ? Math.floor( Math.random() * this.props.items.length) : this.props.determinedWinner;
        if (this.props.onSelectItem) {
          this.props.onSelectItem(selectedItem);
        }
        this.setState({ selectedItem });
        this.props.onFinished(selectedItem, this.props.determinedWinner)
        
      } else {
        this.setState({ selectedItem: null });
        this.props.onFinished(false)
        setTimeout(this.selectItem, 500);
      }
    }
  }

  componentDidMount() {
    if(this.props.determinedWinner !== false){
      setTimeout(() => {
        document.getElementById("wheel-id").click();
      }, 500)
    }
  }

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;
    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';
    return (
      <div id="wheel-container" >
        <div className={`wheel ${spinning}`} style={wheelVars} onClick={this.selectItem} id="wheel-id">
          {items.map((item, index) => (
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
