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

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.state.data) {
      this.setState({
        data: clusterTimeObjects(nextProps.data, [nextProps.viewParameters.fromDate, nextProps.viewParameters.toDate])
      });
    }
  }

  componentDidMount() {
    const {updateDimensions} = this;
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
  }

  componentWillUnmount() {
    const {updateDimensions} = this;
    window.removeEventListener('resize', updateDimensions);
  }

  onMouseDown(evt) {
    const bbox = evt.target.getBBox();
    const height = bbox.height;
    const y = evt.clientY;
    this.setState({
      grabbing: true,
      prevY: y
    });
  }
  onMouseMove(evt) {
    if (this.state.grabbing) {
      const bbox = evt.target.getBBox();
      const height = bbox.height;
      const y = evt.clientY;
      const diff = this.state.prevY - y;
      const dateDiff =  (diff / this.state.height) * (this.props.viewParameters.toDate - this.props.viewParameters.fromDate)
      this.props.onPan(dateDiff > 0, Math.abs(dateDiff));
    }
  }
  onMouseUp(evt) {
    this.setState({
      grabbing: false,
      prevY: undefined
    })
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
      periodsClusters,
      eventsClusters,
      timeBoundaries,
      onZoom
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
      this.node = svg
    };
    const bindCaptorRef = rect => {
      this.captor = rect;
    };

    const onWheel = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const forward = e.deltaY > 0;
      onZoom(1 - e.deltaY/200);
    }

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
            maximumDate={viewParameters.toDate}
          />
          <rect 
            className="timeline-captor"
            width={width}
            height={height}
            style={{
              cursor: grabbing ? 'grabbing': 'grab'
            }}
            x={0}
            y={0}
            ref={bindCaptorRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          />
          <ObjectsContainer
            viewParameters={viewParameters}
            data={data}
            width={width * .9}
            height={height}
            transform={'scale(.9)translate(' + width * .1 + ' 0)'}
            transitionsDuration={1000}
            timeBoundaries={[viewParameters.fromDate, viewParameters.toDate]} />
          <g
            className="labels-container" />
        </svg>
      </section>
    );
  }
}
