import React from 'react';
import Timeline from '../src/Timeline/Timeline';

export default class TimelineStoryContainer extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      baseParameters: {...props.baseParameters},
      activeParameters: {...props.baseParameters},
      timelineData: props.timelineData,
      allowViewChange: props.allowViewChange
    }
    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    const fromYear = parseInt(Math.random() * 700 + 1300);
    const toYear = parseInt(Math.random() * (2000 - fromYear) + fromYear);
    this.setState({
      activeParameters: {
        ...this.state.activeParameters,
        fromDate: new Date().setFullYear(fromYear),
        toDate: new Date().setFullYear(toYear)
      }
    });
  }

  render() {
      return (
        <div style={{
        display: 'flex',
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <aside>
          <button onClick={this.changeState}>Change state</button>
        </aside>
        <div style={{
          flex: 5,
          position: 'relative'
        }}>
          <Timeline 
            allowViewChange ={this.state.allowViewChange}
        data={this.state.timelineData} 
        onViewChange={(e) => console.log('on view change', e)}
        viewParameters = {this.state.activeParameters}
          />
        </div>
      </div>
    ) 
  }
}