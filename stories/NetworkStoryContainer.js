import React from 'react';
import Network from '../src/Network/Network';

export default class NetworkStoryContainer extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      baseParameters: {...props.baseParameters},
      activeParameters: {...props.baseParameters},
      data: props.data,
      allowUserViewChange: props.allowUserViewChange
    }
    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    const fromYear = parseInt(Math.random() * 700 + 1300);
    const toYear = parseInt(Math.random() * (2000 - fromYear) + fromYear);
    const cameraRatio = (Math.random() * 4);
    const cameraX = Math.random() * 200 - 100;
    const cameraY = Math.random() * 200 - 100;
    this.setState({
      activeParameters: {
        ...this.state.activeParameters,
        cameraX,
        cameraY,
        cameraRatio
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
          <Network 
            allowUserViewChange ={this.state.allowUserViewChange}
            data={this.state.data} 
            viewParameters = {this.state.activeParameters}
          />
        </div>
      </div>
    ) 
  }
}