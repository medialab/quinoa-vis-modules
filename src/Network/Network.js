import React, {Component, PropTypes} from 'react';
require('gexf');

import './Graph.scss';

/**
 * Constants.
 */
// TODO : this should be in visualization invariant params,
// and parametrized while creating/parametrizing the whole story
const SIGMA_SETTINGS = {
  labelThreshold: 7,
  minNodeSize: 2,
  edgeColor: 'default',
  defaultEdgeColor: '#D1D1D1',
  sideMargin: 0
};

/**
 * Sigma instance.
 */
const sigInst = new sigma({
  settings: SIGMA_SETTINGS
});

const camera = sigInst.addCamera('main');
camera.isAnimated = true;

class Network extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

    // hack - todo : clean
    const data = new DOMParser().parseFromString(this.props.data[0].gexf, 'application/xml');
    // Adding the relevant renderer
    this.renderer = sigInst.addRenderer({
      container: this.container,
      camera: 'main'
    });

    // Loading the graph
    sigma.parsers.gexf(
      data,
      sigInst,
      () => sigInst.refresh()
    );

    // Hooking into the camera
    // this.releaseCamera = monkeyPatchCamera(this.updateSlide);

    const onCoordinatesUpdate = () => {
      const coords = {
        cameraX: camera.x,
        cameraY: camera.y,
        cameraRatio: camera.ratio,
        cameraAngle: camera.angle,
      };
      this.props.updateView(coords);
    };

    camera.bind('coordinatesUpdated', onCoordinatesUpdate);
  }

  componentWillUpdate (next) {
    if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(next.viewParameters)) {
      const coords = {
        x: next.viewParameters.cameraX,
        y: next.viewParameters.cameraY,
        angle: next.viewParameters.cameraAngle,
        ratio: next.viewParameters.cameraRatio,
      };
      camera.goTo(coords);
      sigInst.refresh();
    }
  }

  componentDidUpdate(prev) {
    // If the graph has changed, we reset sigma
    if (prev.data !== this.props.data) {
      const data = new DOMParser().parseFromString(this.props.data[0].gexf, 'application/xml');
      sigInst.graph.clear();
      sigma.parsers.gexf(
        data,
        sigInst,
        () => {
          // camera.goTo({x: 0, y: 0, angle: 0, ratio: 1});
          camera.goTo();
          sigInst.refresh();
          sigInst.loadCamera('main');
        }
      );
    }
  }

  componentWillUnmount() {
    // Killing the renderer
    sigInst.killRenderer(this.renderer);
    // Releasing the camera
    // this.releaseCamera();
  }

  render() {
    return (
      <div id="sigma-container" ref={div => (this.container = div)} />
    );
  }
}

Network.propTypes = {
  /*
   * Incoming data in json format
   */
  // data: PropTypes.array, // commented to avoid angrying eslint that does not like unprecised arrays as proptypes
  /*
   * string describing how input data is structured (gexf or graphML)
   */
  dataStructure: PropTypes.oneOf(['gexf', 'graphML']),
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not)
   */
  viewParameters: PropTypes.shape({
    /*
     * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
     */
    dataMap: PropTypes.shape({
      title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      category: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ])
    }),
    /*
     * Camera position related parameters
     */
    cameraX: PropTypes.number,
    cameraY: PropTypes.number,
    cameraZoom: PropTypes.number,
    cameraAngle: PropTypes.number
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

