import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {computeTicks} from './utils';

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
      maximumDate
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
              <g 
                className="tick"
                transform={'translate(0 ' + y + ')'}
                key={index}
              >
                <line
                  x1={0}
                  x2={width}
                  y1={0}
                  y2={0}
                />
                <text
                  y={textHeight}
                  fontSize={textHeight}
                >
                  {tick.legend}
                </text>
              </g>
            );
          })
        }
      </g>
    ) : null;
  }
}
