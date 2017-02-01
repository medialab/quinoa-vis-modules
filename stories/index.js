import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Timeline')}/>
  ));

/*
 * TIMELINE COMPONENT STORIES
 */

import Timeline from '../src/Timeline/Timeline';


import TimelineStoryContainer from './TimelineStoryContainer';
import parseTimelineData from '../src/utils/timelineDataParser';
import mapTimelineData from '../src/utils/timelineDataMapper';
import timelineDataRaw from 'raw-loader!./mock_data/milestones-datavis.csv';

const timelineDataMap = {
  year: 'year',
  name: (d) => d.content,
  category: 'category',
  endYear: 'end year'
};
const timelineBaseViewParameters = {
  fromDate: new Date().setFullYear(1900),
  toDate: new Date().setFullYear(1960),
  dataMap: timelineDataMap,
  colorsMap: {
    cartography: '#F24D98',
    computation: '#813B7C',
    mathematics: '#59D044',
    statistics: '#F3A002',
    noCategory: 'brown'
  }
};

const timelineData = mapTimelineData(parseTimelineData(timelineDataRaw), {main: timelineDataMap});

storiesOf('Timeline', module)
  .add('default', () => (
    <Timeline
      allowUserViewChange ={true}
      data={timelineData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {timelineBaseViewParameters}
    />
  ))
  .add('locked', () => (
    <Timeline
      allowUserViewChange ={false}
      data={timelineData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {timelineBaseViewParameters}
    />
  ))
  .add('switch between view states (navigable)', () => (
    <TimelineStoryContainer
      timelineData={timelineData}
      baseParameters={timelineBaseViewParameters}
      allowUserViewChange={true}
    />
  ))
  .add('switch between view states (locked)', () => (
    <TimelineStoryContainer
      timelineData={timelineData}
      baseParameters={timelineBaseViewParameters}
      allowUserViewChange={false}
    />
  ))
  .add('very small layouts', () => (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'darkgrey',
      left: '0',
      top: '0'
    }}>
      <div style={{
        position: 'absolute',
        height: '88%',
        overflow: 'hidden',
        width: '20%',
        top: '1%',
        left: '1%',
        background: 'white'
      }}>
      <Timeline
        allowUserViewChange ={true}
        data={timelineData}
        onUserViewChange={(e) => console.log('on view change', e)}
        viewParameters = {timelineBaseViewParameters}
      />
      </div>
      <div style={{
        position: 'absolute',
        height: '50%',
        overflow: 'hidden',
        width: '60%',
        left: '30%',
        top: '1%',
        background: 'white'
      }}>
      <Timeline
        allowUserViewChange ={true}
        data={timelineData}
        onUserViewChange={(e) => console.log('on view change', e)}
        viewParameters = {timelineBaseViewParameters}
      />
      </div>
    </div>
  ));

/*
 * MAP COMPONENT STORIES
 */

import Map from '../src/Map/Map';
import parseMapData from '../src/utils/mapDataParser';
import mapMapData from '../src/utils/mapDataMapper';

import MapStoryContainer from './MapStoryContainer';
import MapLockSwitcher from './MapLockSwitcher';

import mapDataRaw from 'raw-loader!./mock_data/bornes-recharge-electrique.csv';
import mapGeoJSONData from 'raw-loader!./mock_data/amaps-et-regions.geojson';

const mapDataMap = {
  latitude: 'latitude',
  longitude: 'longitude',
  title: 'nom_station',
  category: 'type_charge'
};
const mapBaseViewParameters = {
  cameraX: 48.8674345,
  cameraY: 2.3455482,
  cameraZoom: 4,
  colorsMap: {
    'accélérée': '#F24D98',
    'normale': '#813B7C',
    noCategory: 'brown'
  },
  tilesUrl: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
};

const mapData = mapMapData(parseMapData(mapDataRaw, 'csv'), {
  main: mapDataMap
});

const mapGeoJSONDataMap = {
  // for now these two are not exposed to mapping
  // latitude: 'latitude',
  // longitude: 'longitude',
  title: 'nom',
  category: 'basemap'
};
const mapGeoJSONBaseViewParameters = {
  cameraX: 48.8674345,
  cameraY: 2.3455482,
  cameraZoom: 4,
  tilesUrl: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
  colorsMap: {
    osm_mapnik: 'orange',
    noCategory: 'brown'
  }
};
const geoJSONData = mapMapData(parseMapData(mapGeoJSONData, 'geoJSON'), {
  main: mapGeoJSONDataMap
});

storiesOf('Map', module)
  .add('default', () => (
    <Map
      allowUserViewChange ={true}
      data={mapData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {mapBaseViewParameters}
    />
  ))
  .add('default (with geojson)', () => (
    <Map
      allowUserViewChange ={true}
      data={geoJSONData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {mapGeoJSONBaseViewParameters}
    />
  ))
  .add('locked', () => (
    <Map
      allowUserViewChange ={false}
      data={mapData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {mapBaseViewParameters}
    />
  ))
  .add('switch between lock mode and unlock mode', () => (
    <MapLockSwitcher
      mapData={mapData}
      baseParameters={mapBaseViewParameters}
      allowUserViewChange={true}
    />
  ))
  .add('switch between view states (navigable)', () => (
    <MapStoryContainer
      mapData={mapData}
      baseParameters={mapBaseViewParameters}
      allowUserViewChange={true}
    />
  ))
  .add('switch between view states (locked)', () => (
    <MapStoryContainer
      mapData={mapData}
      baseParameters={mapBaseViewParameters}
      allowUserViewChange={false}
    />
  ))
  .add('very small layouts', () => (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'darkgrey',
      left: '0',
      top: '0'
    }}>
      <div style={{
        position: 'absolute',
        height: '88%',
        overflow: 'hidden',
        width: '20%',
        top: '1%',
        left: '1%',
        background: 'white'
      }}>
      <Map
        allowUserViewChange ={true}
        data={mapData}
        onUserViewChange={(e) => console.log('on view change', e)}
        viewParameters = {mapBaseViewParameters}
      />
      </div>
      <div style={{
        position: 'absolute',
        height: '50%',
        overflow: 'hidden',
        width: '60%',
        left: '30%',
        top: '1%',
        background: 'white'
      }}>
      <Map
        allowUserViewChange ={true}
        data={mapData}
        onUserViewChange={(e) => console.log('on view change', e)}
        viewParameters = {mapBaseViewParameters}
      />
      </div>
    </div>
  ));

/*
 * NETWORK COMPONENT STORIES
 */

import Network from '../src/Network/Network';
import parseNetworkData from '../src/utils/networkDataParser';
import mapNetworkData from '../src/utils/networkDataMapper';

import networkJSONDataRaw from './mock_data/miserables.json';
import networkGexfDataRaw from 'raw-loader!./mock_data/arctic.gexf';
// import networkGraphMLData from 'raw-loader!./mock_data/primer.graphml';
import networkGraphMLDataRaw from 'raw-loader!./mock_data/family-belongings.xml';

const networkJSONDataMap = {
  nodes: {
    category: 'group',
    label: 'name'
  }
};
const networkJSONBaseViewParameters = {
  cameraX: 0,
  cameraY: 0,
  cameraRatio: 2,
  cameraAngle: 0,
  labelThreshold: 7,
  minNodeSize: 2,
  sideMargin: 0,
  dataMap: networkJSONDataMap,
  colorsMap: {
    1: 'blue',
    2: 'green',
    3: 'red',
    noCategory: 'brown'
  }
};
const networkJSONData = mapNetworkData(parseNetworkData(JSON.stringify(networkJSONDataRaw), 'json'), networkJSONDataMap)

const networkGexfDataMap = {
  nodes: {
    label: 'label',
    category: 'color'
  }
};
const networkGexfBaseViewParameters = {
  cameraX: 0,
  cameraY: 0,
  cameraRatio: 2,
  cameraAngle: 0,
  labelThreshold: 7,
  minNodeSize: 1,
  sideMargin: 0,
  dataMap: networkGexfDataMap,
  colorsMap: {
    "rgb(255,51,51)": "rgb(255,51,51)",
    "rgb(0,204,204)": "rgb(0,204,204)",
    "rgb(255,255,51)": "rgb(255,255,51)",
    "rgb(204,204,255)": "rgb(204,204,255)",
    "rgb(153,0,0)": "rgb(153,0,0)",
    "rgb(102,102,0)": "rgb(102,102,0)",
    "rgb(255,204,102)": "rgb(255,204,102)",
    "rgb(153,255,0)": "rgb(153,255,0)",
    "rgb(102,0,102)": "rgb(102,0,102)",
    "rgb(153,255,255)": "rgb(153,255,255)",
    "rgb(102,255,102)": "rgb(102,255,102)",
    "rgb(0,153,0)": "rgb(0,153,0)",
    "rgb(255,153,153)": "rgb(255,153,153)",
    "rgb(255,255,0)": "rgb(255,255,0)",
    "rgb(204,0,0)": "rgb(204,0,0)",
    "rgb(0,204,51)": "rgb(0,204,51)",
    "rgb(51,153,255)": "rgb(51,153,255)",
    "rgb(255,204,51)": "rgb(255,204,51)",
    noCategory: 'brown'
  }
};

const networkGexfData = mapNetworkData(parseNetworkData(networkGexfDataRaw, 'gexf'), networkGexfDataMap)

const networkGraphMLDataMap = {
  nodes: {
    label: 'name',
    category: 'type',
    description: 'description'
  }
};
const networkGraphMLBaseViewParameters = {
  cameraX: 0,
  cameraY: 0,
  cameraZoom: 2,
  cameraRatio: 0,
  labelThreshold: 7,
  minNodeSize: 2,
  sideMargin: 0,
  dataMap: networkGraphMLDataMap,
  colorsMap: {
    'person': '#F24D98',
    'object': '#813B7C',
    'animal': 'yellow',
    noCategory: 'brown'
  }
};

const networkGraphMLData = mapNetworkData(parseNetworkData(networkGraphMLDataRaw, 'graphML'), networkGraphMLDataMap)

storiesOf('Network', module)
  .add('with gexf', () => (
    <Network
      allowUserViewChange ={true}
      data={networkGexfData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkGexfBaseViewParameters}
    />
  ))
  .add('with json', () => (
    <Network
      allowUserViewChange ={true}
      data={networkJSONData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkJSONBaseViewParameters}
    />
  ))
  .add('with graphml', () => (
    <Network
      allowUserViewChange ={true}
      data={networkGraphMLData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkGraphMLBaseViewParameters}
    />
  ))
  .add('Locked', () => (
    <Network
      allowUserViewChange ={false}
      data={networkGexfData}
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkGexfBaseViewParameters}
    />
  ));

/**
 * SVGVIEWER COMPONENT STORIES
 */

import SVGViewer from '../src/SVGViewer/SVGViewer';
const TEST_SVG_FILE = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/tiger.svg';

storiesOf('SVGViewer', module)
  .add('default', () => (
    <SVGViewer file={TEST_SVG_FILE} />
  ))
  .add('locked', () => (
    <SVGViewer file={TEST_SVG_FILE} allowUserViewChange={false} />
  ))
