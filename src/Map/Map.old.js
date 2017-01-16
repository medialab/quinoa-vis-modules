import React from 'react';
import {Map as MapComponent, Marker, Popup, TileLayer} from 'react-leaflet';

// require leaflet code
require('leaflet/dist/leaflet.css');
// "/node_modules/leaflet/dist/images/marker-icon.png",
// "/node_modules/leaflet/dist/images/marker-icon-2x.png",
// "/node_modules/leaflet/dist/images/marker-shadow.png"
import './Map.scss';

const Map = ({
  data = [],
  viewParameters = {
    cameraX: 48.8674345,
    cameraY: 2.3455482,
    cameraZoom: 13
  },
  updateView
}) => {

  if (Object.keys(viewParameters).length === 0) {
    viewParameters = {
      cameraX: 48.8674345,
      cameraY: 2.3455482,
      cameraZoom: 13
    };
  }

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
      updateView(view);
    }
  };
  // http://{s}.tile.osm.org/{z}/{x}/{y}.png
  return (
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
              const thatPosition = [point.latitude, point.longitude];
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
  );
};

export default Map;

