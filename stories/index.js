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
  orientation: 'portrait'
};
const timelineActiveViewParameters = {...timelineBaseViewParameters}

storiesOf('Timeline', module)
  .add('default (portrait)', () => (
    <Timeline 
      allowViewChange ={true}
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => console.log('on view change', e)}
      viewParameters = {timelineBaseViewParameters}
    />
  ))
  .add('default (landscape)', () => (
    <Timeline 
      allowViewChange ={true}
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => console.log('on view change', e)}
      viewParameters = {timelineBaseViewParameters}
      orientation='landscape'
    />
  ))
  .add('switch between view states (navigable)', () => (
    <div style={{
      display: 'flex',
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>
      <aside>
        <button onClick={
          () => {
            timelineActiveViewParameters.fromDate = new Date(timelineActiveViewParameters.fromDate).setFullYear(1900);
            timelineActiveViewParameters.toDate = new Date(timelineActiveViewParameters.toDate).setFullYear(1920);
            console.log('updated', timelineActiveViewParameters.toDate);
          }
        }>State 1</button>
        <button>State 2</button>
        <button>State 3</button>
      </aside>
      <div style={{
        flex: 5,
        position: 'relative'
      }}>
        <Timeline 
          allowViewChange={true}
          data={timelineData} 
          dataMap={timelineDataMap}
          onViewChange={(e) => action('on view change', e)}
          viewParameters = {timelineActiveViewParameters}
        />
      </div>
    </div>
  ))
  .add('switch between view states (locked)', () => (
    <Timeline 
      allowViewChange={false}
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
      allowViewChange={false}
      viewParameters = {timelineBaseViewParameters}
    />
  ))
  .add('very small', () => (
    <Timeline 
      allowViewChange={true}
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
      viewParameters = {timelineBaseViewParameters}
    />
  ))
  .add('very big', () => (
    <Timeline 
      allowViewChange={true}
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
      viewParameters = {timelineBaseViewParameters}
    />
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