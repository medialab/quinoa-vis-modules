import React, {Component} from 'react';

// import ReactMarkdown from 'react-markdown';

export default class Label extends Component {
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
      color
    } = this.props;
    const x = scaleX(timeObject.column);
    const y = scaleY(timeObject.startDate.getTime());
    const objectWidth = columnWidth > 10 ? 10 : columnWidth;
    const height = timeObject.type === 'period' && scaleY(timeObject.endDate.getTime()) - y;
    return (
      <g
        className="label-group"
        transform={'translate(' + x + ' ' + y + ')'}
        id={'time-object-' + timeObject.id}
        clipPath={'url(#clip' + timeObject.id + ')'}>
        <rect
          fill="#FFFFFF"
          fillOpacity={0.8}
          x={objectWidth}
          y={-columnWidth / 10}
          width={columnWidth + columnWidth / 10}
          height={objectWidth} />
        {
        timeObject.type === 'event' ?
          <circle
            cx={objectWidth / 2}
            cy={0}
            r={objectWidth / 2}
            fill={color} />
          :
          <rect
            x={0}
            y={0}
            width={objectWidth}
            height={height}
            fill={color} />
        }
        <text
          x={objectWidth * 2}
          y={objectWidth / 2}
          maxWidth={columnWidth}>
          {timeObject.title}
        </text>
        <clipPath id={'clip' + timeObject.id}>
          <rect
            x={objectWidth}
            y={-columnWidth / 10}
            width={columnWidth}
            height={objectWidth * 5} />
        </clipPath>
      </g>
    );
  }
}
