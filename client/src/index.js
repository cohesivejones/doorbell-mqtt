import React from "react";
import * as ReactDOM from 'react-dom';

const HelloWord = () => {
  const [timestamps, setTimestamps] = React.useState([]);

  React.useEffect(async () => {
    const response = await fetch('/timestamps')
    const data = await response.json()
    debugger
    setTimestamps(data)
  }, []);
  return (
    <span>
      <ul>
        {timestamps.map(timestamp => {
          return <li key={timestamp}><b>{timestamp}</b></li>
        })}
      </ul>
    </span>
  );
}
ReactDOM.render(<HelloWord />, document.getElementById('root'))
