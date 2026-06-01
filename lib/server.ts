import { consumeEvents } from './rabbitMQ'

const wss = new WebSocket.Socket({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('Nouveau client WebSocket connecté')

  // Écouter les événements RabbitMQ et les diffuser aux clients WebSocket
  consumeEvents((event, eventType) => {
    ws.send(JSON.stringify({ type: eventType, data: event }))
  })

  ws.on('close', () => {
    console.log('Client WebSocket déconnecté')
  })
})

console.log('Serveur WebSocket démarré sur ws://localhost:8080')
