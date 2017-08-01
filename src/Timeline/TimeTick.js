/**
 * This module exports a component for displaying a single time tick
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

import {interpolateNumber} from 'd3-interpolate';
import {timer} from 'd3-timer';

/**
 * TimeTick main component
 */
export default class TimeTick extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor(props) {
    super(props);
    this.state = {
      y: props.y
    };
    this.update = this.update.bind(this);
  }
  /**
   * Executes code on instance after the component is mounted
   */
  componentDidMount() {
    this.update(this.state.y, this.props.transitionsDuration);
  }
  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(next) {
    if (next.y !== this.state.y) {
      this.update(next.y, this.props.transitionsDuration);
      this.setState({
        y: next.y
      });
    }
  }
  /**
   * Handle object modifications with new parameters
   * @param {number} y - the new vertical position of the component
   * @param {number} transitionsDuration - the new durations to use for moving the component
   */
  update (y, transitionsDuration) {
    const {node} = this;
    const from = this.state.y;
    const to = y;
    const interp = interpolateNumber(from, to);
    if (from) {
      node.setAttribute('transform', 'translate(0 ' + from + ')');
    }
    const onTick = elapsed => {
      const t = elapsed < transitionsDuration ? 1 - Math.log(elapsed / transitionsDuration) : 1;
      const newY = interp(t);
      node.setAttribute('transform', 'translate(0 ' + newY + ')');
      if (t >= 1) {
        this.transition.stop();
      }
    };
    if (this.transition) {
      this.transition.restart(onTick, 0, transitionsDuration);
    }
    else {
      this.transition = timer(onTick, transitionsDuration);
    }
  }

  /**
   * Renders the component
   * @return {ReactElement} component - react representation of the component
   */
  render() {
    const {
      textHeight,
      width,
      tick
    } = this.props;
    const bindRef = (node) => {
      this.node = node;
    };
    return (
      <g
        className="tick"
        ref={bindRef}>
        <line
          x1={0}
          x2={width}
          y1={0}
          y2={0} />
        <text
          y={textHeight}
          fontSize={textHeight}>
          {tick.legend}
        </text>
      </g>
    );
  }
}
