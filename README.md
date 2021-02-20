## MQTT Server
This project is an MQTT Broker used for collecting data from IoT devices, such as Doorbell (Adafruit Feather ESP32)

### Testing doorbell/active

1. Install mqtt-cli
`sh
brew install hivemq/mqtt-cli/mqtt-cli
`

2. Connect to mqtt server and publish message
`sh
mqtt sh
con -V 3 -h driver.cloudmqtt.com -p 18846 -u [username] -pw [password]
pub -t doorbell/active -m 'hello'
`

3. Check logs for messages
`sh
heroku logs
`
