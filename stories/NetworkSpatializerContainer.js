import React from 'react';
import Network from '../src/Network/Network';

export default class NetworkSpatializerContainer extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      baseParameters: {...props.baseParameters},
      activeParameters: {...props.baseParameters},
      data: props.data,
      allowUserViewChange: props.allowUserViewChange,
      spatializing: true
    }
    this.getNodesPositions = this.getNodesPositions.bind(this);
    this.toggleSpatialization = this.toggleSpatialization.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.getNodesPositions());
  }

  getNodesPositions() {
    const nodes = this.graph.getNodesPositions();
    this.setState({
      nodes
    });
  }

  toggleSpatialization() {
    this.setState({
      spatializing: !this.state.spatializing
    })
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
          <button onClick={this.getNodesPositions}>Get nodes positions</button>
          <button onClick={this.toggleSpatialization}>{this.state.spatializing ? 'Stop spatialization': 'Run spatialization'}</button>
          <pre>
            <code>
              {JSON.stringify(this.state.nodes, null, 2)}
            </code>
          </pre>
        </aside>
        <div style={{
          flex: 5,
          position: 'relative'
        }}>
          <Network 
            allowUserViewChange ={this.state.allowUserViewChange}
            forceAtlasActive={this.state.spatializing}
            data={this.state.data} 
            viewParameters = {this.state.activeParameters}
            ref={graph => {this.graph = graph}}
          />
        </div>
      </div>
    ) 
  }
}