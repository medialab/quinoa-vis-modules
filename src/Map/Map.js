import React, {Component, PropTypes} from 'react';
import {Map as MapComponent, Marker, Popup, TileLayer} from 'react-leaflet';
import {divIcon} from 'leaflet';
import {debounce} from 'lodash';
import {
  computeDataRelatedState
} from './utils';
// require leaflet code
require('leaflet/dist/leaflet.css');

import './Map.scss';

/**
 * Map main component
 */
class Map extends Component {
  /**
   * constructor
   */
  constructor(props) {
    super(props);
    this.state = computeDataRelatedState(props.data, props.viewParameters.dataMap, props.viewParameters);
    this.onUserViewChange = debounce(this.onUserViewChange, 100);
    this.activateMap = this.activateMap.bind(this);
    this.deactivateMap = this.deactivateMap.bind(this);
  }

  componentDidMount () {
    const map = this.map.leafletElement;
    // disable leaflet instance interactivity if change is not allowed
    if (!this.props.allowUserViewChange) {
      this.deactivateMap(map);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
      this.setState({
        viewParameters: nextProps.viewParameters
      });
    }

    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      const newStateParts = computeDataRelatedState(nextProps.data, nextProps.viewParameters.dataMap, nextProps.viewParameters);
      this.setState({
        ...newStateParts
      });
    }

    if (nextProps.allowUserViewChange !== this.props.allowUserViewChange) {
      const map = this.map.leafletElement;
      if (nextProps.allowUserViewChange) {
        this.activateMap(map);
      }
      else {
        this.deactivateMap(map);
      }
    }
  }

  /**
   * Enables interactivity on leaflet map instance
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
   * Disables interactivity on leaflet map instance
   * @param {Leaflet.leafletElement} map - leaflet map instance to manipulate
   */
  deactivateMap (map) {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
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
      data,
      viewParameters
    } = this.state;
    const {
      allowUserViewChange
    } = this.props;
    const position = [viewParameters.cameraX, viewParameters.cameraY];
    const zoom = viewParameters.cameraZoom;

    const onMoveEnd = (evt = {}) => {
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
    // http://{s}.tile.osm.org/{z}/{x}/{y}.png
    return (
      <figure className={'quinoa-map' + (allowUserViewChange ? '' : ' locked')}>
        <MapComponent
          ref={(c) => {
 this.map = c;
}}
          center={position}
          zoom={zoom}
          onMoveEnd={onMoveEnd}
          animate>
          <TileLayer
            url="http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" />
          {
                data.map((point, index) => {
                  if (point.latitude && point.longitude) {
                    const thatPosition = [+point.latitude, +point.longitude];
                    const color = viewParameters.colorsMap[point.category] || viewParameters.colorsMap.noCategory;
                    const thatIcon = divIcon({
                      className: 'point-marker-icon',
                      html: '<span class="shape" style="background:' + color + '"></span>'
                    });
                    return (
                      <Marker
                        key={index}
                        position={thatPosition}
                        icon={thatIcon}>
                        <Popup>
                          <span>{point.title}</span>
                        </Popup>
                      </Marker>
                    );
                  }
                  else {
                    return '';
                  }
                })
              }
        </MapComponent>
      </figure>
    );
  }
}

Map.propTypes = {
  /*
   * Incoming data in json format
   */
  // data: PropTypes.array, // commented to avoid angrying eslint that does not like unprecised arrays as proptypes
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not)
   */
  viewParameters: PropTypes.shape({
    /*
     * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
     */
    dataMap: PropTypes.shape({
      latitude: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      longitude: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
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
    cameraZoom: PropTypes.number
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

