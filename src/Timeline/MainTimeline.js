import React, {Component} from 'react';

import ObjectsContainer from './ObjectsContainer';

import TimeTicks from './TimeTicks';

import {
  clusterTimeObjects
} from './utils';

export default class MainTimeline extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.state = {
      width: undefined,
      height: undefined,
      data: clusterTimeObjects(props.data, [props.viewParameters.fromDate, props.viewParameters.toDate]),
      grabbing: false
    };
  }

  componentDidMount() {
    const {updateDimensions} = this;
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.state.data) {
      this.setState({
        data: clusterTimeObjects(nextProps.data, [nextProps.viewParameters.fromDate, nextProps.viewParameters.toDate])
      });
    }
  }

  componentWillUnmount() {
    const {updateDimensions} = this;
    window.removeEventListener('resize', updateDimensions);
  }

  onMouseDown(evt) {
    if (!this.props.allowUserEvents) {
      return;
    }
    const y = evt.clientY;
    this.setState({
      grabbing: true,
      prevY: y
    });
  }
  onMouseMove(evt) {
    if (!this.props.allowUserEvents) {
      return;
    }
    if (this.state.grabbing) {
      const y = evt.clientY;
      const diff = (this.state.prevY - y) / 5;
      const dateDiff = (diff / this.state.height) * (this.props.viewParameters.toDate - this.props.viewParameters.fromDate);
      this.props.onPan(dateDiff > 0, Math.abs(dateDiff));
      this.setState({
        prevY: y
      });
    }
  }
  onMouseUp() {
    if (!this.props.allowUserEvents) {
      return;
    }
    this.setState({
      grabbing: false,
      prevY: undefined
    });
  }

  updateDimensions () {
    if (this.node) {
      const bRect = this.node.getBoundingClientRect();
      this.setState({
        width: bRect.width,
        height: bRect.height
      });
    }
  }

  render() {
    const {
      viewParameters,
      allowUserEvents
    } = this.props;
    const {
      onMouseDown,
      onMouseMove,
      onMouseUp
    } = this;
    const {
      width,
      height,
      data,
      grabbing
    } = this.state;
    const bindRef = svg => {
      this.node = svg;
    };
    const bindCaptorRef = rect => {
      this.captor = rect;
    };

    const onWheel = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!allowUserEvents) {
        return;
      }
      let displacement = e.deltaY / 200;
      if (displacement > 0.9) {
        displacement = 0.9;
      }
      if (displacement < -0.9) {
        displacement = -0.9;
      }
      this.props.onZoom(1 + displacement);
    };

    return (
      <section className="main-timeline" onWheel={onWheel}>
        <svg
          className="main-timeline-container"
          ref={bindRef}>
          <TimeTicks
            width={width}
            height={height}
            transitionsDuration={500}
            minimumDate={viewParameters.fromDate}
            maximumDate={viewParameters.toDate} />
          <rect
            className="timeline-captor"
            width={width}
            height={height}
            style={{
              cursor: grabbing ? 'grabbing' : 'grab'
            }}
            x={0}
            y={0}
            ref={bindCaptorRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp} />
          <ObjectsContainer
            viewParameters={viewParameters}
            data={data}
            width={width * 0.9}
            height={height}
            transform={'scale(.9, 1)translate(' + width * 0.1 + ' 0)'}
            transitionsDuration={500}
            timeBoundaries={[viewParameters.fromDate, viewParameters.toDate]} />
          <g
            className="labels-container" />
        </svg>
      </section>
    );
  }
}
