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

    this.state = {
      svg: null,
      zoomLevel: 0,
      zoomOrigin: null,
      dragOffset: null,
      dragPosition: {x: 0, y: 0},
      isDragEnabled: false
    };
  }

  componentWillMount () {
    this.loadFile = this.loadFile.bind(this);
    this.parseSVG = this.parseSVG.bind(this);
    this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
    this.setZoomOrigin = this.setZoomOrigin.bind(this);
    this.unsetZoomOrigin = this.unsetZoomOrigin.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.doDrag = this.doDrag.bind(this);

    // Debounce zoom method for user-friendly zoom behavior.
    this.zoom = debounce(
      this.zoom.bind(this), 50,
      {leading: true, trailing: false}
    );
  }

  componentDidMount () {
    return this.props.file.indexOf('http') === 0
      ? this.loadFile()
      : this.parseSVG(this.props.svgString);
  }

  loadFile() {
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
      this.setState({zoomLevel: this.state.zoomLevel + amount});
    }
  }

  setZoomOrigin (e) {
    this.setState({zoomOrigin: {x: e.clientX, y: e.clientY}});
  }

  unsetZoomOrigin () {
    this.setState({zoomOrigin: null});
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
                  translateY(${this.state.dragPosition.y}px)
                  translateZ(${this.limitZoomLevel(this.state.zoomLevel * 500)}px)`
    };

    if (this.state.zoomOrigin) {
      svgContainerStyles.transformOrigin = `${this.state.zoomOrigin.x}px ${this.state.zoomOrigin.y}px`;
    }

    return (
      <div className="svg-container">
        {this.state.svg
          ? <div className={this.props.allowUserViewChange ? 'grabbable' : ''}
            onWheel={this.mouseWheelHandler}
            onMouseDown={this.startDrag}
            onMouseUp={this.stopDrag}
            style={svgContainerStyles}
            dangerouslySetInnerHTML={{
                  __html: new XMLSerializer().serializeToString(this.state.svg.documentElement)}} />
          : <div>Loading...</div>}
      </div>
    );
  }
}

SVGViewer.defaultProps = {
  allowUserViewChange: true,
  maxZoomLevel: 2000,
  minZoomLevel: -2000
};

SVGViewer.proptypes = {
  maxZoomLevel: PropTypes.number,
  minZoomLevel: PropTypes.number,
  allowUserViewChange: PropTypes.bool,
  svgString: PropTypes.string,
  file: PropTypes.string
};

export default SVGViewer;
