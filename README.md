[WIP] Quinoa vis modules
===

Quinoa vis module exposes a set of scripts aimed at being used in quinoa applications. Work in progress.

These scripts are of two types :

- React components with a consistent API
- parsing and mapping script aimed at manipulating data according to a specific visualization type

These components are particularly designed to behave in the same way according to the same API, despite the differences of data structures and parameters shape accross visualization types

They are stateful components, because they can temporarily have an inner state different from the one provided in their props, in order to allow application-state-independent navigation behaviors in the vis.

# Install

```
npm install --save https://github.com/medialab/quinoa-vis-modules
```

# Npm Scripts

``build`` : build dist code for use as dependency

``lint`` : *

``comb`` : *

``test`` :  triggers ``.spec.js`` tests files present in ``src``

``build-storybook`` : builds storybook static assets

``storybook`` : runs a visual testing environment accessible at ``localhost:6006``

``precommit-add-build`` : as the project uses a pre-commit hook to enforce code quality at each commit, each successful commit automatically adds the build directory

# Components general structure and API

## Examples of use

```
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

## Data shape

The data provided to components *must* always be an object in which each property represents a *collection* of the data to represent.

For now, timeline and map require both a single-collection dataset, that is to be provided with an object containing a property `main` containing the data.

Network requires a two-collections dataset, made of a `nodes` collection and an `edge` collection.

## API

Each quinoa-vis-module component *must* comply to the following API :

Variable props :

- ``data`` : ready-to-use data to visualize
- ``allowUserViewChange`` : boolean to specify whether the user can pan/zoom/interact with the view or not
- ``viewParameters`` : object describing the current view of the visualization

Method props :

- ``onUserViewChange`` : returns data about the triggering interaction and the new view representation

The ``viewParameters`` *must* contain all the parameters necessary to render successfully a view of the visualization. The particular structures of the ``viewParameters`` of each component is detailed below, but all ``viewParameters``props share some subprop :

- ``colorsMap`` : object that specifies how to color objects. First-level keys correspond to data's collections names. Second-level keys are values to look for in a categorical set of values present in objects' data, value are css color descriptions (therefore accepted methods : names, rgb, rgba, hex)
- ``showCategories`` : object that specifies how to visually filter objects. First-level keys correspond to data's collections names. Each of them contains an array of strings corresponding the categories to show.

# visualization-specific ``viewParameters`` property models

## Timeline

### ``fromDate`` : date||number

Start date to use fo displayingr the main view of the timeline.

### ``toDate`` : date||number

End date to use for displaying the main view of the timeline.


### ``colorMap`` : object

Object that specifies how to color objects. Keys are values to look for in a categorical set of values present in objects' data, value are css color descriptions (therefore accepted methods : names, rgb, rgba, hex)

## Map

### ``cameraX`` : number

Longitude coordinate of the camera center

### ``cameraY`` : number

Latitude coordinate of the camera center

### ``cameraZoom`` : number

Zoom degree of the camera (1 corresponds to the farthest position of camera)

### ``colorMap`` : object

Object that specifies how to color objects. Keys are values to look for in a categorical set of values present in objects' data, value are css color descriptions (therefore accepted methods : names, rgb, rgba, hex)

## Network

### ``cameraX`` : number

Describes the camera center

### ``cameraY`` : number

Describes the camera center

### ``cameraRatio`` : number

Zoom degree of the camera.

### ``cameraAngle`` : number

Rotation angle of the camera.

### ``colorMap`` : object

Object that specifies how to color objects. Keys are values to look for in a categorical set of values present in objects' data, value are css color descriptions (therefore accepted methods : names, rgb, rgba, hex)

### ``labelThreshold`` : number

Zoom level starting from which labels can be displayed.

### ``minNodeSize`` : number

Minimum size of network nodes.

### ``sideMargin`` : number

The margin (in pixels) to keep around the graph.



