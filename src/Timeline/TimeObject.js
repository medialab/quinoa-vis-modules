/* eslint react/prefer-stateless-function : 0 */
/* eslint react/require-optimization : 0 */
/**
 * This module exports a component for displaying a single time object (point or period)
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

// todo: turn this component to a pure function

/**
 * TimeObject main component
 */
export default class TimeObject extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor(props) {
    super(props);
  }
  /**
   * Renders the component
   * @return {ReactElement} component - react representation of the component
   */
  render() {
    const {
      color,
      columnWidth,
      onSelection,
      scaleX,
      scaleY,
      selected,
      shown,
      timeObject,
    } = this.props;
    const x = scaleX(timeObject.column);
    const y = scaleY(timeObject.startDate.getTime());
    const objectWidth = columnWidth > 10 ? 10 : columnWidth;// todo: parametrize that
    const height = timeObject.type === 'period' && scaleY(timeObject.endDate.getTime()) - y;
    return (
      <g
        className={
          'time-object-group ' +
          (selected ? 'selected' : '') +
          (shown ? '' : 'hidden')
        }
        transform={'translate(' + x + ' ' + y + ')'}
        id={'time-object-' + timeObject.id}>
        {
        timeObject.type === 'event' ?
          <circle
            cx={objectWidth / 2}
            cy={0}
            r={objectWidth / 2}
            fill={color}
            onClick={onSelection} />
          :
          <rect
            x={0}
            y={0}
            width={objectWidth}
            height={height}
            fill={color}
            onClick={onSelection} />
        }
      </g>
    );
  }
}
