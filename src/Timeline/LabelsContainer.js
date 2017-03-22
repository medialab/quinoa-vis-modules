import React, {Component} from 'react';


import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';

import Label from './Label';

export default class LabelsContainer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      scaleX: undefined,
      timeObjects: [],
      hoveredLabelId: undefined
    };
    this.toggleLabelHover = this.toggleLabelHover.bind(this);
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

  toggleLabelHover (objectId, value) {
    if (!value) {
      this.setState({
        hoveredLabelId: undefined
      });
    }
 else {
      let hoveredIndex;
      let hovered;
      this.state.timeObjects.some((timeObject, index) => {
        if (timeObject.id === objectId) {
          hoveredIndex = index;
          hovered = timeObject;
          return true;
        }
      });
      const timeObjects = [
        ...this.state.timeObjects.slice(0, hoveredIndex),
        ...this.state.timeObjects.slice(hoveredIndex + 1),
        hovered
      ];
      this.setState({
        hoveredLabelId: objectId,
        timeObjects
      });
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
      transform,
      onLabelsHovered,
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
        className="labels-container"
        transform={transform || ''}
        onMouseEnter={onLabelsHovered}>
        {
          timeObjects.map((timeObject, index) => {
            return (
              <Label
                timeObject={timeObject}
                key={index}
                scaleX={scaleX}
                scaleY={scaleY}
                columnWidth={columnWidth}
                screenHeight={height}
                screenWidth={width}
                color={(viewParameters.colorsMap.main && viewParameters.colorsMap.main[timeObject.category]) || (viewParameters.colorsMap.main.default || viewParameters.colorsMap.default)}
                transitionsDuration={transitionsDuration}
                toggleLabelHover={this.toggleLabelHover}
                onObjectSelection={onObjectSelection}
                selected={viewParameters.selectedObjectId === timeObject.id} />
            );
          })
        }
      </g>
    ) : null;
  }
}
