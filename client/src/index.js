import React from "react";
import moment from "moment-timezone";
import * as ReactDOM from 'react-dom';
import { Button, List, ListItemText, Container } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

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
    <Container maxWidth="md" component="main">
      {
        isInactive && (
          <Alert severity="info">
            <AlertTitle>Device Status: INACTIVE</AlertTitle>
          </Alert>
        )
      }
      {
        !isInactive && (
          <Alert severity="success">
            <AlertTitle>Device Status: ACTIVE</AlertTitle>
            <Button variant="contained" color="primary" onClick={openDoor}>Buzzer</Button>
          </Alert >
        )
      }
      <section>
        <h3>Activation timestamps:</h3>
        <List>
          {timestamps.map(timestamp => (
            <ListItemText key={timestamp}>
              {moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}
            </ListItemText>
          )
          )}
        </List>
      </section>
    </Container >
  );
}
ReactDOM.render(<Doorbell />, document.getElementById('root'))
