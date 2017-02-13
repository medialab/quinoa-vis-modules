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
    this.rebootSigma();
    // launch forceAtlas if graph is not spatialized
    if (!props.data.spatialized && sigInst) {
      sigInst.startForceAtlas2({
        startingIterations: 1000
      });
      setTimeout(() => sigInst.stopForceAtlas2(), 1000);
    }
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

    const onCoordinatesUpdate = (event) => {
      const nextCamera = event.target;
      const coords = {
        cameraX: nextCamera.x,
        cameraY: nextCamera.y,
        cameraRatio: nextCamera.ratio,
        cameraAngle: nextCamera.angle,
      };
      this.setState({
        viewParameters: {
          ...this.state.viewParameters,
          ...coords
        }
      });
      this.onUserViewChange(coords, 'userevent');
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
      // launch forceAtlas if graph is not spatialized
      if (!nextProps.data.spatialized && sigInst) {
        sigInst.startForceAtlas2({
          startingIterations: 1000
        });
        setTimeout(() => sigInst.stopForceAtlas2(), 1000);
      }
    }

    // update sigma when state's data has changed
    if (JSON.stringify(this.state.data) !== JSON.stringify(nextState.data)) {
      this.rebootSigma();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.lastEventDate !== nextState.lastEventDate && typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange({
        lastEventType: nextState.lastEventType,
        viewParameters: nextState.viewParameters
      });
    }
    if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
      this.setState({
        viewParameters: nextProps.viewParameters
      });
    }
  }


  componentDidUpdate(prevProps, prev) {
    // If the graph has changed, we reset sigma
    if (prev.data !== this.state.data) {
      this.rebootSigma();
    }
    if (JSON.stringify(this.state.viewParameters.colorsMap) !== JSON.stringify(prev.viewParameters.colorsMap)) {
      this.rebootSigma();
    }
  }

  componentWillUnmount() {
    if (sigInst) {
      // Killing the renderer todo re set with new workflow
      sigInst.graph.clear();
      sigInst.refresh();
      sigInst.killRenderer(this.renderer);
      // sigInst = undefined;
    }
    // Releasing the camera
    // this.releaseCamera();
  }

  /**
   * Inits and re-spatialize sigma visualization
   */
  rebootSigma () {
    const props = {
      ...this.state.viewParameters,
      allowUserViewChange: this.props.allowUserViewChange
    };
    const visData = {
      nodes: this.state.data.nodes.map(node => ({
        ...node,
        // dynamically set color
        color: (props.colorsMap.nodes && (props.colorsMap.nodes[node.category] || props.colorsMap.nodes.default)) || props.colorsMap.default
      })),
      edges: this.state.data.edges.map(edge => ({
        ...edge,
        type: edge.type || 'undirected',
        color: (props.colorsMap.edges && (props.colorsMap.edges[edge.category] || props.colorsMap.edges.default)) || props.colorsMap.default
      }))
    };

    const SIGMA_SETTINGS = {
      labelThreshold: props.labelThreshold || 7,
      minNodeSize: props.minNodeSize || 2,
      edgeColor: 'default',
      defaultEdgeColor: (props.viewParameters && props.viewParameters.colorsMap && props.viewParameters.colorsMap.noCategory) || '#D1D1D1',
      sideMargin: props.sideMargin || 0,
      enableCamera: props.allowUserViewChange
    };
    if (sigInst === undefined) {
      sigInst = new sigma({
        settings: SIGMA_SETTINGS,
        graph: visData,
      });
      camera = sigInst.addCamera('main');
      camera.isAnimated = true;
    }
    else {
      sigInst.graph.clear();
      sigInst.graph.read(visData);
    }

    sigInst.refresh();
  }

  /**
   * Lets instance parent to know when user has updated view
   * @param {string} lastEventType - event type of the last event triggered by user
   */
  onUserViewChange (parameters, lastEventType) {
    this.setState({
      lastEventType,
      lastEventDate: new Date()
    });
  }
  /**
   * Renders the component
   */
  render() {
    const {
      allowUserViewChange = true
    } = this.props;

    return (
      <figure className={'quinoa-network' + (allowUserViewChange ? '' : ' locked')}>
        <div id="sigma-container" ref={div => (this.container = div)} />
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
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
      size: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })),
    edges: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      weight: PropTypes.number,
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
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
    // colorsMap: PropTypes.object, // commented because it cannot be specified a priori, which gets the linter on nerves
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

