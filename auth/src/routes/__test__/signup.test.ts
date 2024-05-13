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