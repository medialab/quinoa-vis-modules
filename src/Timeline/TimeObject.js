import React, {Component} from 'react';

export default class TimeObject extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const {
      timeObject,
      scaleX,
      scaleY,
      columnWidth,
      color,
      selected,
      onSelection
    } = this.props;
    const x = scaleX(timeObject.column);
    const y = scaleY(timeObject.startDate.getTime());
    const objectWidth = columnWidth > 10 ? 10 : columnWidth;
    const height = timeObject.type === 'period' && scaleY(timeObject.endDate.getTime()) - y;
    return (
      <g
        className={'time-object-group ' + (selected ? 'selected' : '')}
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
