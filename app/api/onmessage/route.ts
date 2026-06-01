import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const sw = new WebSocket('ws://localhost:15674/ws')
  const client = await sw.connect()

  client.on('message', (message) => {
    console.log('Received message:', message)
  })

  client.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  return NextResponse.json({ message: 'WebSocket connection established' })
}
