import express from 'express';
import mqtt from 'mqtt';
import path from 'path';
import db from './config';

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

const DOORBELL_ACTIVE = 'doorbell/active';

client.on('connect', () => {
  client.subscribe(DOORBELL_ACTIVE);
})

client.on('message', (topic, message) => {
  console.log('received message %s %s', topic, message)
  switch (topic) {
    case DOORBELL_ACTIVE:
      db.query(
        'INSERT INTO events (created_at) VALUES ($1)',
        [new Date().toISOString()],
        (error) => {
          if (error) {
            throw error
          }
        },
      )
      break;
    default:
      console.log('No handler for topic %s', topic)
  }
})

const app = express()

app.get('/timestamps', (req, res) => {
  db.query('SELECT created_at FROM events', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows.map((row) => row.created_at));
  })
})

const staticFiles = express.static(path.join(__dirname, '../client/build'))

app.use(staticFiles)

app.use('/*', staticFiles)

app.listen(process.env.PORT || 3001,
  () => console.log("Server is running..."));
