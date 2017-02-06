/**
 * @module SVGViewer
 */
import React, {PropTypes} from 'react';
import {debounce} from 'lodash';

require('es6-promise').polyfill();
require('isomorphic-fetch');

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
     * dragPosition    number   Current position of dragged object
     * isDragEnabled   boolean  Enable dragging motion if true
     */
    this.state = {
      svg: null,
      zoomLevel: 0,
      dragOffset: null,
      dragPosition: {x: 0, y: 0},
      isDragEnabled: false
    };
  }

  componentWillMount () {
    this.loadSVGFromRemoteServer = this.loadSVGFromRemoteServer.bind(this);
    this.parseSVG = this.parseSVG.bind(this);
    this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.doDrag = this.doDrag.bind(this);

    // Debounce zoom method for user-friendly zoom behavior.
    this.zoom = debounce(
      this.zoom.bind(this), 50,
      {leading: true, trailing: false}
    );
  }

  /**
   * On mounting, check whether SVG data is raw, or to be loaded from a remote server.
   * Remoting loading superseds raw data if both are present.
   */
  componentDidMount () {
    return this.props.file.indexOf('http') === 0
      ? this.loadSVGFromRemoteServer()
      : this.parseSVG(this.props.svgString);
  }

  loadSVGFromRemoteServer() {
    fetch(this.props.file)
      .then(res => {
        if (res.status >= 400) {
          throw new Error(`Bad response from server while loading ${this.props.file}`);
        }
        return res.text();
      })
      .then(svg => {
        this.setState({svg: this.parseSVG(svg)});
      })
      .catch(err => {
        throw new Error(`Unknown error occured while loading ${this.props.file} -> ${err.message}`);
      });
  }

  parseSVG(xmlString = '') {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
  }

  mouseWheelHandler(e) {
    e.preventDefault();
    const amount = e.deltaY;
    this.zoom(amount);
  }

  zoom (amount) {
    if (amount !== 0 && amount !== -0) {
      this.setState({
        zoomLevel: this.state.zoomLevel + amount
      });
    }
  }

  limitZoomLevel (level) {
    if (level >= 0) {
      return level < this.props.maxZoomLevel ? level : this.props.maxZoomLevel;
    }

    if (level <= -0) {
      return level > this.props.minZoomLevel ? level : this.props.minZoomLevel;
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
        y: e.clientY - bounds.top
      }
    });
    e.currentTarget.addEventListener('mousemove', this.doDrag);
  }

  stopDrag (e) {
    this.setState({isDragEnabled: false});
    e.currentTarget.removeEventListener('mousemove', this.doDrag);
  }

  doDrag (e) {
    if (!this.state.isDragEnabled) return;

    // this.setZoomOrigin(e);
    this.setState({
      dragPosition: {
        x: e.clientX - this.state.dragOffset.x,
        y: e.clientY - this.state.dragOffset.y
      }
    });
  }

  render () {
    const svgContainerStyles = {
      transform: `translateX(${this.state.dragPosition.x}px)
                  translateY(${this.state.dragPosition.y}px)`
    };

    const svgStyles = {
      transform: `perspective(${this.props.perspectiveLevel}px)
                  translateZ(${this.limitZoomLevel(this.state.zoomLevel * this.props.zoomFactor)}px)`
    };

    if (this.state.zoomOrigin) {
      svgStyles.transformOrigin = `${this.state.zoomOrigin.x}px ${this.state.zoomOrigin.y}px`;
    }

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
 * maxZoomLevel        number   Max zoom value, defaults to 2000
 * minZoomLevel        number   Min zoom value, defaults to 2000
 * perspectiveLevel    number   CSS perspective level in 3D space, 1000(px)
 * zoomFactor          number   Factorize wheel zoom for proper zoom effect, defauls to 250
 * allowUserViewChange boolean  If true, locks interaction on SVGViewer
 * svgString           string   Raw SVG string to load
 * file                string   URL to SVG file to load, superseding `svgString` prop if both are present
 */
SVGViewer.proptypes = {
  maxZoomLevel: PropTypes.number,
  minZoomLevel: PropTypes.number,
  perspectiveLevel: PropTypes.number,
  zoomFactor: PropTypes.number,
  allowUserViewChange: PropTypes.bool,
  svgString: PropTypes.string,
  file: PropTypes.string
};

SVGViewer.defaultProps = {
  allowUserViewChange: true,
  maxZoomLevel: 2000,
  minZoomLevel: -2000,
  zoomFactor: 250,
  perspectiveLevel: 1000
};


export default SVGViewer;
