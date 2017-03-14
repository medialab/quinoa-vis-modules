/**
 * Series of timeline-related sub components
 * @module Timeline
 */
import React from 'react';

/**
 * Computes react representation of a time object (event or period)
 * @return {ReactComponent} React component
 */
export const TimeObject = ({
  point,
  scale,
  color,
  showLabel = true,
  showTooltip = true,
  shown = true
}) => (
  <span
    className={'time-object' + (point.endDate ? ' period ' : ' point ') + (shown ? 'shown' : 'hidden')}
    style={{
      top: scale(point.startDate.getTime()) + '%',
      height: point.endDate ? scale(point.endDate.getTime()) - scale(point.startDate.getTime()) + '%' : undefined
    }}>
    <span className="marker" style={{
      background: color
    }} />
    {showLabel ?
      <span className="name-container">
        <span className="name">
          {point.name && point.name.length > 27 ? point.name.substr(0, 30) + '...' : point.name}
          <span
            className="name-underline"
            style={{
            borderColor: color
          }} />
        </span>
      </span>
    : ''}
    {showTooltip ?
      <span
        className="tooltip"
        style={{
            borderColor: color
          }}>
        {point.name}
      </span>
      : ''}
  </span>
);

/**
 * Computes react representation of time graduations
 * @return {ReactComponent} React component
 */
export const TimeTicks = ({
  ticks,
  scale
}) => (
  <div className="time-graduations-container">
    {ticks.map((tick, index) => (
      <p
        className="tick"
        key={index}
        style={{
          top: scale(tick.time) + '%'
        }}>
        <span className="legend">{tick.legend}</span>
      </p>
    ))}
  </div>
);

/**
 * Computes react representation of timeline controls
 * @return {ReactComponent} React component
 */
export const Controls = ({
  zoomIn,
  zoomOut,
  panBackward,
  panForward
}) => (
  <div className="controls-container">
    <button onMouseDown={panBackward} id="left">backward</button>
    <button onMouseDown={panForward} id="right">forward</button>
    <button onMouseDown={zoomIn} id="zoom-in">zoom-in</button>
    <button onMouseDown={zoomOut} id="zoom-out">zoom-out</button>
  </div>
);

/**
 * Represents a group of "clustered" time objects, organized in columns
 * @return {ReactComponent} React component
 */
export const ClustersGroup = ({
  clusters,
  viewParameters,
  scale
}) => (
  <div className="columns-container">
    {
    clusters.columns.map(column => (
      <div key={column} className="objects-column">
        {clusters
          .timeObjects
          .filter(obj => obj.column === column)
          .map((obj, index) => {
            return (
              <TimeObject
                key={index}
                point={obj}
                scale={scale}
                color={(viewParameters.colorsMap.main && viewParameters.colorsMap.main[obj.category]) || (viewParameters.colorsMap.main.default || viewParameters.colorsMap.default)}
                shown={viewParameters.shownCategories ? obj.category && viewParameters.shownCategories.main.find(cat => obj.category + '' === cat + '') !== undefined : true}
                showLabel={!obj.overlapped} />
            );
          }
          )
        }
      </div>
    ))
  }
  </div>
);

/**
 * Computes the relative and proportional position of a mouse-like event related to its target
 * @param {event} e - the event to analyze
 * @return {object} eventPosition - an object containing useful data about position of the event being triggered
 */
const getEventCoordinates = e => {
  const w = e.target.clientWidth;
  const h = e.target.clientHeight;
  const x = e.target.offsetLeft;
  const y = e.target.offsetTop;
  const relativeX = e.clientX - x;
  const relativeY = e.clientY - y;
  const portionX = relativeX / w;
  const portionY = relativeY / h;
  return {
    relativeX,
    relativeY,
    absoluteX: e.clientX,
    absoluteY: e.clientY,
    portionX,
    portionY
  };
};

/**
 * Timeline brush stateful component
 */
export class Brush extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      canBrushContainer: false,
      brushingContainer: false,
      containerBrushStartPosition: undefined,
      brushInteractionMode: undefined,
      brushMoveStartPosition: undefined
    };
  }


  render () {
    const {
      scale,
      fromDate,
      toDate,
      onSimpleClick,
      // onSpanAbsoluteDefinition,
      onSpanEventDefinition,
      allowBrush
    } = this.props;

    const onContainerLeave = () => {
      this.setState({
        canBrushContainer: false,
        brushingContainer: false,
        containerBrushStartPosition: undefined,
        brushInteractionMode: undefined,
        brushMoveStartPosition: undefined
      });
    };

    const onBrushMouseMove = e => {
      e.stopPropagation();
      if (this.state.brushInteractionMode) {
        if (this.state.brushInteractionMode === 'move') {
          onSimpleClick(getEventCoordinates(e));
          /*const displacement = (position.portionY - this.state.brushMoveStartPosition.portionY);
          const span = toDate - fromDate;
          const from = fromDate + span * displacement * 2;
          const to = toDate + span * displacement * 2;
          onSpanAbsoluteDefinition(from, to);
          this.setState({
            brushMoveStartPosition: position
          });*/
        }
      }
    };


    const onContainerClick = e => {
      e.stopPropagation();
      if (this.state.brushingContainer === false && !this.state.brushInteractionMode) {
        onSimpleClick(getEventCoordinates(e));
      }

      if (this.state.brushingContainer) {
        this.setState({
          brushingContainer: false
        });
      }
      if (this.state.canBrushContainer) {
        this.setState({
          canBrushContainer: false
        });
      }
      if (this.state.brushInteractionMode) {
        this.setState({
          brushInteractionMode: undefined
        });
      }
    };
    const onContainerMouseDown = e => {
      e.stopPropagation();
      if (!this.state.canBrushContainer) {
        this.setState({
          canBrushContainer: true
        });
      }
      this.setState({
        containerBrushStartPosition: undefined
      });
    };
    const onContainerMouseMove = e => {
      e.stopPropagation();
      const eventPosition = getEventCoordinates(e);
      if (this.state.canBrushContainer) {
        // console.log('mouse move, brushing container ?', this.state.brushingContainer);
        if (!this.state.brushingContainer) {
          this.setState({
            brushingContainer: true,
            // storing brush start position
            containerBrushStartPosition: eventPosition
          });
        }
      else {
          const currentPosition = getEventCoordinates(e);
          const from = this.state.containerBrushStartPosition;
          const to = currentPosition;
          if (from && to && from.portionY >= 0 && from.portionY <= 1
             && to.portionY >= 0 && to.portionY <= 1) {
            const fromOutput = this.state.containerBrushStartPosition.portionY < currentPosition.portionY ? this.state.containerBrushStartPosition : currentPosition;
            const toOutput = currentPosition.portionY > this.state.containerBrushStartPosition.portionY ? currentPosition : this.state.containerBrushStartPosition;
            onSpanEventDefinition(fromOutput, toOutput);
          }
        }
      }
      else if (this.state.brushingContainer) {
        this.setState({
          brushingContainer: false
        });
      }

      if (this.state.brushInteractionMode === 'resize-top') {
        onSpanEventDefinition(undefined, {portionY: eventPosition.portionY});
      }
      else if (this.state.brushInteractionMode === 'resize-bottom') {
        onSpanEventDefinition({portionY: eventPosition.portionY}, undefined);
      }
 else if (this.state.brushInteractionMode === 'move') {
        if (!this.state.brushMoveStartPosition) {
          this.setState({
            brushMoveStartPosition: eventPosition
          });
        }
 else {
          onBrushMouseMove(e);
        }
      }
    };

    const onBrushMouseDown = e => {
      e.stopPropagation();
      if (!this.state.brushInteractionMode) {
        const position = getEventCoordinates(e);
        let interactionMode;
        let moveStartPosition;
        if (position.portionY < 0.2) {
          interactionMode = 'resize-top';
        }
        else if (position.portionY > 0.8) {
          interactionMode = 'resize-bottom';
        }
        else {
          interactionMode = 'move';
          moveStartPosition = position;
        }
        this.setState({
          brushInteractionMode: interactionMode,
          brushMoveStartPosition: moveStartPosition
        });
      }
    };
    const onBrushClick = e => {
      e.stopPropagation();
      this.setState({
        brushInteractionMode: undefined
      });
    };

    return allowBrush ?
      (<div
        className="brush-placeholder"
        onClick={onContainerClick}
        onMouseDown={onContainerMouseDown}
        onMouseMove={onContainerMouseMove}
        onMouseLeave={onContainerLeave}>
        <div
          className="brush"
          onClick={onBrushClick}
          onMouseDown={onBrushMouseDown}
          style={{
            top: scale(fromDate) + '%',
            height: scale(toDate) - scale(fromDate) + '%',
            pointerEvents: (this.state.brushingContainer || this.state.brushInteractionMode) ? 'none' : 'all'
          }} />
      </div>)
      :
      (<div
        className="brush-placeholder">
        <div
          className="brush"
          style={{
            top: scale(fromDate) + '%',
            height: scale(toDate) - scale(fromDate) + '%',
            pointerEvents: 'none'
          }} />
      </div>);
  }
}
