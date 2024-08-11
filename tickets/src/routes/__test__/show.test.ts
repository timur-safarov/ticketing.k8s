import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('Returns a 404 if the ticket is not found', async () => {

	// Генерируем id для mongo так как например такой gfdsn45yk789okj86789 не подойдёт
	// У неё определённый формат свой
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		// Передадим не существущий Url api
		.get(`/api/tickets/${id}`)
		.send()
		.expect(404);

	// Чтобы протестировать что возвращается в запросе можно сделать так
	// const response = await request(app)
	// 	// Передадим не существущий Url api
	// 	.get('/api/tickets/gfdsn45yk789okj86789')
	// 	.send();

	// console.log(response.body);


});

it('Returns the ticket if the ticket is found', async () => {

	const title = 'concert';
	const price = 20;

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
		  title,
		  price,
		})
		.expect(201);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);

});