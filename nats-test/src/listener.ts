import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

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

  new TicketCreatedListener(stan).listen();

  // Код ниже был удалён в блоке 15 - урок 3. Extending the Listener
  // const options = stan
  //       .subscriptionOptions()
  //       .setManualAckMode(true)
  //       .setDeliverAllAvailable()
  //       .setDurableName('accounting-service');

  // // Все настройки subscription можно посмотреть в мониторинге тут - http://localhost:8222/streaming/channelsz?subs=1
  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'queue-group-name',
  //   // Этот параметр нужен чтобы не передавались одинаковые сообщения в слушатели - он может быть любым
  //   // если параметр queue-group-name отключен то при команде rs все сообщения будут передаваться повторно
  //   options
  // );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }

  //   // Останавливаем передачу сообщения так как оно получено
  //   msg.ack();

  // });

});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
