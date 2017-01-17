import React from 'react';
import Map from '../src/Map/Map';

export default class MapLockSwitcher extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      baseParameters: {...props.baseParameters},
      activeParameters: {...props.baseParameters},
      mapData: props.mapData,
      allowUserViewChange: props.allowUserViewChange
    }
    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    this.setState({
      allowUserViewChange: !this.state.allowUserViewChange
    });
  }

  render() {
      return (
        <div style={{
        display: 'flex',
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <aside>
          <button onClick={this.changeState}>{this.state.allowUserViewChange ? 'Lock': 'Unlock'}</button>
        </aside>
        <div style={{
          flex: 5,
          position: 'relative'
        }}>
          <Map 
            allowUserViewChange ={this.state.allowUserViewChange}
            data={this.state.mapData} 
            viewParameters = {this.state.activeParameters}
          />
        </div>
      </div>
    ) 
  }
}