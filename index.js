const mqtt = require('mqtt');

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

client.on('connect', () => {

  client.subscribe('hello/world', () => {
    client.on('message', (topic, message, _packet) => {
      console.log("Received '" + message + "' on '" + topic + "'");
    });
  });

  client.publish('hello/world', 'my message', () => {
    console.log("Message is published");
    client.end();
  });
});
