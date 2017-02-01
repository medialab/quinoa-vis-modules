/**
 * @module SVGViewer
 */
import React, {PropTypes} from 'react';
import Draggable from 'react-draggable';

require('es6-promise').polyfill();
require('isomorphic-fetch');

import './SVGViewer.scss';

class SVGViewer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {svg: null};

    this.loadFile = this.loadFile.bind(this);
    this.parseSVG = this.parseSVG.bind(this);
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

  render () {
    return (
      <div className="grabbable">
        {this.state.svg
          ? <Draggable axis='both' disabled={!this.props.allowUserViewChange}>
                <div className="draggable" dangerouslySetInnerHTML={{
                  __html: new XMLSerializer().serializeToString(this.state.svg.documentElement)}}
                />
            </Draggable>
          : <div>Loading...</div>}
      </div>
    )
  }
}

SVGViewer.defaultProps = {
  allowUserViewChange: true
};

SVGViewer.proptypes = {
  allowUserViewChange: PropTypes.bool,
  svgString: PropTypes.string,
  file: PropTypes.string
};

export default SVGViewer;
