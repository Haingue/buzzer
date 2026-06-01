'use client'

import { useEffect, useState } from 'react'

export default function EventListener() {
  const [events, setEvents] = useState<object[]>([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:15674/ws')

    ws.onopen = () => {
      console.log('Connecté au serveur WebSocket')
    }

    ws.onmessage = (event) => {
      const newEvent = JSON.parse(event.data)
      setEvents((prev) => [...prev, newEvent])
    }

    ws.onclose = () => {
      console.log('Déconnecté du serveur WebSocket')
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <div>
      <h1>Événements en temps réel</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.type}:</strong> {JSON.stringify(event.data)}
          </li>
        ))}
      </ul>
    </div>
  )
}
