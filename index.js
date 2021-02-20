const mqtt = require('mqtt');

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

let timestamps = [];
const DOORBELL_ACTIVE = 'doorbell/active';

client.on('connect', () => {
  client.subscribe(DOORBELL_ACTIVE);
})

client.on('message', (topic, message) => {
  console.log('received message %s %s', topic, message)
  switch (topic) {
    case DOORBELL_ACTIVE:
      timestamps.push(Date.now);
      break;
    default:
      console.log('No handler for topic %s', topic)
  }
})
