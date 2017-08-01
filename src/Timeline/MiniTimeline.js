/**
 * This module exports a component for displaying the mini (small) timeline
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

import ObjectsContainer from './TimeObjectsContainer';
import Brush from './Brush';
import TimeTicks from './TimeTicks';

import {
  clusterTimeObjects
} from './utils';

/**
 * MiniTimeline main component
 */
export default class MiniTimeline extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      width: undefined,
      height: undefined,
      data: clusterTimeObjects(props.data, [props.timeBoundaries.minimumDateDisplay, props.timeBoundaries.maximumDateDisplay])
    };
  }
  /**
   * Executes code on instance after the component is mounted
   */
  componentDidMount() {
    const {updateDimensions} = this;
    updateDimensions();
  }
  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.state.data) {
      this.setState({
        data: clusterTimeObjects(nextProps.data, [nextProps.timeBoundaries.minimumDateDisplay, nextProps.timeBoundaries.maximumDateDisplay])
      });
    }
  }
  /**
   * Executes code on instance after the component has been updated
   * @param {object} prevProps - the props before update
   */
  componentDidUpdate(prevProps) {
    // if dimensions have changed we update dimensions of the component
    if (
      prevProps.parentDimensions.width !== this.props.parentDimensions.width
      || prevProps.parentDimensions.height !== this.props.parentDimensions.height
    ) {
      this.updateDimensions();
    }
  }
  /**
   * Handles updating the state with new dimensions of the component
   */
  updateDimensions () {
    if (this.node) {
      const bRect = this.node.getBoundingClientRect();
      this.setState({
        width: bRect.width,
        height: bRect.height
      });
    }
  }
  /**
   * Renders the component
   * @return {ReactElement} component - react representation of the component
   */
  render() {
    const {
      viewParameters,
      periodsClusters,
      eventsClusters,
      timeBoundaries,
      onTimespanUpdate,
      allowUserEvents
    } = this.props;
    const {
      width,
      height,
      data
    } = this.state;
    const bindRef = svg => {
      this.node = svg;
    };
    return (
      <aside className="mini-timeline">
        <svg
          className="mini-timeline-container"
          ref={bindRef}>
          <ObjectsContainer
            viewParameters={viewParameters}
            data={data}
            periodsClusters={periodsClusters}
            eventsClusters={eventsClusters}
            width={width * 0.9}
            transform={'scale(.9, 1)translate(' + width * 0.1 + ' 0)'}
            height={height}
            transitionsDuration={500}
            timeBoundaries={[timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay]} />
          <TimeTicks
            width={width}
            height={height}
            transitionsDuration={500}
            minimumDate={timeBoundaries.minimumDateDisplay}
            maximumDate={timeBoundaries.maximumDateDisplay} />
          <Brush
            timeBoundaries={[timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay]}
            from={viewParameters.fromDate}
            to={viewParameters.toDate}
            width={width}
            height={height}
            onUpdate={onTimespanUpdate}
            active={allowUserEvents} />
        </svg>
      </aside>
    );
  }
}
