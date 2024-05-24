import request from 'supertest';

// Импортируем запуск приложения из файла app
import { app } from "../../app";

it('responds with details about the current user', async () => {

	// const authResponce = await request(app)
	// 	.post('/api/users/signup')
	// 	.send({
	// 		email: 'test@test.com',
	// 		password: 'password'
	// 	})
	// 	.expect(201);

	// const cookie = authResponce.headers['set-cookie'];

	// Вместо того что вверху написано мы пишем теперь так
	// signin() прописана в test/setup.ts
	const cookie = await global.signin();

	// console.log(typeof cookie);

	// Чтобы получать данныепользователя нужно отправлять куки
	const responce = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	// {
	// 	currentUser: {
	// 		id: '664de92b02f33a1d585dec52',
	// 		email: 'test@test.com',
	// 		iat: 1716381995
	// 	}
	// }
	// console.log(responce.body);

	expect(responce.body.currentUser.email).toEqual('test@test.com');

});


it('responds with null if not authenticated', async () => {

	const responce = await request(app)
		.get('/api/users/currentuser')
		.send()
		.expect(200);

	expect(responce.body.currentUser).toEqual(null);

});