import React from "react";
import moment from "moment-timezone";
import * as ReactDOM from 'react-dom';

const Doorbell = () => {
  const [timestamps, setTimestamps] = React.useState([]);
  const [status, setStatus] = React.useState('');

  setTimeout(window.location.reload.bind(window.location), 2000);
  React.useEffect(async () => {
    const response = await fetch('/timestamps')
    const data = await response.json()
    setTimestamps(data)
  }, []);
  React.useEffect(async () => {
    const response = await fetch('/status')
    const data = await response.json()
    setStatus(data)
  }, []);
  return (
    <div>
      <span>STATUS: {status}</span>
      <ul>
        {timestamps.map(timestamp => {
          return <li key={timestamp}><b>{moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}</b></li>
        })}
      </ul>
    </div>
  );
}
ReactDOM.render(<Doorbell />, document.getElementById('root'))
