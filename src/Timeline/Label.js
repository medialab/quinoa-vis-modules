import React, {Component} from 'react';

// import ReactMarkdown from 'react-markdown';

export default class Label extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
    this.toggleHover = this.toggleHover.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  toggleHover (target) {
    const hovered = target === undefined ? !this.state.hovered : target;
    this.setState({
      hovered
    });
    this.props.toggleLabelHover(this.props.timeObject.id, hovered);
  }

  render() {
    const {
      timeObject,
      scaleX,
      scaleY,
      columnWidth,
      screenHeight,
      screenWidth,
      color
    } = this.props;
    const {
      availableColumns
    } = timeObject;
    const {
      hovered
    } = this.state;
    const x = scaleX(timeObject.column);
    const y = scaleY(timeObject.startDate.getTime());
    const objectWidth = columnWidth > 10 ? 10 : columnWidth;
    const textHeight = screenHeight / 40;
    let labelWidth = columnWidth * availableColumns - columnWidth * 0.3;
    labelWidth = labelWidth < 0 ? 0 : labelWidth;

    const bindTextRef = (text) => {
      this.text = text;
    };
    const availableWidth = screenWidth - x;
    let bgWidth = this.text ? this.text.getBBox().width : 0;
    if (bgWidth > availableWidth) {
      bgWidth = availableWidth;
    }

    let labelY = timeObject.type === 'event' ?
      y : y + textHeight / 2;
    labelY = labelY > 0 ? labelY : textHeight;

    const onMouseEnter = () => this.toggleHover(true);
    const onMouseLeave = () => this.toggleHover(false);
    return (
      <g
        className={'label-group ' + (availableColumns === 0 ? 'hidden' : '')}
        transform={'translate(' + x + ' ' + labelY + ')'}
        id={'time-object-' + timeObject.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <rect
          fill="#FFFFFF"
          x={timeObject.type === 'event' ? -objectWidth / 2 : objectWidth}
          y={-textHeight}
          width={hovered ? bgWidth + objectWidth : labelWidth}
          height={textHeight * 2}
          className="background-rect" />
        {
        timeObject.type === 'event' ?
          <circle
            cx={objectWidth / 2}
            cy={0}
            r={objectWidth / 2}
            fill={color} />
          :
          null
        }
        <text
          x={objectWidth * 1.2}
          y={textHeight / 3}
          fontSize={textHeight}
          clipPath={'url(#clip' + timeObject.id + ')'}
          ref={bindTextRef}>
          {timeObject.title}
        </text>
        <clipPath id={'clip' + timeObject.id}>
          <rect
            x={-objectWidth / 2}
            y={-textHeight}
            width={hovered ? bgWidth : labelWidth}
            height={textHeight * 2}
            className="rect-clip-path" />
        </clipPath>
      </g>
    );
  }
}
