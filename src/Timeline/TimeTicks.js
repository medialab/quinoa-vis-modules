/**
 * This module exports a component for displaying a group of time ticks
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {computeTicks} from './utils';

import TimeTick from './TimeTick';

/**
 * TimeTicks main component
 */
export default class TimeTicks extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor(props) {
    super(props);
    this.state = {
      scaleY: undefined
    };
  }
  /**
   * Renders the component
   * @return {ReactElement} component - react representation of the component
   */
  render() {
    const {
      width,
      height,
      minimumDate,
      maximumDate,
      transitionsDuration
    } = this.props;
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
                transitionsDuration={transitionsDuration} />
            );
          })
        }
      </g>
    ) : null;
  }
}
