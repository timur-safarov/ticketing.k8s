import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it('Returns a 404 if the provided id does not exist', async () => {

	// Генерируем id для mongo так как например такой gfdsn45yk789okj86789 не подойдёт
	// У неё определённый формат свой
	const id = new mongoose.Types.ObjectId().toHexString();
	const title = 'concert';
	const price = 20;

	await request(app)
		// Передадим не существущий Url api
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
		  title,
		  price,
		})
		.expect(404);

});

it('Returns a 401 if the user is not authenticated', async () => {
	
	// Генерируем id для mongo так как например такой gfdsn45yk789okj86789 не подойдёт
	// У неё определённый формат свой
	const id = new mongoose.Types.ObjectId().toHexString();
	const title = 'concert';
	const price = 20;

	await request(app)
		// Передадим не существущий Url api
		.put(`/api/tickets/${id}`)
		.send({
		  title,
		  price,
		})
		.expect(401);
});

it('Returns a 401 if the user does not own the ticket', async () => {

	const title = 'concert';
	const price = 20;

	const response = await request(app)
	    .post('/api/tickets')
	    .set('Cookie', global.signin())
	    .send({
		  title,
		  price,
	    });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
		  title: 'alskdjflskjdf',
		  price: 1000,
		})
		.expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});
