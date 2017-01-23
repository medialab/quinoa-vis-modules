import React, {Component, PropTypes} from 'react';
import {debounce} from 'lodash';
require('gexf');

import './Network.scss';

let sigInst;
let camera;

class Network extends Component {

  constructor(props, context) {
    super(props, context);
    this.onUserViewChange = debounce(this.onUserViewChange, 100);
    const state = {
      data: props.data,
      viewParameters: props.viewParameters
    };

    this.state = state;

    this.rebootSigma = this.rebootSigma.bind(this);
  }

  componentDidMount() {
    this.rebootSigma();
    // Adding the relevant renderer
    this.renderer = sigInst.addRenderer({
      container: this.container,
      type: 'canvas',
      camera
    });
    sigInst.refresh();

    // // Hooking into the camera
    // // this.releaseCamera = monkeyPatchCamera(this.updateSlide);

    const onCoordinatesUpdate = () => {
      const coords = {
        cameraX: camera.x,
        cameraY: camera.y,
        cameraRatio: camera.ratio,
        cameraAngle: camera.angle,
      };
      this.setState({
        viewParameters: {
          ...this.state.viewParameters,
          coords
        }
      });
      this.onUserViewChange('userevent');
    };

    camera.bind('coordinatesUpdated', onCoordinatesUpdate);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
      this.setState({
        viewParameters: nextProps.viewParameters
      });
        const coords = {
        x: nextProps.viewParameters.cameraX,
        y: nextProps.viewParameters.cameraY,
        angle: nextProps.viewParameters.cameraAngle,
        ratio: nextProps.viewParameters.cameraRatio,
      };
      camera.goTo(coords);
      sigInst.refresh();
    }
    // update state's data when props update data
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.setState({
        data: nextProps.data
      });
    }

    // update sigma when state's data has changed
    if (JSON.stringify(this.state.data) !== JSON.stringify(nextState.data)) {
      this.rebootSigma();
    }
  }


  componentDidUpdate(prevProps, prev) {
    // If the graph has changed, we reset sigma
    if (prev.data !== this.state.data) {
      sigInst.graph.clear();
      this.rebootSigma();
    }
  }

  componentWillUnmount() {
    if (sigInst) {
      // Killing the renderer todo re set with new workflow
      // sigInst.killRenderer(this.renderer);
    }
    // Releasing the camera
    // this.releaseCamera();
  }

  /**
   * Inits and re-spatialize sigma visualization
   */
  rebootSigma () {
    const props = this.state.viewParameters;
    const visData = {
      nodes: this.state.data.nodes.map(node => ({
        ...node,
        // dynamically set color
        color: props.colorsMap[node.category] || props.colorsMap.noCategory
      })),
      edges: this.state.data.edges.map(edge => ({
        ...edge,
        type: edge.type || 'undirected'
      }))
    };

    const SIGMA_SETTINGS = {
      labelThreshold: props.labelThreshold || 7,
      minNodeSize: props.minNodeSize || 2,
      edgeColor: 'default',
      defaultEdgeColor: (props.colorsMap && props.colorsMap.noCategory) || '#D1D1D1',
      sideMargin: props.sideMargin || 0
    };
    sigInst = new sigma({
      // settings: SIGMA_SETTINGS,
      // graph: state.data,
      // container: 'sigma-container'
      settings: SIGMA_SETTINGS,
      graph: visData,
      // container: this.container,
      // renderer: {
      //   container: this.container,
      //   type: 'svg'
      // }
    });
    camera = sigInst.addCamera('main');
    camera.isAnimated = true;

    // launch forceAtlas if graph is not spatialized
    if (!this.state.data.spatialized) {
      sigInst.refresh();
      sigInst.startForceAtlas2({
        startingIterations: 1000
      });
      setTimeout(() => sigInst.stopForceAtlas2(), 1000);
    }
  }

  /**
   * Lets instance parent to know when user has updated view
   * @param {string} lastEventType - event type of the last event triggered by user
   */
  onUserViewChange (lastEventType) {
    if (typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange({
        lastEventType,
        // todo: verify if not next state needed ?
        viewParameters: this.state.viewParameters
      });
    }
  }
  /**
   * Renders the component
   */
  render() {
    const {
      allowUserViewChange
    } = this.props;

    return (
      <figure className={'quinoa-network' + (allowUserViewChange ? '' : ' locked')}>
        <div id="sigma-container" ref={div => (this.container = div)} />
        {allowUserViewChange ? '' : <div id="interaction-cache" />}
      </figure>
    );
  }
}

Network.propTypes = {
  /*
   * Incoming data
   */
  data: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      size: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
      id: PropTypes.string
    })),
    edges: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      weight: PropTypes.number,
      id: PropTypes.string,
      source: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      target: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      spatialized: PropTypes.bool
    }))
  }),
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not)
   */
  viewParameters: PropTypes.shape({
    /*
     * Camera position related parameters
     */
    cameraX: PropTypes.number,
    cameraY: PropTypes.number,
    cameraRatio: PropTypes.number,
    cameraAngle: PropTypes.number,
    /*
     * Graph settings parameters
     */
    labelThreshold: PropTypes.number,
    minNodeSize: PropTypes.number,
    sideMargin: PropTypes.number
  }),
  /*
   * boolean to specify whether the user can pan/pan/interact or not with the view
   */
  allowUserViewChange: PropTypes.bool,
  /*
   * callback fn triggered when user changes view parameters, callbacks data about the triggering interaction and about the new view parameters
   */
  onUserViewChange: PropTypes.func
};


export default Network;

