import React from 'react';
import SVGViewer from '../src/SVGViewer/SVGViewer';

export default class SVGtoryContainer extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      baseParameters: {...props.baseParameters},
      activeParameters: {...props.baseParameters},
      data: props.data,
      allowUserViewChange: true
    }
    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    const x = parseInt(Math.random() * 1000  - 500);
    const y = parseInt(Math.random() * 1000  - 500);
    const zoomLevel = parseInt(Math.random() * 100 - 200);
    console.log(x, y, zoomLevel);
    this.setState({
      activeParameters: {
        ...this.state.activeParameters,
        x,
        y,
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
        <aside style={{zIndex: 1000}}>
          <button onClick={this.changeState}>Change state</button>
        </aside>
        <div style={{
          flex: 5,
          position: 'relative'
        }}>
          <SVGViewer 
            allowUserViewChange ={this.state.allowUserViewChange}
            data={this.state.data} 
            viewParameters = {this.state.activeParameters}
          />
        </div>
      </div>
    ) 
  }
}