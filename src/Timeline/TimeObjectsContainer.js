/**
 * This module exports a component for displaying a group of time objects (point or period)
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';

import TimeObject from './TimeObject';

/**
 * ObjectsContainer main component
 */
export default class ObjectsContainer extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      scaleX: undefined,
      timeObjects: []
    };
  }
  /**
   * Executes code on instance after the component is mounted
   */
  componentDidMount() {
    const {props, state, update} = this;
    update(props, props, state);
  }
  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(next) {
    const {props, update} = this;
    if (props !== next) {
      update(next);
    }
  }
  /**
   * Updates state with new data by recomputing it
   * @param {object} next - the next props to consumes
   */
  update(next) {
    const {width, height, timeBoundaries} = next;

    const timeObjects = next.data || [];
    const columnsCount = max(timeObjects, d => d.column) + 1;
    const columnWidth = width / columnsCount;

    this.setState({
      scaleX: scaleLinear().domain([0, columnsCount + 1]).range([0, width]),
      scaleY: scaleLinear().domain([timeBoundaries[0], timeBoundaries[1]]).range([0, height]),
      columnWidth,
      timeObjects
    });
  }
  /**
   * Renders the component
   * @return {ReactMarkup} component - react representation of the component
   */
  render() {
    const {
      viewParameters,
      width,
      height,
      transitionsDuration,
      transform,
      selectedObjectId,
      onObjectSelection
    } = this.props;
    const {
      scaleX,
      scaleY,
      timeObjects,
      columnWidth
    } = this.state;

    return scaleX && scaleY && width && height ? (
      <g
        className="objects-container"
        transform={transform || ''}>
        {
          timeObjects.map((timeObject, index) => {
            const onClick = () => {
              if (typeof onObjectSelection === 'function') {
                onObjectSelection(timeObject.id);
              }
            };
            return (
              <TimeObject
                timeObject={timeObject}
                key={index}
                onSelection={onClick}
                shown={viewParameters.shownCategories ? timeObject.category && viewParameters.shownCategories.main.find(cat => timeObject.category + '' === cat + '') !== undefined : true}
                scaleX={scaleX}
                scaleY={scaleY}
                columnWidth={columnWidth}
                selected={selectedObjectId === timeObject.id}
                color={(viewParameters.colorsMap.main && viewParameters.colorsMap.main[timeObject.category]) || (viewParameters.colorsMap.main.default || viewParameters.colorsMap.default)}
                transitionsDuration={transitionsDuration} />
            );
          })
        }
      </g>
    ) : null;
  }
}
