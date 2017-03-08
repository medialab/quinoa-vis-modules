/* eslint no-undef: 0 */

import React, {Component, PropTypes} from 'react';

import {debounce} from 'lodash';

import Sigma from 'react-sigma/lib/Sigma';
import ForceAtlas2 from 'react-sigma/lib/ForceAtlas2';

import chroma from 'chroma-js';

require('gexf');

import './Network.scss';

class Network extends Component {

  constructor(props, context) {
    super(props, context);
    this.onCoordinatesUpdate = debounce(this.onCoordinatesUpdate.bind(this), 100);
    this.getNodesPositions = this.getNodesPositions.bind(this);
    const state = {
      data: props.data,
      viewParameters: {...props.viewParameters}
    };

    this.state = state;

    this.buildVisData = this.buildVisData.bind(this);
  }

  componentDidMount() {
    const visData = this.buildVisData(this.props.data, this.props.viewParameters);
    setTimeout(() => {
      if (this.sigma) {
        this.sigma.sigma.graph.clear();
      }
      this.setState({
        visData,
        data: this.props.data
      });

      const coords = {
        x: this.props.viewParameters.cameraX,
        y: this.props.viewParameters.cameraY,
        angle: this.props.viewParameters.cameraAngle,
        ratio: this.props.viewParameters.cameraRatio,
      };
      if (this.sigma) {
        const camera = this.sigma.sigma.cameras[0];
        camera.isAnimated = true;
        camera.goTo(coords);
        camera.bind('coordinatesUpdated', this.onCoordinatesUpdate);
      }
    });
  }


  componentWillReceiveProps(nextProps) {
    if (
      this.props.data !== nextProps.data ||
      this.props.viewParameters.dataMap !== nextProps.viewParameters.dataMap ||
      this.props.viewParameters.shownCategories !== nextProps.viewParameters.shownCategories ||
      this.props.viewParameters.colorsMap !== nextProps.viewParameters.colorsMap
    ) {
      const visData = this.buildVisData(nextProps.data, nextProps.viewParameters);
      if (this.sigma) {
        this.sigma.sigma.graph.clear();
      }
      this.setState({
        visData,
        data: nextProps.data,
        viewParameters: nextProps.viewParameters
      });
    }
    if (
      // this.props.viewParameters !== nextProps.viewParameters  // ||
      JSON.stringify(this.state.viewParameters) !== JSON.stringify(nextProps.viewParameters)
    ) {
      const coords = {
        x: nextProps.viewParameters.cameraX,
        y: nextProps.viewParameters.cameraY,
        angle: nextProps.viewParameters.cameraAngle,
        ratio: nextProps.viewParameters.cameraRatio,
      };
      if (this.sigma) {
        const camera = this.sigma.sigma.cameras[0];
        sigma.misc.animation.camera(
          camera,
          coords,
          {
            duration: 500
          }
        );
      }
      this.setState({
        viewParameters: nextProps.viewParameters
      });
    }
  }

  buildVisData(data, viewParameters) {
    const shownCats = viewParameters.shownCategories;
    return {
      nodes: data.nodes
        .map(node => {
          const category = node.category === undefined ? 'default' : node.category;
          const color = (viewParameters.colorsMap.nodes &&
                  (viewParameters.colorsMap.nodes[category]
                    || viewParameters.colorsMap.nodes.default))
                  || viewParameters.colorsMap.default;
          return {
          ...node,
          // dynamically set color
          color: (!shownCats || !shownCats.nodes) || (shownCats.nodes.find(cat => cat + '' === category + '') !== undefined)
                  ? color : chroma(color).desaturate(5).brighten().hex()
          };
      }),
      edges: data.edges
        .map(edge => {
          const category = edge.category === undefined ? 'default' : node.category;
          const color = (viewParameters.colorsMap.edges &&
                    (viewParameters.colorsMap.edges[category]
                      || viewParameters.colorsMap.edges.default)
                    )
                    || viewParameters.colorsMap.default;
          return {
            ...edge,
            type: edge.type || 'undirected',
            color: (!shownCats || !shownCats.edges) || (shownCats.edges.find(cat => cat + '' === category + '') !== undefined)
                  ? color : chroma(color).desaturate(5).brighten().alpha(0.2).hex()
          };
         })
    };
  }

  getNodesPositions () {
    const nodes = this.sigma.sigma.graph.nodes();
    return nodes.map(node => ({
      x: node.x,
      y: node.y,
      id: node.id
    }));
  }

  onCoordinatesUpdate (event) {
    const nextCamera = event.target;
    const coords = {
      cameraX: nextCamera.x,
      cameraY: nextCamera.y,
      cameraRatio: nextCamera.ratio,
      cameraAngle: nextCamera.angle,
    };
    if (typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange({
        viewParameters: {
          ...this.state.viewParameters,
          ...coords
        },
        lastEeventType: 'userevent'
      });
    }
  }
  /**
   * Renders the component
   */
  render() {
    const {
      allowUserViewChange = true,
      forceAtlasActive = false,
      viewParameters
    } = this.props;
    const {
      visData
    } = this.state;

    const bindSigInst = comp => {
      this.sigma = comp;
    };

    const settings = {
      drawEdges: true,
      ...viewParameters,
      mouseEnabled: allowUserViewChange
    };

    if (visData) {
      return forceAtlasActive ?
      (
        <figure className={'quinoa-network' + (allowUserViewChange ? '' : ' locked')}>
          <Sigma
            style={{width: '100%', height: '100%'}}
            graph={visData}
            ref={bindSigInst}
            settings={settings}>
            <ForceAtlas2
              worker
              barnesHutOptimize
              barnesHutTheta={0.6}
              iterationsPerRender={10}
              linLogMode />
          </Sigma>
        </figure>
      )
      : (
        <figure className={'quinoa-network' + (allowUserViewChange ? '' : ' locked')}>
          <Sigma
            style={{width: '100%', height: '100%'}}
            graph={visData}
            ref={bindSigInst}
            settings={settings} />
        </figure>
      );
    }
    return null;
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
      ])
    })),
    spatialized: PropTypes.bool
  }),
  /*
   * Spatialization related
   */
   forceAtlasActive: PropTypes.bool,
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
    // shownCategories: PropTypes.object, // commented because it cannot be specified a priori, which gets the linter on nerves
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

