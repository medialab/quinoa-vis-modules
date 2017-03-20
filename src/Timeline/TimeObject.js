import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {timer} from 'd3-timer';
import {interpolateNumber, interpolateString} from 'd3-interpolate';

let transition;

export default class TimeObject extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    // this.isEntering = this.isEntering.bind(this);
    // this.isExiting = this.isExiting.bind(this);
    // this.isUpdating = this.isUpdating.bind(this);
    this.state = {
      scaleX: undefined,
      timeObject: props.timeObject,
      entering: true
    };
  }

  componentDidMount() {
    const {props, state} = this;
    this.removed = {};
    this.update(props, props, state);
  }

  componentWillReceiveProps(next) {
    const {props, state} = this;
    this.update(next, props);
    // if (this.props.timeObject.state !== next.timeObject.state) {
    //   this.update(next, props, state);
    // }
  }

  componentWillUnmount() {
  }

  // isEntering (node, duration) {
  //   const prevY = - 10000;
  //   const y = this.props.scaleY(this.props.timeObject.startDate.getTime());
  //   const prevX = this.props.scaleX(this.props.timeObject.column);
  //   const x = this.props.scaleX(this.props.timeObject.column);
  //   const fromTransform = 'translate(' + prevX + ' ' + prevY + ')';
  //   const toTransform = 'translate(' + x + ' ' + y + ')';
  //   const interpTransform = interpolateString(fromTransform, toTransform);

  //   const interpOpacity = interpolateNumber(1e-6, 1);
  //   // node.setAttribute('opacity', 1e-6);
  //   node.setAttribute('transform', fromTransform);
  //   this.transition = timer(elapsed => {
  //     const t = elapsed < duration ? (elapsed / duration) : 1;
  //     // node.setAttribute('opacity', interpOpacity(t));
  //     node.setAttribute('transform', interpTransform(t));
  //     if (t === 1) {
  //       this.transition.stop();
  //       this.setState({
  //         entering: false
  //       })
  //     }
  //   });
  // }

  // isUpdating (node, duration, prevTimeObject, timeObject) {
  //   const prevY = this.props.scaleY(prevTimeObject.startDate.getTime());
  //   const y = this.props.scaleY(timeObject.startDate.getTime());
  //   const prevX = this.props.scaleX(prevTimeObject.column);
  //   const x = this.props.scaleX(timeObject.column);
  //   const fromTransform = 'translate(' + prevX + ' ' + prevY + ')';
  //   const toTransform = 'translate(' + x + ' ' + y + ')';
  //   const interpTransform = interpolateString(fromTransform, toTransform);
  //   if (fromTransform) {
  //     node.setAttribute('transform', fromTransform);
  //   }
  //   this.transition = timer(elapsed => {
  //     let t = elapsed < duration ? (elapsed / duration): 1;
  //     node.setAttribute('transform', interpTransform(t));
  //     if (t === 1) {
  //       this.transition.stop();
  //     }
  //   });
  // }

  // isExiting (node, duration, timeObject) {
  //   console.log('is exiting');
  //   // const interp = interpolateNumber(1, 1e-6);
  //   // node.setAttribute('opacity', 1);
  //   // this.transition = timer(elapsed => {
  //   //   const t = elapsed < duration ? (elapsed / duration) : 1;
  //   //   node.setAttribute('opacity', interp(t));
  //   //   if (t === 1) {
  //   //     this.transition.stop();
  //   //     this.props.removeNode(timeObject.id);
  //   //   }
  //   // });
  // }

  update({timeObject, transitionsDuration}, prevProps) {
    const node = this.node;
    const prevTimeObject = prevProps.timeObject;

    const prevY = this.props.scaleY(prevTimeObject.startDate.getTime());
    const y = this.props.scaleY(timeObject.startDate.getTime());
    const prevX = this.props.scaleX(prevTimeObject.column);
    const x = this.props.scaleX(timeObject.column);
    const fromTransform = 'translate(' + prevX + ' ' + prevY + ')';
    const toTransform = 'translate(' + x + ' ' + y + ')';
    const interpTransform = interpolateString(fromTransform, toTransform);
    if (fromTransform) {
      node.setAttribute('transform', fromTransform);
    }
    const onTick = elapsed => {
      const t = elapsed < transitionsDuration ? (elapsed / transitionsDuration) : 1;
      const newTransform = interpTransform(t);
      node.setAttribute('transform', newTransform);
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
      timeObject,
      scaleX,
      scaleY,
      columnWidth,
      color
    } = this.props;
    const bindRef = g => this.node = g;

    const x = scaleX(timeObject.column);
    const y = scaleY(timeObject.startDate.getTime());

    const objectWidth = columnWidth > 10 ? 10 : columnWidth;
    // transform={'translate(' + x + ' ' + y + ')'}

    const height = timeObject.type === 'period' && scaleY(timeObject.endDate.getTime()) - y;
    return (
      <g
        className="time-object-group"
        ref={bindRef}
        id={'time-object-' + timeObject.id}>
        {
        timeObject.type === 'event' ?
          <circle cx={objectWidth / 2} cy={0} r={objectWidth / 2} fill={color} />
          :
          <rect x={0} y={0} width={objectWidth} height={height} fill={color} />
        }
      </g>
    );
  }
}
