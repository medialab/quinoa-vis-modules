[WIP] Quinoa vis modules
===

Quinoa vis module exposes a set of react component aimed at being used in quinoa applications. Work in progress.

# Install

```
npm install https://github.com/medialab/quinoa-vis-modules
```

# Components general structure and API

## API

Each quinoa-vis-module component *must* comply to the following API :

Variable props :

- ``data`` : data (array, object, or raw string) passed by parent
- ``dataStructure`` : string specifying how incoming data is structured (WIP - possible values for now : ``flatArray``, ``geoJson`)
- ``allowUserViewChange`` : boolean to specify whether the user can pan/zoom/interact with the view or not
- ``viewParameters`` : object describing the current view of the visualization

Method props :

- ``onUserViewChange`` : returns data about the triggering interaction and the new view representation

The ``viewParameters`` *must* contain all the parameters necessary to render successfully a view of the visualization. The particular structures of the ``viewParameters`` of each component is detailed below, but all ``viewParameters``props share some subprop :

- ``dataMap`` : object that specifies how to map data to vis properties. Keys are names of vis props, values may be a string representing input data objects' key name, or an accessor function
- ``colorsMap`` : object that specifies how to color objects. Keys are values to look for in a categorical set of values present in objects' data, value are css color descriptions (therefore accepted methods : names, rgb, rgba, hex)

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
          dataMap: {
              year: 'year',
              name: (d) => d.contents.title,
              category: 'category',
              endYear: 'end year'
            },
          colorsMap: {
            cartography: '#F24D98',
            computation: '#813B7C',
            mathematics: '#59D044',
            statistics: '#F3A002'
          }
        }}
    />
    </div>
)
```

See [the story book](https://github.com/medialab/quinoa-vis-modules/blob/master/stories/index.js) for more examples of use.

## File structure

Each ``src`` subfolder is dedicated to a specific quinoa visualization component.

Example of the ``Timeline`` submodule :

```
-Timeline
--Timeline.js // stateful main component
--Timeline.scss // component layout styling and general styling
--subComponents.js // mini components (mostly stateless) to be used by the main component
```

# ``viewParameters`` property models

## Timeline

### ``fromDate`` : date||number

Start date to use fo displayingr the main view of the timeline.

### ``toDate`` : date||number

End date to use for displaying the main view of the timeline.

### ``dataMap`` : object

Object that specifies how to map data to vis properties. Keys are names of vis props, values may be a string representing input data objects' key name, or an accessor function.

Detail of the timeline data map :

- ``name`` : **required** - name of time objects to be displayed in labels
- ``category`` : category to use for coloring and filtering objects
- ``year`` : **required** - start year of time object
- ``month`` : start month of time object
- ``day`` : start year of time object
- ``time`` : start time of time object (time as a ':'-separated string (e.g. ``12:33:32``)
- ``endYear`` : end year of time object
- ``endMonth`` : end month of time object
- ``endDay`` : end day of time object
- ``endTime`` : end time of time object (time as a ':'-separated string (e.g. ``12:33:32``)

### ``colorMap`` : object

Object that specifies how to color objects. Keys are values to look for in a categorical set of values present in objects' data, value are css color descriptions (therefore accepted methods : names, rgb, rgba, hex)

## Map

TODO

## Graph

TODO

