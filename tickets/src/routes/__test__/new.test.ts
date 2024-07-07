import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('Has a route handler listening /api/tickets for post request', async () => {

	const response = await request(app)
	.post('/api/tickets')
	.send({});

	expect(response.status).not.toEqual(404);

});

it('Can only be access if the user is signed in', async () => {

	const response = await request(app)
	.post('/api/tickets')
	.send({})
	.expect(401);

	// expect(response.status).toEqual(401);

});

it('Returns a status other than 401 if the user is signed in', async () => {

	// global.signin формируется тут /tickets/src/test/setup.ts

	const response = await request(app)
	.post('/api/tickets')
	.set('Cookie', global.signin())
	.send({});

	// console.log(response.status);

	expect(response.status).not.toEqual(401);
});

it('Returns an error if an invaled title is provided', async () => {

	await request(app)
	.post('/api/tickets')
	.set('Cookie', global.signin())
	.send({
		title: '',
		price: 10
	}).expect(400);

	await request(app)
	.post('/api/tickets')
	.set('Cookie', global.signin())
	.send({
		price: 10
	}).expect(400);

});

it('Returns an error if an invaled price is provided', async () => {
	
	await request(app)
	.post('/api/tickets')
	.set('Cookie', global.signin())
	.send({
		title: 'some string',
		price: -10
	}).expect(400);

	await request(app)
	.post('/api/tickets')
	.set('Cookie', global.signin())
	.send({
		title: 'some string'
	}).expect(400);

});

it('Creates a ticke with a valid inputs', async () => {

	let tickets = await Ticket.find({});
	expect(tickets.length).toEqual(0);

	const title = 'some string';

	await request(app)
	.post('/api/tickets')
	.set('Cookie', global.signin())
	.send({
		title,
		price: 20,
	})
	.expect(201);

	tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].price).toEqual(20);
	expect(tickets[0].title).toEqual(title);

});