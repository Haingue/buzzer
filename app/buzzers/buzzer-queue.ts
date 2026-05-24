import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';

async function sendMessage() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'myQueue';
    await channel.assertQueue(queue);
    const message = 'Hello, RabbitMQ!';
    channel.sendToQueue(queue, Buffer.from(message));
    console.log('Message sent:', message);
    await channel.close();
    await connection.close();
}
async function receiveMessage() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'myQueue';
    await channel.assertQueue(queue);
    channel.consume(queue, (msg) => {
        if (msg) {
            console.log('Received message:', msg.content.toString());
            channel.ack(msg);
        }
    });
}

async function connectWithRetry() {
    let retries = 5;
    while (retries > 0) {
        try {
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            console.log('Connected to RabbitMQ');
            return { connection, channel };
        } catch (error) {
            console.error('Connection error, retrying in 5 seconds...', error);
            retries--;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    console.error('Failed to connect to RabbitMQ after multiple attempts');
}