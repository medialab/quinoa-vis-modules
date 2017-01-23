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
import timelineData from 'dsv!./mock_data/milestones-datavis.csv';

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
import MapStoryContainer from './MapStoryContainer';
import MapLockSwitcher from './MapLockSwitcher';

import mapData from 'dsv!./mock_data/bornes-recharge-electrique.csv';
import mapGeoJSONData from 'json!./mock_data/amaps-et-regions.geojson';


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
  dataMap: mapDataMap,
  colorsMap: {
    'accélérée': '#F24D98',
    'normale': '#813B7C',
    noCategory: 'brown'
  },
  tilesUrl: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
};

const mapGeoJSONDataMap = {
  latitude: 'latitude',
  longitude: 'longitude',
  title: 'nom',
  category: 'basemap'
};
const mapGeoJSONBaseViewParameters = {
  cameraX: 48.8674345,
  cameraY: 2.3455482,
  cameraZoom: 4,
  dataMap: mapGeoJSONDataMap,
  colorsMap: {
    osm_mapnik: 'orange',
    noCategory: 'brown'
  }
};

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
      data={mapGeoJSONData} 
      dataStructure="geoJSON"
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

import networkJSONData from './mock_data/miserables.json';
import networkGexfData from 'raw-loader!./mock_data/arctic.gexf';
// import networkGraphMLData from 'raw-loader!./mock_data/primer.graphml';
import networkGraphMLData from 'raw-loader!./mock_data/family-belongings.xml';

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

storiesOf('Network', module)
  .add('with gexf', () => (
    <Network 
      allowUserViewChange ={true}
      data={networkGexfData} 
      dataStructure="gexf"
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkGexfBaseViewParameters}
    />
  ))
  .add('with json', () => (
    <Network 
      allowUserViewChange ={true}
      data={networkJSONData} 
      dataStructure="json"
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkJSONBaseViewParameters}
    />
  ))
  .add('with graphml', () => (
    <Network 
      allowUserViewChange ={true}
      data={networkGraphMLData} 
      dataStructure="graphML"
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkGraphMLBaseViewParameters}
    />
  ))
  .add('Locked', () => (
    <Network 
      allowUserViewChange ={false}
      data={networkGexfData} 
      dataStructure="gexf"
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {networkGexfBaseViewParameters}
    />
  ))






