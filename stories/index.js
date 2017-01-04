import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';

import Timeline from '../src/Timeline/Timeline';
import Graph from '../src/Graph/Graph';
import Map from '../src/Map/Map';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

storiesOf('Timeline', module)
  .add('default', () => (
    <Timeline />
  ));

storiesOf('Graph', module)
  .add('default', () => (
    <Graph />
  ));

storiesOf('Map', module)
  .add('default', () => (
    <Map />
  ));