import amqp, { Channel, ConsumeMessage, ChannelModel } from 'amqplib';

export async function sendMessage(message: string) {
    const connection: ChannelModel = await amqp.connect('amqp://localhost');
    const channel: Channel = await connection.createChannel();
    const queue = 'myQueue';
    await channel.assertQueue(queue);

    channel.sendToQueue(queue, Buffer.from(message));
    console.log('Message sent:', message);
    await channel.close();
    await connection.close();
}

export async function receiveMessage(onMessage: (msg: ConsumeMessage | null) => void) {
    const connection: ChannelModel = await amqp.connect('amqp://localhost');
    const channel: Channel = await connection.createChannel();
    const queue = 'pingpong';
    await channel.assertQueue(queue);
    channel.consume(queue, onMessage);
    // channel.ack(msg);
}
