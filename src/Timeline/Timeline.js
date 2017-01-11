import React, {PropTypes} from 'react';
import {min, max} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {timeFormat} from 'd3-time-format';
import {debounce} from 'lodash';

import {
  setTicks,
  computeDate,
  computeTicks,
  clusterEvents
} from './utils';

import {
  TimeObject,
  TimeTicks,
  Controls,
  ClustersGroup
} from './subComponents.js';
import './Timeline.scss';

class Timeline extends React.Component {
  constructor (props) {
    super(props);
    this.mapData = this.mapData.bind(this);
    this.computeBoundaries = this.computeBoundaries.bind(this);
    this.pan = this.pan.bind(this);
    this.zoom = this.zoom.bind(this);
    this.computePeriods = this.computePeriods.bind(this);
    this.computeEvents = this.computeEvents.bind(this);
    this.onViewChange = debounce(this.onViewChange, 100);

    // data time boundaries in order to display the mini-timeline
    this.timeBoundaries = {
      // absolute minimum date
      minimumDate: -Infinity,
      // absolute maximum date
      maximumDate: Infinity,
      // padded minimum date
      minimumDateDisplay: - Infinity,
      // padded maximum date
      maximumDateDisplay: Infinity
    };
    this.viewParameters = props.viewParameters;
    this.miniScale = scaleLinear().range([0, 100]).domain([-Infinity, Infinity]);
    this.mapData(this.props.data, this.props.viewParameters.dataMap);
    this.periodsClusters = this.computePeriods(this.data);
    const displaceThreshold = (this.timeBoundaries.maximumDateDisplay - this.timeBoundaries.minimumDateDisplay)/1000;
    this.eventsClusters = this.computeEvents(this.data, displaceThreshold);
  }

  componentWillUpdate(nextProps) {
    // remap data if data or datamap will change
    /*
    if (this.props.data !== nextProps.data || this.props.dataMap !== nextProps.dataMap) {
      this.mapData(nextProps.data, nextProps.dataMap);
    }
    */
    if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
      this.viewParameters = nextProps.viewParameters;
    }
  }

  onViewChange (lastEventType) {
    this.props.onViewChange({
      lastEventType,
      viewParameters: this.viewParameters
    });
  }

  computePeriods(data) {
    let maxColumn = 1;
    const periodsClusters = data.filter(point => point.endDate !== undefined);
    periodsClusters.forEach((period, index) => {
      let previous;
      if (index > 0) {
        previous = periodsClusters[index - 1];
      }
      if (previous && period.startDate < previous.endDate) {
        period.column = previous.column + 1;
        previous.overlapped = true;
        period.overlapped = false;
        if (previous.column + 1 > maxColumn) {
          maxColumn = previous.column + 1;
        }
      }
      else {
        period.column = 1;
      }
    });
    const clustersColumns = [];
    for (let count = 0; count < maxColumn; count ++) {
      clustersColumns.push(count + 1);
    }
    return {
      columns: clustersColumns,
      timeObjects: periodsClusters
    };
  }

  computeEvents(data, thresholdTime) {
    let maxColumn = 1;
    const eventsClusters = data.filter(point => point.endDate === undefined).map(point => Object.assign({}, point));
    eventsClusters.forEach((event, index) => {
      let previous;
      if (index > 0) {
        previous = eventsClusters[index - 1];
      }
      if (previous && event.startDate - previous.startDate <= thresholdTime) {
        event.column = previous.column + 1;
        if (previous.column + 1 > maxColumn) {
          maxColumn = previous.column + 1;
        }
      }
      else {
        event.column = 1;
      }
    });
    const clustersColumns = [];
    for (let count = 0; count < maxColumn; count ++) {
      clustersColumns.push(count + 1);
    }
    return {
      columns: clustersColumns,
      timeObjects: eventsClusters
    };
  }

  pan (forward, delta) {
    this.viewParameters.toDate += (forward ? delta : -delta);
    this.viewParameters.fromDate += (forward ? delta : -delta);
    this.forceUpdate();
    this.onViewChange('wheel');
  }

  zoom (ratio) {
    const timeSpan = this.viewParameters.toDate - this.viewParameters.fromDate;
    const newTimeSpan = timeSpan / ratio;
    const diff = newTimeSpan - timeSpan;
    const newFrom = this.viewParameters.fromDate - diff / 2;
    const newTo = this.viewParameters.toDate + diff / 2;
    if (newFrom >= this.timeBoundaries.minimumDateDisplay && newTo <= this.timeBoundaries.maximumDateDisplay) {
      this.viewParameters.fromDate = newFrom;
      this.viewParameters.toDate = newTo;
      this.forceUpdate();
    }
    this.onViewChange('zoom');
  }

  /*
   * Registers invariant timeline boundaries
   */
   computeBoundaries () {
    const minimumDate = min(this.data, (d) => d.startDate.getTime());
    const maximumDate = max(this.data, (d) => {
      return d.endDate ? d.endDate.getTime() : d.startDate.getTime();
    });
    // padding max and min of 1% of total time ambitus
    const ambitus = maximumDate - minimumDate;
    const displacement = ambitus / 100;
    const minimumDateDisplay = (minimumDate - displacement);
    const maximumDateDisplay = (maximumDate + displacement);
    this.timeBoundaries = {
      minimumDate,
      maximumDate,
      minimumDateDisplay,
      maximumDateDisplay
    };
    this.miniScale.domain([minimumDateDisplay, maximumDateDisplay]);
    this.miniTicks = computeTicks(minimumDateDisplay, maximumDateDisplay);
   }
  /*
   * Maps incoming data with provided data map
   */
  mapData (data, dataMap) {
    this.data = data.map(datapoint => {
      return Object.keys(dataMap).reduce((obj, dataKey) => {
        return {
          ...obj,
          [dataKey]: typeof dataMap[dataKey] === 'function' ?
                      dataMap[dataKey](datapoint) // case accessor
                      : datapoint[dataMap[dataKey]] // case prop name
        };
      }, {});
    })
    // compute dates (timeline specific)
    .map(datapoint => {
      const {
        year,
        month,
        day,
        time
      } = datapoint;

      const {
        endYear,
        endMonth,
        endDay,
        endTime
      } = datapoint;

      const startDate = computeDate(year, month, day, time);
      const endDate = computeDate(endYear, endMonth, endDay, endTime);
      return {
        ...datapoint,
        startDate,
        endDate
      };
    })
    // sort by ascending date
    .sort((a, b) => {
      if (a.startDate.getTime() > b.startDate.getTime()) {
        return 1;
      }
      else return -1;
    });
    this.computeBoundaries();
  }

  render () {
    const {
      allowViewChange = true,
      orientation = 'portrait',
      // onViewChange,
    } = this.props;
    const {
      data,
      miniScale,
      miniTicks,
      viewParameters,
      periodsClusters,
      eventsClusters: globalEventsClusters
    } = this;
    const fromDate = viewParameters.fromDate instanceof Date ? viewParameters.fromDate.getTime() : viewParameters.fromDate;
    const toDate = viewParameters.toDate instanceof Date ? viewParameters.toDate.getTime() : viewParameters.toDate;
    const timeSpan = toDate - fromDate;
    const displayedData = data.filter(point => {
      const start = point.startDate.getTime();
      const end = point.endDate && point.endDate.getTime();
      return (start >= fromDate && start <= toDate) || (end && end >= fromDate && end <= toDate);
    });
    const displayedEvents = displayedData.filter(obj => obj.endDate === undefined);
    const eventPadding = timeSpan / 20;
    const eventsClusters = clusterEvents(displayedEvents, eventPadding);
    const displayedPeriods = periodsClusters.timeObjects.filter(point => {
      const start = point.startDate.getTime();
      const end = point.endDate && point.endDate.getTime();
      return (start >= fromDate && start <= toDate) || (end && end >= fromDate && end <= toDate);
    });
    const timelineScale = scaleLinear().range([0, 100]).domain([fromDate, toDate]);
    const ticksParams = setTicks(toDate - fromDate);
    const formatDate = timeFormat(ticksParams.format);
    const mainTicks = computeTicks(fromDate, toDate);

    const onMainWheel = (e) => {
      e.stopPropagation();
      if (!this.props.allowViewChange) {
        return;
      }
      const delta = (toDate - fromDate) / 10;
      const forward = e.deltaY > 0;
      if (forward && toDate + delta <= this.timeBoundaries.maximumDateDisplay) {
        this.pan(true, delta);
      }
      if (!forward && fromDate - delta >= this.timeBoundaries.minimumDateDisplay) {
        this.pan(false, delta);
      }
    };

    const onAsideWheel = (e) => {
      e.stopPropagation();
      if (!this.props.allowViewChange) {
        return;
      }
      const delta = (toDate - fromDate) / 2;
      const forward = e.deltaY > 0;
      if (forward && toDate + delta <= this.timeBoundaries.maximumDateDisplay) {
        this.pan(true, delta);
      }
      if (!forward && fromDate - delta >= this.timeBoundaries.minimumDateDisplay) {
        this.pan(false, delta);
      }
    };

    const zoomIn = () => this.zoom(1.1);
    const zoomOut = () => this.zoom(0.9);

    return (
      <figure className={'quinoa-timeline' + (orientation === 'portrait' ? ' portrait' : ' landscape')}>
        <aside onWheel={onAsideWheel} className="mini-timeline">
          <TimeTicks ticks={miniTicks} scale={miniScale} />
          <div
            className="brush"
            style={{
              top: miniScale(fromDate) + '%',
              height: miniScale(toDate) - miniScale(fromDate) + '%'
            }} />
          <div className="time-objects-container">
            <ClustersGroup 
              viewParameters={viewParameters} 
              scale={miniScale} 
              clusters={periodsClusters} 
            />
            <ClustersGroup 
              viewParameters={viewParameters} 
              scale={miniScale} 
              clusters={globalEventsClusters} 
            />
            
          </div>
          {/*<div className="time-objects-container">
            {data.map((point, index) => (
              <TimeObject 
                scale={miniScale} 
                point={point} 
                key={index}
                showTooltip={false} 
              />
            ))}
          </div>
        */}
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
                }} 
              /> : ''}
            {eventsClusters.timeObjects.length ?
              <ClustersGroup 
                viewParameters={viewParameters} 
                scale={timelineScale} 
                clusters={eventsClusters} 
              /> : ''}

            {/*displayedData.map((point, index) => (
              <TimeObject scale={timelineScale} point={point} key={index} />
            ))*/}
          </div>
          {allowViewChange ?
            <Controls
              zoomIn={zoomIn}
              zoomOut={zoomOut} />
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
  // data: PropTypes.array,
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not - like Timeline spatialization algorithm for instance)
   */
  viewParameters: PropTypes.shape({
    /*
     * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
     */
    dataMap: PropTypes.shape({
      name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      category: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      year: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      month: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      day: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      time: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      endYear: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      endMonth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      endDay: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      endTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
    }),
    fromDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number
    ]),
    toDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number
    ]),
    orientation: PropTypes.oneOf(['landscape', 'portrait'])
  }),
  /*
   * boolean to specify whether the user can pan/pan/interact or not with the view
   */
  allowViewChange: PropTypes.bool,
  /*
   * callback fn triggered when user changes view parameters, callbacks data about the triggering interaction and about the new view parameters
   */
  onViewChange: PropTypes.func
};

export default Timeline;
