# Buzzer

This is a PoC of RabbitMQ + Nodejs.

## Notes
- Need to try STOMP/Websocket to have better flexibility from server/client side

## Getting Started

Fisrt, start RabbitMQ

```bash
docker compose -f docker-compose.yml up -d
```

Open [http://localhost:15672/](http://localhost:15672/) with your browser to see the result.

---

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
