import { useState } from 'react'

const PingPong = () => {
  const [message, setMessage] = useState<string>('Waiting for Ping...');

  const handleSendPing = async () => {
    console.log('Sending Ping...');
    setMessage('Sending Ping...');
    fetch('/api/sendmessage?queue=pingpong&message=Ping')
      .then(response => response.json())
      .then(data => {
        setMessage(data.result);
      })
      .catch(error => {
        console.error('Error receiving message:', error);
      })
      .finally(() => {
        console.log('Finished sending Ping');
      })
  }

  return (
    <>
      <section>
        <h1>Ping Pong</h1>
      </section>
      <section>
        <h2>Sender</h2>
        <button onClick={handleSendPing}>Send Ping</button>
      </section>
      <section>
        <h2>Receiver</h2>
        <p>{message}</p>
      </section>
    </>
  )
}

export default PingPong