import express from 'express';
import mqtt from 'mqtt';
import path from 'path';
import db from './config';

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

const DOORBELL_ACTIVE = 'doorbell/active';
const DOORBELL_INACTIVE = 'doorbell/inactive';

client.on('connect', () => {
  client.subscribe([DOORBELL_ACTIVE, DOORBELL_INACTIVE]);
})

client.on('message', (topic, message) => {
  console.log('received message %s %s', topic, message)
  switch (topic) {
    case DOORBELL_ACTIVE:
      db.query(
        'INSERT INTO events (status, created_at) VALUES ($1, $2)',
        ['active', new Date().toISOString()],
      );
      break;
    case DOORBELL_INACTIVE:
      db.query(
        'INSERT INTO events (status, created_at) VALUES ($1, $2)',
        ['inactive', new Date().toISOString()],
      );
      break;
    default:
      console.log('No handler for topic %s', topic)
  }
})

const app = express()

app.get('/timestamps', (req, res) => {
  db.query("SELECT created_at FROM events WHERE status = 'active' ORDER BY created_at desc", (error, results) => {
    res.status(200).json(results?.rows.map((row) => row.created_at));
  });
})
app.get('/status', (req, res) => {
  db.query('SELECT status FROM events ORDER BY created_at desc LIMIT 1', (error, results) => {
    res.status(200).json(results?.rows.map((row) => row.status)[0]);
  });
})

const staticFiles = express.static(path.join(__dirname, '../client/build'))

app.use(staticFiles)

app.use('/*', staticFiles)

app.listen(process.env.PORT || 3001,
  () => console.log("Server is running..."));
