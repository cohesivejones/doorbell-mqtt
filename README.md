# Doorbell MQTT Server

This project is an MQTT Broker and website used for collecting data from [Doorbell Bridge](https://github.com/cohesivejones/doorbell-bridge) and displaying it at https://doorbell.drnatejones.com/. The app subscribes for doorbell events passed to the MQTT broker and stores these events in a postgres DB. 

The frontend provides an interface for sending messages to the doorbell bridge which in turn allow deliveries / guests to enter the building.

## Stack

### Client (/client)
- [Create React App](https://create-react-app.dev/)
- [Material UI](https://material-ui.com/)

### API (/server)
- [Node Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Typescript](https://www.typescriptlang.org/)

## Environments

Production env can be found at https://doorbell.drnatejones.com/

## Testing

N/A

## Additional Info

### Sending messages to MQTT via CMD

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
