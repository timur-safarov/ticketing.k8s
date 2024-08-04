import nats from 'node-nats-streaming';

// NATS это библиотека, а stan это экземпляр(instance) к которому мы подключаемся
// Наш стриминг сервер запускается внутри K8S кластера и по умолчанию
// мы не имеем прямого доступа туда

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
