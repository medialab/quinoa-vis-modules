import React, {Component, PropTypes} from 'react';
import {Map as MapComponent, Marker, Popup, TileLayer} from 'react-leaflet';
import {debounce} from 'lodash';
import {
  computeDataRelatedState
} from './utils';
// require leaflet code
require('leaflet/dist/leaflet.css');
// "/node_modules/leaflet/dist/images/marker-icon.png",
// "/node_modules/leaflet/dist/images/marker-icon-2x.png",
// "/node_modules/leaflet/dist/images/marker-shadow.png"
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
  }

  componentWillUpdate(nextProps) {
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
  }

  /**
   * Lets instance parent to know when user has updated view
   * @param {string} lastEventType - event type of the last event triggered by user
   */
  onUserViewChange (lastEventType) {
    this.props.onUserViewChange({
      lastEventType,
      // todo: verify if not next state needed ?
      viewParameters: this.state.viewParameters
    });
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
      // allowUserViewChange
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
      <figure className="quinoa-map">
        <MapComponent
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
                  return (<Marker key={index} position={thatPosition}>
                    <Popup>
                      <span>{point.title}</span>
                    </Popup>
                  </Marker>);
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

