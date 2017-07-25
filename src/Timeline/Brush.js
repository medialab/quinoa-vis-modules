/**
 * This module exports a stateful brush component
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
/**
 * Brush main component
 */
export default class Brush extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.updateBrush = this.updateBrush.bind(this);
    const {
      from,
      to,
      timeBoundaries
    } = props;
    const bigAmbitus = timeBoundaries[1] - timeBoundaries[0];
    const beginPortion = (from - timeBoundaries[0]) / bigAmbitus;
    const endPortion = (to - timeBoundaries[0]) / bigAmbitus;
    this.state = {
      state: undefined,
      beginPortion,
      endPortion
    };
  }
  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(next) {
    if (next.from !== this.state.from || next.to !== this.state.to && this.state.state === undefined) {
      const {
        from,
        timeBoundaries,
        to
      } = next;
      const bigAmbitus = timeBoundaries[1] - timeBoundaries[0];
      const beginPortion = (from - timeBoundaries[0]) / bigAmbitus;
      const endPortion = (to - timeBoundaries[0]) / bigAmbitus;
      this.setState({
        beginPortion,
        endPortion,
        from,
        to
      });
    }
  }
  /**
   * Update brush state with new parameters
   * @param {object} portions - couple of numbers representing absolute time of the boundaries of the brush
   * @param {object} state - the state object to use (todo: this is dummy)
   * @param {object} portion - the current portion of the brush
   */
  updateBrush({beginPortion, endPortion}, state, portion) {
    let beginPortionInState = beginPortion ? beginPortion : this.state.beginPortion;
    let endPortionInState = endPortion ? endPortion : this.state.endPortion;
    if (beginPortionInState > endPortionInState) {
      const temp = beginPortionInState;
      beginPortionInState = endPortionInState;
      endPortionInState = temp;
    }
    const ambitus = this.props.timeBoundaries[1] - this.props.timeBoundaries[0];
    const fromDate = this.props.timeBoundaries[0] + beginPortionInState * ambitus;
    const toDate = this.props.timeBoundaries[0] + endPortionInState * ambitus;

    if (fromDate && toDate && fromDate >= this.props.timeBoundaries[0] && toDate <= this.props.timeBoundaries[1]) {
      this.props.onUpdate(fromDate, toDate, false, true);
      this.setState({
        beginPortion: beginPortionInState,
        endPortion: endPortionInState,
        from: fromDate,
        to: toDate,
        state,
        previousPortion: portion
      });
    }
  }
  /**
   * Handles mouse pressed event
   * @param {object} event - the input event
   */
  onMouseDown (evt) {
    if (this.props.active === false) {
      return;
    }
    const bbox = evt.target.getBBox();
    const height = bbox.height;
    const y = evt.clientY;
    const portion = y / height;
    const onElement = portion >= this.state.beginPortion && portion <= this.state.endPortion;
    let state;
    if (onElement) {
      const positionOnElement = (portion - this.state.beginPortion) / (this.state.endPortion - this.state.beginPortion);
      if (positionOnElement <= 0.2) {
        state = 'resizing-top';
        this.updateBrush({beginPortion: portion}, state, portion);
      }
      else if (positionOnElement >= 0.8) {
        state = 'resizing-bottom';
        this.updateBrush({endPortion: portion}, state, portion);
      }
      else {
        state = 'moving';
        this.updateBrush({}, state, portion);
      }
    }
    else {
      state = 'drawing';
      this.updateBrush({beginPortion: portion, endPortion: portion}, state, portion);
    }
  }
  /**
   * Handles mouse moved event
   * @param {object} event - the input event
   */
  onMouseMove (evt) {
    if (this.props.active === false) {
      return;
    }
    const bbox = evt.target.getBBox();
    const height = bbox.height;
    const y = evt.clientY;
    const portion = y / height;
    if (this.state.state === 'drawing') {
      this.updateBrush({endPortion: portion}, this.state.state, portion);
    }
    else if (this.state.state === 'resizing-top') {
      this.updateBrush({beginPortion: portion}, this.state.state, portion);
    }
    else if (this.state.state === 'resizing-bottom') {
      this.updateBrush({endPortion: portion}, this.state.state, portion);
    }
    else if (this.state.state === 'moving') {
      if (this.state.previousPortion) {
        const diff = this.state.previousPortion - portion;
        const newBegin = this.state.beginPortion - diff;
        const newEnd = this.state.endPortion - diff;
        if (newBegin >= this.props.timeBoundaries[0] && newEnd <= this.props.timeBoundaries[1]) {
          this.updateBrush({beginPortion: newBegin, endPortion: newEnd}, this.state.state, portion);
        }
      }
    // hovering
    }
    else {
      const onElement = portion >= this.state.beginPortion && portion <= this.state.endPortion;
      let state;
      if (onElement) {
        const positionOnElement = (portion - this.state.beginPortion) / (this.state.endPortion - this.state.beginPortion);
        if (positionOnElement <= 0.33333) {
          state = 'n-resize';
        }
        else if (positionOnElement >= 0.66666666) {
          state = 's-resize';
        }
        else {
          state = 'move';
        }
      }
      else {
        state = 'pointer';
      }
      this.setState({
        cursor: state
      });
    }
  }
  /**
   * Handles mouse up event
   * @param {object} event - the input event
   */
  onMouseUp () {
    if (this.props.active === false) {
      return;
    }
    this.setState({
      state: undefined,
      previousPortion: undefined
    });
  }
  /**
   * Handles mouse wheel event
   * @param {object} event - the input event
   */
  onMouseWheel (evt) {
    if (this.props.active === false) {
      return;
    }
    const direction = evt.deltaY > 0 ? 1 : -1;
    const displacement = direction * (this.state.endPortion - this.state.beginPortion) / 10;
    const newBegin = this.state.beginPortion + displacement;
    const newEnd = this.state.endPortion + displacement;
    this.updateBrush({beginPortion: newBegin, endPortion: newEnd}, undefined);
  }
  /**
   * Renders the component
   * @return {ReactMarkup} component - representation of the component
   */
  render() {
    const {
      width,
      height,
    } = this.props;
    const {
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onMouseWheel
    } = this;
    const {
      beginPortion: from,
      endPortion: to,
      cursor
    } = this.state;
    const bindRef = g => {
      this.node = g;
    };

    const scaleY = scaleLinear().domain([0, 1]).range([0, height]);
    const fromY = scaleY(from);
    const toY = scaleY(to);

    const brushHeight = toY && fromY && toY - fromY;
    const rectStyle = {
      transform: 'translateX(' + 0 + 'px) ' +
        'translateY(' + fromY + 'px)'
    };
    return (
      <g className="brush-container">
        <rect
          x={0} y={0}
          width={width}
          height={height}
          className="brush-captor"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onWheel={onMouseWheel}
          ref={bindRef}
          style={{cursor}} />
        <g
          className="brush-rect"
          style={rectStyle}>
          <rect
            x={0}
            y={0}
            width={width}
            height={brushHeight} />
        </g>
      </g>
    );
  }
}
