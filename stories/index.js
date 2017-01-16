import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Timeline')}/>
  ));

import Timeline from '../src/Timeline/Timeline';
import Graph from '../src/Graph/Graph';
import Map from '../src/Map/Map';

import TimelineStoryContainer from './TimelineStoryContainer';
import MapStoryContainer from './MapStoryContainer';

import timelineData from 'dsv!./mock_data/milestones-datavis.csv';
import graphData from './mock_data/miserables.json';
import mapData from 'dsv!./mock_data/bornes-recharge-electrique.csv';


/*
 * TIMELINE COMPONENT STORIES
 */

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
  .add('locked', () => (
    <Map 
      allowUserViewChange ={false}
      data={mapData} 
      onUserViewChange={(e) => console.log('on view change', e)}
      viewParameters = {mapBaseViewParameters}
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
    <span>Todo</span>
  ))

/*
storiesOf('Graph', module)
  .add('default', () => (
    <Graph data={graphData} />
  ));

storiesOf('Map', module)
  .add('default', () => (
    <Map />
  ));
  */