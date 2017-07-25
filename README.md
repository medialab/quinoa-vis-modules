Quinoa vis modules - *unified react component for displaying controlled visualizations*
===

Quinoa vis module exposes a set of scripts aimed at being used in quinoa applications.

These scripts are of two types :

- a set of React components displaying a visualization for which the whole state is controlled declaratively, exposing a consistent API despite the difference of data structures and visualization parameters
- a set of parsing and mapping scripts aimed at manipulating data according to a specific visualization type

Components are stateful, because they can temporarily have an inner state different from the one provided in their props, in order to allow application-state-independent navigation behaviors in the vis.

# Installation as a dependency

```
npm install --save https://github.com/medialab/quinoa-vis-modules
```

# Installation for development

```
git clone https://github.com/medialab/quinoa-vis-modules
cd quinoa-vis-modules
npm install
npm run build-storybook
```

# Development

The project uses [storybook](https://storybook.js.org/) to visually test the possible implementations of the component.

```
npm run storybook
```

# Npm Scripts

``build`` : builds dist code for use as dependency

``lint`` : lints the code (autofix on)

``comb`` : prettifies scss code

``test`` :  run mocha unit tests on all ``.spec.js`` prefixed files present in ``src``

``build-storybook`` : builds storybook static assets

``storybook`` : runs a visual testing environment accessible at ``localhost:6006``

``precommit-add-build`` : as the project uses a pre-commit hook to enforce code quality at each commit, each successful commit automatically adds the build directory

# Module general structure and API

## Module submodules

```js
import {
  Network, // Network react component
  Map, // Map react component
  SVGViewer, // SVG react component
  Timeline, // Timeline react component

  parseNetworkData, // parses a network data representation string
  parseMapData, // parses a map data representation string
  parseTimelineData, // parses a timeline data representation string

  mapNetworkData, // consumes data mapping parameters to produce a data representation readable by the network component
  mapMapData, // consumes data mapping parameters to produce a data representation readable by the map component
  mapTimelineData, // consumes data mapping parameters to produce a data representation readable by the timeline component
} from 'quinoa-vis-modules';
```

## Examples of use of the components

Each component receives a declarative description of the state it has to render, plus some callbacks, like so:

```js
export const MyTimelineContainer = () => (
    <div className="my-timeline-container">
      <Timeline 
        data={timelineData} 
        allowUserViewChange ={true}
        onUserViewChange={(e) => console.log('user changed the view', e)}
        viewParameters = {{
            fromDate: new Date().setFullYear(1900),
            toDate: new Date().setFullYear(1960),
            orientation: 'portrait',
            colorsMap: {
              main: {
                cartography: '#F24D98',
                computation: '#813B7C',
                mathematics: '#59D044',
                statistics: '#F3A002'
              }
            }
          }}
      />
    </div>
)
```

See [the story book](https://github.com/medialab/quinoa-vis-modules/blob/master/stories/index.js) for more examples of use.

## Data formatting needs

The data provided to components *must* always be an object in which each property represents a *collection* of the data to represent.

For now, timeline and map require both a single-collection dataset, that is to be provided with an object containing a property `main` containing the data as an array of js objects.

Example of data readable by a timeline :

```js
{
  "main": [
    {
      "title": "Event title",
      "description": "Event description",
      "source": "Event source",
      "category": "computation",
      "startDate": "1943-12-31T23:00:00.335Z"
    },
    // ...
  ]
}
```

Network requires a two-collections dataset, made of a `nodes` collection and an `edges` collection.

```js
{
  "nodes": [
    {
      "id": "229",
      "x": -38.86054,
      "y": -70.56831,
      "size": 3.6082125,
      "label": "Amérique Du Sud",
      "category": "rgb(255,51,51)"
    },
    // ...
  ],
  "edges": {
    {
      "id": "5720",
      "type": "undirected",
      "label": "",
      "source": "229",
      "target": "964",
      "weight": 1
    },
    // ..
  }
}
```

## API

Each quinoa-vis-module component *must* comply to the following API :

Variable props :

- ``data`` : ready-to-use data to visualize
- ``allowUserViewChange`` : boolean to specify whether the user can pan/zoom/interact with the view or not
- ``viewParameters`` : object describing the current view of the visualization - the shape of this object depends on the visualization type

Method props :

- ``onUserViewChange`` : returns data about the triggering interaction and the new view representation

### Common proporties of the ``viewParameters`` prop

The ``viewParameters`` *must* contain all the parameters necessary to render successfully a view of the visualization. The particular structures of the ``viewParameters`` of each component is detailed below, but all ``viewParameters``props share some following subprop :

- ``colorsMap`` : object that specifies how to color objects. First-level keys correspond to data's collections names. Second-level keys are values to look for in a categorical set of values present in objects' data, value are css color descriptions (therefore accepted methods : names, rgb, rgba, hex)
- ``dataMap`` : object that specifies how to interpret's data points' properties in order to populate the visualization. First-level keys correspond to data's collections names. Second-level keys correspond to a visualization's parameter, the value pointing to datapoints' properties names to use for populating the visualization.
- ``showCategories`` : object that specifies how to visually filter objects. First-level keys correspond to data's collections names. Each of them contains an array of strings corresponding the categories to show.

# visualization-specific ``viewParameters`` property models

## Timeline

Example of a viewParameters object for the Timeline component: 

```js
const timelineBaseViewParameters = {
  fromDate: new Date().setFullYear(1900),
  toDate: new Date().setFullYear(1960),
  colorsMap: {
    main: {
      cartography: '#F24D98',
      computation: '#813B7C',
      mathematics: '#59D044',
      statistics: '#F3A002',
      default: 'lightgrey'
    },
    default: 'lightgrey'
  },
  shownCategories: {
    main: ['computation']
  }
};
```

### ``fromDate`` : date||number

Start date to use fo displayingr the main view of the timeline.

### ``toDate`` : date||number

End date to use for displaying the main view of the timeline.

## Map

Example of a viewParameters object for the Map component: 

```js
const mapBaseViewParameters = {
  cameraX: 48.8674345,
  cameraY: 2.3455482,
  cameraZoom: 4,
  colorsMap: {
    main: {
      'accélérée': '#F24D98',
      'normale': '#813B7C',
      default: 'lightgrey'
    },
    default: 'lightgrey'
  },
  tilesUrl: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
};
```

### ``cameraX`` : number

Longitude coordinate of the camera center

### ``cameraY`` : number

Latitude coordinate of the camera center

### ``cameraZoom`` : number

Zoom degree of the camera (1 corresponds to the farthest position of camera)

### ``tilesUrl`` : string

Url pattern to use in order to retrieve map tiles.

## Network

Example of a viewParameters object for the Network component: 

```js
const networkJSONBaseViewParameters = {
  cameraX: 0,
  cameraY: 0,
  cameraRatio: 2,
  cameraAngle: 0,
  labelThreshold: 7,
  minNodeSize: 2,
  sideMargin: 0,
  colorsMap: {
    nodes: {
      1: '#813B7C',
      2: '#41d9f4',
      3: '#64f441',
      default: '#F24D98'
    },
    edges: {
      default: '#c0c6c6'
    },
    default: '#c0c6c6'
  }
};
```


### ``cameraX`` : number

Describes the camera center

### ``cameraY`` : number

Describes the camera center

### ``cameraRatio`` : number

Zoom degree of the camera.

### ``cameraAngle`` : number

Rotation angle of the camera.

### ``labelThreshold`` : number

Zoom level starting from which labels can be displayed.

### ``minNodeSize`` : number

Minimum size of network nodes.

### ``sideMargin`` : number

The margin (in pixels) to keep around the graph.

# Pre-commit hook

The project uses a precommit hook before each commit to ensure the code remains clean at all times. Check out the `package.json` to learn more about it.



