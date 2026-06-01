import { publishEvent } from '@/lib/rabbitMQ'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Méthode non autorisée' },
      { status: 405 },
    )
  }

  const { eventType, eventData } = await req.json()
  if (!eventType || !eventData) {
    return NextResponse.json(
      { error: 'eventType et eventData sont requis' },
      { status: 400 },
    )
  }

  try {
    console.debug("Publication de l'événement :", { eventType, eventData })
    await publishEvent(eventType, eventData)
    return NextResponse.json(
      { success: true, message: 'Événement publié' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Erreur lors de la publication :', error)
    return NextResponse.json(
      { error: 'Échec de la publication' },
      { status: 500 },
    )
  }
}
