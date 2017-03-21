import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';

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
    const {props, state, update} = this;
    update(props, props, state);
  }

  componentWillReceiveProps(next) {
    const {props, update} = this;
    if (props !== next) {
      update(next);
    }
  }

  update(next) {
    const {width, height, timeBoundaries} = next;

    const timeObjects = next.data || [];
    const columnsCount = max(timeObjects, d => d.column);
    const columnWidth = width / columnsCount;

    this.setState({
      scaleX: scaleLinear().domain([0, columnsCount + 1]).range([0, width]),
      scaleY: scaleLinear().domain([timeBoundaries[0], timeBoundaries[1]]).range([0, height]),
      columnWidth,
      timeObjects
    });
  }

  render() {
    const {
      viewParameters,
      width,
      height,
      transitionsDuration,
      transform
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
