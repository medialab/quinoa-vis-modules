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

import timelineData from 'dsv!./mock_data/milestones-datavis.csv';
import graphData from './mock_data/miserables.json';
import mapData from 'dsv!./mock_data/etablissements-enseignement-fr.csv';

const timelineDataMap = {
  year: 'year',
  name: (d) => d.content,
  category: 'category',
  endYear: 'end year'
};
const timelineBaseViewParameters = {
  fromDate: new Date().setFullYear(1900),
  toDate: new Date().setFullYear(1960),
  orientation: 'portrait',
  dataMap: timelineDataMap,
  colorsMap: {
    cartography: '#F24D98',
    computation: '#813B7C',
    mathematics: '#59D044',
    statistics: '#F3A002'
  }
};


storiesOf('Timeline', module)
  .add('default (portrait)', () => (
    <Timeline 
      allowViewChange ={true}
      data={timelineData} 
      onViewChange={(e) => console.log('on view change', e)}
      viewParameters = {timelineBaseViewParameters}
    />
  ))
  // .add('default (landscape)', () => (
  //   <span>Todo</span>
  // ))
  .add('switch between view states (navigable)', () => (
    <TimelineStoryContainer
      timelineData={timelineData}
      baseParameters={timelineBaseViewParameters}
      allowViewChange={true}
    />
  ))
  .add('switch between view states (locked)', () => (
    <TimelineStoryContainer
      timelineData={timelineData}
      baseParameters={timelineBaseViewParameters}
      allowViewChange={false}
    />
  ))
  .add('very small', () => (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'yellow',
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
        allowViewChange ={true}
        data={timelineData} 
        onViewChange={(e) => console.log('on view change', e)}
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
        allowViewChange ={true}
        data={timelineData} 
        onViewChange={(e) => console.log('on view change', e)}
        viewParameters = {timelineBaseViewParameters}
      />
      </div>
    </div>
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