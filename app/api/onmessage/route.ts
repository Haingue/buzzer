import amqp, { Channel, ChannelModel } from 'amqplib';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET (req: NextRequest) {
  try {
    const connection: ChannelModel = await amqp.connect('amqp://localhost', {
      credentials: amqp.credentials.plain('guest', 'guest'),
    });
    const channel: Channel = await connection.createChannel();
    const queue = req.nextUrl.searchParams.get('queue') as string || 'pingpong';
    await channel.assertQueue(queue);

    let result: NextResponse = NextResponse.json({ result: 'No result' }, { status: 500 });
    await channel.consume(queue, (msg) => {
      if (msg) {
        const receivedMessage = msg.content.toString();
        console.log('Received message:', receivedMessage);
        setTimeout(function() {
          console.log(" [x] Done");
          channel.ack(msg);
        }, 5_000);
        result = NextResponse.json({ result: receivedMessage }, { status: 200 });
      } else {
        result = NextResponse.json({ result: 'No message received' }, { status: 201 });
      }
    }, { noAck: true });

    connection.close();
    return result!;
  } catch (err) {
    return NextResponse.json({ error: 'failed to load data', message: (err as Error).message }, { status: 500 })
  }
}