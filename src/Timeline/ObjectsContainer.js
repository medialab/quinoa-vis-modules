import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {min, max} from 'd3-array';

import TimeObject from './TimeObject';

export default class ObjectsContainer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      scaleX: undefined,
      timeObjects: []
    };
  }

  componentDidMount() {
    const {props, state, updateDimensions} = this;
    this.removed = {};
    this.update(props, props, state);
  }

  componentWillReceiveProps(next) {
    const {props, state} = this;
    if (this.props !== next) {
      this.update(next, props, state);
    }
  }

  componentWillUnmount() {
    const {updateDimensions} = this;
  }

  update(next, props, state) {
    const {width, height, timeBoundaries} = next;

    // isolating new exiting elements
    const exiting = state.data ? state.data.filter(object => {
      const correspondance = next.data.timeObjects.find(obj => obj.id === object.id);
      return correspondance === undefined && object.state !== 'isExiting';
    }).map(object => ({
      ...object,
      state: 'isExiting'
    })) : [];
    const notExiting = next.data ? next.data.map((object, index) => {
      const correspondance = state.timeObjects.find(obj => obj.id === object.id);
      if (correspondance === undefined) {
        return {
          ...object,
          state: 'isEntering',
          column: object.column || 1
        };
      }
      const isVisible = object.endDate ?
        object.startDate >= timeBoundaries[0] && object.startDate <= timeBoundaries[1] ||
        object.endDate >= timeBoundaries[0] && object.endDate <= timeBoundaries[1] ||
        object.startDate <= timeBoundaries[0] && object.endDate >= timeBoundaries[1]
      : object.startDate >= timeBoundaries[0] && object.startDate <= timeBoundaries[1];
      return {
        ...object,
        state: isVisible ? 'isUpdating' : undefined,
        column: object.column || 1
      };
    }) : [];
    const timeObjects = notExiting.concat(exiting);
    const columnsCount = max(timeObjects, d => d.column);
    const columnWidth = width / columnsCount;
    this.setState({
      scaleX: scaleLinear().domain([1, columnsCount + 1]).range([0, width]),
      scaleY: scaleLinear().domain([timeBoundaries[0], timeBoundaries[1]]).range([0, height]),
      columnWidth,
      timeObjects
    });
  }

  render() {
    const {
      viewParameters,
      periodsClusters,
      eventsClusters,
      width,
      height,
      transitionsDuration
    } = this.props;
    const {
      scaleX,
      scaleY,
      timeObjects,
      columnWidth
    } = this.state;
    const bindRef = g => this.node = g;
    return scaleX && scaleY && width && height ? (
      <g className="objects-container">
        {
          timeObjects.map((timeObject, index) => {
            return (
              <TimeObject
                timeObject={timeObject}
                key={index}
                scaleX={scaleX}
                scaleY={scaleY}
                columnWidth={columnWidth}
                color={(viewParameters.colorsMap.main && viewParameters.colorsMap.main[timeObject.category]) || (viewParameters.colorsMap.main.default || viewParameters.colorsMap.default)}
                transitionsDuration={transitionsDuration} />
            );
          })
        }
      </g>
    ) : null;
  }
}
