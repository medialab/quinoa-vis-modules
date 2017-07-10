/**
 * @module SVGViewer
 */
import React, {PropTypes} from 'react';
import {debounce} from 'lodash';

import './SVGViewer.scss';


class SVGViewer extends React.Component {
  constructor (props) {
    super(props);

    /**
     * State
     *
     * svg             object   SVG data, as a DOM Document Object
     * zoomLevel       number   Zoom level on the viewer
     * dragOffset      number   Offset object calculating drag offset (the X/Y offset from mouse X/Y)
     * isDragEnabled   boolean  Enable dragging motion if true
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
  }

  /**
   * When mounting, load data into state
   */
  componentDidMount () {
    return this.mountSVG(this.parseSVG(this.props.data));
  }

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
      this.mountSVG(this.mountSVG(this.parseSVG(this.props.data)));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.stateViewParameters !== nextState.viewParameters;
  } 

  /**
   * Debounced onUserViewChange call
   */
  onUserViewChange(e) {
    if (typeof this.props.onUserViewChange === 'function') {
      this.props.onUserViewChange(e);
    }
  }

  /**
   * From XML dom string representing the SVG, return a mountable Document object.
   */
  parseSVG(xmlString = '') {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
  }

  /**
   * Mount DOM Document (SVG) into the DOM via state setting of the component.
   */
  mountSVG(svgDom) {
    this.setState({svg: svgDom});
  }

  mouseWheelHandler(e) {
    e.preventDefault();
    const amount = e.deltaY;
    this.zoom(amount);
  }

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

  limitZoomLevel (level) {
    if (level >= 0) {
      return level < this.props.viewParameters.maxZoomLevel ? level : this.props.viewParameters.maxZoomLevel;
    }

    if (level <= -0) {
      return level > this.props.viewParameters.minZoomLevel ? level : this.props.viewParameters.minZoomLevel;
    }

    return level;
  }

  startDrag (e) {
    const bounds = e.currentTarget.getBoundingClientRect();
    this.setState({
      isDragEnabled: true,
      perspectiveLevel: 0,
      dragOffset: {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      },
    });
    e.currentTarget.addEventListener('mousemove', this.doDrag);
  }

  stopDrag (e) {
    this.setState({isDragEnabled: false});
    e.currentTarget.removeEventListener('mousemove', this.doDrag);
  }

  doDrag (e) {
    if (!this.state.isDragEnabled) return;
    const x = e.clientX - this.state.dragOffset.x;
    const y = e.clientY - this.state.dragOffset.y;
    this.setState({
      viewParameters: {
        ...this.state.viewParameters,
        x,
        y,
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

  render () {
    const svgContainerStyles = {
      transition: 'all .2s ease',
      transform: `translateX(${this.state.viewParameters.x}px)
                  translateY(${this.state.viewParameters.y}px)`
    };

    const svgStyles = {
      transition: 'all .2s ease',
      transform: `perspective(${this.props.viewParameters.perspectiveLevel}px)
                  translateZ(${this.limitZoomLevel(this.state.viewParameters.zoomLevel * this.props.viewParameters.zoomFactor)}px)`
    };

    return (
      <div className="svg-container"
        style={svgContainerStyles}
        onMouseDown={this.props.allowUserViewChange ? this.startDrag : void (0)}
        onMouseUp={this.props.allowUserViewChange ? this.stopDrag : void (0)}>
        {this.state.svg
          ? <div className={this.props.allowUserViewChange ? 'grabbable' : ''}
            onWheel={this.props.allowUserViewChange ? this.mouseWheelHandler : void (0)}
            style={svgStyles}
            dangerouslySetInnerHTML={{
                  __html: new XMLSerializer().serializeToString(this.state.svg.documentElement)}} />
          : <div>Loading...</div>}
      </div>
    );
  }
}

/**
 * PropTypes
 *
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

SVGViewer.defaultProps = {
  allowUserViewChange: true,
  viewParameters: {
    maxZoomLevel: 1000,
    minZoomLevel: -2000,
    zoomFactor: 50,
    perspectiveLevel: 1000
  },
};


export default SVGViewer;
