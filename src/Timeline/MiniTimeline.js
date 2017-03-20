import React, {Component} from 'react';

import ObjectsContainer from './ObjectsContainer';
import Brush from './Brush';
import TimeTicks from './TimeTicks';

import {
  clusterTimeObjects
} from './utils';

export default class MiniTimeline extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      width: undefined,
      height: undefined,
      data: clusterTimeObjects(props.data, [props.timeBoundaries.minimumDateDisplay, props.timeBoundaries.maximumDateDisplay])
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.state.data) {
      this.setState({
        data: clusterTimeObjects(nextProps.data, [nextProps.timeBoundaries.minimumDateDisplay, nextProps.timeBoundaries.maximumDateDisplay])
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
      onTimespanUpdate
    } = this.props;
    const {
      width,
      height,
      data
    } = this.state;
    const bindRef = svg => this.node = svg;
    return (
      <aside className="mini-timeline">
        <svg
          className="mini-timeline-container"
          ref={bindRef}>
          <TimeTicks
            width={width}
            height={height}
            transitionsDuration={500}
            minimumDate={timeBoundaries.minimumDateDisplay}
            maximumDate={timeBoundaries.maximumDateDisplay}
          />
          <ObjectsContainer
            viewParameters={viewParameters}
            data={data}
            periodsClusters={periodsClusters}
            eventsClusters={eventsClusters}
            width={width * .9}
            transform={'scale(.9)translate(' + width * .1 + ' 0)'}
            height={height}
            transitionsDuration={500}
            timeBoundaries={[timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay]} />
          <Brush
            timeBoundaries={[timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay]}
            from={viewParameters.fromDate}
            to={viewParameters.toDate}
            width={width}
            height={height} 
            onUpdate={onTimespanUpdate}
          />
        </svg>
      </aside>
    );
  }
}
