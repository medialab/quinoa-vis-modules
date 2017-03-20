import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {computeTicks} from './utils';

import TimeTick from './TimeTick';

export default class TimeTicks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleY: undefined
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(next) {
  }

  componentWillUnmount() {
  }

  

  render() {
    const {
      width,
      height,
      minimumDate,
      maximumDate,
      transitionsDuration
    } = this.props;
    const bindRef = g => this.node = g;
    const ticks = computeTicks(minimumDate, maximumDate);
    const scaleY = scaleLinear().domain([minimumDate, maximumDate]).range([0, height]);
    const textHeight = 0.1 * height / ticks.length;
    return width && height ? (
      <g className="ticks-container">
        {
          ticks.map((tick, index) => {
            const y = scaleY(tick.time);
            return (
              <TimeTick
                key={index}
                tick={tick}
                y={y}
                textHeight={textHeight}
                width={width}
                transitionsDuration={transitionsDuration}
              />
            );
          })
        }
      </g>
    ) : null;
  }
}
