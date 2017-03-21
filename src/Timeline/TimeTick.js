import React, {Component} from 'react';

import {interpolateNumber} from 'd3-interpolate';
import {timer} from 'd3-timer';

export default class TimeTick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      y: props.y
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.update(this.state.y, this.props.transitionsDuration);
  }

  componentWillReceiveProps(next) {
    if (next.y !== this.state.y) {
      this.update(next.y, this.props.transitionsDuration);
      this.setState({
        y: next.y
      });
    }
  }

  componentWillUnmount() {
  }

  update (y, transitionsDuration) {
    const {node} = this;
    // if (this.node) {
    //   this.node.setAttribute('transform', 'translate(0 ' + y + ')');
    // }
    // const from = 'translate(0 ' + this.state.y + ')';
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
