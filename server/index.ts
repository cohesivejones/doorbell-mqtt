import express from 'express';
import mqtt from 'mqtt';
import path from 'path';

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

let timestamps: number[] = [];
const DOORBELL_ACTIVE = 'doorbell/active';

client.on('connect', () => {
  client.subscribe(DOORBELL_ACTIVE);
  client.publish(DOORBELL_ACTIVE, '');
})

client.on('message', (topic, message) => {
  console.log('received message %s %s', topic, message)
  switch (topic) {
    case DOORBELL_ACTIVE:
      timestamps.push(Date.now());
      break;
    default:
      console.log('No handler for topic %s', topic)
  }
})

const app = express()

app.get('/timestamps', (req, res) => {
  res.json(timestamps.map((t) => new Date(t).toISOString()))
})

const staticFiles = express.static(path.join(__dirname, '../client/build'))

app.use(staticFiles)

app.use('/*', staticFiles)

app.listen(process.env.PORT || 3001,
  () => console.log("Server is running..."));
