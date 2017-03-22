import React, {Component} from 'react';


import ObjectsContainer from './TimeObjectsContainer';
import LabelsContainer from './LabelsContainer';

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
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onLabelsHovered = this.onLabelsHovered.bind(this);

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
      const diff = (this.state.prevY - y);
      const dateDiff = (diff / this.state.height) * (this.props.viewParameters.toDate - this.props.viewParameters.fromDate);
      this.props.onPan(dateDiff > 0, Math.abs(dateDiff));
      this.setState({
        prevY: y
      });
    }
  }

  onDoubleClick(evt) {
    if (!this.props.allowUserEvents) {
      return;
    }

    const y = evt.clientY;
    const h = this.captor.getBBox().height;
    const portion = y / h;
    const {
      fromDate,
      toDate
    } = this.props.viewParameters;
    const ambitus = toDate - fromDate;
    const target = fromDate + ambitus * portion;
    const newAmbitus = ambitus / 4;
    const newFrom = target - newAmbitus;
    const newTo = target + newAmbitus;
    this.props.setViewSpan(newFrom, newTo, false);
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

  onLabelsHovered() {
    this.onMouseUp();
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
      allowUserEvents,
      onObjectSelection,
      onBgClick,
      formatDate
    } = this.props;
    const {
      onDoubleClick,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onLabelsHovered
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

    const objectsDisplacement = 'scale(.9, 1)translate(' + (width * 0.1) + ' 0)';

    return (
      <section className="main-timeline" onWheel={onWheel}>
        <svg
          className={'main-timeline-container'}
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
            onMouseUp={onMouseUp}
            onDoubleClick={onDoubleClick}
            onClick={onBgClick} />
          <ObjectsContainer
            viewParameters={viewParameters}
            data={data}
            width={width * 0.9}
            height={height}
            onObjectSelection={onObjectSelection}
            transform={objectsDisplacement}
            transitionsDuration={500}
            timeBoundaries={[viewParameters.fromDate, viewParameters.toDate]}
            selectedObjectId={viewParameters.selectedObjectId} />
          <LabelsContainer
            viewParameters={viewParameters}
            data={data}
            width={width * 0.9}
            height={height}
            transform={objectsDisplacement}
            transitionsDuration={500}
            onObjectSelection={onObjectSelection}
            timeBoundaries={[viewParameters.fromDate, viewParameters.toDate]}
            onLabelsHovered={onLabelsHovered}
            selectedObjectId={viewParameters.selectedObjectId} />
        </svg>
        <div className="time-boundaries-container">
          <div id="from-date">{formatDate(viewParameters.fromDate)}</div>
          <div id="to-date">{formatDate(viewParameters.toDate)}</div>
        </div>
      </section>
    );
  }
}
