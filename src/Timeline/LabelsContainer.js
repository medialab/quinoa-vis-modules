/**
 * This module exports a labels container component
 * @module quinoa-vis-modules/Timeline
 */
import React, {Component} from 'react';

import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';

import Label from './Label';
/**
 * LabelsContainer main component
 */
export default class LabelsContainer extends Component {
  /**
   * constructor
   * @param {object} props - props received by instance at initialization
   */
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
   * Handle toggling the "hover" state of a specific label
   * @param {string} objectId - the id of the object to toggle
   * @param {boolean} value - the hover value to set for the targeted object
   */
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
   * @return {ReactElement} component - representation of the component
   */
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
                shown={viewParameters.shownCategories ? timeObject.category && viewParameters.shownCategories.main.find(cat => timeObject.category + '' === cat + '') !== undefined : true}
                color={(viewParameters.colorsMap.main && viewParameters.colorsMap.main[timeObject.category]) || (viewParameters.colorsMap.main.default || viewParameters.colorsMap.default)}
                transitionsDuration={transitionsDuration}
                toggleLabelHover={this.toggleLabelHover}
                onObjectSelection={onObjectSelection}
                selected={viewParameters.selectedObjectId === timeObject.id} />
            );
          })
        }
      </g>
    )
    : null;
  }
}
