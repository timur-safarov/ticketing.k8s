import request from "supertest";

// Импортируем запуск приложения из файла app
import { app } from "../../app";

it('returns a 201 on successful signup', async () => {

	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201);

});

// Тут мы тестируем что будет ответ 400 если не верный email
it('returns a 400 with an invalid email', async () => {

	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test-test.com',
			password: 'password'
		})
		.expect(400);

});

// Тут мы тестируем что будет ответ 400 если не верный password
it('returns a 400 with an invalid password', async () => {

	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'p'
		})
		.expect(400);

});

// Тут мы тестируем что будет ответ 400 если отсутствуют email и password
it('returns a 400 with missing email and password', async () => {

	// await можно использовать вместо return
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com'
		})
		.expect(400);

	await request(app)
		.post('/api/users/signup')
		.send({
			password: 'password'
		})
		.expect(400);

});

// Тест на дубликаты email адрессов
it('disallows dublicate emails', async () => {

	// Первый пользователь добавляется нормально
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201);

	// Второй пользователь с таким же email не добавляется
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(400);

});