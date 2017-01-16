import React from 'react';
import Map from '../src/Map/Map';

export default class MapStoryContainer extends React.Component {

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
    const cameraZoom = parseInt(Math.random() * 5) + 4;
    const cameraX = this.state.activeParameters.cameraX + Math.random() * 4 - 2;
    const cameraY = this.state.activeParameters.cameraY + Math.random() * 4 - 2;
    this.setState({
      activeParameters: {
        ...this.state.activeParameters,
        cameraZoom,
        cameraX,
        cameraY
      }
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
          <button onClick={this.changeState}>Change state</button>
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