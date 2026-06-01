import amqp, { Channel, ChannelModel } from 'amqplib'

let channel: Channel
let connection: ChannelModel

export async function connectRabbitMQ() {
  if (connection) return { connection, channel }

  try {
    connection = await amqp.connect('amqp://localhost:5672', {
      credentials: amqp.credentials.plain('guest', 'guest'),
    })
    channel = await connection.createChannel()
    await channel.assertExchange('events', 'topic', { durable: false })
    await channel.assertQueue('event_queue', { durable: false })
    await channel.bindQueue('event_queue', 'events', '#')
    return { connection, channel }
  } catch (error) {
    console.error('Erreur de connexion à RabbitMQ :', error)
    throw error
  }
}

export async function publishEvent(routingKey: string, eventData: object) {
  const { channel } = await connectRabbitMQ()
  const buffer = Buffer.from(JSON.stringify(eventData))
  await channel.publish('events', routingKey, buffer)
  console.log(`Événement publié : ${routingKey}`, eventData)
}

export async function consumeEvents(
  callback: (event: object, routingKey: string) => void,
) {
  const { channel } = await connectRabbitMQ()
  await channel.consume('event_queue', (msg) => {
    if (msg) {
      const event = JSON.parse(msg.content.toString())
      callback(event, msg.fields.routingKey)
      channel.ack(msg)
    }
  })
}
