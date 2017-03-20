import React, {Component} from 'react';

import ObjectsContainer from './ObjectsContainer';

import Brush from './Brush';

import {
  clusterTimeObjects
} from './utils';

export default class MainTimeline extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      width: undefined,
      height: undefined,
      data: clusterTimeObjects(props.data, [props.viewParameters.fromDate, props.viewParameters.toDate])
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
      onWheel
    } = this.props;
    const {
      width,
      height,
      data
    } = this.state;
    const bindRef = svg => this.node = svg;

    return (
      <section className="main-timeline" onWheel={onWheel}>
        <svg
          className="main-timeline-container"
          ref={bindRef}>
          <g
            className="ticks-container" />
          <ObjectsContainer
            viewParameters={viewParameters}
            data={data}
            width={width}
            height={height}
            transitionsDuration={1000}
            timeBoundaries={[viewParameters.fromDate, viewParameters.toDate]} />
          <g
            className="labels-container" />
        </svg>
      </section>
    );
  }
}
