/**
 * This module exports a stateful customizable svg viewer component
 * @module quinoa-vis-modules/SVGViewer
 */
import React, {PropTypes} from 'react';
import {debounce} from 'lodash';

import './SVGViewer.scss';

/**
 * SVGViewer class for building network react component instances
 */
class SVGViewer extends React.Component {
  /**
   * instance constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor (props) {
    super(props);

    /**
     * State
     *
     * svg {object}   SVG data, as a DOM Document Object
     * zoomLevel {number}   Zoom level on the viewer
     * dragOffset {number}   Offset object calculating drag offset (the X/Y offset from mouse X/Y)
     * isDragEnabled {boolean}  Enable dragging motion if true
     */
    this.state = {
      svg: null,
      viewParameters: {
        zoomLevel: 0,
        x: 0,
        y: 0,
        maxZoomLevel: 1000,
        minZoomLevel: -2000,
        zoomFactor: 50,
        perspectiveLevel: 1000,
      },
      dragOffset: null,
      isDragEnabled: false,
    };
  }

  /**
   * Executes code before the component is mounted
   */
  componentWillMount () {
    this.parseSVG = this.parseSVG.bind(this);
    this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.doDrag = this.doDrag.bind(this);
    this.onUserViewChange = debounce(this.onUserViewChange, 100);

    // Debounce zoom method for user-friendly zoom behavior.
    this.zoom = debounce(
      this.zoom.bind(this), 10,
      {leading: true, trailing: false}
    );
    this.setState({
      viewParameters: this.props.viewParameters ? {...this.props.viewParameters} : this.state.viewParameters
    });
  }

  /**
   * When mounting, load data into state
   */
  componentDidMount () {
    return this.mountSVG(this.parseSVG(this.props.data));
  }

  /**
   * Executes code when component's properties change
   * @param {object} nextProps - properties given to instance at instanciation
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewParameters !== this.state.viewParameters) {
      this.setState({
        viewParameters: {
          ...this.state.viewParameters,
          ...nextProps.viewParameters
        }
      });
    }
    if (nextProps.data !== this.props.data) {
      // remount the svg if data is changed
      this.mountSVG(this.mountSVG(this.parseSVG(this.props.data)));
    }
  }

  /**
   * decides wether component should be rerendered
   * @param {object} nextProps - properties to come
   * @param {object} nextState - state to come
   * @return {boolean} shouldRender
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.stateViewParameters !== nextState.viewParameters;
  }

  /**
   * Debounced onUserViewChange call
   * @param {object} event - the event triggering the view change
   */
  onUserViewChange(e) {
    if (typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange(e);
    }
  }

  /**
   * From XML dom string representing the SVG, return a mountable Document object.
   * @param {string} xmlString - the string to parse as xml/svg data
   */
  parseSVG(xmlString = '') {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
  }

  /**
   * Mount DOM Document (SVG) into the DOM via state setting of the component.
   * @param {DOMElement} svgDom - the svg document element to mount
   */
  mountSVG(svgDom) {
    this.setState({svg: svgDom});
  }
  /**
   * Handles mouse wheel events
   * @param {object} event - the mouse wheel event
   */
  mouseWheelHandler(e) {
    event.preventDefault();
    const amount = e.deltaY;
    this.zoom(amount);
  }

  /**
   * Handles zooming in the component
   * @param {number} amount - the value returned by a wheel event
   */
  zoom (amount) {
    if (amount !== 0 && amount !== -0) {
      const zoomLevel = this.limitZoomLevel(this.state.viewParameters.zoomLevel + amount);
      this.setState({
        viewParameters: {
          ...this.state.viewParameters,
          zoomLevel,
        }
      });
      this.onUserViewChange({
        viewParameters: {
          ...this.state.viewParameters,
          zoomLevel
        },
        lastEeventType: 'userevent'
      });
    }
  }

  /**
   * limits a zoom level to bounds stored in view parameters
   * @param {number} level - the level to limit
   * @return {number} level - the level after limitation
   */
  limitZoomLevel (level) {
    if (level >= 0) {
      return level < this.props.viewParameters.maxZoomLevel ? level : this.props.viewParameters.maxZoomLevel;
    }

    if (level <= -0) {
      return level > this.props.viewParameters.minZoomLevel ? level : this.props.viewParameters.minZoomLevel;
    }

    return level;
  }
  /**
   * updates component state when starting to drag the svg
   * @param {object} e - the drag event to use
   */
  startDrag (e) {
    this.setState({
      isDragEnabled: true,
      perspectiveLevel: 0,
      dragOffset: {
        x: e.clientX, // - bounds.left,
        y: e.clientY, //- bounds.top,
      },
    });
    e.currentTarget.addEventListener('mousemove', this.doDrag);
  }
  /**
   * updates component state when stopping to drag the svg
   * @param {object} e - the drag event to use
   */
  stopDrag (e) {
    this.setState({isDragEnabled: false});
    e.currentTarget.removeEventListener('mousemove', this.doDrag);
  }
  /**
   * updates component state when dragging the svg
   * @param {object} e - the drag event to use
   */
  doDrag (e) {
    if (!this.state.isDragEnabled) return;
    const xDiff = e.clientX - this.state.dragOffset.x;
    const yDiff = e.clientY - this.state.dragOffset.y;
    const x = (this.state.viewParameters.x || 0) + xDiff;
    const y = (this.state.viewParameters.y || 0) + yDiff;
    this.setState({
      viewParameters: {
        ...this.state.viewParameters,
        x,
        y,
      },
      dragOffset: {
        x: e.clientX,
        y: e.clientY
      }
    });
    this.onUserViewChange({
      viewParameters: {
        ...this.state.viewParameters,
        x,
        y,
      },
      lastEeventType: 'userevent'
    });
  }
  /**
   * renders the component as react markup
   * @return {ReactMarkup} component - representation of the component
   */
  render () {
    const svgContainerStyles = {
      transition: 'all .2s ease', // todo: parametrize that
      transform: `translateX(${this.state.viewParameters.x}px)
                  translateY(${this.state.viewParameters.y}px)`
    };

    const svgStyles = {
      transition: 'all .2s ease', // todo: parametrize that
      transform: `perspective(${this.props.viewParameters.perspectiveLevel}px)
                  translateZ(${this.limitZoomLevel(this.state.viewParameters.zoomLevel * this.props.viewParameters.zoomFactor)}px)`
    };

    return (
      <div className="quinoa-svg">
        <div className="svg-container"
          style={svgContainerStyles}
          onMouseDown={this.props.allowUserViewChange ? this.startDrag : void (0)}
          onMouseUp={this.props.allowUserViewChange ? this.stopDrag : void (0)}
          onMouseLeave={this.props.allowUserViewChange ? this.stopDrag : void (0)}>
          {this.state.svg
            ? <div className={this.props.allowUserViewChange ? 'grabbable' : ''}
              onWheel={this.props.allowUserViewChange ? this.mouseWheelHandler : void (0)}
              style={svgStyles}
              dangerouslySetInnerHTML={{
                    __html: new XMLSerializer().serializeToString(this.state.svg.documentElement)}} />
            : <div>Loading...</div>}
        </div>
      </div>
    );
  }
}

/**
 * Static properties types of the component
 */
SVGViewer.propTypes = {
  data: PropTypes.string,

  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not)
   */
  viewParameters: PropTypes.shape({
    /*
     * maxZoomLevel        number   Max zoom value, defaults to 2000
     */
    maxZoomLevel: PropTypes.number,
    /*
     * minZoomLevel        number   Min zoom value, defaults to 2000
     */
    minZoomLevel: PropTypes.number,
    /*
     * perspectiveLevel    number   CSS perspective level in 3D space, 1000(px)
     */
    perspectiveLevel: PropTypes.number,
    /*
     * zoomFactor          number   Factorize wheel zoom for proper zoom effect, defauls to 250
     */
    zoomFactor: PropTypes.number,
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
/**
 * Static default properties of the component
 */
SVGViewer.defaultProps = {
  allowUserViewChange: true,
  // todo: store that elsewhere
  viewParameters: {
    maxZoomLevel: 1000,
    minZoomLevel: -2000,
    zoomFactor: 50,
    perspectiveLevel: 1000
  },
};


export default SVGViewer;
