import request from 'supertest';

// Импортируем запуск приложения из файла app
import { app } from "../../app";

it('fails when a email that doesn not exist is supplied', async () => {

	// Тут будет ошибка 400 потому как пользователя с данным email не существует
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(400);

});

it('fails when an incorrect password is supplied', async () => {

	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201);

	// Указываем неправильный пароль
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'new_password'
		})
		.expect(400);
});

it('responds with a cookie when given valid credentials', async () => {

	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201);

	// Указываем неправильный пароль
	const responce = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(200);

	expect(responce.get('Set-Cookie')).toBeDefined();

});