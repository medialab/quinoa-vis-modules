import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {timer} from 'd3-timer';
import {interpolateNumber, interpolateString} from 'd3-interpolate';

export default class TimeObject extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {props, state} = this;
  }

  componentWillReceiveProps(next) {
  }

  componentWillUnmount() {
  }

  render() {
    const {
      from,
      to,
      timeBoundaries,
      width,
      height,
    } = this.props;
    const bindRef = g => this.node = g;

    const scaleY = scaleLinear().domain([timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay]).range([0, height]);

    const fromY = scaleY(from);
    const toY = scaleY(to);
    const brushHeight = toY - fromY;
    const style = {
      transform: 'translateX(' + 0 + 'px) ' +
        'translateY(' + fromY + 'px)'
    };
    return (
      <g
        className="brush-container"
        style={style}
        ref={bindRef}>
        <rect x={0} y={0} width={width} height={brushHeight} fill="rgba(0,0,0,.3)" />
      </g>
    );
  }
}
