import amqp, { Channel, ChannelModel } from 'amqplib';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET (
  req: NextRequest,
) {
  const queue = req.nextUrl.searchParams.get('queue') as string || 'pingpong'
  const message = req.nextUrl.searchParams.get('message') as string || 'Ping'
  console.log('Received request to send message:', { queue, message });
  try {
    const connection: ChannelModel = await amqp.connect('amqp://localhost', {
      credentials: amqp.credentials.plain('guest', 'guest'),
    });
    const channel: Channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })

    const result: boolean = await channel.sendToQueue(queue, Buffer.from(message), { persistent: true })
    // await channel.publish(queue, Buffer.from(message))

    connection.close();
    if (result) {
      return NextResponse.json({ result: 'Message sent' }, { status: 200 })
    } else {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }
  } catch (err) {
    // res.status(500).json({ error: 'failed to load data' })
    return NextResponse.json({ error: 'failed to load data', message: (err as Error).message }, { status: 500 })
  }
}