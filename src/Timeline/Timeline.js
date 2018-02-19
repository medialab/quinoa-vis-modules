/**
 * This module exports a stateful customizable timeline component
 * @module quinoa-vis-modules/Timeline
 */

import React from 'react';
import PropTypes from 'prop-types';
import {easeCubic} from 'd3-ease';
import {debounce} from 'lodash';
import {timeFormat} from 'd3-time-format';


import Measure from 'react-measure';

import {
  normalizeData,
  computeDataRelatedState,
  setTicks
} from './utils';

import './Timeline.scss';

import MiniTimeline from './MiniTimeline';
import MainTimeline from './MainTimeline';
import ObjectDetail from './ObjectDetail';

import {interpolateNumber} from 'd3-interpolate';
import {timer} from 'd3-timer';

/**
 * Timeline main component
 */
class Timeline extends React.Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor (props) {
    super(props);
    this.pan = this.pan.bind(this);
    this.zoom = this.zoom.bind(this);
    this.jump = this.jump.bind(this);
    this.setViewSpan = this.setViewSpan.bind(this);
    this.selectObject = this.selectObject.bind(this);
    this.resetSelection = this.resetSelection.bind(this);
    this.onUserViewChange = debounce(this.onUserViewChange, 100);
    this.emitViewChange = debounce(this.emitViewChange, 300);
    this.state = computeDataRelatedState(props.data, props.viewParameters || {});
    this.transition = null;
  }
  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    // date bounds are changed --> update timeline
    if (
      this.props.viewParameters.fromDate !== nextProps.viewParameters.fromDate ||
      this.props.viewParameters.toDate !== nextProps.viewParameters.toDate
    ) {
      const transitionsDuration = 500;
      const prevFrom = this.state.viewParameters.fromDate;
      const prevTo = this.state.viewParameters.toDate;
      const newFrom = nextProps.viewParameters.fromDate;
      const newTo = nextProps.viewParameters.toDate;
      const interpFrom = interpolateNumber(prevFrom, newFrom);
      const interpTo = interpolateNumber(prevTo, newTo);
      const onTick = elapsed => {
        const t = elapsed < transitionsDuration ? easeCubic(elapsed / transitionsDuration) : 1;
        const fromDate = interpFrom(t);
        const toDate = interpTo(t);
        this.setState({
          viewParameters: {
            ...this.state.viewParameters,
            fromDate,
            toDate,
            selectedObjectId: nextProps.viewParameters.selectObjectId
          }
        });
        if (t >= 1 && this.transition) {
          this.transition.stop();
          this.transition = null;
        }
      };
      if (this.transition === null) {
        this.transition = timer(onTick);
      }
      else {
        this.setState({
          viewParameters: {
            ...this.state.viewParameters,
            fromDate: newFrom,
            toDate: newTo,
            // selectedObjectId: nextProps.viewParameters.selectObjectId
          }
        });
      }
    }
    // view parameters are changed - todo -> doing this is dirty and should not be necessary
    else if (
      JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)
    ) {
      this.setState({
        viewParameters: {...nextProps.viewParameters}
      });
    }

    // if data has change, re-compute a part of the state (ticks, ...)
    if (this.props.data !== nextProps.data) {
      const newStateParts = computeDataRelatedState(nextProps.data, nextProps.viewParameters);
      this.setState({
        ...newStateParts
      });
    }
  }
  /**
   * Executes code before component updates
   * @param {object} nextProps - properties component will have
   * @param {object} nextState - future state of the component
   */
  componentWillUpdate(nextProps, nextState) {
    if (this.state.lastEventDate !== nextState.lastEventDate && typeof this.props.onUserViewChange === 'function') {
      this.emitViewChange(nextState);
    }
  }

  /**
   * Triggers the callback informing that user changed the view
   * @param {object} state - the current state of the component
   */
  emitViewChange (state) {
    this.props.onUserViewChange({
        lastEventType: state.lastEventType,
        viewParameters: state.viewParameters
      });
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
    if (from >= this.state.timeBoundaries.minimumDateDisplay && to <= this.state.timeBoundaries.maximumDateDisplay) {
      this.setViewSpan(from, to, false);
      this.onUserViewChange({
        fromDate: from,
        toDate: to
      }, 'wheel');
    }
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
  setViewSpan (from, to, fromEvents = true, emitChange = false) {
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
    if (emitChange) {
      this.onUserViewChange({
        lastEventType: 'mini-view',
        viewParameters
      });
    }
    this.setState({
      viewParameters
    });
  }
  /**
   * Handles the action of selecting (or deselecting) an object in the timeline
   * @param {string} id - the id of the object to select (can be undefined in case of deselecting)
   */
  selectObject (id) {
    const viewParameters = {
      ...this.state.viewParameters,
      selectedObjectId: this.state.viewParameters.selectedObjectId === id ? undefined : id
    };
    this.onUserViewChange(viewParameters, 'object-selection');
    this.setState({
      viewParameters
    });
  }
  /**
   * Disables the selection in state
   */
  resetSelection () {
    const viewParameters = {
      ...this.state.viewParameters,
      selectedObjectId: undefined
    };
    this.onUserViewChange(viewParameters, 'object-selection');
    this.setState({
      viewParameters
    });
  }

  /**
   * Renders the component
   * @return {ReactElement} component - react representation of the component
   */
  render () {
    const {
      allowUserViewChange = true,
      orientation = 'portrait',
    } = this.props;

    const {
      data,
      miniScale,
      // note: viewParameters is present both in component props and in component state to allow temporary displacements between
      // the view parameters being provided by parent through props and internal viewParameters
      viewParameters,
      timeBoundaries
    } = this.state;


    const visData = normalizeData(this.props.data);

    const selectedObject = viewParameters.selectedObjectId ?
      visData.find(obj => obj.id === viewParameters.selectedObjectId)
      : undefined;
    /*
     * Step: render component
     */
    const ticksParams = setTicks(viewParameters.toDate - viewParameters.fromDate);
    const formatDate = timeFormat(ticksParams.format);

    return data ? (
      <Measure>
        {dimensions =>
          (<figure className={'quinoa-timeline' + (orientation === 'portrait' ? ' portrait' : ' landscape')}>
            <MiniTimeline
              viewParameters={viewParameters}
              timeBoundaries={timeBoundaries}
              parentDimensions={dimensions}
              scale={miniScale}
              data={normalizeData(this.props.data)}
              onTimespanUpdate={this.setViewSpan}
              allowUserEvents={allowUserViewChange} />
            <MainTimeline
              viewParameters={viewParameters}
              scale={miniScale}
              data={normalizeData(this.props.data)}
              onZoom={this.zoom}
              parentDimensions={dimensions}
              onPan={this.pan}
              onObjectSelection={this.selectObject}
              allowUserEvents={allowUserViewChange}
              onBgClick={this.resetSelection}
              setViewSpan={this.setViewSpan}
              formatDate={formatDate} />
            <ObjectDetail
              active={viewParameters.selectedObjectId !== undefined}
              timeObject={selectedObject}
              formatDate={formatDate} />
          </figure>)
      }
      </Measure>
    ) : 'Loading';
  }
}

/**
 * Static properties types of the component
 */
Timeline.propTypes = {
  /*
   * Incoming data in json format
   */
  data: PropTypes.shape({
    main: PropTypes.arrayOf(PropTypes.shape({
      category: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      source: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      selectedObjectId: PropTypes.string
    }))
  }),
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not - like Timeline spatialization algorithm for instance)
   */
  viewParameters: PropTypes.shape({
    shownCategories: PropTypes.object, // commented because it cannot be specified a priori, which gets the linter on nerves
    colorsMap: PropTypes.object, // commented because it cannot be specified a priori, which gets the linter on nerves
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
