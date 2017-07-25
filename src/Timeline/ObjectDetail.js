/**
 * This module exports a component for displaying a pannel to display
 * when a timeline object is selected
 * @module quinoa-vis-modules/Timeline
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * ObjectDetail main component
 * @param {boolean} active - the pannel is visible or not
 * @param {object} timeObject - the data point to consume to populate the pannel
 * @param {string} formatDate - the date pattern to use to display dates
 */
const ObjectDetail = ({
  active,
  timeObject,
  formatDate
}) => (
  <div className={'object-detail-container' + (active ? ' active' : '')}>
    {
      timeObject ?
        <div className="object-detail-contents">
          <div className="header">
            <p>
              {formatDate(timeObject.startDate)}
              {timeObject.endDate ?
                ' - ' + formatDate(timeObject.endDate)
                : null}
            </p>
            <h2>{timeObject.title}</h2>
          </div>
          <div className="content">
            {timeObject.description ?
              <ReactMarkdown source={timeObject.description} />
              : null}
            {timeObject.source ?
              <div className="source">
                <h4>Sources</h4>
                <ReactMarkdown source={timeObject.source} />
              </div>
              : null}
          </div>
        </div>
      : null
    }
  </div>
);

export default ObjectDetail;
