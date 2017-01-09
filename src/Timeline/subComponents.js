import React from 'react';

export const TimeObject = ({
  point,
  scale
}) => (
  <span
    className={'time-object' + (point.endDate ? ' period' : ' point')}
    title={point.name}
    style={{
      top: scale(point.startDate.getTime()) + '%',
      height: point.endDate ? scale(point.endDate.getTime()) - scale(point.startDate.getTime()) + '%' : undefined
    }}>
    <span className="marker" />
    <span className="name">{point.name}</span>
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
}) => (
  <div className="controls-container">
    <button id="left">backward</button>
    <button id="right">forward</button>
    <button id="zoom-in">zoom-in</button>
    <button id="zoom-out">zoom-out</button>
  </div>
);
