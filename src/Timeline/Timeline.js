import React, {PropTypes} from 'react';

class Timeline extends React.Component {
  constructor (props) {
    super(props);
    this.mapData = this.mapData.bind(this);
    this.mapData(this.props.data, this.props.dataMap);
  }

  componentWillUpdate(nextProps) {
    // remap data if data or datamap will change
    if (this.props.data !== nextProps.data || this.props.dataMap !== nextProps.dataMap) {
      this.mapData(nextProps.data, nextProps.dataMap);
    }
  }

  /*
   * Maps incoming data with provided data map
   */
  mapData (data, dataMap) {
    this.data = data.map(datapoint => {
      return Object.keys(dataMap).reduce((obj, dataKey) => {
        return {
          ...obj,
          [dataKey]: typeof dataMap[dataKey] === 'function' ?
                      dataMap[dataKey](datapoint) // case accessor
                      : datapoint[dataMap[dataKey]] // case prop name
        };
      }, {});
    });
  }

  render () {
    const {
      viewParameters = {},
      // allowViewChange = true,
      onViewChange
    } = this.props;
    const {data} = this;
    return (
      <div>
        <button onClick={onViewChange()} />
        {JSON.stringify(viewParameters, null, 2)}
        {JSON.stringify(data, null, 2)}
      </div>
    );
  }
}

Timeline.propTypes = {
  /*
   * Incoming data in json format
   */
  data: PropTypes.oneOfType[
    PropTypes.array
  ],
  /*
   * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
   */
  dataMap: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    year: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number,
    time: PropTypes.number,
    endYear: PropTypes.number,
    endMonth: PropTypes.number,
    endDay: PropTypes.number,
    endTime: PropTypes.number
  }),
  /*
   * object describing the current view (some being exposed to user interaction like zoom and pan params, others not - like Timeline spatialization algorithm for instance)
   */
  viewParameters: PropTypes.shape({
    fromData: PropTypes.date,
    toDate: PropTypes.instanceOf(Date)
  }),
  /*
   * boolean to specify whether the user can pan/zoom/interact or not with the view
   */
  allowViewChange: PropTypes.bool,
  /*
   * callback fn triggered when user changes view parameters, callbacks data about the triggering interaction and about the new view parameters
   */
  onViewChange: PropTypes.func
};

export default Timeline;
