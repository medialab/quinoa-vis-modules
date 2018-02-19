/**
 * This module exports a stateful customizable map component
 * @module quinoa-vis-modules/Map
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
// the module relies heavily on react-leaflet which is used
// as a map renderer
// see http://leafletjs.com/
// see https://github.com/PaulLeCam/react-leaflet
import {
  Map as MapComponent,
  Marker,
  Popup,
  TileLayer,
  Polygon,
  Polyline
} from 'react-leaflet';
import {divIcon} from 'leaflet';
import {debounce} from 'lodash';
// require leaflet styling code
require('leaflet/dist/leaflet.css');

import './Map.scss';

/**
 * Map class for building map react component instances
 */
class Map extends Component {
  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      viewParameters: props.viewParameters
    };
    // we debounce user view change as a quickfix
    // to leaflet's callback inconsistencies
    this.onUserViewChange = debounce(this.onUserViewChange, 100);
    this.activateMap = this.activateMap.bind(this);
    this.deactivateMap = this.deactivateMap.bind(this);
  }

  /**
   * Executes code on instance after the component is mounted
   */
  componentDidMount () {
    const map = this.map.leafletElement;
    // disable leaflet instance interactivity if change is not allowed
    if (!this.props.allowUserViewChange) {
      this.deactivateMap(map);
    }
  }

  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    // update viewParameters if changed
    if (this.props.viewParameters !== nextProps.viewParameters) {
      this.setState({
        viewParameters: nextProps.viewParameters
      });
    }
    // update data if changed
    if (this.props.data !== nextProps.data) {
      this.setState({
        data: nextProps.data
      });
    }
    // update map state if readOnly mode changes
    if (nextProps.allowUserViewChange !== this.props.allowUserViewChange) {
      const map = this.map.leafletElement;
      if (nextProps.allowUserViewChange) {
        // we have to manipulate the map component imperatively
        this.activateMap(map);
      }
      else {
        this.deactivateMap(map);
      }
    }
  }
  /**
   * Executes code before component updates
   * @param {object} nextProps - properties component will have
   * @param {object} nextState - future state of the component
   */
  componentWillUpdate(nextProps, nextState) {
    if (this.state.lastEventDate !== nextState.lastEventDate && typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange({
        lastEventType: nextState.lastEventType,
        viewParameters: nextState.viewParameters
      });
    }
  }

  /**
   * Enables interactivity on leaflet map instance imperatively
   * @param {Leaflet.leafletElement} map - leaflet map instance to manipulate
   */
  activateMap (map) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) {
      map.tap.enable();
    }
  }

  /**
   * Disables interactivity on leaflet map instance imperatively
   * @param {Leaflet.leafletElement} map - leaflet map instance to manipulate
   */
  deactivateMap (map) {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) {
      map.tap.disable();
    }
  }

  /**
   * Lets instance parent to know when user has updated view
   * @param {object} newParameters - new view parameters to merge with the existing
   * @param {string} lastEventType - event type of the last event triggered by user
   */
  onUserViewChange (newParameters, lastEventType) {
    this.setState({
      lastEventType,
      lastEventDate: new Date(),
      viewParameters: {
        ...this.state.viewParameters,
        ...newParameters
      }
    });
  }
  /**
   * Renders the component
   * @return {ReactElement} the component react representation
   */
  render() {
    const {
      data,
      viewParameters
    } = this.state;

    const {
      allowUserViewChange = true
    } = this.props;

    const position = [viewParameters.cameraX, viewParameters.cameraY];
    const zoom = viewParameters.cameraZoom;

    /**
     * callbacks
     */
    const onMoveEnd = (evt = {}) => {
      // evt.target is the leaflet instance
      if (evt.target) {
        const coords = evt.target.getCenter();
        const view = {
          cameraZoom: evt.target.getZoom(),
          cameraX: coords.lat,
          cameraY: coords.lng
        };
        this.onUserViewChange(view);
      }
    };
    /**
     * references bindings
     */
    const refMap = (c) => {
      this.map = c;
    };
    return data ? (
      <figure className={'quinoa-map' + (allowUserViewChange ? '' : ' locked')}>
        <MapComponent
          ref={refMap}
          center={position}
          zoom={zoom}
          onMoveEnd={onMoveEnd}
          animate>
          <TileLayer
            url={viewParameters.tilesUrl} />

          {
            data &&
            data.main &&
            Array.isArray(data.main) ?
            data.main.map((obj, index) => {
              // each object on the map is rendered separately
              const shown = viewParameters.shownCategories ? obj.category && viewParameters.shownCategories.main.find(cat => obj.category + '' === cat + '') !== undefined : true;
              const color = (viewParameters.colorsMap.main && viewParameters.colorsMap.main[obj.category]) || (viewParameters.colorsMap.main.default || viewParameters.colorsMap.default);
              let coordinates;
              // object geometry types must comply to the geoJSON specification
              switch (obj.geometry.type) {
                case 'Point':
                  const thatPosition = obj.geometry.coordinates;

                  if (!Number.isNaN(thatPosition[0]) && !Number.isNaN(thatPosition[1])) {
                    const thatIcon = divIcon({
                      className: 'point-marker-icon',
                      html: '<span class="shape" style="background:' + color + '"></span>'
                    });
                    return (
                      <Marker
                        key={index}
                        position={thatPosition}
                        icon={thatIcon}
                        opacity={shown ? 1 : 0.1}>
                        <Popup>
                          <span>{obj.title}</span>
                        </Popup>
                      </Marker>
                    );
                  }
                  break;

                case 'Polygon':
                  coordinates = obj.geometry.coordinates.map(couple => couple.reverse());
                  return (
                    <Polygon
                      key={index}
                      color={'white'}
                      fillColor={color}
                      opacity={shown ? 1 : 0.1}
                      stroke
                      positions={coordinates} />
                  );
                case 'Polyline':
                case 'LineString':
                  coordinates = obj.geometry.coordinates.map(couple => couple.reverse());
                  return (
                    <Polyline
                      key={index}
                      color={color}
                      opacity={shown ? 1 : 0.1}
                      positions={coordinates} />
                  );

                default:
                  return '';

              }
            })
            : null
          }

        </MapComponent>
      </figure>
    )
    // fallback when no data (todo: harmonize that accross components)
    : 'Loading';
  }
}

Map.propTypes = {
  /*
   * Incoming data in json format
   */
  data: PropTypes.shape({
    // for now the component accepts a single "main" collection of data
    // but we could imagine to allow more and display them as several layers
    main: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      category: PropTypes.string,
      geometry: PropTypes.shape({
        type: PropTypes.string,
        // coordinates: PropTypes.array
      })
    }))
  }),
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not)
   */
  viewParameters: PropTypes.shape({
    /*
     * Colors map - which colors to associate with which value
     */
    colorsMap: PropTypes.object,
    /*
     * Filters-related object
     */
    shownCategories: PropTypes.object,
    /*
     * Camera position related parameters
     */
    cameraX: PropTypes.number,
    cameraY: PropTypes.number,
    cameraZoom: PropTypes.number,
    /*
     * Other settings-related properties
     */
     tilesUrl: PropTypes.string // URL pattern of the leaflet tiles to use (e.g. http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png)
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

export default Map;
