/**
 * This module exports a stateful timeline object label component
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

/**
 * Label main component
 */
export default class Label extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
    this.toggleHover = this.toggleHover.bind(this);
  }

  /**
   * Toogles hovering state of the component
   * @param {boolean} target - the hover state to set
   */
  toggleHover (target) {
    const hovered = target === undefined ? !this.state.hovered : target;
    this.setState({
      hovered
    });
    this.props.toggleLabelHover(this.props.timeObject.id, hovered);
  }
  /**
   * Renders the component
   * @return {ReactElement} component - react representation of the component
   */
  render() {
    const {
      timeObject,
      scaleX,
      scaleY,
      columnWidth,
      screenHeight,
      screenWidth,
      color,
      onObjectSelection,
      selected,
      shown
    } = this.props;
    const {
      availableColumns
    } = timeObject;
    const {
      hovered
    } = this.state;
    const x = scaleX(timeObject.column);
    const y = scaleY(timeObject.startDate.getTime());
    // todo: {:o this is dirty
    const objectWidth = columnWidth > 10 ? 10 : columnWidth;
    const textHeight = screenHeight / 40;
    let labelWidth = columnWidth * availableColumns - columnWidth * 0.3;// this should be parametrized
    labelWidth = labelWidth < 0 ? 0 : labelWidth;

    const availableWidth = screenWidth - x + objectWidth;
    let bgWidth = this.text ? this.text.getBBox().width : 0;
    if (bgWidth > availableWidth) {
      bgWidth = availableWidth;
    }

    let labelY = timeObject.type === 'event' ?
      y : y + textHeight / 2;
    labelY = labelY > 0 ? labelY : textHeight;
    /**
     * Callbacks
     */
    const onMouseEnter = () => this.toggleHover(true);
    const onMouseLeave = () => this.toggleHover(false);
    const handleClick = () => {
      onObjectSelection(timeObject.id);
    };
    /**
     * Reference binding
     */
    const bindTextRef = (text) => {
      this.text = text;
    };
    return (
      <g
        className={
          'label-group ' +
          (availableColumns === 0 ? 'hidden' : '') +
          (selected ? 'selected' : '') +
          (shown ? '' : 'filtered-out')
        }
        transform={'translate(' + x + ' ' + labelY + ')'}
        id={'time-object-' + timeObject.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}>
        <rect
          fill="#FFFFFF"
          x={timeObject.type === 'event' ? -objectWidth / 2 : objectWidth + objectWidth * 0.2}
          y={-textHeight}
          width={hovered || selected ? bgWidth + objectWidth * 2 : labelWidth}
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
          x={objectWidth * 1.5}
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
            width={hovered || selected ? objectWidth * 3 + bgWidth : labelWidth}
            height={textHeight * 2}
            className="rect-clip-path" />
        </clipPath>
      </g>
    );
  }
}
