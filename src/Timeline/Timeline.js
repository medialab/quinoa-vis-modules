/**
 * This module exports a stateful customizable timeline component
 * @module Timeline
 */

import React, {PropTypes} from 'react';
import {scaleLinear} from 'd3-scale';
import {timeFormat} from 'd3-time-format';
import {debounce} from 'lodash';

import {
  setTicks,
  computeTicks,
  clusterEvents,
  computeDataRelatedState
} from '../utils/timelineDataParser';

import {
  Brush,
  TimeTicks,
  Controls,
  ClustersGroup
} from './subComponents.js';
import './Timeline.scss';

/**
 * Timeline main component
 */
class Timeline extends React.Component {
  /**
   * constructor
   */
  constructor (props) {
    super(props);
    this.pan = this.pan.bind(this);
    this.zoom = this.zoom.bind(this);
    this.jump = this.jump.bind(this);
    this.setViewSpan = this.setViewSpan.bind(this);
    this.onUserViewChange = debounce(this.onUserViewChange, 100);
    this.state = computeDataRelatedState(props.data, props.viewParameters || {});
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
      this.setState({
        viewParameters: nextProps.viewParameters
      });
    }

    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      const newStateParts = computeDataRelatedState(nextProps.data, nextProps.viewParameters);
      this.setState({
        ...newStateParts
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.lastEventDate !== nextState.lastEventDate && typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange({
        lastEventType: nextState.lastEventType,
        viewParameters: nextState.viewParameters
      });
    }
  }

  /**
   * Lets instance parent to know when user has updated view
   * @param {string} parameters - visualization parameters to update
   * @param {string} lastEventType - event type of the last event triggered by user
   */
  onUserViewChange (newParameters, lastEventType) {
    this.setState({
      lastEventType,
      lastEventDate: new Date()
    });
  }

  /**
   * Computes and calls a translation to the timespan being displayed in the main timeline
   * @param {boolean} forward - whether panning goes forward or backward in time
   * @param {number} delta - number of miliseconds to pan
   */
  pan (forward, delta) {
    const from = this.state.viewParameters.fromDate + (forward ? delta : -delta);
    const to = this.state.viewParameters.toDate + (forward ? delta : -delta);
    this.setViewSpan(from, to, false);
    this.onUserViewChange({
      fromDate: from,
      toDate: to
    }, 'wheel');
  }

  /**
   * Computes and calls a change of scale to the timespan being displayed in the main timeline - camera center is preserved
   * @param {number} coefficient - the coefficient to apply to the scaling of view
   */
  zoom (coefficient) {
    const timeSpan = this.state.viewParameters.toDate - this.state.viewParameters.fromDate;
    const newTimeSpan = timeSpan / coefficient;
    const diff = newTimeSpan - timeSpan;
    const newFrom = this.state.viewParameters.fromDate - diff / 2;
    const newTo = this.state.viewParameters.toDate + diff / 2;
    if (newFrom >= this.state.timeBoundaries.minimumDateDisplay && newTo <= this.state.timeBoundaries.maximumDateDisplay) {
      this.setViewSpan(newFrom, newTo, false);
      this.onUserViewChange({
        fromDate: newFrom,
        toDate: newTo
      }, 'zoom');
    }
  }

  /**
   * Computes and calls a move of the timespan being displayed to a specific central point of time
   * @param {number|object} param - whether an absolute time or an event position object
   * @param {boolean} fromEvent - determines whether jump is called from a click-like event or not, thus whether first param is a number of an object
   */
  jump (param, fromEvent = true) {
    let toTime;
    // giving event position as param
    if (fromEvent) {
      toTime = this.state.timeBoundaries.minimumDateDisplay + (this.state.timeBoundaries.maximumDateDisplay - this.state.timeBoundaries.minimumDateDisplay) * param.portionY;
    }
    // giving time number as param
    else {
      toTime = param;
    }
    const span = this.state.viewParameters.toDate - this.state.viewParameters.fromDate;
    this.setViewSpan(toTime - span / 2, toTime + span / 2, false);
  }
  /**
   * Computes and applies a change to the timespan being displayed
   * @param {number|object} from - whether an absolute time or an event position object
   * @param {number|object} to - whether an absolute time or an event position object
   * @param {boolean} fromEvent - determines whether jump is called from a click-like event or not, thus whether first param is a number of an object
   */
  setViewSpan (from, to, fromEvents = true) {
    let fromTime;
    let toTime;
    // giving events positions as params
    if (fromEvents) {
      fromTime = this.state.timeBoundaries.minimumDateDisplay + (this.state.timeBoundaries.maximumDateDisplay - this.state.timeBoundaries.minimumDateDisplay) * from.portionY;
      toTime = this.state.timeBoundaries.minimumDateDisplay + (this.state.timeBoundaries.maximumDateDisplay - this.state.timeBoundaries.minimumDateDisplay) * to.portionY;
    }
    // giving time numbers as params
    else {
      fromTime = from;
      toTime = to;
    }
    const viewParameters = {
        ...this.state.viewParameters,
        fromDate: fromTime,
        toDate: toTime
      };
    this.setState({
      viewParameters
    });
  }

  /**
   * Renders the component
   */
  render () {
    const {
      allowUserViewChange = true,
      orientation = 'portrait',
    } = this.props;

    const {
      data,
      miniScale,
      miniTicks,
      // note: viewParameters is present both in component props and in component state to allow temporary displacements between
      // the view parameters being provided by parent through props and internal viewParameters
      viewParameters,
      periodsClusters,
      eventsClusters: globalEventsClusters,
      timeBoundaries
    } = this.state;

    /*
     * Step: filter the elements to display in the main timeline
     */
    const fromDate = viewParameters.fromDate instanceof Date ? viewParameters.fromDate.getTime() : viewParameters.fromDate;
    const toDate = viewParameters.toDate instanceof Date ? viewParameters.toDate.getTime() : viewParameters.toDate;
    const timeSpan = toDate - fromDate;
    const displayedData = data.filter(point => {
      const start = point.startDate.getTime();
      const end = point.endDate && point.endDate.getTime();
      return (start >= fromDate && start <= toDate) || (end && end >= fromDate && end <= toDate);
    });
    /*
     * Step: organize events in a series of columns to avoid objects overlapping and allow a maximum number of labels to be rendered
     */
    const displayedEvents = displayedData.filter(obj => obj.endDate === undefined);
    const eventPadding = timeSpan / 20;
    const eventsClusters = clusterEvents(displayedEvents, eventPadding);
    /*
     * Step: organize periods in a series of columns to avoid objects overlapping and allow a maximum number of labels to be rendered
     */
    const displayedPeriods = periodsClusters.timeObjects.filter(point => {
      const start = point.startDate.getTime();
      const end = point.endDate && point.endDate.getTime();
      return (start >= fromDate && start <= toDate) || (end && end >= fromDate && end <= toDate);
    });
    /*
     * Step: compute timeline scale function, time graduations (ticks) and appropriate date formater (fn(timespan))
     */
    const timelineScale = scaleLinear().range([0, 100]).domain([fromDate, toDate]);
    const ticksParams = setTicks(toDate - fromDate);
    const formatDate = timeFormat(ticksParams.format);
    const mainTicks = computeTicks(fromDate, toDate);

    /*
     * Step: specify callbacks for user inputs
     */
    const onMainWheel = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!this.props.allowUserViewChange) {
        return;
      }
      const delta = (toDate - fromDate) / 10;
      const forward = e.deltaY > 0;
      if (forward && toDate + delta <= this.state.timeBoundaries.maximumDateDisplay) {
        this.pan(true, delta);
      }
      if (!forward && fromDate - delta >= this.state.timeBoundaries.minimumDateDisplay) {
        this.pan(false, delta);
      }
    };
    const onAsideWheel = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!this.props.allowUserViewChange) {
        return;
      }
      const delta = (toDate - fromDate) / 2;
      const forward = e.deltaY > 0;
      if (forward && toDate + delta <= timeBoundaries.maximumDateDisplay) {
        this.pan(true, delta);
      }
      if (!forward && fromDate - delta >= timeBoundaries.minimumDateDisplay) {
        this.pan(false, delta);
      }
    };
    const zoomIn = () => this.zoom(1.1);
    const zoomOut = () => this.zoom(0.9);
    const panBackward = () => this.pan(false, (toDate - fromDate) / 10);
    const panForward = () => this.pan(true, (toDate - fromDate) / 10);

    const onBrushClick = (fromInput, toInput) => {
      if (fromInput && toInput) {
        this.setViewSpan(fromInput, toInput);
      }
      /*
      // brush-resizing related
      const from = fromInput !== undefined ?
      fromInput
      : {
          portionY: Math.abs(viewParameters.fromDate / (timeBoundaries.maximumDateDisplay - timeBoundaries.minimumDateDisplay))
        };
      const to = toInput !== undefined ?
      toInput
      : {
          portionY: Math.abs(viewParameters.toDate / (timeBoundaries.maximumDateDisplay - timeBoundaries.minimumDateDisplay))
        };
      this.setViewSpan(from, to);
      */
    };

    const onBrushManipulation = (from, to) => {
      this.setViewSpan(from, to, false);
    };

    /*
     * Step: render component
     */
    return (
      <figure className={'quinoa-timeline' + (orientation === 'portrait' ? ' portrait' : ' landscape')}>
        <aside onWheel={onAsideWheel} className="mini-timeline">
          <TimeTicks ticks={miniTicks} scale={miniScale} />
          <Brush
            onSimpleClick={this.jump}
            scale={miniScale}
            fromDate={viewParameters.fromDate}
            toDate={viewParameters.toDate}
            active={allowUserViewChange}
            onSpanEventDefinition={onBrushClick}
            onSpanAbsoluteDefinition={onBrushManipulation} />
          <div className="time-objects-container">
            <ClustersGroup
              viewParameters={viewParameters}
              scale={miniScale}
              clusters={periodsClusters} />
            <ClustersGroup
              viewParameters={viewParameters}
              scale={miniScale}
              clusters={globalEventsClusters} />

          </div>
        </aside>
        <section className="main-timeline" onWheel={onMainWheel}>
          <TimeTicks ticks={mainTicks} scale={timelineScale} />

          <div className="time-objects-container">
            {displayedPeriods.length ?
              <ClustersGroup
                viewParameters={viewParameters}
                scale={timelineScale}
                clusters={{
                  columns: periodsClusters.columns,
                  timeObjects: displayedPeriods
                }} /> : ''}
            {eventsClusters.timeObjects.length ?
              <ClustersGroup
                viewParameters={viewParameters}
                scale={timelineScale}
                clusters={eventsClusters} /> : ''}
          </div>
          {allowUserViewChange ?
            <Controls
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              panForward={panForward}
              panBackward={panBackward} />
          : ''}
          <div className="time-boundaries-container">
            <div id="from-date">{formatDate(new Date(fromDate))}</div>
            <div id="to-date">{formatDate(new Date(toDate))}</div>
          </div>
        </section>
      </figure>
    );
  }
}

Timeline.propTypes = {
  /*
   * Incoming data in json format
   */
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    name: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date)
  })),
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not - like Timeline spatialization algorithm for instance)
   */
  viewParameters: PropTypes.shape({
    // colorsMap: PropTypes.object, // commented because it cannot be specified a priori, which gets the linter on nerves
    /*
     * parameters related to camera position
     */
    fromDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number
    ]),
    toDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number
    ]),
    /*
     * parameters specifying whether timeline should be displayed in left-to-right or top-to-bottom style
     */
    orientation: PropTypes.oneOf(['landscape', 'portrait'])
  }),
  /*
   * boolean to specify whether the user can pan/pan/interact or not with the view
   */
  allowUserViewChange: PropTypes.bool,
  /*
   * callback fn triggered when user changes view parameters, callbacks data about the triggering interaction and about the new view parameters
   */
  onUserViewChange: PropTypes.func
};

export default Timeline;
