import React from 'react';

export const TimeObject = ({
  point,
  scale,
  showLabel = true
}) => (
  <span
    className={'time-object' + (point.endDate ? ' period' : ' point')}
    title={point.name}
    style={{
      top: scale(point.startDate.getTime()) + '%',
      height: point.endDate ? scale(point.endDate.getTime()) - scale(point.startDate.getTime()) + '%' : undefined
    }}>
    <span className="marker" />
    {showLabel ? <span className="name">
      {point.name.length > 27 ? point.name.substr(0, 30) + '...' : point.name}
    </span> : ''}
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
        {tick.legend}
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
