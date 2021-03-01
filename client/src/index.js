import React from "react";
import moment from "moment-timezone";
import * as ReactDOM from 'react-dom';

const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const Doorbell = () => {
  const [timestamps, setTimestamps] = React.useState([]);
  const [status, setStatus] = React.useState('');
  const isInactive = status !== "active"

  useInterval(async () => {
    const response = await fetch('/timestamps')
    const data = await response.json()
    setTimestamps(data)
  }, 2000);

  useInterval(async () => {
    const response = await fetch('/status')
    const data = await response.json()
    setStatus(data)
  }, 2000);

  const openDoor = () => fetch('/buzzer', { method: 'POST' });

  return (
    <div>
      <div>STATUS: {status}</div>
      <div>
        <button onClick={openDoor} disabled={isInactive}>Buzzer</button>
      </div>
      <ul>
        {timestamps.map(timestamp => {
          return <li key={timestamp}><b>{moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}</b></li>
        })}
      </ul>
    </div>
  );
}
ReactDOM.render(<Doorbell />, document.getElementById('root'))
