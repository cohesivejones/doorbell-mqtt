import mqtt from 'mqtt';
import express from 'express';

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
app.use(express.static("public"))

app.get("/", function (_req, res) {
  res.send(timestamps.map((t) => new Date(t).toISOString()).join(', '))
})

app.listen(process.env.PORT || 3000,
  () => console.log("Server is running..."));