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

  useInterval(async () => {
    const response = await fetch('/timestamps')
    const data = await response.json()
    setTimestamps(data)
  }, 1000);

  useInterval(async () => {
    const response = await fetch('/status')
    const data = await response.json()
    setStatus(data)
  }, 1000);

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
