/* eslint no-undef: 0 */
/**
 * This module exports a stateful customizable network component
 * @module quinoa-vis-modules/Network
 */

import React, {Component, PropTypes} from 'react';

import {debounce} from 'lodash';
// component uses sigma and react-sigma as a renderer
import Sigma from 'react-sigma/lib/Sigma';
import ForceAtlas2 from 'react-sigma/lib/ForceAtlas2';

import chroma from 'chroma-js';
// gexf is a lib that allows to manipulate xml/gexf data
require('gexf');

import './Network.scss';

/**
 * Network class for building network react component instances
 */
class Network extends Component {
  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   * @param {object} context - context given to instance at instanciation
   */
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

  /**
   * Executes code after the component was mounted
   */
  componentDidMount() {
    // we build data with proper params/data mapping
    const visData = this.buildVisData(this.props.data, this.props.viewParameters);
    // component mounting has to be wrapped in a timeout
    // to let sigma initialize a first time
    setTimeout(() => {
      // for security we first clear the graph
      if (this.sigma) {
        this.sigma.sigma.graph.clear();
      }
      // vis will be reloaded with correct data
      this.setState({
        visData,
        data: this.props.data
      });

      const coordinates = {
        x: this.props.viewParameters.cameraX,
        y: this.props.viewParameters.cameraY,
        angle: this.props.viewParameters.cameraAngle,
        ratio: this.props.viewParameters.cameraRatio,
      };
      if (this.sigma) {
        // we position the camera to its first position
        const camera = this.sigma.sigma.cameras[0];
        camera.isAnimated = true;
        camera.goTo(coordinates);
        camera.bind('coordinatesUpdated', this.onCoordinatesUpdate);
      }
    });
  }

  /**
   * Executes code when props change
   * @param {nextProps} - props to come
   */
  componentWillReceiveProps(nextProps) {
    if (
      // these are all the cases in which the vis data has to be rebuilt
      this.props.data !== nextProps.data ||
      this.props.viewParameters.dataMap !== nextProps.viewParameters.dataMap ||
      this.props.viewParameters.shownCategories !== nextProps.viewParameters.shownCategories ||
      this.props.viewParameters.colorsMap !== nextProps.viewParameters.colorsMap
    ) {
      const visData = this.buildVisData(nextProps.data, nextProps.viewParameters);
      if (this.sigma) {

        // this is a first method to updating graph by mutating its data directly (witness benchmark: 2242 ms)
        // (Guillaume told me there is a better way to do that but we did not have the time to see it together)
        // const nodes = this.sigma.sigma.graph.nodes();
        // const edges = this.sigma.sigma.graph.edges();

        // const nodesToDelete = nodes.filter(node => visData.nodes.find(node2 => node.id === node2.id) === undefined);
        // const edgesToDelete = edges.filter(edge => visData.edges.find(edge2 => edge.id === edge2.id) === undefined);
        // const nodesToAdd = visData.nodes.filter(node => nodes.find(node2 => node.id === node2.id) === undefined);
        // const edgesToAdd = visData.edges.filter(edge => edges.find(edge2 => edge.id === edge2.id) === undefined);

        // nodesToAdd.forEach(node => this.sigma.sigma.graph.addNode(node));
        // nodesToDelete.forEach(node => this.sigma.sigma.graph.dropNode(node.id));
        // edgesToAdd.forEach(edge => this.sigma.sigma.graph.addEdge(edge));
        // edgesToDelete.forEach(edge => this.sigma.sigma.graph.dropEdge(edge.id));
        // this.sigma.sigma.graph.nodes().forEach(node => {
        //   const newNode = visData.nodes.find(n => n.id === node.id);
        //   node = newNode;
        // });
        // this.sigma.sigma.graph.edges().forEach(edge => {
        //   const newEdge = visData.edges.find(e => e.id === edge.id);
        //   edge = newEdge;
        // });

        // this is a second method to updating graph by clearing it and reloading (witness benchmark: 227 ms - adopted)
        this.sigma.sigma.graph.clear();
        this.sigma.sigma.graph.read(visData);
        this.sigma.sigma.refresh();
      }
      this.setState({
        visData,
        data: nextProps.data,
        viewParameters: nextProps.viewParameters
      });
    }
    if (
      // we hard compare the view parameters values
      // (todo: this is an expensive quickfix that should not be necessary)
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
            duration: 500// todo: put that elsewhere, as a config variable
          }
        );
      }
      this.setState({
        viewParameters: nextProps.viewParameters
      });
    }
  }
  /**
   * Executes code after component updated
   * @param {object} prevState - the state before update
   * @param {object} prevProps - the props before update
   */
  componentDidUpdate(prevState, prevProps) {
    // forcing update for graph settings changes
    if (prevState.viewParameters.labelThreshold !== this.state.viewParameters.labelThreshold) {
      if (this.sigma) {
        this.sigma.sigma.renderers[0].settings('labelThreshold', this.state.viewParameters.labelThreshold);
        this.sigma.sigma.refresh();
      }
    }
    if (prevState.viewParameters.minNodeSize !== this.state.viewParameters.minNodeSize) {
      if (this.sigma) {
        this.sigma.sigma.renderers[0].settings('minNodeSize', this.state.viewParameters.minNodeSize);
        this.sigma.sigma.refresh();
      }
    }
    if (prevProps.allowUserViewChange !== this.props.allowUserViewChange && this.sigma) {
      this.sigma.sigma.settings('mouseEnabled', this.props.allowUserViewChange);
    }
  }
  /**
   * Builds a js representation of the graph data
   * that fits with active filters and colors map
   * @param {object} data - the data to consume
   * @param {object} viewParameters - the view parameters(including colorsMap and shownCategories) to consume
   * @return {object} graphData - consumable graph data
   */
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
          const category = edge.category === undefined ? 'default' : edge.category;
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
  /**
   * Extracts from current graph data the position of the nodes
   * @return {array} nodes --> a representation of the nodes positions (+ their id)
   */
  getNodesPositions () {
    const nodes = this.sigma.sigma.graph.nodes();
    return nodes.map(node => ({
      x: node.x,
      y: node.y,
      id: node.id
    }));
  }
  /**
   * Wraps sigma's camera change event and triggers proper callbacks
   * @param {object} event - the sigma-triggered event
   */
  onCoordinatesUpdate (event) {
    const nextCamera = event.target;
    const coordinates = {
      cameraX: nextCamera.x,
      cameraY: nextCamera.y,
      cameraRatio: nextCamera.ratio,
      cameraAngle: nextCamera.angle,
    };
    if (typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange({
        viewParameters: {
          ...this.state.viewParameters,
          ...coordinates
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
      // Component can handle forceAtlas2 spatialization on its data
      // or not
      return forceAtlasActive ?
      // with forceAtlas
      (
        <figure className={'quinoa-network' + (allowUserViewChange ? '' : ' locked')}>
          <Sigma
            style={{width: '100%', height: '100%'}}
            graph={visData}
            ref={bindSigInst}
            settings={settings}>
            {/*
              react-sigma uses a weird way to specify parameters through children components
              but that's life.
             */}
            <ForceAtlas2
              worker
              barnesHutOptimize
              barnesHutTheta={0.6}
              iterationsPerRender={10}
              linLogMode />
          </Sigma>
        </figure>
      )
      // without force atlas
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

/**
 * Static properties types of the component
 */
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
    colorsMap: PropTypes.object,
    shownCategories: PropTypes.object,
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

