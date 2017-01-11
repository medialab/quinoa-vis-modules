import React from 'react';

export const TimeObject = ({
  point,
  scale,
  color = 'grey',
  showLabel = true,
  showTooltip = true
}) => (
  <span
    className={'time-object' + (point.endDate ? ' period' : ' point')}
    style={{
      top: scale(point.startDate.getTime()) + '%',
      height: point.endDate ? scale(point.endDate.getTime()) - scale(point.startDate.getTime()) + '%' : undefined
    }}>
    <span className="marker" style={{
      background: color
    }} />
    {showLabel ?
      <span className="name-container">
        <span className="name">
          {point.name.length > 27 ? point.name.substr(0, 30) + '...' : point.name}
          <span
            className="name-underline"
            style={{
            borderColor: color
          }} />
        </span>
      </span>
    : ''}
    {showTooltip ?
      <span 
          className="tooltip" 
          style={{
            borderColor: color
          }}>
        {point.name}
      </span>
      : ''}
  </span>
);

export const TimeTicks = ({
  ticks,
  scale
}) => (
  <div className="time-graduations-container">
    {ticks.map((tick, index) => (
      <p
        className="tick"
        key={index}
        style={{
          top: scale(tick.time) + '%'
        }}>
        <span className="legend">{tick.legend}</span>
      </p>
    ))}
  </div>
);

export const Controls = ({
  zoomIn,
  zoomOut
}) => (
  <div className="controls-container">
    <button id="left">backward</button>
    <button id="right">forward</button>
    <button onMouseDown={zoomIn} id="zoom-in">zoom-in</button>
    <button onMouseDown={zoomOut} id="zoom-out">zoom-out</button>
  </div>
);

export const ClustersGroup = ({
  clusters,
  viewParameters,
  scale
}) => (
<div className="columns-container">
  {
    clusters.columns.map(column => (
      <div key={column} className="objects-column">
        {clusters
          .timeObjects
          .filter(obj => obj.column === column)
          .map((obj, index) => (
            <TimeObject
              key={index}
              point={obj}
              scale={scale}
              color={viewParameters.colorsMap[obj.category]}
              showLabel={!obj.overlapped} />
          ))
        }
      </div>
    ))
  }
</div> 
)
