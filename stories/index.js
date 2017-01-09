import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';

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
}

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Timeline')}/>
  ));

storiesOf('Timeline', module)
  .add('default', () => (
    <Timeline 
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
    />
  ))
  .add('switch between view states (navigable)', () => (
    <Timeline 
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
    />
  ))
  .add('switch between view states (locked)', () => (
    <Timeline 
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
    />
  ))
  .add('very small', () => (
    <Timeline 
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
    />
  ))
  .add('very big', () => (
    <Timeline 
      data={timelineData} 
      dataMap={timelineDataMap}
      onViewChange={(e) => action('on view change', e)}
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