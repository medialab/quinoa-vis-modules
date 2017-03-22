import React from 'react';
import ReactMarkdown from 'react-markdown';

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
            {console.log(timeObject)}
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
