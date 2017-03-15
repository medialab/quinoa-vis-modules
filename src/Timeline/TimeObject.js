import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {timer} from 'd3-timer';
import {interpolateNumber, interpolateString} from 'd3-interpolate';

export default class TimeObject extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.isEntering = this.isEntering.bind(this);
    this.isExiting = this.isExiting.bind(this);
    this.isUpdating = this.isUpdating.bind(this);
    this.state = {
      scaleX: undefined,
      timeObject: props.timeObject
    };
  }

  componentDidMount() {
    const {props, state} = this;
    this.removed = {};
    this.update(props, props, state);
  }

  componentWillReceiveProps(next) {
    const {props, state} = this;
    if (this.props.timeObject.state !== next.timeObject.state) {
      this.update(next, props, state);
    }
  }

  componentWillUnmount() {
  }

  isEntering (node, duration) {
    const interp = interpolateNumber(1e-6, 1);
    node.setAttribute('opacity', 1e-6);
    this.transition = timer(elapsed => {
      const t = elapsed < duration ? (elapsed / duration) : 1;
      node.setAttribute('opacity', interp(t));
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  isUpdating (node, duration, prevTimeObject, timeObject) {
    const prevY = this.props.scaleY(prevTimeObject.startDate.getTime());
    const y = this.props.scaleY(timeObject.startDate.getTime());
    const prevX = this.props.scaleX(prevTimeObject.column);
    const x = this.props.scaleX(timeObject.column);
    const fromTransform = 'translate(' + prevX + 'px) translateY(' + prevY + 'px)';
    const toTransform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
    const interpTransform = interpolateString(fromTransform, toTransform);
    if (fromTransform)
      node.setAttribute('transform', fromTransform);

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;
      console.log(interpTransform(t))
      // node.setAttribute('transform', interpTransform(t));
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  isExiting (node, duration, timeObject) {
    // const interp = interpolateNumber(1, 1e-6);
    // node.setAttribute('opacity', 1);
    // this.transition = timer(elapsed => {
    //   const t = elapsed < duration ? (elapsed / duration) : 1;
    //   node.setAttribute('opacity', interp(t));
    //   if (t === 1) {
    //     this.transition.stop();
    //     this.props.removeNode(timeObject.id);
    //   }
    // });
  }

  update({timeObject, transitionsDuration}, props) {
    switch (timeObject.state) {
      case 'isEntering':
        this.isEntering(this.node, transitionsDuration);
        break;
      case 'isExiting':
        this.isExisting(this.node, transitionsDuration, timeObject);
        break;
      case 'isUpdating':
        this.isUpdating(this.node, transitionsDuration, props.timeObject, timeObject);
        break;
      default:
        break;
    }
  }

  render() {
    const {
      timeObject,
      scaleX,
      scaleY,
      columnWidth,
      color
    } = this.props;
    const bindRef = g => this.node = g;

    const x = scaleX(timeObject.column);
    const y = scaleY(timeObject.startDate.getTime());
    const style = {
      transform: 'translateX(' + x + 'px) ' +
        'translateY(' + y + 'px)'
    };
    const height = timeObject.type === 'period' && scaleY(timeObject.endDate.getTime()) - y;
    return (
      <g
        className="time-object-group"
        style={style}
        ref={bindRef}>
        {
        timeObject.type === 'event' ?
          <circle x={0} y={0} r={columnWidth / 2} fill={color} />
          :
          <rect x={0} y={0} width={columnWidth} height={height} fill={color} />
        }
      </g>
    );
  }
}
