import React from 'react';
import {default as TimelineComponent} from 'react-visjs-timeline';
import './Timeline.scss';

const Timeline = ({
  data = [],
  viewParameters = {},
  updateView
}) => {
  let range;
  if (Object.keys(viewParameters).length) {
    range = {
      start: viewParameters && new Date(viewParameters.fromDate),
      end: viewParameters && new Date(viewParameters.toDate)
    };
  }
  else if (data.length) {
    const min = Math.min.apply(Math, data.map(point => point.start));
    const max = Math.max.apply(Math, data.map(point => point.start));
    const dist = max - min;
    range = {
      start: new Date(min - dist / 4),
      end: new Date(max + dist / 4)
    };
  }
  else {
    range = {
      start: new Date(0),
      end: new Date()
    };
  }

  const animation = {
    duration: 100,
    easingFunction: 'easeInQuint'
  };

  const options = {
    width: '100%',
    height: '100%',
    stack: true,
    showMajorLabels: false,
    showCurrentTime: false,

    type: 'point',
    format: {
      minorLabels: {
        minute: 'h:mma',
        hour: 'ha'
      }
    },
    start: range.start,
    end: range.end
  };

  function onRange(props) {
    if (props.byUser) {
      const params = {fromDate: props.start.getTime(), toDate: props.end.getTime()};
      updateView(params);
    }
  }

  return (
    <TimelineComponent
      options={options}
      rangechangedHandler={onRange}
      items={data}
      animation={animation} />
  );
};

export default Timeline;

