import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// randomBytes(4).toString('hex') - нужен чтобы всегда новый слушатель объвлялся
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  // Все настройки subscription можно посмотреть в мониторинге тут - http://localhost:8222/streaming/channelsz?subs=1
  const options = stan.subscriptionOptions().setManualAckMode(true);

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group', // Этот параметр нужен чтобы не передавались одинаковые сообщения в слушатели - он может быть любым
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    // Останавливаем передачу сообщения так как оно получено
    msg.ack();

  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
