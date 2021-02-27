import React from "react";
import moment from "moment-timezone";
import * as ReactDOM from 'react-dom';

const Doorbell = () => {
  const [timestamps, setTimestamps] = React.useState([]);

  React.useEffect(async () => {
    const response = await fetch('/timestamps')
    const data = await response.json()
    setTimestamps(data)
  }, []);
  return (
    <span>
      <ul>
        {timestamps.map(timestamp => {
          return <li key={timestamp}><b>{moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}</b></li>
        })}
      </ul>
    </span>
  );
}
ReactDOM.render(<Doorbell />, document.getElementById('root'))
